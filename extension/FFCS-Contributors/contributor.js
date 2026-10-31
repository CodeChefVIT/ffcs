/* global chrome */
(() => {
  const $ = id => document.getElementById(id);
  let schools = [],
    inspection = null,
    job = null,
    working = false,
    polling = false;
  let autoDownload = null,
    downloading = false;
  const destination = () => ({ school: $('school').value, branch: $('branch').value });
  function error(message = '') {
    $('error').textContent = message;
    $('error').hidden = !message;
  }
  async function send(type, data = {}) {
    const result = await chrome.runtime.sendMessage({ type, ...data });
    if (!result?.ok)
      throw new Error(result?.error || 'The extension did not respond. Reload it and try again.');
    return result;
  }
  function syncControls() {
    const running = job?.state === 'running';
    let folder = '';
    try {
      if (schools.includes($('school').value))
        folder = globalThis.FFCSContributorExport.destinationPath(destination());
    } catch {
      /* A partially entered branch is not ready yet. */
    }
    $('destination').textContent = folder
      ? `ZIP folder: ${folder}/`
      : 'Choose a school and enter your branch.';
    $('connect').disabled = working || running || !$('vtop-tab').value;
    $('reload-tabs').disabled = working || running;
    $('vtop-tab').disabled = working || running;
    $('school').disabled = working || running;
    $('branch').disabled = working || running;
    $('start').disabled =
      working ||
      running ||
      !folder ||
      !inspection ||
      inspection.tabId !== Number($('vtop-tab').value);
    $('cancel').hidden = !running;
    $('download').hidden = job?.state !== 'ready';
    $('download').disabled = downloading;
    $('clear').disabled = working;
  }
  function renderCategories() {
    const body = $('categories');
    body.replaceChildren();
    if (!inspection) {
      const row = document.createElement('tr'),
        cell = document.createElement('td');
      cell.colSpan = 2;
      cell.textContent = 'Connect to VTOP to see the files that will be exported.';
      row.appendChild(cell);
      body.appendChild(row);
    } else
      for (const category of inspection.categories) {
        const row = document.createElement('tr'),
          label = document.createElement('td'),
          filename = document.createElement('td');
        label.textContent = category.label;
        filename.textContent = globalThis.FFCSContributorExport.categoryFile(category);
        row.append(label, filename);
        body.appendChild(row);
      }
    syncControls();
  }
  function renderJob() {
    const progress = $('progress');
    progress.hidden = job?.state !== 'running';
    progress.max = job?.total || 1;
    if (job?.total) progress.value = job.completed;
    else progress.removeAttribute('value');
    const status = $('job-status');
    if (!job) status.textContent = 'Connect to VTOP and enter your school and branch to start.';
    else if (job.state === 'running')
      status.textContent = `${job.detail} - ${job.completed} / ${job.total || '...'} ${job.stage === 'categories' ? 'categories' : 'courses'}`;
    else if (job.state === 'ready')
      status.textContent = `${job.folder}: ${job.courses} courses, ${job.fileCount} files. ${job.filename}`;
    else status.textContent = job.error || job.detail || 'Capture stopped.';
    syncControls();
  }
  async function reloadTabs() {
    const old = $('vtop-tab').value;
    const { tabs } = await send('ADMIN_TABS');
    $('vtop-tab').replaceChildren();
    if (!tabs.length) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'No VTOP tab found - open VTOP and log in';
      $('vtop-tab').appendChild(option);
    }
    for (const tab of tabs) {
      const option = document.createElement('option');
      option.value = String(tab.id);
      option.textContent = `${tab.title} (tab ${tab.id})`;
      $('vtop-tab').appendChild(option);
    }
    if (tabs.some(tab => String(tab.id) === old)) $('vtop-tab').value = old;
    syncControls();
  }
  async function download() {
    if (downloading) return;
    downloading = true;
    syncControls();
    error();
    try {
      const { result } = await send('ADMIN_EXPORT');
      const url = URL.createObjectURL(
        new Blob([globalThis.FFCSZip.createZip(result.files)], { type: 'application/zip' })
      );
      let timeout, id;
      const release = () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(url);
        chrome.downloads.onChanged.removeListener(changed);
      };
      const changed = delta => {
        if (delta.id === id && ['complete', 'interrupted'].includes(delta.state?.current))
          release();
      };
      try {
        id = await chrome.downloads.download({ url, filename: result.filename, saveAs: false });
      } catch (err) {
        URL.revokeObjectURL(url);
        throw err;
      }
      chrome.downloads.onChanged.addListener(changed);
      timeout = setTimeout(release, 60000);
    } catch (err) {
      error(err.message);
    } finally {
      downloading = false;
      syncControls();
    }
  }
  async function poll() {
    if (polling) return;
    polling = true;
    try {
      const state = await send('ADMIN_STATE');
      job = state.job;
      renderJob();
      if (job?.state === 'ready' && job.id === autoDownload) {
        autoDownload = null;
        await download();
      }
    } catch (err) {
      error(err.message);
    } finally {
      polling = false;
    }
  }
  $('school').addEventListener('change', syncControls);
  $('branch').addEventListener('input', syncControls);
  $('vtop-tab').addEventListener('change', () => {
    inspection = null;
    $('session-status').textContent = 'Connect to the selected VTOP tab.';
    renderCategories();
  });
  $('reload-tabs').addEventListener(
    'click',
    () => void reloadTabs().catch(err => error(err.message))
  );
  $('connect').addEventListener('click', async () => {
    working = true;
    error();
    syncControls();
    $('session-status').textContent = 'Reading your available categories from VTOP...';
    try {
      const response = await send('ADMIN_INSPECT_TAB', { tabId: Number($('vtop-tab').value) });
      inspection = response.inspection;
      $('session-status').textContent =
        `${inspection.categories.length} categories will be exported${inspection.term ? ` - ${inspection.term}` : ''}.`;
      renderCategories();
    } catch (err) {
      inspection = null;
      $('session-status').textContent = 'Connection failed. Log in, refresh VTOP and reconnect.';
      renderCategories();
      error(err.message);
    } finally {
      working = false;
      syncControls();
    }
  });
  $('start').addEventListener('click', async () => {
    working = true;
    error();
    syncControls();
    try {
      const response = await send('ADMIN_START', { tabId: inspection.tabId, ...destination() });
      job = response.job;
      autoDownload = job.id;
      renderJob();
    } catch (err) {
      error(err.message);
    } finally {
      working = false;
      syncControls();
    }
  });
  $('cancel').addEventListener('click', async () => {
    autoDownload = null;
    try {
      await send('ADMIN_CANCEL');
      await poll();
    } catch (err) {
      error(err.message);
    }
  });
  $('download').addEventListener('click', () => void download());
  $('clear').addEventListener('click', async () => {
    working = true;
    autoDownload = null;
    syncControls();
    try {
      await send('ADMIN_CLEAR');
      inspection = null;
      job = null;
      error();
      $('session-status').textContent = 'Captured data cleared. Connect to VTOP to start again.';
      renderCategories();
      renderJob();
    } catch (err) {
      error(err.message);
    } finally {
      working = false;
      syncControls();
    }
  });
  async function init() {
    try {
      const config = await send('ADMIN_CONFIG');
      schools = config.schools;
      for (const school of schools) {
        const option = document.createElement('option');
        option.value = school;
        option.textContent = school;
        $('school').appendChild(option);
      }
      await reloadTabs();
      const state = await send('ADMIN_STATE');
      job = state.job;
      if (state.settings && schools.includes(state.settings.school)) {
        $('school').value = state.settings.school;
        $('branch').value = state.settings.branch || '';
      }
      if (
        state.inspection &&
        [...$('vtop-tab').options].some(option => Number(option.value) === state.inspection.tabId)
      ) {
        inspection = state.inspection;
        $('vtop-tab').value = String(inspection.tabId);
        $('session-status').textContent =
          `${inspection.categories.length} available categories${inspection.term ? ` - ${inspection.term}` : ''}.`;
      }
      renderCategories();
      renderJob();
      setInterval(() => void poll(), 750);
    } catch (err) {
      error(err.message);
    }
  }
  void init();
})();
