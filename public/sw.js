/**
 * EKA Progressive Web App Service Worker
 * Provides offline resilience, intelligent runtime asset caching,
 * and high-availability shell fallbacks.
 */

const CACHE_VERSION = "v2";
const STATIC_CACHE = `eka-static-${CACHE_VERSION}`;
const ASSET_CACHE = `eka-assets-${CACHE_VERSION}`;
const PAGE_CACHE = `eka-pages-${CACHE_VERSION}`;

const PRECACHE_ASSETS = [
  "/",
  "/discover",
  "/stories",
  "/ask",
  "/offline.html",
  "/manifest.webmanifest",
  "/brand/favicon.svg",
  "/brand/eka-logo.png",
];

// Install: precache core app shell and offline fallback
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) =>
        cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn("[EKA SW] Precache partial error (non-fatal):", err);
        })
      )
      .then(() => self.skipWaiting())
  );
});

// Activate: purge obsolete cache versions and take immediate control
self.addEventListener("activate", (event) => {
  const currentCaches = [STATIC_CACHE, ASSET_CACHE, PAGE_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !currentCaches.includes(key))
            .map((key) => {
              console.log("[EKA SW] Evicting stale cache:", key);
              return caches.delete(key);
            })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Handle custom messages from client
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  } else if (event.data?.type === "eka-warm") {
    event.waitUntil(
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_ASSETS).catch(() => undefined))
    );
  }
});

function isStaticAsset(url) {
  // Common static file extensions
  if (/\.(?:js|css|woff2?|ttf|eot|png|jpg|jpeg|svg|webp|ico|json)$/i.test(url.pathname)) {
    return true;
  }
  // Internal build chunks or public assets
  if (url.pathname.startsWith("/_build/") || url.pathname.startsWith("/brand/")) {
    return true;
  }
  // External Google Fonts / CDN assets
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    return true;
  }
  return false;
}

// Fetch handler
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only intercept GET requests
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Ignore unsupported protocols (e.g., chrome-extension://)
  if (!url.protocol.startsWith("http")) return;

  // 1. Navigation requests (HTML pages)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            void caches.open(PAGE_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          // Attempt exact match from cached pages
          const cachedPage = await caches.match(request);
          if (cachedPage) return cachedPage;

          // Fallback to cached home shell or dedicated offline fallback
          const homeShell = await caches.match("/");
          if (homeShell) return homeShell;

          const offlinePage = await caches.match("/offline.html");
          if (offlinePage) return offlinePage;

          return new Response(
            "<html><body><h1>Offline</h1><p>Please reconnect to the internet.</p></body></html>",
            {
              status: 503,
              headers: { "Content-Type": "text/html" },
            }
          );
        })
    );
    return;
  }

  // 2. Static Assets (JS, CSS, Images, Fonts) -> Cache-first with network fallback
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              void caches.open(ASSET_CACHE).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => {
            // Return empty or fallback if asset fails to fetch
            return cachedResponse || Response.error();
          });
      })
    );
    return;
  }

  // 3. API requests -> Network-first with offline error payload
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({
            offline: true,
            error: "You are currently offline. Live inquiries require an active internet connection.",
          }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }
        );
      })
    );
  }
});
