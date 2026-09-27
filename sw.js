const CACHE_NAME = 'plzdraw-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './js/canvas.js',
  './js/app.js'
];

// 1. 서비스 워커 설치 및 파일 캐싱
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. 오프라인 요청 처리 (네트워크 우선 -> 실패 시 캐시 읽기)
self.addEventListener('fetch', (e) => {
  // WebSocket 요청이나 외부 API 호출은 서비스 워커 캐시에서 제외
  if (e.request.url.startsWith('ws://') || e.request.url.startsWith('wss://')) {
    return;
  }

  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});

