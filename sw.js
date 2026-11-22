/* Azulejo service worker — offline-first after the first visit. */
const CACHE = 'azulejo-v3.23.0';
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
  './js/readings.js',
  './js/listening-zh.js',
  './js/grammar-extra.js',
  './js/vocab-bank.js',
  './js/verbs.js',
  './js/morphology.js',
  './js/intensive.js',
  './js/writing-bank.js',
  './js/exam-guide.js',
  './js/themes.js',
  './js/memory.js',
  './js/phonetics.js',
  './js/pos-existing.js',
  './js/phrases1000.js',
  './js/culture100.js',
  './js/config.js',
  './js/license.js',
  './js/analytics.js',
  './js/cloud.js',
  './js/audio-map.js',
  './js/exams.js',
  './js/exam-bank.js',
  './js/immersion.js',
  './js/resources.js',
  './js/app.js',
  './manifest.webmanifest',
  './assets/icon.svg',
  './assets/photos/azulejo.jpg',
  './assets/photos/bookshop.jpg',
  './assets/photos/cafe.jpg',
  './assets/photos/coast.jpg',
  './assets/photos/fado.jpg',
  './assets/photos/market.jpg',
  './assets/photos/meeting.jpg',
  './assets/photos/office.jpg',
  './assets/photos/pharmacy.jpg',
  './assets/photos/studio.jpg',
  './assets/photos/tram.jpg',
  './assets/audio/a2-1.mp3',
  './assets/audio/a2-2.mp3',
  './assets/audio/a2-3.mp3',
  './assets/audio/a2-4.mp3',
  './assets/audio/a2-5.mp3',
  './assets/audio/a2-6.mp3',
  './assets/audio/a2-7.mp3',
  './assets/audio/a2-8.mp3',
  './assets/audio/a2-9.mp3',
  './assets/audio/a2-10.mp3'
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
