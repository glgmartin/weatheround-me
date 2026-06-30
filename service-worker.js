const CACHE_NAME = 'weather-app-v1';
const APP_SHELL = ['/', '/index.html', '/manifest.json', '/service-worker.js'];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    const isAppShell = url.origin === self.location.origin &&
        APP_SHELL.some(path => url.pathname === path || url.pathname.endsWith('/index.html'));

    if (isAppShell) {
        event.respondWith(
            caches.match(event.request).then(cached => cached || fetch(event.request))
        );
    }
});
