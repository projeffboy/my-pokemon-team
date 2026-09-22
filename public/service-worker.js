// The Create React App build served a Workbox service worker at this URL until Aug 2026. Browsers
// that registered it keep serving that last build and never drop it, since a 404 here does not
// unregister it. This replacement removes itself, clears its caches, and reloads the pages it controls.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => event.waitUntil(removeSelf()));

async function removeSelf() {
  await self.clients.claim();
  const keys = await caches.keys();
  await Promise.all(keys.map(key => caches.delete(key)));
  await self.registration.unregister();
  const clients = await self.clients.matchAll({ type: "window" });
  await Promise.allSettled(clients.map(client => client.navigate(client.url)));
}
