'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    if (process.env.NODE_ENV !== 'production') {
      // An old offline worker can serve stale development chunks after a file is renamed.
      const clearDevelopmentCache = async () => {
        const registration = await navigator.serviceWorker.getRegistration('/');
        const workers = [registration?.active, registration?.waiting, registration?.installing];
        const ownsRegistration = workers.some(worker => {
          if (!worker) return false;
          const url = new URL(worker.scriptURL);
          return url.origin === window.location.origin && url.pathname === '/service-worker.js';
        });
        const controlled = navigator.serviceWorker.controller;
        const ownsController =
          controlled &&
          new URL(controlled.scriptURL).origin === window.location.origin &&
          new URL(controlled.scriptURL).pathname === '/service-worker.js';
        const unregistered = ownsRegistration && (await registration!.unregister());
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(
            keys.filter(key => key.startsWith('FFCS-CodeChefVIT_')).map(key => caches.delete(key))
          );
        }
        // Unregistering leaves this tab controlled until its next navigation.
        if (unregistered && ownsController) window.location.reload();
      };
      void clearDevelopmentCache().catch(() => {});
      return;
    }

    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  }, []);

  return null;
}
