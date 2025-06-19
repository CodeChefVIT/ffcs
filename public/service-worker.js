/// <reference lib="webworker" />

const CACHE_NAME = "FFCS-CodeChefVIT_v1";
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
];

function isPublicAsset(request) {
  const url = new URL(request.url);
  return (
    url.origin === self.location.origin &&
    (CORE_ASSETS.includes(url.pathname) ||
      url.pathname.startsWith("/logo_ffcs/") ||
      url.pathname.match(/\.(png|svg|webp|jpg|jpeg|gif|ico|json)$/))
  );
}

self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  if (isPublicAsset(event.request)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request).catch(() => caches.match("/offline"))
        );
      })
    );
  }
});
