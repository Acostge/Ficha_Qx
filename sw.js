// Cambiamos la versión para obligar a actualizar todo
const CACHE_VERSION = 'v1.4'; 

// ... (deja el resto de tus constantes ASSETS e install/activate igual) ...

// RESPONDER PETICIONES (CORREGIDO PARA LOGRAR PASO DIRECTO DE LA API)
self.addEventListener('fetch', event => {
  // Si la petición es para la API de Google Apps Script, dejarla pasar directo por red sin tocar el caché
  if (event.request.url.includes('script.google.com')) {
    return event.respondWith(fetch(event.request));
  }

  // Para el resto de los archivos locales (html, logos, etc), usar el caché
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
