// === VARIABLE DE CONTROL DE CAMBIOS ===
// Cada vez que alteres el diseño o agregues algo en el index.html, 
// cambia este número (ej: de 'v1.1' a 'v1.2') para alertar al teléfono.
const CACHE_VERSION = 'v1.3'; 

const CACHE_NAME = `piemca-cache-${CACHE_VERSION}`;
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './logo.png',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0'
];

// Instalar el Service Worker y almacenar archivos iniciales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // Fuerza a activarse de inmediato
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
    }).then(() => self.clients.claim()) // Toma control sobre todas las pestañas abiertas
  );
});

// Responder peticiones desde el caché para máxima velocidad
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Escuchar la orden de actualización inmediata desde el index.html
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
