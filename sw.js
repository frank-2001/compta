// Cache infos
const VERSION_APP = "V1"
const NAME_APP="COMPTA"
let dir=location.origin+"/"
const STATIC_CACHE_URLS = [
    dir,
    dir+"manifest.json",
    dir+"src/js/jquery.min.js",
    dir+"index.html",
    dir+"src/css/style.css",
    dir+"src/js/base.js",
    dir+"src/js/chart.js",
    dir+"src/js/db.js",
    dir+"src/js/dettes.js",
    dir+"src/js/new.js",
    dir+"src/js/project.js",
    dir+"src/js/stat.js",
    dir+"src/js/wallet.js",
    dir+"src/img/ico1.png",
];
// PWA Installation
self.addEventListener("install", event => {
    console.log("Service Worker installing version : " + VERSION_APP);
    self.skipWaiting();
    caches.delete(VERSION_APP)
    event.waitUntil(
        caches.open(VERSION_APP).then(cache => cache.addAll(STATIC_CACHE_URLS))
    );
});

self.addEventListener("activate", event => {
    console.log("Service Worker Activation version :" + VERSION_APP);
    clients.claim();
    // delete any unexpected caches
    event.waitUntil(
        caches
            .keys()
            .then(keys => keys.filter(key => key !== VERSION_APP))
            .then(keys =>
                Promise.all(
                    keys.map(key => {
                        console.log(`Deleting cache ${key}`);
                        return  caches.delete(key);
                    })
                )
            )
    );

})

self.addEventListener("fetch", event => {
    // console.log(event);
        // return fetch(event.request).catch((r)=>{
        //     event.respondWith(
        //         caches.match(event.request).then(response => {
        //             return response
        //         })
        //     );        
        // })
        event.respondWith(
            caches.match(event.request).then(response => {  
                // return fetch(event.request).catch((r)=>{
                    return response        
                // })
                // return response
            }).catch(re=>{
                return fetch(event.request)
            })
        );
        // event.respondWith(
        //     caches.match(event.request).then(response => {
        //         return response  || fetch(event.request)
        //     })
        // );
});
// self.addEventListener('push', event => {
//     // console.log(JSON.parse(event.data.text()));
//     // payload
//     // {"title":"Title","body":"body testing push notif","url":"/" }
//     const data = JSON.parse(event.data.text())
//     // console.log(data);
//     const options = {
//         body: data.body,
//         icon: 'src/img/icon512x512.png',
//         image: data.image,
//         data: {
//             notifURL: data.url
//         }
//     };
//     event.waitUntil(self.registration.showNotification(data.title, options));
    
// });
// self.addEventListener('notificationclick', event => {
//     event.notification.close();
//     event.waitUntil(
//         clients.openWindow(event.notification.data.notifURL)
//     );
// });