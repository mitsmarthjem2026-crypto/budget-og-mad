// Budget og Mad – gemmer appen på telefonen, så den virker uden internet.
// Sikre opdateringer: en ny version bliver først brugt, når brugeren selv trykker »Opdater«.
// Har den nye version fejl, bliver den ikke taget i brug, og appen kører videre på den gamle.
const VERSION = 86;
const CACHE = 'bom-v' + VERSION;
const META = 'bom-meta';
const FILER = ['./', './index.html', './opskrifter.js', './motion.js', './spil.js', './budget2.js', './jura.js', './styring.js', './manifest.json', './version.json',
  './ikoner/ikon-180.png', './ikoner/ikon-192.png', './ikoner/ikon-512.png', './fotos/galleri/madlavning.jpg', './fotos/galleri/koekken.jpg', './fotos/galleri/picnic.jpg', './fotos/galleri/udenfor.jpg', './fotos/galleri/bord.jpg', './fotos/galleri/salat.jpg', './fotos/galleri/frugt.jpg',
  './fotos/budget.jpg', './fotos/motion.jpg', './fotos/spil.jpg', './fotos/opskrifter.jpg', './fotos/madplan.jpg', './fotos/indkob.jpg', './fotos/lager.jpg', './fotos/kalender.jpg',
  './fotos/retter/frikadeller.jpg', './fotos/retter/boller.jpg', './fotos/retter/biksemad.jpg', './fotos/retter/braendende.jpg', './fotos/retter/braendende-egen.jpg',
  './fotos/retter/millionbof.jpg', './fotos/retter/porresuppe.jpg', './fotos/retter/gulearter.jpg', './fotos/retter/risengrod.jpg',
  './fotos/retter/pandekager.jpg', './fotos/retter/kyllingkarry.jpg', './fotos/retter/spaghetti.jpg', './fotos/retter/chili.jpg',
  './fotos/retter/havregrod.jpg', './fotos/retter/lasagne.jpg', './fotos/retter/tomatsuppe.jpg', './fotos/retter/linsesuppe.jpg', './fotos/retter/stegtris.jpg', './fotos/retter/carbonara.jpg', './fotos/retter/shakshuka.jpg', './fotos/retter/tacos.jpg', './fotos/retter/pizza.jpg', './fotos/retter/wraps.jpg', './fotos/retter/pesto.jpg', './fotos/retter/aeblecrumble.jpg', './fotos/retter/kyllingpasta.jpg', './fotos/retter/wok.jpg', './fotos/retter/spejlaeg.jpg', './fotos/retter/tunsalat.jpg', './fotos/retter/omelet.jpg', './fotos/retter/burger.jpg', './fotos/retter/chilicon.jpg', './fotos/retter/dhal.jpg', './fotos/retter/taerte.jpg', './fotos/retter/quesadilla.jpg', './fotos/retter/falafel.jpg', './fotos/retter/pasta/aglio.jpg', './fotos/retter/pasta/alfredo.jpg', './fotos/retter/pasta/arrabbiata.jpg', './fotos/retter/pasta/baconaerter.jpg', './fotos/retter/pasta/broccolipasta.jpg', './fotos/retter/pasta/citronpasta.jpg', './fotos/retter/pasta/fetapasta.jpg', './fotos/retter/pasta/glasnudel.jpg', './fotos/retter/pasta/gnocchisalvie.jpg', './fotos/retter/pasta/gnocchitomat.jpg', './fotos/retter/pasta/graeskar.jpg', './fotos/retter/pasta/kodboller.jpg', './fotos/retter/pasta/kyllingfad.jpg', './fotos/retter/pasta/macncheese.jpg', './fotos/retter/pasta/nudelsuppe.jpg', './fotos/retter/pasta/oksenudler.jpg', './fotos/retter/pasta/padthai.jpg', './fotos/retter/pasta/peanut.jpg', './fotos/retter/pasta/pestokylling.jpg', './fotos/retter/pasta/ramen.jpg', './fotos/retter/pasta/ravioli.jpg', './fotos/retter/pasta/rejepasta.jpg', './fotos/retter/pasta/skinkefad.jpg', './fotos/retter/pasta/squash.jpg', './fotos/retter/pasta/svampepasta.jpg', './fotos/retter/pasta/tortellini.jpg', './fotos/retter/pasta/tunfad.jpg', './fotos/retter/pasta/tunpasta.jpg', './fotos/retter/pasta/vegelasagne.jpg', './fotos/retter/pasta/aertemynte.jpg', './fotos/retter/pasta/boennepasta.jpg', './fotos/retter/pasta/chorizoflode.jpg', './fotos/retter/pasta/chowmein.jpg', './fotos/retter/pasta/chowmeingroent.jpg', './fotos/retter/pasta/dandan.jpg', './fotos/retter/pasta/fetapastasalat.jpg', './fotos/retter/pasta/japchae.jpg', './fotos/retter/pasta/khaosoi.jpg', './fotos/retter/pasta/laksa.jpg', './fotos/retter/pasta/lasagnette.jpg', './fotos/retter/pasta/linsepesto.jpg', './fotos/retter/pasta/mozzpastasalat.jpg', './fotos/retter/pasta/muslinger.jpg', './fotos/retter/pasta/orzofeta.jpg', './fotos/retter/pasta/ostesovs.jpg', './fotos/retter/pasta/phoboi.jpg', './fotos/retter/pasta/ragu.jpg', './fotos/retter/pasta/roedbede.jpg', './fotos/retter/pasta/soba.jpg', './fotos/retter/pasta/soltorret.jpg', './fotos/retter/pasta/tortellinisuppe.jpg', './fotos/retter/pasta/tunpastasalat.jpg', './fotos/retter/pasta/yakisoba.jpg', './fotos/retter/ny/kaalfars.jpg', './fotos/retter/ny/hvidebonner.jpg', './fotos/retter/ny/kyllingbaade.jpg', './fotos/retter/ny/bagtekartofler.jpg', './fotos/retter/ny/kaalsuppe.jpg', './fotos/retter/ny/karbonader.jpg', './fotos/retter/ny/rodfrugter.jpg', './fotos/retter/ny/rugbrodaeg.jpg', './fotos/retter/ny/aeggekagebroccoli.jpg', './fotos/retter/ny/kikaertspinat.jpg', './fotos/retter/ny/spinatpasta.jpg', './fotos/galleri/budget1.jpg', './fotos/galleri/budget2.jpg', './fotos/galleri/budget3.jpg', './fotos/galleri/budget4.jpg', './fotos/galleri/forside1.jpg', './fotos/galleri/forside2.jpg', './fotos/galleri/forside3.jpg', './fotos/galleri/forside5.jpg', './fotos/galleri/forside6.jpg', './fotos/galleri/indkob1.jpg', './fotos/galleri/indkob2.jpg', './fotos/galleri/indkob3.jpg', './fotos/galleri/indkob4.jpg', './fotos/galleri/lager1.jpg', './fotos/galleri/lager2.jpg', './fotos/galleri/lager3.jpg', './fotos/galleri/madplan2.jpg', './fotos/galleri/madplan3.jpg', './fotos/galleri/opskrifter1.jpg', './fotos/galleri/opskrifter2.jpg', './fotos/galleri/opskrifter3.jpg', './fotos/galleri/opskrifter4.jpg', './fotos/galleri/budget-10.jpg', './fotos/galleri/budget-11.jpg', './fotos/galleri/budget-12.jpg', './fotos/galleri/budget-13.jpg', './fotos/galleri/budget-14.jpg', './fotos/galleri/budget-15.jpg', './fotos/galleri/budget-16.jpg', './fotos/galleri/budget-17.jpg', './fotos/galleri/budget-18.jpg', './fotos/galleri/budget-19.jpg', './fotos/galleri/budget-20.jpg', './fotos/galleri/budget-21.jpg', './fotos/galleri/budget-22.jpg', './fotos/galleri/budget-23.jpg', './fotos/galleri/budget-24.jpg', './fotos/galleri/forside-10.jpg', './fotos/galleri/forside-11.jpg', './fotos/galleri/forside-12.jpg', './fotos/galleri/forside-13.jpg', './fotos/galleri/forside-14.jpg', './fotos/galleri/forside-15.jpg', './fotos/galleri/forside-16.jpg', './fotos/galleri/forside-17.jpg', './fotos/galleri/indkob-10.jpg', './fotos/galleri/indkob-11.jpg', './fotos/galleri/indkob-12.jpg', './fotos/galleri/indkob-13.jpg', './fotos/galleri/indkob-14.jpg', './fotos/galleri/indkob-15.jpg', './fotos/galleri/indkob-16.jpg', './fotos/galleri/indkob-17.jpg', './fotos/galleri/indkob-18.jpg', './fotos/galleri/indkob-19.jpg', './fotos/galleri/indkob-20.jpg', './fotos/galleri/indkob-21.jpg', './fotos/galleri/indkob-22.jpg', './fotos/galleri/indkob-23.jpg', './fotos/galleri/indkob-24.jpg', './fotos/galleri/lager-10.jpg', './fotos/galleri/lager-11.jpg', './fotos/galleri/lager-12.jpg', './fotos/galleri/lager-13.jpg', './fotos/galleri/lager-14.jpg', './fotos/galleri/lager-15.jpg', './fotos/galleri/lager-16.jpg', './fotos/galleri/lager-17.jpg', './fotos/galleri/lager-18.jpg', './fotos/galleri/lager-19.jpg', './fotos/galleri/lager-20.jpg', './fotos/galleri/lager-21.jpg', './fotos/galleri/lager-22.jpg', './fotos/galleri/lager-23.jpg', './fotos/galleri/lager-24.jpg', './fotos/galleri/lager-25.jpg', './fotos/galleri/madplan-10.jpg', './fotos/galleri/madplan-11.jpg', './fotos/galleri/madplan-12.jpg', './fotos/galleri/madplan-13.jpg', './fotos/galleri/madplan-14.jpg', './fotos/galleri/madplan-15.jpg', './fotos/galleri/madplan-16.jpg', './fotos/galleri/madplan-17.jpg', './fotos/galleri/madplan-18.jpg', './fotos/galleri/madplan-19.jpg', './fotos/galleri/madplan-20.jpg', './fotos/galleri/madplan-21.jpg', './fotos/galleri/madplan-22.jpg', './fotos/galleri/madplan-23.jpg', './fotos/galleri/madplan-24.jpg', './fotos/galleri/madplan-25.jpg', './fotos/galleri/madplan-26.jpg', './fotos/galleri/opskrifter-10.jpg', './fotos/galleri/opskrifter-11.jpg', './fotos/galleri/opskrifter-12.jpg', './fotos/galleri/opskrifter-13.jpg', './fotos/galleri/opskrifter-14.jpg', './fotos/galleri/opskrifter-15.jpg', './fotos/galleri/opskrifter-16.jpg', './fotos/galleri/opskrifter-17.jpg', './fotos/galleri/opskrifter-18.jpg', './fotos/galleri/opskrifter-19.jpg', './fotos/galleri/opskrifter-20.jpg', './fotos/galleri/opskrifter-21.jpg', './fotos/galleri/opskrifter-22.jpg', './fotos/galleri/opskrifter-23.jpg', './fotos/galleri/opskrifter-24.jpg'];

