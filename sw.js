const CACHE_NAME = 'chronos-lifetracker-cache-v1';
const urlsToCache = [
  '/',
  '/index.html' 
];

// Evento di installazione: apre la cache e aggiunge i file principali.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento fetch: intercetta le richieste di rete.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se la risorsa è nella cache, la restituisce.
        if (response) {
          return response;
        }
        // Altrimenti, la richiede alla rete.
        return fetch(event.request);
      }
    )
  );
});

// Evento activate: gestisce le vecchie cache.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
