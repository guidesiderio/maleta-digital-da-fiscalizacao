// ⚠️ Sincronizar com LAST_UPDATED em js/data.js ao atualizar conteúdo
const CACHE_NAME = 'maleta-2026-04-07';

const SHELL = [
  './',
  'index.html',
  'css/style.css',
  'js/data.js',
  'js/script.js',
  'manifest.json',
  'assets/img/logo-ufpi.png',
];

// Pre-cache app shell on install
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

// Clean old caches on activate
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for shell assets (HTML, JS, CSS) and PDFs — always try fresh.
// Cache-first only for static assets that rarely change (images, icons, fonts).
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  const path = url.pathname;
  const isStatic = /\.(png|jpe?g|gif|svg|ico|webp|woff2?|ttf|eot)$/i.test(path);

  if (isStatic) {
    // Cache first for images, icons, fonts (rarely change)
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // Network first for everything else (HTML, JS, CSS, PDFs, manifest)
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
