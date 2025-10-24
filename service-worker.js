const CACHE_NAME = "domino-1.4.6";
const FILES_TO_CACHE = [
  "./index.html",
  "./logo192x192.png",
  "./logo512x512.png"
];

// --- INSTALL ---
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  // activate immediately after install
  self.skipWaiting();
});

// --- ACTIVATE ---
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      );
      // ✅ Claim only after this worker becomes active
      await self.clients.claim();
    })()
  );
});

// --- FETCH ---
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Always fetch a fresh index.html
  if (request.mode === "navigate" || request.url.endsWith("index.html")) {
    event.respondWith(
      fetch(request).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Cache-first fallback for everything else
  event.respondWith(
    caches.match(request).then((response) => response || fetch(request))
  );
});