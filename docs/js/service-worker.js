const CACHE_NAME = 'image-cache-v1';
const urlsToCache = [
    '../img/favicon14.png',
    '../img/favicon15.png',
    '../img/favicon3.png',
    '../img/favicon4.png'
];

// Install the service worker and cache the images
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Intercept network requests and serve cached images
self.addEventListener('fetch', event => {
    if (event.request.url.includes('/img/')) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    return response || fetch(event.request);
                })
        );
    }
});