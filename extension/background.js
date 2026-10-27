/* global chrome, importScripts */
importScripts('parser.js');
const VTOP = 'https://vtop.vit.ac.in';
const APP_ORIGINS = new Set([
  'https://ffcs.codechefvit.com',
  'http://localhost',
  'http://127.0.0.1',
]);
const LEASE_MS = 90000;
let queue = Promise.resolve();
const ready = Promise.all([
  chrome.storage.local.setAccessLevel({ accessLevel: 'TRUSTED_CONTEXTS' }),
  chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_CONTEXTS' }),
]);
function senderKind(sender) {
  if (sender.id !== chrome.runtime.id || sender.frameId > 0) return null;
  if (sender.url === chrome.runtime.getURL('popup.html')) return 'popup';
  try {
    const url = new URL(sender.url);
    if (url.origin === VTOP && url.pathname.startsWith('/vtop/')) return 'vtop';
    if (APP_ORIGINS.has(url.origin) || APP_ORIGINS.has(`${url.protocol}//${url.hostname}`))
      return 'app';
  } catch {
    /* Opaque senders cannot access the catalogue. */
  }
  return null;
}
async function handle(message, sender) {
  await ready;
  const kind = senderKind(sender);
  if (!kind) throw new Error('This page cannot access the catalogue.');
  const { dataset, contextKey } = await chrome.storage.local.get(['dataset', 'contextKey']);
  const { capture } = await chrome.storage.session.get('capture');
  const active = capture?.running && capture.expiresAt > Date.now();
  if (message.type === 'GET_DATA' && (kind === 'app' || kind === 'popup'))
    return { dataset: dataset || null };
  if (message.type === 'GET_STATUS')
    return {
      capturedAt: dataset?.capturedAt || null,
      courses: dataset
        ? new Set(Object.values(dataset.categories).flatMap(group => Object.keys(group))).size
        : 0,
      categories: dataset ? Object.keys(dataset.categories).length : 0,
      running: Boolean(active),
      stage: capture?.stage || 'categories',
      completed: capture?.completed || 0,
      total: capture?.total || 0,
      error:
        !active && capture?.running
          ? 'Capture stopped. Open VTOP and sync again.'
          : capture?.error || null,
    };
  if (message.type === 'CLEAR_DATA' && (kind === 'app' || kind === 'popup')) {
    await chrome.storage.local.remove(['dataset', 'contextKey']);
    await chrome.storage.session.remove('capture');
    return {};
  }
  if (kind !== 'vtop') throw new Error('Only VTOP can capture courses.');
  if (message.type === 'VTOP_BEGIN') {
    if (!/^[a-f0-9]{64}$/.test(message.contextKey)) throw new Error('Invalid VTOP context.');
    if (active) throw new Error('A capture is already running. Wait for it to finish.');
    if (contextKey !== message.contextKey) await chrome.storage.local.remove('dataset');
    await chrome.storage.local.set({ contextKey: message.contextKey });
    const runId = crypto.randomUUID();
    await chrome.storage.session.set({
      capture: {
        runId,
        tabId: sender.tab.id,
        contextKey: message.contextKey,
        running: true,
        expiresAt: Date.now() + LEASE_MS,
        completed: 0,
        total: 0,
      },
    });
    return { runId };
  }
  if (!active || capture.runId !== message.runId || capture.tabId !== sender.tab?.id) {
    throw new Error('Capture expired or was cleared. Sync again in VTOP.');
  }
  if (message.type === 'VTOP_PROGRESS') {
    await chrome.storage.session.set({
      capture: {
        ...capture,
        completed: message.completed,
        total: message.total,
        stage: message.stage === 'courses' ? 'courses' : 'categories',
        expiresAt: Date.now() + LEASE_MS,
      },
    });
    return {};
  }
  if (message.type === 'VTOP_COMMIT') {
    if (
      !globalThis.FFCSVtopParser.validDataset(message.dataset) ||
      message.dataset.catalogueId !== capture.contextKey
    ) {
      throw new Error('VTOP returned an invalid catalogue.');
    }
    await chrome.storage.local.set({ dataset: message.dataset });
    await chrome.storage.session.set({ capture: { running: false } });
    return {};
  }
  if (message.type === 'VTOP_FAIL') {
    await chrome.storage.session.set({
      capture: { running: false, error: String(message.error).slice(0, 300) },
    });
    return {};
  }
  throw new Error('Unknown extension request.');
}
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  // Serialize changes so multiple tabs cannot overwrite each other's captures.
  const operation = queue.then(() => handle(message || {}, sender));
  queue = operation.catch(() => {});
  operation.then(
    data => respond({ ok: true, ...data }),
    error => respond({ ok: false, error: error.message })
  );
  return true;
});
