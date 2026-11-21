const CACHE='lift-log-shell-v14';
const FILES=['./','./index.html','./style.css','./app.js','./model.js','./manifest.webmanifest','./healthspan-text.otf','./healthspan-display.otf','./barbell.svg','./barbell-192.png','./barbell-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(path=>new Request(path,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('lift-log-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin)return;const allowed=FILES.map(f=>new URL(f,self.registration.scope).pathname);if(!allowed.includes(url.pathname))return;event.respondWith(caches.open(CACHE).then(async cache=>{const hit=await cache.match(event.request,{ignoreSearch:true});return hit||fetch(event.request);}));});
