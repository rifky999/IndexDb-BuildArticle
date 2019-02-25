const CACHE_NAME = "NewsReader-v2";

var urlToCache = [
  "/",
  "/nav.html",
  "/index.html",
  "/article.html", // tambahkan ini
  "/pages/home.html",
  "/pages/about.html",
  "/pages/contact.html",
  "/css/materialize.min.css",
  "/js/materialize.min.js",
  "/js/nav.js",
  "/js/api.js"
];

    //mendaftarkab cache
    self.addEventListener("install", function(event) {
      event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
          return cache.addAll(urlToCache);
        })
      );
    });

  //If Cache Notfound then add Cache from server
self.addEventListener("fetch", function(event) {
  var base_url = "https://readerapi.codepolitan.com/";

  if (event.request.url.indexOf(base_url) > -1) {

      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
        })
      });

  }else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }
});

  //If the Local CACHE_NAME different with the Server CACHE_NAME then previous the CACHE will be delete
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheName) {
      return Promise.all(
        cacheName.map(function(cacheName) {
        if (cacheName != CACHE_NAME) {
              console.log("ServiceWorker: cache " + cacheName + " dihapus");
              return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