async function hentAktiv() {
  const m = await caches.open(META);
  const r = await m.match('aktiv');
  return r ? r.text() : CACHE;
}
async function saetAktiv(navn) {
  const m = await caches.open(META);
  await m.put('aktiv', new Response(navn));
}

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    try {
      await c.addAll(FILER.map(u => new Request(u, { cache: 'reload' })));
      // Tjek at den nye version er hel, før den må bruges
      const side = await (await c.match('./index.html')).text();
      if (!side.includes('BOM-APP-OK') || !side.includes('</html>')) throw new Error('index.html er ikke hel');
      JSON.parse(await (await c.match('./manifest.json')).text());
      const ops = await (await c.match('./opskrifter.js')).text();
      if (!ops.includes('STD_OPSKRIFTER') || !ops.trim().endsWith(';')) throw new Error('opskrifter.js er ikke hel');
      new Function(ops); // stopper, hvis der er stavefejl i koden
      new Function(await (await c.match('./budget2.js')).text()); // version 57: også budget2.js
      const scripts = [...side.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x => x[1]);
      scripts.forEach(s => new Function(s));
      const v = JSON.parse(await (await c.match('./version.json')).text());
      if (!(v.version >= VERSION)) throw new Error('version.json passer ikke');
    } catch (fejl) {
      await caches.delete(CACHE);
      throw fejl; // installationen stoppes – den gamle version bliver
    }
    // Første gang (ingen gammel version) må den gerne starte med det samme
    if (!self.registration.active) self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const navne = (await caches.keys()).filter(n => /^bom-v\d+$/.test(n)).sort((a, b) => +b.slice(5) - +a.slice(5));
    // Behold den nye og den forrige version (til at gå tilbage), slet ældre
    const forrige = navne.find(n => n !== CACHE);
    for (const n of navne) if (n !== CACHE && n !== forrige) await caches.delete(n);
    await saetAktiv(CACHE);
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => {
  if (e.data === 'OPDATER') self.skipWaiting();
  if (e.data === 'TILBAGE') e.waitUntil((async () => {
    const forrige = (await caches.keys()).filter(n => /^bom-v\d+$/.test(n) && n !== CACHE).sort((a, b) => +b.slice(5) - +a.slice(5))[0];
    if (forrige) await saetAktiv(forrige);
  })());
});

self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (u.origin === location.origin) {
    if (u.pathname.endsWith('/version.json') || u.pathname.endsWith('/sw.js')) return; // altid frisk
    e.respondWith((async () => {
      const c = await caches.open(await hentAktiv());
      return (await c.match(e.request, { ignoreSearch: true })) || fetch(e.request);
    })());
  } else if (u.hostname === 'cdn.jsdelivr.net' || u.hostname.endsWith('tessdata.projectnaptha.com') || u.hostname === 'storage.googleapis.com' || u.hostname === 'tfhub.dev' || u.hostname === 'www.kaggle.com') {
    e.respondWith(caches.match(e.request).then(h => h || fetch(e.request).then(r => {
      const k = r.clone(); caches.open(CACHE).then(c => c.put(e.request, k)); return r;
    })));
  }
});
