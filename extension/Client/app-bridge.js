/* global chrome */
(() => {
  const channel = 'ffcs-vtop-v1';
  window.addEventListener('message', async event => {
    const request = event.data;
    if (
      event.source !== window ||
      event.origin !== location.origin ||
      request?.channel !== channel ||
      request.direction !== 'request' ||
      typeof request.requestId !== 'string' ||
      request.requestId.length > 100 ||
      !['GET_DATA', 'GET_STATUS', 'CLEAR_DATA'].includes(request.type)
    )
      return;
    try {
      const result = await chrome.runtime.sendMessage({ type: request.type });
      window.postMessage(
        { channel, direction: 'response', requestId: request.requestId, ...result },
        location.origin
      );
    } catch {
      window.postMessage(
        {
          channel,
          direction: 'response',
          requestId: request.requestId,
          ok: false,
          error: 'Extension was updated. Refresh this page.',
        },
        location.origin
      );
    }
  });
  // The worker restricts direct storage access. Only an invalidation notification crosses this boundary.
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.dataset)
      window.postMessage({ channel, direction: 'changed' }, location.origin);
  });
})();
