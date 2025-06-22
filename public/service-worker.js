/// <reference lib="webworker" />

const CACHE_NAME = "FFCS-CodeChefVIT_v1";
const CORE_ASSETS = [
  "/",
  "/offline",
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
];

const limitCacheSize = (name, maxItems) => {
  caches.open(name).then((cache) =>
    cache.keys().then((keys) => {
      if (keys.length > maxItems) {
        cache.delete(keys[0]).then(() => limitCacheSize(name, maxItems));
      }
    })
  );
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (
    request.method !== "GET" ||
    request.url.includes("/api") ||
    request.url.includes("chrome-extension") ||
    request.url.startsWith("chrome")
  ) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cacheRes) => {
      return (
        cacheRes ||
        fetch(request)
          .then((fetchRes) => {
            return caches.open(CACHE_NAME).then((cache) => {
              if (
                request.url.startsWith(self.location.origin) &&
                !request.url.includes("/api")
              ) {
                cache.put(request.url, fetchRes.clone());
                limitCacheSize(CACHE_NAME, 50);
              }
              return fetchRes;
            });
          })
          .catch(() => {
            if (request.headers.get("accept")?.includes("text/html")) {
              return caches.match("/offline");
            }
          })
      );
    })
  );
});
