// Budget og Mad – gemmer appen på telefonen, så den virker uden internet
const CACHE='bom-v4';
const FILER=['./','./index.html','./manifest.json','./ikoner/ikon-180.png','./ikoner/ikon-192.png','./ikoner/ikon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILER)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  if(u.origin===location.origin){
    // Nyeste version når der er net, ellers den gemte
    e.respondWith(fetch(e.request).then(r=>{const k=r.clone();caches.open(CACHE).then(c=>c.put(e.request,k));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
  }else if(u.hostname==='cdn.jsdelivr.net'||u.hostname.endsWith('tessdata.projectnaptha.com')){
    e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request).then(r=>{const k=r.clone();caches.open(CACHE).then(c=>c.put(e.request,k));return r})));
  }
});