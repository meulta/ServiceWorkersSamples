self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/',
        './javascripts/index.jsx',
        './javascripts/registersw.js',
        './index.html',
        './webchatsw.js'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
    console.log('Oh, fetch');
    // setTimeout(() => {
    //   self.registration.showNotification("Fetch", {});
    // }, 500);
    // event.respondWith(
    //   caches.match(event.request).then(function(resp) {
    //     return resp || fetch(event.request).then(function(response) {
    //       return caches.open('v1').then(function(cache) {
    //         cache.put(event.request, response.clone());
    //         return response;
    //       });  
    //     });
    //   })
    // );
    //event.respondWith(new Response("Hello t'as vu!"));
});

self.addEventListener('push', function(event) {
  var notificationOptions = {
    body: "Hello World",
    icon: icon ? icon : 'public/icons/icon-default.png',
    data:{
      url : 'http://example.com/updates'
    }
  };
  title = "Ceci est une notification !";
  return self.registration.showNotification(title, notificationOptions);
});
