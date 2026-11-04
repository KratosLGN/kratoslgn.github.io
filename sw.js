const CACHE_NAME = 'fsociety-install-v2';
const OFFLINE_URL = new URL('./offline.html', self.location.href).href;
const INSTALL_ASSETS = ['./offline.html', './icons/fsociety.png', './icons/fsociety.svg'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(INSTALL_ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('fsociety-install-') && key !== CACHE_NAME)
      .map(key => caches.delete(key))
  )));
});
self.addEventListener('fetch', event => {
  // Never intercept channel frames, streams, tokens, or third-party resources.
  if (event.request.mode !== 'navigate' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE_URL)));
});
