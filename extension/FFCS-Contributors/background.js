/* global chrome, importScripts */
importScripts('exporter.js');
const page = chrome.runtime.getURL('contributor.html');
const ready = Promise.all([
  chrome.storage.local.setAccessLevel({ accessLevel: 'TRUSTED_CONTEXTS' }),
  fetch(chrome.runtime.getURL('catalogue.json')).then(response => response.json()),
]);
let queue = Promise.resolve();
function kind(sender) {
  if (sender.id !== chrome.runtime.id || sender.frameId > 0) return null;
  if (sender.url?.split(/[?#]/)[0] === page) return 'dashboard';
  try {
    const url = new URL(sender.url);
    if (
      url.origin === 'https://vtop.vit.ac.in' &&
      url.pathname.startsWith('/vtop/') &&
      Number.isInteger(sender.tab?.id)
    )
      return 'vtop';
  } catch {
    /* Opaque senders cannot export. */
  }
  return null;
}
async function tab(id) {
  if (!Number.isInteger(id)) throw new Error('Select an open VTOP tab.');
  const current = await chrome.tabs.get(id);
  if (!current.url?.startsWith('https://vtop.vit.ac.in/vtop/'))
    throw new Error('Select a VTOP Vellore tab.');
  return current;
}
async function sendToTab(id, request) {
  let response;
  try {
    response = await chrome.tabs.sendMessage(id, request);
  } catch {
    throw new Error(
      'Refresh the selected VTOP tab after installing the extension, then reconnect.'
    );
  }
  if (!response?.ok)
    throw new Error(response?.error || 'VTOP did not respond. Refresh VTOP and reconnect.');
  return response;
}
async function loadJob() {
  let { job } = await chrome.storage.local.get('job');
  if (job?.state === 'running' && Date.now() - job.updatedAt > 90000) {
    job = {
      ...job,
      state: 'error',
      error: 'The VTOP capture stopped responding. Reconnect and fetch again.',
    };
    await chrome.storage.local.set({ job });
  }
  return job || null;
}
async function handle(request, sender) {
  const [, catalogue] = await ready;
  const who = kind(sender);
  if (!who) throw new Error('This page cannot access the contributor exporter.');
  const job = await loadJob();
  if (who === 'dashboard') {
    if (request.type === 'ADMIN_CONFIG') return { profiles: catalogue.profiles };
    if (request.type === 'ADMIN_STATE') {
      const { inspection, settings } = await chrome.storage.local.get(['inspection', 'settings']);
      return { job, inspection: inspection || null, settings: settings || null };
    }
    if (request.type === 'ADMIN_TABS') {
      const tabs = await chrome.tabs.query({ url: 'https://vtop.vit.ac.in/vtop/*' });
      return {
        tabs: tabs
          .sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0))
          .map(item => ({ id: item.id, title: item.title || 'VTOP' })),
      };
    }
    if (request.type === 'ADMIN_INSPECT_TAB') {
      if (job?.state === 'running')
        throw new Error('Finish or cancel the current capture before reconnecting.');
      await tab(request.tabId);
      const response = await sendToTab(request.tabId, { type: 'ADMIN_INSPECT' });
      if (
        !/^[a-f0-9]{64}$/.test(response.contextKey) ||
        !Array.isArray(response.categories) ||
        !response.categories.length ||
        response.categories.length > 100 ||
        response.categories.some(
          item =>
            typeof item.code !== 'string' ||
            !item.code ||
            item.code.length > 200 ||
            typeof item.label !== 'string' ||
            item.label.length > 200
        )
      )
        throw new Error('VTOP returned invalid category metadata.');
      const inspection = {
        tabId: request.tabId,
        contextKey: response.contextKey,
        categories: response.categories.map(item => ({ code: item.code, label: item.label })),
        term: String(response.term || '').slice(0, 200),
      };
      await chrome.storage.local.set({ inspection });
      return { inspection };
    }
    if (request.type === 'ADMIN_START') {
      if (job?.state === 'running') throw new Error('An export is already running.');
      const { inspection } = await chrome.storage.local.get('inspection');
      if (!inspection || inspection.tabId !== request.tabId)
        throw new Error('Connect to the VTOP tab before exporting.');
      await tab(request.tabId);
      const profile = catalogue.profiles.find(item => item.folder === request.folder);
      const mappings = Array.isArray(request.mappings)
        ? request.mappings.map(item => ({ code: item.code, file: item.file }))
        : [];
      if (
        mappings.some(item => !inspection.categories.some(category => category.code === item.code))
      )
        throw new Error('Only inspected VTOP categories can be exported.');
      const empty = Object.create(null);
      for (const item of mappings) empty[item.code] = {};
      globalThis.FFCSContributorExport.buildFiles(
        profile,
        mappings,
        empty,
        Boolean(request.includeIndex)
      );
      const id = crypto.randomUUID();
      const next = {
        id,
        tabId: request.tabId,
        folder: profile.folder,
        mappings,
        includeIndex: Boolean(request.includeIndex),
        state: 'running',
        stage: 'preparing',
        completed: 0,
        total: 0,
        detail: 'Connecting to VTOP',
        updatedAt: Date.now(),
        term: inspection.term,
      };
      await chrome.storage.local.remove('result');
      await chrome.storage.local.set({
        job: next,
        settings: { folder: profile.folder, mappings, includeIndex: next.includeIndex },
      });
      try {
        await sendToTab(request.tabId, {
          type: 'ADMIN_CAPTURE',
          jobId: id,
          codes: mappings.map(item => item.code),
          contextKey: inspection.contextKey,
        });
      } catch (error) {
        await chrome.storage.local.set({ job: { ...next, state: 'error', error: error.message } });
        throw error;
      }
      return { job: next };
    }
    if (request.type === 'ADMIN_CANCEL') {
      if (job?.state === 'running') {
        await chrome.storage.local.set({
          job: { ...job, state: 'cancelled', detail: 'Cancelled. No partial ZIP was created.' },
        });
        await chrome.tabs
          .sendMessage(job.tabId, { type: 'ADMIN_CANCEL', jobId: job.id })
          .catch(() => {});
      }
      return {};
    }
    if (request.type === 'ADMIN_EXPORT') {
      if (job?.state !== 'ready') throw new Error('Fetch a complete export before downloading.');
      const { result } = await chrome.storage.local.get('result');
      if (!result || result.jobId !== job.id)
        throw new Error('The saved export is unavailable. Fetch again.');
      return { result };
    }
    if (request.type === 'ADMIN_CLEAR') {
      if (job?.state === 'running')
        await chrome.tabs
          .sendMessage(job.tabId, { type: 'ADMIN_CANCEL', jobId: job.id })
          .catch(() => {});
      await chrome.storage.local.remove(['job', 'result', 'inspection']);
      return {};
    }
    throw new Error('Unknown contributor dashboard request.');
  }
  if (!job || job.state !== 'running' || job.id !== request.jobId || job.tabId !== sender.tab.id)
    throw new Error('This capture was cancelled, expired or replaced.');
  if (request.type === 'ADMIN_PROGRESS') {
    if (
      !['preparing', 'categories', 'courses'].includes(request.stage) ||
      !Number.isInteger(request.completed) ||
      !Number.isInteger(request.total) ||
      request.completed < 0 ||
      request.total < request.completed ||
      request.total > 5000
    )
      throw new Error('Invalid export progress.');
    await chrome.storage.local.set({
      job: {
        ...job,
        stage: request.stage,
        completed: request.completed,
        total: request.total,
        detail: String(request.detail || '').slice(0, 200),
        updatedAt: Date.now(),
      },
    });
    return {};
  }
  if (request.type === 'ADMIN_FAILED') {
    await chrome.storage.local.set({
      job: {
        ...job,
        state: 'error',
        error: String(request.error || 'VTOP capture failed.').slice(0, 300),
        updatedAt: Date.now(),
      },
    });
    return {};
  }
  if (request.type === 'ADMIN_COMPLETE') {
    const profile = catalogue.profiles.find(item => item.folder === job.folder);
    const files = globalThis.FFCSContributorExport.buildFiles(
      profile,
      job.mappings,
      request.groups,
      job.includeIndex
    );
    const courses = new Set(Object.values(request.groups).flatMap(group => Object.keys(group)))
      .size;
    const capturedAt = new Date().toISOString();
    const filename = `FFCS-${job.folder}-${capturedAt.slice(0, 10)}.zip`;
    const result = { jobId: job.id, files, filename, capturedAt, courses };
    await chrome.storage.local.set({
      result,
      job: {
        ...job,
        state: 'ready',
        completed: job.total,
        courses,
        fileCount: files.length,
        filename,
        capturedAt,
        detail: 'Your repository-ready ZIP is available.',
        updatedAt: Date.now(),
      },
    });
    return {};
  }
  throw new Error('Unknown VTOP capture request.');
}
chrome.runtime.onMessage.addListener((request, sender, respond) => {
  const operation = queue.then(() => handle(request || {}, sender));
  queue = operation.catch(() => {});
  operation.then(
    data => respond({ ok: true, ...data }),
    error => respond({ ok: false, error: error.message })
  );
  return true;
});
chrome.action.onClicked.addListener(() => {
  void chrome.tabs.create({ url: page });
});
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') void chrome.tabs.create({ url: page });
});
chrome.tabs.onRemoved.addListener(id => {
  const operation = queue.then(async () => {
    const job = await loadJob();
    if (job?.state === 'running' && job.tabId === id)
      await chrome.storage.local.set({
        job: {
          ...job,
          state: 'error',
          error: 'The VTOP tab was closed. Reopen it, log in and reconnect.',
        },
      });
  });
  queue = operation.catch(() => {});
});
