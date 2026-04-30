// Service Worker for ADSL/VDSL Calculator PWA
const CACHE_NAME = 'adsl-vdsl-calc-v1';
const STATIC_ASSETS = [
    '/adsl-vdsl-line-speed-calculator/',
    '/adsl-vdsl-line-speed-calculator/index.html',
    '/adsl-vdsl-line-speed-calculator/css/style.css',
    '/adsl-vdsl-line-speed-calculator/js/app.js',
    '/adsl-vdsl-line-speed-calculator/js/i18n.js',
    '/adsl-vdsl-line-speed-calculator/img/logo.svg',
    '/adsl-vdsl-line-speed-calculator/img/favicon.svg',
    '/adsl-vdsl-line-speed-calculator/img/favicon.ico',
    '/adsl-vdsl-line-speed-calculator/img/apple-touch-icon.png',
    '/adsl-vdsl-line-speed-calculator/img/og-image.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Don't cache non-GET requests or external resources
                        if (event.request.method !== 'GET' || 
                            !event.request.url.includes(self.location.origin)) {
                            return networkResponse;
                        }
                        // Cache successful responses
                        if (networkResponse && networkResponse.status === 200) {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, responseClone);
                            });
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // Return offline fallback for HTML requests
                        if (event.request.headers.get('accept')?.includes('text/html')) {
                            return caches.match('/adsl-vdsl-line-speed-calculator/');
                        }
                        // Return a simple offline message for other resources
                        return new Response('Offline - Resource not cached', {
                            status: 503,
                            headers: { 'Content-Type': 'text/plain' }
                        });
                    });
            })
    );
});
