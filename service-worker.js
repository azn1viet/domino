const CACHE_NAME = "domino-v2";
const FILES_TO_CACHE = [
  "./manifest.json",
  "./logo192x192.png",
  "./logo512x512.png"
];

// Install new service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate — clean old versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network first for index.html, cache fallback
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.mode === "navigate" || req.url.endsWith("index.html")) {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put("/", copy));
        return res;
      }).catch(() => caches.match("/index.html"))
    );
  } else {
    event.respondWith(caches.match(req).then((res) => res || fetch(req)));
  }
});
