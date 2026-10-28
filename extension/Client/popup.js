/* global chrome */
const statusElement = document.getElementById('status');
const captureButton = document.getElementById('capture');
let actionError = '';
async function refresh() {
  try {
    const status = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });
    if (!status.ok) throw new Error(status.error);
    captureButton.disabled = status.running;
    const saved = status.courses
      ? `${status.courses} courses / ${status.categories} categories\nSaved ${new Date(status.capturedAt).toLocaleString()}`
      : 'No courses captured yet.';
    statusElement.textContent = [
      status.running
        ? `Fetching ${status.stage === 'categories' ? 'categories' : 'courses'}: ${status.completed} / ${status.total || '...'}`
        : saved,
      actionError || status.error,
    ]
      .filter(Boolean)
      .join('\n');
  } catch (error) {
    statusElement.textContent = error.message;
  }
}
captureButton.addEventListener('click', async () => {
  actionError = '';
  try {
    const tabs = await chrome.tabs.query({ url: 'https://vtop.vit.ac.in/vtop/*' });
    const tab = tabs.find(item => item.active) || tabs[0];
    if (!tab) throw new Error('Open VTOP and log in. Capture starts automatically.');
    const result = await chrome.tabs.sendMessage(tab.id, { type: 'CAPTURE_NOW' });
    if (!result?.ok) throw new Error(result?.error || 'Refresh VTOP and try again.');
  } catch (error) {
    actionError = error.message;
  }
  await refresh();
});
document.getElementById('clear').addEventListener('click', async () => {
  actionError = '';
  try {
    const result = await chrome.runtime.sendMessage({ type: 'CLEAR_DATA' });
    if (!result.ok) throw new Error(result.error);
  } catch (error) {
    actionError = error.message;
  }
  await refresh();
});
refresh();
setInterval(refresh, 1000);
