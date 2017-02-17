self.addEventListener('install', function(event) {
    event.waitUntil(
    console.log('Hey, I am installing stuff!')
        //fetchStuffAndInitDatabases()
    );
});

self.addEventListener('activate', function(event) {
    console.log('Activatinnnng');
});

self.addEventListener('fetch', function(event) {
    console.log('Oh, fetch');
    event.respondWith(new Response("Hello t'as vu!"));
});