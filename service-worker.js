const CACHE_NAME = "domino-v1";
const FILES_TO_CACHE = [
  "./manifest.json",
   "./logo.png",
  "./logo192x192.png",
  "./logo512x512.png"
];
// Install — cache static assets + latest index.html
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([...FILES_TO_CACHE, "./index.html"]))
  );
  self.skipWaiting();
});

// Activate — remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Always try network first for index.html, fallback to cache if offline
  if (request.mode === "navigate" || request.url.endsWith("index.html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Save fresh version to cache
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html")) // fallback if offline
    );
    return;
  }

  // For other files: cache first, then network fallback
  event.respondWith(
    caches.match(request).then((response) => response || fetch(request))
  );
});