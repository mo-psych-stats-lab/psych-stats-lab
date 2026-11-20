/* Offline support: network first, cached copy when offline. Only same-origin GET requests are cached. */
const CACHE = 'psych-stats-lab-d5a9189e';
const CORE = [
 "./",
 "icon-192.png",
 "icon-512.png",
 "manifest.webmanifest",
 "firebase-config.js?v=20261104a",
 "account.js?v=f16b3cd9",
 "vendor/anim/gsap.min.js",
 "vendor/anim/ScrollTrigger.min.js",
 "vendor/anim/SplitText.min.js",
 "vendor/anim/MotionPathPlugin.min.js",
 "vendor/anim/lenis.min.js",
 "stats-motion.js?v=20261101d",
 "stats-exam.js?v=20261101a",
 "audience.js?v=20261101a",
 "constructs.js?v=20261104a",
 "destrieux.js?v=20261101a",
 "stats-neuro.js?v=20261101b",
 "privacy.js?v=2298d6fa",
 "know.js?v=ad290bf1",
 "tests.js?v=1e611eb9",
 "reward.js?v=20261104a",
 "stats-thesis.js?v=20261104a",
 "admin.js?v=4b011ad7",
 "laws.js?v=cca56bd5"
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(res => {
    if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: req.mode === 'navigate' }).then(r => r || (req.mode === 'navigate' ? caches.match('./') : null)).then(r => r || Response.error())));
});
