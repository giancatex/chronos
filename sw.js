const CACHE_NAME = 'chronos-lifetracker-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'logo.png'
  // Aggiungi qui altri file statici che vuoi mettere in cache, es. CSS o altri JS
];

// Evento di installazione: viene eseguito quando il Service Worker viene registrato per la prima volta.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aperta');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento di fetch: intercetta tutte le richieste di rete fatte dalla pagina.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se la risorsa è già in cache, la restituisce.
        if (response) {
          return response;
        }
        // Altrimenti, esegue la richiesta di rete.
        return fetch(event.request);
      }
    )
  );
});

// Evento di attivazione: viene eseguito quando il Service Worker viene attivato.
// Utile per pulire vecchie cache non più necessarie.
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

