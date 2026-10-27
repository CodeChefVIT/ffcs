/* global chrome */
(() => {
  const $ = id => document.getElementById(id);
  let profiles = [],
    inspection = null,
    job = null,
    rows = [],
    working = false,
    polling = false;
  let autoDownload = null,
    downloading = false;
  const currentProfile = () => profiles.find(profile => profile.folder === $('folder').value);
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
  function mappings() {
    return rows
      .filter(row => row.check.checked)
      .map(row => ({ code: row.category.code, file: row.select.value }));
  }
  function validMappings() {
    const selected = mappings();
    return (
      selected.length > 0 &&
      selected.every(item => item.file) &&
      new Set(selected.map(item => item.file)).size === selected.length
    );
  }
  function syncControls() {
    const running = job?.state === 'running';
    $('connect').disabled = working || running || !$('vtop-tab').value;
    $('reload-tabs').disabled = working || running;
    $('vtop-tab').disabled = working || running;
    $('folder').disabled = working || running;
    $('include-index').disabled = working || running;
    $('start').disabled =
      working ||
      running ||
      !inspection ||
      inspection.tabId !== Number($('vtop-tab').value) ||
      !currentProfile() ||
      !validMappings();
    $('cancel').hidden = !running;
    $('download').hidden = job?.state !== 'ready';
    $('download').disabled = downloading;
    $('clear').disabled = working;
    for (const row of rows) {
      row.check.disabled = working || running;
      row.select.disabled = working || running || !row.check.checked;
    }
    const preview = $('preview');
    preview.replaceChildren();
    const profile = currentProfile();
    if (profile) {
      for (const item of mappings())
        if (item.file) {
          const li = document.createElement('li');
          li.textContent = `src/data/${profile.folder}/${item.file}`;
          preview.appendChild(li);
        }
      if ($('include-index').checked && mappings().length) {
        const li = document.createElement('li');
        li.textContent = `src/data/${profile.folder}/index.ts (unchanged)`;
        preview.appendChild(li);
      }
    }
  }
  function renderMappings(previous = []) {
    rows = [];
    const body = $('mappings');
    body.replaceChildren();
    if (!inspection) {
      const row = document.createElement('tr'),
        cell = document.createElement('td');
      cell.colSpan = 3;
      cell.textContent = 'Connect to VTOP to see available categories.';
      row.appendChild(cell);
      body.appendChild(row);
      syncControls();
      return;
    }
    const profile = currentProfile();
    for (const category of inspection.categories) {
      const tr = document.createElement('tr'),
        choose = document.createElement('td'),
        label = document.createElement('td'),
        target = document.createElement('td');
      const check = document.createElement('input');
      check.type = 'checkbox';
      check.checked = true;
      check.setAttribute('aria-label', `Export ${category.code}`);
      choose.appendChild(check);
      label.textContent = category.label;
      const code = document.createElement('small');
      code.textContent = category.code;
      label.appendChild(code);
      const select = document.createElement('select');
      select.setAttribute('aria-label', `File for ${category.code}`);
      const empty = document.createElement('option');
      empty.value = '';
      empty.textContent = profile
        ? 'Choose a file or uncheck this category'
        : 'Choose a destination folder first';
      select.appendChild(empty);
      for (const file of profile?.files || []) {
        const option = document.createElement('option');
        option.value = file.file;
        option.textContent = `${file.file} - export ${file.symbol}`;
        select.appendChild(option);
      }
      const saved = previous.find(item => item.code === category.code);
      select.value =
        saved && profile?.files.some(file => file.file === saved.file)
          ? saved.file
          : profile
            ? globalThis.FFCSContributorExport.suggestFile(profile, category)
            : '';
      target.appendChild(select);
      tr.append(choose, label, target);
      body.appendChild(tr);
      rows.push({ category, check, select });
      check.addEventListener('change', syncControls);
      select.addEventListener('change', syncControls);
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
    if (!job) status.textContent = 'Choose a folder and category mappings to start.';
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
      const bytes = globalThis.FFCSZip.createZip(result.files);
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/zip' }));
      let timeout;
      const release = () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(url);
        chrome.downloads.onChanged.removeListener(changed);
      };
      const changed = delta => {
        if (delta.id === id && ['complete', 'interrupted'].includes(delta.state?.current))
          release();
      };
      let id;
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
  $('folder').addEventListener('change', () => renderMappings());
  $('include-index').addEventListener('change', syncControls);
  $('vtop-tab').addEventListener('change', () => {
    inspection = null;
    $('session-status').textContent = 'Connect to the selected VTOP tab.';
    renderMappings();
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
        `${inspection.categories.length} available categories${inspection.term ? ` - ${inspection.term}` : ''}.`;
      renderMappings();
    } catch (err) {
      inspection = null;
      $('session-status').textContent = 'Connection failed. Log in, refresh VTOP and reconnect.';
      renderMappings();
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
      const response = await send('ADMIN_START', {
        tabId: inspection.tabId,
        folder: $('folder').value,
        mappings: mappings(),
        includeIndex: $('include-index').checked,
      });
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
      renderMappings();
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
      profiles = config.profiles;
      for (const profile of profiles) {
        const option = document.createElement('option');
        option.value = profile.folder;
        option.textContent = `${profile.label} / ${profile.folder}${profile.files.length ? '' : ' (no configured data files)'}`;
        option.disabled = !profile.files.length;
        $('folder').appendChild(option);
      }
      await reloadTabs();
      const state = await send('ADMIN_STATE');
      job = state.job;
      if (
        state.settings &&
        profiles.some(profile => profile.folder === state.settings.folder && profile.files.length)
      ) {
        $('folder').value = state.settings.folder;
        $('include-index').checked = state.settings.includeIndex;
      }
      if (
        state.inspection &&
        [...$('vtop-tab').options].some(option => Number(option.value) === state.inspection.tabId)
      ) {
        inspection = state.inspection;
        $('vtop-tab').value = String(inspection.tabId);
        $('session-status').textContent =
          `${inspection.categories.length} categories${inspection.term ? ` - ${inspection.term}` : ''}. Reconnect after changing VTOP account or semester.`;
      }
      renderMappings(state.settings?.mappings);
      renderJob();
      setInterval(() => void poll(), 750);
    } catch (err) {
      error(err.message);
    }
  }
  void init();
})();
