/* FinLed service worker
   Caches only the app shell (this page + the Supabase JS library it loads +
   the manifest/icons) so the app can open with no connection at all.
   It never touches Supabase (database/Auth) network calls — those are left alone so
   cloud sync keeps working normally whenever you do have a connection.

   IMPORTANT: bump the number in CACHE_NAME any time you change index.html,
   manifest.json, or any icon file. This service worker's own byte content
   has to change for the browser to even notice there's an update, and the
   activate handler below only deletes old caches whose name doesn't match
   CACHE_NAME — so an unchanged cache name means old, stale assets (icons
   included) can keep being served indefinitely even after you replace the
   underlying files. */
const CACHE_NAME = 'finled-shell-v41';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './Photos/icon-192.png',
  './Photos/icon-512.png',
  './Photos/icon-192-maskable.png',
  './Photos/icon-512-maskable.png',
  './Photos/apple-touch-icon.png',
  './Photos/favicon-32.png',
  './Photos/finled-logo.png',
  './learn.css',
  './learn.js',
  './fonts/IBMPlexSans-Regular.woff2',
  './fonts/IBMPlexSans-Medium.woff2',
  './fonts/IBMPlexSans-SemiBold.woff2',
  './fonts/IBMPlexMono-Regular.woff2',
  './fonts/IBMPlexMono-Medium.woff2',
  './virtual-pet/pet.css',
  './virtual-pet/pet.js',
  './virtual-pet/pet-dialogue.js',
  './virtual-pet/tour.css',
  './virtual-pet/tour-steps.js',
  './virtual-pet/tour.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    // Cache each file on its own. cache.addAll() is all-or-nothing: one missing icon or a
    // blocked CDN request would silently leave the WHOLE app uncached (no offline mode).
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(APP_SHELL.map(url =>
        cache.add(url).catch(err => console.warn('SW install: could not cache', url, err))
      )))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return; // never touch writes (Supabase etc.)

  // Compare without the query string for our own files: the page links icons as "Photos/icon-192.png?v=5",
  // which never matched the plain entries in APP_SHELL, so those requests were never cached offline.
  const keyOf = u => {
    const x = new URL(u, self.location.href);
    return x.origin === self.location.origin ? x.origin + x.pathname : x.href;
  };
  const reqKey = keyOf(event.request.url);
  const isShellAsset = APP_SHELL.some(shellUrl => {
    try { return keyOf(shellUrl) === reqKey; }
    catch (e) { return false; }
  });
  if (!isShellAsset) return; // let every other request (Supabase, images...) pass through untouched

  // The page itself (index.html / the app's start URL) goes network-first so a
  // pushed update shows up on the very next open instead of needing two opens.
  // Everything else in the shell (icons, manifest, Supabase library — rarely change)
  // stays cache-first for an instant, offline-friendly load.
  const isPageRequest = event.request.mode === 'navigate' ||
    reqKey === keyOf('./') ||
    reqKey === keyOf('./index.html');

  if (isPageRequest) {
    event.respondWith(
      // cache:'no-cache' makes the browser revalidate with the server instead of
      // reusing its own HTTP cache. Without it, hosts like GitHub Pages (which send
      // a ~10 minute max-age) can hand back the OLD index.html even though this
      // fetch looks "network-first".
      fetch(event.request, { cache: 'no-cache' }).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match(event.request, { ignoreSearch: true })
        .then(hit => hit || caches.match('./index.html'))) // offline: last cached page (also for ?query / deep links)
    );
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(cached => {
      const networkFetch = fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached); // offline: fall back to whatever's cached
      return cached || networkFetch; // instant load if cached, background-refreshed for next time
    })
  );
});
