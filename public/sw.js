/*
 * EKA offline shell. Caches the app shell and the screens a member should be
 * able to open with no signal at all — Journal and Scripture — so the app opens
 * from the device rather than the network.
 */

const SHELL = "eka-shell-v1";
const RUNTIME = "eka-runtime-v1";
const ESSENTIAL = ["/", "/app/journal", "/app/practice"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.addAll(ESSENTIAL).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== SHELL && k !== RUNTIME).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "eka-warm") return;
  event.waitUntil(
    caches.open(SHELL).then((cache) => cache.addAll(ESSENTIAL).catch(() => undefined)),
  );
});

function isAsset(url) {
  return (
    /\.(?:js|css|woff2?|png|jpg|jpeg|svg|ico|webp)$/.test(url.pathname) ||
    url.pathname.startsWith("/_build/")
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: network first, fall back to whatever shell we hold.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          void caches.open(SHELL).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(
          async () =>
            (await caches.match(request)) ??
            (await caches.match("/app/journal")) ??
            (await caches.match("/")) ??
            Response.error(),
        ),
    );
    return;
  }

  // Build assets: cache first, they are content-hashed.
  if (isAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ??
          fetch(request).then((response) => {
            const copy = response.clone();
            void caches.open(RUNTIME).then((cache) => cache.put(request, copy));
            return response;
          }),
      ),
    );
  }
});
