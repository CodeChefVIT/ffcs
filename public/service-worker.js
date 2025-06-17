/// <reference lib="webworker" />

const CACHE_NAME = "FFCS-CodeChefVIT_v1";
const DYNAMIC_CACHE_NAME = `FFCS-CodeChefVIT_dynamic_v1`;
const DYNAMIC_CACHE_LIMIT = 50;
const CORE_ASSETS = [
  "/",
  "/offline",
  "/manifest.json",
  "/logo_ffcs/icon-16x16.webp",
  "/logo_ffcs/icon-32x32.webp",
  "/logo_ffcs/icon-48x48.webp",
  "/logo_ffcs/icon-64x64.webp",
  "/logo_ffcs/icon-72x72.webp",
  "/logo_ffcs/icon-76x76.webp",
  "/logo_ffcs/icon-96x96.webp",
  "/logo_ffcs/icon-114x114.webp",
  "/logo_ffcs/icon-120x120.webp",
  "/logo_ffcs/icon-128x128.webp",
  "/logo_ffcs/icon-144x144.webp",
  "/logo_ffcs/icon-152x152.webp",
  "/logo_ffcs/icon-180x180.webp",
  "/logo_ffcs/icon-192x192.webp",
  "/logo_ffcs/icon-196x196.webp",
  "/logo_ffcs/icon-228x228.webp",
  "/logo_ffcs/icon-256x256.webp",
  "/logo_ffcs/icon-384x384.webp",
  "/logo_ffcs.png",
  "/logo_ffcs.svg",
  "/logo_ffcs.webp",
  "/logo_ffcs.svg",
];

function isCoreAsset(request) {
  const url = new URL(request.url);
  return CORE_ASSETS.includes(url.pathname);
}

function isPublicAsset(request) {
  const url = new URL(request.url);
  return (
    url.pathname.match(/^\/(icons|art|social|logo_ffcs)\//) ||
    url.pathname.match(/^\/[^/]+\.(png|svg|webp|jpg|jpeg|gif|ico|json)$/)
  );
}

async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    await limitCacheSize(cacheName, maxItems);
  }
}

async function cacheCoreAssets() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(CORE_ASSETS);
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn("[SW] Cache-first fetch failed:", error);
    return await cache.match("/offline");
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then(async (response) => {
      if (response && response.status === 200) {
        await cache.put(request, response.clone());
        await limitCacheSize(DYNAMIC_CACHE_NAME, DYNAMIC_CACHE_LIMIT);
      }
      return response;
    })
    .catch((error) => {
      console.warn("[SW] Network fetch failed:", error);
      return null;
    });
  return cached || fetchPromise;
}

self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");
  event.waitUntil(cacheCoreAssets());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...");
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== DYNAMIC_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
      self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET") {
    return;
  }
  if (url.origin === self.location.origin) {
    if (isCoreAsset(event.request)) {
      event.respondWith(cacheFirst(event.request));
    } else if (isPublicAsset(event.request)) {
      // Cache all public assets on first fetch
      event.respondWith(cacheFirst(event.request));
    } else {
      event.respondWith(
        (async () => {
          const cached = await caches
            .open(DYNAMIC_CACHE_NAME)
            .then((c) => c.match(event.request));
          if (cached) {
            event.waitUntil(staleWhileRevalidate(event.request));
            return cached;
          } else {
            try {
              const response = await fetch(event.request);
              if (response && response.status === 200) {
                const cache = await caches.open(DYNAMIC_CACHE_NAME);
                await cache.put(event.request, response.clone());
                await limitCacheSize(DYNAMIC_CACHE_NAME, DYNAMIC_CACHE_LIMIT);
              }
              return response;
            } catch (error) {
              console.warn("[SW] Dynamic fetch failed:", error);
              return await caches.match("/offline");
            }
          }
        })()
      );
    }
  }
});
