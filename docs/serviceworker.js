var staticCacheName = "swordHero-v1";

self.addEventListener("install", function (e) {
    console.log('Service worker INSTALL event running')
    e.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            // const contentToCache = [

            // ]
            // return cache.addAll(["/"]);
            return Promise.resolve() // cache nothing for now...
        })
    );
});


self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) { return r; }
        const response = await fetch(e.request);

        if(e.request.url.startsWith('http')) {
            const cache = await caches.open(staticCacheName);
            console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
            cache.put(e.request, response.clone());
        }

        return response;
    })());
});

