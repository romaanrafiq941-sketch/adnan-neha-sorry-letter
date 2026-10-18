'use strict';

const CACHE_NAME = 'sorry-letter-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './script.js'
];

// On install: cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// On activate: remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first, fallback to network, then fallback to cache of index.html
self.addEventListener('fetch', event => {
  const req = event.request;

  // Only handle GET requests for same-origin resources
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req)
        .then(networkRes => {
          // Optionally cache the fetched resource
          return caches.open(CACHE_NAME).then(cache => {
            // Put a clone in cache (ignore opaque responses)
            try {
              if (networkRes && networkRes.status === 200 && networkRes.type === 'basic') {
                cache.put(req, networkRes.clone());
              }
            } catch (e) {
              // ignore cache put errors
            }
            return networkRes;
          });
        })
        .catch(() => {
          // If fetch fails (offline), fallback to cached index.html for navigation requests
          if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
            return caches.match('./index.html');
          }
          // For other requests, try to return something from cache or fail
          return caches.match(req);
        });
    })
  );
});
