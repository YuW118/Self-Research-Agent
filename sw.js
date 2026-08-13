/**
 * Self-Research Agent - Service Worker
 * PWA offline support - network-first for JS/CSS, cache-first for others
 */

const CACHE_NAME = 'self-research-v32';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/library.css',
  './js/dimensions.js',
  './js/topics.js',
  './js/store.js',
  './js/voice.js',
  './js/views.js',
  './js/app.js',
  './js/library-data.js',
  './js/library-books-extra.js',
  './js/library.js',
  './assets/icon.svg',
  './assets/icon-maskable.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network-first for JS and CSS — always fetch latest code
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline: fall back to cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // 带查询参数（如 ?view=checkin）的导航请求，回退到缓存的主页面
          if (event.request.mode === 'navigate') return caches.match('./index.html');
          return new Response('Offline', { status: 503 });
        });
      })
    );
    return;
  }

  // Cache-first for images, manifest, and other assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
