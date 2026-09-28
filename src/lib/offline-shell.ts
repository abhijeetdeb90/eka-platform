/**
 * Registers the offline shell. Called once after sign-in so the app itself —
 * not just its data — is on the device before the signal ever drops.
 */
export function registerOfflineShell() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  void navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      const target = registration.active ?? navigator.serviceWorker.controller;
      target?.postMessage({ type: "eka-warm" });
    })
    .catch(() => {
      /* offline shell is an enhancement — never block the app */
    });
}
