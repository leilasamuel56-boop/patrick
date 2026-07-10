const CACHE_NAME = 'ekobanque-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Installation phase: Caches the core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Mise en cache des ressources initiales');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      // Force immediate activation of the new Service Worker
      return self.skipWaiting();
    })
  );
});

// Activation phase: Cleans up old caches to prevent stale states
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Suppression de l\'ancien cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      // Claim clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch phase: Network first, falling back to cache when offline
self.addEventListener('fetch', (event) => {
  // Only handle HTTP/HTTPS requests (ignores chrome-extension, etc.)
  if (!event.request.url.startsWith(self.location.origin) && !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If the request was successful, clone and store it in the cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Offline Fallback: try matching the request in cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // If the request was for a page/navigation, provide a fallback "Offline" view
          if (event.request.mode === 'navigate' || (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
            return new Response(
              `<!DOCTYPE html>
              <html lang="fr">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Ekobanque - Hors Ligne</title>
                <style>
                  body {
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    background-color: #0f172a;
                    color: #ffffff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    text-align: center;
                  }
                  .container {
                    max-width: 400px;
                    padding: 24px;
                    border-radius: 24px;
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
                  }
                  h1 {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 12px;
                    color: #3b82f6;
                  }
                  p {
                    font-size: 14px;
                    color: #94a3b8;
                    line-height: 1.6;
                    margin-bottom: 24px;
                  }
                  button {
                    background-color: #2563eb;
                    color: #ffffff;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                  }
                  button:hover {
                    background-color: #1d4ed8;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>Vous êtes hors connexion</h1>
                  <p>Il semblerait que vous n'ayez pas d'accès Internet actif. Veuillez vérifier votre connexion et réessayer.</p>
                  <button onclick="window.location.reload()">Réessayer</button>
                </div>
              </body>
              </html>`,
              {
                status: 200,
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
              }
            );
          }

          // Fallback empty response for other asset types
          return Promise.reject('No network and no cached resource available.');
        });
      })
  );
});
