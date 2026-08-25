/* ========== WELDPRO — Service Worker (PWA) ========== */

const CACHE_NAME = 'weldpro-v2-20260825';
const STATIC_URLS = [
  './',
  './index.html',
  './catalog.html',
  './calculators.html',
  './wiki.html',
  './account.html',
  './catalog-compare.html',
  './css/styles.css',
  './js/app.js',
  './manifest.json'
];

// Install: cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Кэширование статических ресурсов');
      return cache.addAll(STATIC_URLS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Удаление старого кэша:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip chrome://, data://, etc.
  if (!request.url.startsWith('http')) return;
  
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        console.log('[SW] Отдача из кэша:', request.url);
        return cached;
      }
      
      // Not in cache — fetch from network
      console.log('[SW] Загрузка с сети:', request.url);
      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200) {
          return response;
        }
        
        // Clone the response
        const responseToCache = response.clone();
        
        // Cache successful fetches (basic, cors, and opaque responses)
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        
        return response;
      }).catch(() => {
        // Offline fallback for HTML pages
        if (request.url.endsWith('.html') || request.url.endsWith('/')) {
          return caches.match('./index.html');
        }
        
        // For other assets, return a 404 response
        return new Response('Resource not found', { status: 404, statusText: 'Not Found' });
      });
    })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  const { action, data } = event.data || {};
  
  if (action === 'skipWaiting') {
    self.skipWaiting();
  } else if (action === 'clearCache') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('[SW] Кэш очищен');
    });
  } else if (action === 'getCacheSize') {
    caches.open(CACHE_NAME).then((cache) => {
      cache.keys().then((keys) => {
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              action: 'cacheSize',
              size: keys.length
            });
          });
        });
      });
    });
  }
});

// Background sync (optional — for future features)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-calculations') {
    event.waitUntil(doSync());
  }
});

async function doSync() {
  // Placeholder for background sync logic
  console.log('[SW] Фоновая синхронизация');
}

// Push notifications (optional — for future features)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Новое обновление WELDPRO!',
    icon: './favicon.svg',
    badge: './favicon.svg',
    vibrate: [100, 50, 100],
    data: { date: Date.now() },
    actions: [
      { action: 'open', title: 'Открыть' },
      { action: 'close', title: 'Закрыть' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('WELDPRO', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});

console.log('[SW] Service Worker загружен');
