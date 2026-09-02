const STATIC_CACHE = "thedevrox-static-v3";
const IMAGES_CACHE = "thedevrox-images-v3";
const PAGES_CACHE = "thedevrox-pages-v3";

// Max items in caches
const PAGES_MAX = 30;
const IMAGES_MAX = 500;

// Install: claim immediately
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Activate: clean old cache versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key !== STATIC_CACHE &&
                key !== IMAGES_CACHE &&
                key !== PAGES_CACHE,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Fetch strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // 1. Next.js Optimized Images (/_next/image) and all Image assets
  if (
    request.destination === "image" ||
    url.pathname.startsWith("/_next/image") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/logos/") ||
    url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|avif|ico)$/i)
  ) {
    event.respondWith(cacheFirst(request, IMAGES_CACHE, IMAGES_MAX));
    return;
  }

  // 2. Static Code Assets (JS bundles, CSS, fonts)
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/fonts/") ||
    url.pathname.match(/\.(js|css|woff2?)$/i)
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, 150));
    return;
  }

  // 3. HTML pages: stale-while-revalidate
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(staleWhileRevalidate(request, PAGES_CACHE, PAGES_MAX));
    return;
  }
});

// Cache-first strategy: serves instantly from cache, downloads and stores on miss
async function cacheFirst(request, cacheName, maxItems = 100) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const keys = await cache.keys();
      if (keys.length >= maxItems) {
        await cache.delete(keys[0]);
      }
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (
      cached ||
      new Response("Asset Unavailable Offline", {
        status: 503,
        headers: { "Content-Type": "text/plain" },
      })
    );
  }
}

// Stale-while-revalidate: serve cache immediately, update in background
async function staleWhileRevalidate(request, cacheName, maxItems = 30) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        await cache.put(request, response.clone());
        const keys = await cache.keys();
        if (keys.length > maxItems) {
          for (let i = 0; i < keys.length - maxItems; i++) {
            await cache.delete(keys[i]);
          }
        }
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}
