const CACHE_NAME = "biochar-app-cache-v1";

const urlsToCache = [
  "/",
  "/offline",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(event.request).catch(() => {
        // If the request is for a page, return the offline page
        if (event.request.mode === "navigate") {
          return caches.match("/offline");
        }
      });
    })
  );
});
