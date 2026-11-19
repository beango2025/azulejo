/* Azulejo service worker — offline-first after the first visit. */
const CACHE = 'azulejo-v1.8.0';
const CORE = [
  './',
  './index.html',
  './css/styles.css',
  './js/data.js',
  './js/advanced.js',
  './js/more.js',
  './js/lexicon.js',
  './js/scenes.js',
  './js/labs.js',
  './js/immersion.js',
  './js/resources.js',
  './js/app.js',
  './manifest.webmanifest',
  './assets/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request).then(cached => cached || caches.match('./index.html')))
  );
});
