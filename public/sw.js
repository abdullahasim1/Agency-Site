const STATIC_CACHE = "thedevrox-static-v2";
const PAGES_CACHE = "thedevrox-pages-v2";

// Max items in the pages cache before oldest entries are evicted.
const PAGES_MAX = 20;

// Install: skip pre-caching — fetching 5 pages on first visit adds to initial
// load time. The cache-first strategy for static assets and stale-while-revalidate
// for pages means they fill in naturally as the user browses.
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate: clean old caches (including v1 from previous versions).
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key !== STATIC_CACHE && key !== PAGES_CACHE,
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

  // HTML pages: stale-while-revalidate
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(staleWhileRevalidate(request, PAGES_CACHE));
    return;
  }

  // Static assets (JS, CSS, fonts, images): cache-first
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/fonts/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/logos/") ||
    url.pathname.match(/\.(js|css|woff2?|png|jpg|jpeg|gif|svg|webp|avif|ico)$/)
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }
});

// Cache-first: serve from cache, fallback to network.
// Returns a proper offline page when both cache and network fail.
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      // Evict oldest entries if the cache is too large.
      const keys = await cache.keys();
      if (keys.length > 50) {
        await cache.delete(keys[0]);
      }
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Offline", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

// Stale-while-revalidate: serve cache, update in background.
// Limits the pages cache to PAGES_MAX entries.
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        await cache.put(request, response.clone());

        // Evict oldest entries if the cache is too large.
        const keys = await cache.keys();
        if (keys.length > PAGES_MAX) {
          for (let i = 0; i < keys.length - PAGES_MAX; i++) {
            await cache.delete(keys[i]);
          }
        }
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}
