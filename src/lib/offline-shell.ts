/**
 * Registers the EKA offline shell and service worker.
 * Provides caching of critical routes, assets, and offline fallback.
 */
export function registerOfflineShell() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  // Wait for window load event to not compete with initial paint
  const init = () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        // Post warming message once active
        const target = registration.active ?? navigator.serviceWorker.controller;
        target?.postMessage({ type: "eka-warm" });

        // Check for updates
        registration.addEventListener("updatefound", () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener("statechange", () => {
              if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("[EKA SW] New service worker version available.");
              }
            });
          }
        });
      })
      .catch((err) => {
        /* offline shell is an enhancement — never block the app */
        console.warn("[EKA SW] Registration ignored:", err);
      });
  };

  if (document.readyState === "complete") {
    init();
  } else {
    window.addEventListener("load", init, { once: true });
  }
}
