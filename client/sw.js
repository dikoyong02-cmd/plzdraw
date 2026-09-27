const CACHE_NAME = 'plzdraw-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/canvas.js',
  './js/db.js',
  './js/app.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Socket.io 통신 및 외부 CDN은 서비스 워커 캐시 대상에서 제외
  if (e.request.url.includes('/socket.io/')) return;

  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

