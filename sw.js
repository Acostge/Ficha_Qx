// Variable de control para forzar la actualización
const CACHE_VERSION = 'v1.5'; 
const CACHE_NAME = `piemca-cache-${CACHE_VERSION}`;

// Solo guardamos en caché los archivos locales que controlamos en Github
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './logo.png'
];

// Instalar el Service Worker y almacenar archivos locales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Limpiar versiones viejas del caché automáticamente
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ESTRATEGIA DE RED MEJORADA: Solo interceptar archivos locales del repositorio
self.addEventListener('fetch', event => {
  // Si la petición NO es interna de nuestro servidor/repositorio (ej: CDN de charts o script de Google), se va directo por internet sin pasar por el Service Worker
  if (!event.request.url.startsWith(self.location.origin)) {
    return; 
  }

  // Si es un archivo local (index.html, logos), buscamos en caché primero
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Escuchar la orden de actualización inmediata
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
