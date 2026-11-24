// Budget og Mad – ejerens styring + brugstal (version 51)
// Brugstal sendes KUN, hvis brugeren selv har sagt ja (juraStatistikOK). Kun antal minutter og dele – aldrig brugerens egne tal.
var STYR_KEY = 'madapp-v1-styring', BRUG_KEY = 'madapp-v1-brug';
var STYR_DELE = [['opskrifter', '📖 Opskrifter'], ['madplan', '📅 Madplan'], ['indkob', '🛒 Indkøb'], ['lager', '🥫 Lager'], ['budget', '💰 Budget'], ['kalender', '🗓️ Kalender'], ['motion', '🏃 Motion']];
var STYR_NAVN = { forside: '🏠 Forsiden' }; STYR_DELE.forEach(function (d) { STYR_NAVN[d[0]] = d[1] });

function styrLoggetInd() { try { return LOGIN_TIL && loginGemt() && loginGemt().kode } catch (e) { return false } }
function styrStatus() { try { return JSON.parse(localStorage.getItem(STYR_KEY) || 'null') || {} } catch (e) { return {} } }

// ---------- Hvad må brugeren se? ----------
function styringMaa(del) {
  if (!styrLoggetInd() || erEjer()) return true;
  var s = styrStatus();
  if (!s.dele || !STYR_NAVN[del] || del === 'forside') return true;
  return s.dele.indexOf(del) >= 0;
}
function styringIkke(del) { toast((STYR_NAVN[del] || 'Den del') + ' er ikke åben for dig endnu.') }

// ---------- Kort på forsiden: besked + dagens ret ----------
function styringForside() {
  if (!styrLoggetInd()) return '';
  var s = styrStatus(), h = '';
  var set = +(localStorage.getItem(STYR_KEY + '-set') || 0);
  if (s.besked && s.besked_id && s.besked_id !== set) {
    h += '<div style="background:var(--card);border-radius:20px;padding:14px;margin:12px 0;box-shadow:0 6px 20px rgba(0,0,0,.08)"><b style="font-size:17px">📣 Besked fra ' + esc(EJER) + '</b><p style="margin:6px 0 10px;white-space:pre-wrap">' + esc(s.besked) + '</p><button class="l" onclick="localStorage.setItem(STYR_KEY+\'-set\',\'' + (+s.besked_id) + '\');vis()">OK, læst</button></div>';
  }
  if (s.dagens_ret && styringMaa('opskrifter')) {
    h += '<div style="background:var(--acc2);border-radius:20px;padding:14px;margin:12px 0;display:flex;gap:10px;align-items:center;flex-wrap:wrap"><div style="flex:1;min-width:180px"><b>🍽️ Dagens ret</b><div style="font-size:18px;font-weight:800">' + esc(s.dagens_ret) + '</div></div><button class="b" onclick="window._q=' + esc(JSON.stringify(s.dagens_ret)).replace(/"/g, '&quot;') + ';gaaTil(\'opskrifter\')">Se opskriften</button></div>';
  }
  return h;
}

// ---------- Pause ----------
function styringPause(s) {
  var d = document.getElementById('styrpause');
  if (s && s.pause) {
    if (!d) { d = document.createElement('dialog'); d.id = 'styrpause'; d.addEventListener('cancel', function (e) { e.preventDefault() }); document.body.appendChild(d) }
    d.innerHTML = '<div class="in" style="text-align:center"><div style="font-size:54px">🛠️</div><h2>Appen holder en lille pause</h2><p>' + esc(s.pause_tekst || 'Der bliver rettet lidt. Prøv igen om lidt.') + '</p><p class="muted" style="font-size:14px">Dine tal er stadig gemt på din telefon.</p><button class="b" style="width:100%" onclick="styringStart()">Prøv igen</button></div>';
    if (!d.open) d.showModal();
  } else if (d && d.open) d.close();
}

// ---------- Hent status fra serveren ----------
async function styringStart() {
  if (!styrLoggetInd() || navigator.onLine === false) return;
  var s;
  try { s = await rpc('min_status', { k: loginGemt().kode }) } catch (e) { return }
  if (!s || !s.ok) return;
  var foer = localStorage.getItem(STYR_KEY);
  localStorage.setItem(STYR_KEY, JSON.stringify(s));
  if (!window._brugAaben) { window._brugAaben = 1; brugTael(0, true) }
  styringPause(s);
  styringBeskyt();
  if (!styringMaa(side)) { side = 'forside'; localStorage.setItem(KEY + '-side', side) }
  if (foer !== JSON.stringify(s) && (side === 'forside' || !styringMaa(side)) && !dlg.open) vis();
  brugSend();
}

// ---------- Brugstal (kun med samtykke) ----------
function brugData() { try { return JSON.parse(localStorage.getItem(BRUG_KEY) || '{}') } catch (e) { return {} } }
function brugDag() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') }
var brugSidstSynlig = Date.now();
function brugTael(sek, aabning) {
  if (!styrLoggetInd() || erEjer() || typeof juraStatistikOK !== 'function' || !juraStatistikOK()) { localStorage.removeItem(BRUG_KEY); return }
  var b = brugData(), dag = brugDag(), x = b[dag] || (b[dag] = { a: 0, s: 0, d: {} });
  if (aabning) x.a++;
  if (sek) { x.s += sek; var del = STYR_NAVN[side] ? side : 'forside'; x.d[del] = (x.d[del] || 0) + sek }
  Object.keys(b).sort().slice(0, -14).forEach(function (k) { delete b[k] });
  localStorage.setItem(BRUG_KEY, JSON.stringify(b));
}
async function brugSend() {
  if (!styrLoggetInd() || erEjer() || typeof juraStatistikOK !== 'function' || !juraStatistikOK() || navigator.onLine === false) return;
  var b = brugData(), sendt = JSON.parse(localStorage.getItem(BRUG_KEY + '-sendt') || '{}'), dage = Object.keys(b);
  for (var i = 0; i < dage.length; i++) {
    var dag = dage[i], x = b[dag], sig = JSON.stringify(x);
    if (sendt[dag] === sig) continue;
    var dele = {}; Object.keys(x.d).forEach(function (k) { dele[k] = Math.round(x.d[k] / 60) });
    try { await rpc('brug_meld', { k: loginGemt().kode, dag: dag, aabninger: x.a, minutter: Math.round(x.s / 60), dele: dele }); sendt[dag] = sig } catch (e) { return }
  }
  Object.keys(sendt).forEach(function (k) { if (!b[k]) delete sendt[k] });
  localStorage.setItem(BRUG_KEY + '-sendt', JSON.stringify(sendt));
}
setInterval(function () { if (document.visibilityState === 'visible') brugTael(15, false) }, 15000);
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'hidden') { brugSidstSynlig = Date.now(); brugSend() }
  else { if (Date.now() - brugSidstSynlig > 30 * 60000) { brugTael(0, true); styringStart() } }
});
setInterval(function () { styringStart() }, 5 * 60000);
styringStart();

// ================= Ejerens side =================
var styrEjer = { indstil: null, brug: null };
async function styringHent() {
  try { styrEjer.indstil = await rpc('ejer_hent_indstil', { k: ejerKode() }) } catch (e) { styrEjer.indstil = null }
  try { styrEjer.brug = await rpc('ejer_brug', { k: ejerKode() }) } catch (e) { styrEjer.brug = null }
}
function styrMin(m) { m = +m || 0; return m >= 60 ? Math.floor(m / 60) + ' t ' + (m % 60) + ' min' : m + ' min' }
function styrDato(d) { return d ? new Date(d).toLocaleDateString('da-DK', { day: 'numeric', month: 'short', year: 'numeric' }) : '' }

function styringEjerHTML() {
  var b = styrEjer.brug, s = styrEjer.indstil || {}, h = '';
  // Vejledning til nye brugere
  h += '<details style="background:var(--felt);border-radius:14px;padding:12px;margin:10px 0"><summary style="font-weight:800;font-size:17px;cursor:pointer">📲 Vejledning til nye brugere</summary>' +
    '<p style="margin:8px 0">6 billeder, der viser, hvordan man lægger appen på telefonen. Send dem sammen med link og kode.</p>' +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">' + [1, 2, 3, 4, 5, 6].map(function (i) { return '<img src="vejledning/' + i + '.jpg" alt="Trin ' + i + '" style="width:100%;border-radius:8px">' }).join('') + '</div>' +
    '<button class="b" style="width:100%;margin-top:10px" onclick="styringSendVejledning()">📤 Send vejledningen</button>' +
    '<p class="muted" style="font-size:13px;margin-bottom:0">På din PC ligger billederne også på skrivebordet i mappen »Vejledning til Budget og Mad«.</p></details>';
  // Brug
  h += '<details open style="background:var(--felt);border-radius:14px;padding:12px;margin:10px 0"><summary style="font-weight:800;font-size:17px;cursor:pointer">📊 Hvad bruger folk appen til?</summary>';
  if (!b) h += '<p class="muted">Kan ikke hente tallene lige nu.</p>';
  else {
    h += '<div style="display:flex;gap:8px;margin:10px 0;text-align:center">' + [['I dag', b.idag], ['7 dage', b.uge], ['30 dage', b.maaned]].map(function (t) { return '<div style="flex:1;background:var(--card);border-radius:12px;padding:8px"><div style="font-size:24px;font-weight:800">' + (+t[1] || 0) + '</div><div class="muted" style="font-size:13px">brugere ' + t[0] + '</div></div>' }).join('') + '</div>';
    var dele = Object.keys(b.dele || {}).map(function (k) { return [k, +b.dele[k] || 0] }).sort(function (a, c) { return c[1] - a[1] }), max = dele.length ? Math.max(1, dele[0][1]) : 1;
    h += '<b>Tid i hver del (30 dage)</b>';
    h += dele.length ? dele.map(function (d) { return '<div style="margin:6px 0"><div style="display:flex;justify-content:space-between;font-size:14px"><span>' + esc(STYR_NAVN[d[0]] || d[0]) + '</span><b>' + styrMin(d[1]) + '</b></div><div style="height:12px;background:var(--card);border-radius:6px;overflow:hidden"><div style="height:100%;width:' + Math.max(3, Math.round(d[1] / max * 100)) + '%;background:var(--grad,var(--acc));border-radius:6px"></div></div></div>' }).join('') : '<p class="muted">Ingen tal endnu.</p>';
  }
  h += '<p class="muted" style="font-size:13px;margin-bottom:0">Tallene viser kun dem, der selv har sagt ja til brugstal. Du ser kun tid og dele – aldrig deres egne tal.</p></details>';
  // Besked, dagens ret, pause
  var navne = []; try { navne = (typeof STD_OPSKRIFTER !== 'undefined' ? STD_OPSKRIFTER : []).concat(D.opskrifter || []).map(function (o) { return o.navn }).filter(Boolean) } catch (e) { }
  navne = navne.filter(function (n, i) { return navne.indexOf(n) === i }).slice(0, 2000);
  h += '<details style="background:var(--felt);border-radius:14px;padding:12px;margin:10px 0"><summary style="font-weight:800;font-size:17px;cursor:pointer">📣 Til alle brugere</summary>' +
    '<p style="margin:10px 0 4px"><b>Besked til alle</b> <span class="muted" style="font-size:13px">(vises på forsiden, til de trykker »OK, læst«)</span></p><textarea id="styrbesked" maxlength="500" placeholder="Fx: Nye opskrifter er på vej 🎉" style="min-height:70px;width:100%">' + esc(s.besked || '') + '</textarea>' +
    '<p style="margin:10px 0 4px"><b>🍽️ Dagens ret</b> <span class="muted" style="font-size:13px">(vises på forsiden i dag)</span></p><input id="styrret" list="styrretliste" maxlength="120" placeholder="Skriv eller vælg en ret" value="' + esc(s.dagens_ret || '') + '" style="width:100%"><datalist id="styrretliste">' + navne.map(function (n) { return '<option value="' + esc(n) + '">' }).join('') + '</datalist>' +
    '<p style="margin:10px 0 4px"><b>⏸️ Pause</b> <span class="muted" style="font-size:13px">(lukker appen for alle andre end dig)</span></p><label style="display:flex;gap:8px;align-items:center;font-weight:700"><input type="checkbox" id="styrpausek" ' + (s.pause ? 'checked' : '') + ' style="width:22px;height:22px"> Sæt appen på pause</label><input id="styrpauset" maxlength="300" placeholder="Fx: Vi er tilbage kl. 18" value="' + esc(s.pause_tekst || '') + '" style="width:100%;margin-top:6px">' +
    '<button class="b" style="width:100%;margin-top:10px" onclick="styringGemIndstil()">Gem</button></details>';
  return h;
}
async function styringGemIndstil() {
  var p = document.getElementById('styrpausek').checked;
  if (p && !confirm('Vil du sætte appen på pause for alle andre? De kan ikke bruge den, før du slår pausen fra igen.')) return;
  try {
    await rpc('ejer_indstil', { k: ejerKode(), ny_besked: document.getElementById('styrbesked').value, ny_pause: p, ny_pause_tekst: document.getElementById('styrpauset').value, ny_dagens_ret: document.getElementById('styrret').value });
    await styringHent(); tegnAndreBrugere(); toast('Gemt ✔');
  } catch (e) { alert('Det virkede ikke. Tjek at du har internet, og prøv igen.') }
}

function styringKodeHTML(x) {
  if (x.ejer) return '';
  var h = '', u = styrEjer.brug && styrEjer.brug.koder && styrEjer.brug.koder[x.kode];
  if (u) h += '<div style="font-size:14px;margin-top:4px">📊 Sidste 7 dage: brugt ' + (+u.dage7 || 0) + ' af 7 dage · ' + styrMin(u.min7) + (u.top ? ' · mest ' + esc(STYR_NAVN[u.top] || u.top) : '') + '</div>';
  if (x.dele && x.dele.length) h += '<div style="font-size:14px;margin-top:4px">🔐 Må kun se: ' + x.dele.map(function (d) { return esc(STYR_NAVN[d] || d) }).join(', ') + (x.dele_til ? ' <span class="muted">(prøvetid til ' + styrDato(x.dele_til) + ', så alt)</span>' : '') + '</div>';
  if (x.udloeb) h += '<div style="font-size:14px;margin-top:4px">⏳ Slukker selv efter ' + styrDato(x.udloeb) + '</div>';
  return h;
}
function styringAdgang(kode) {
  var x = (ejerListe || []).find(function (y) { return y.kode === kode }); if (!x) return;
  var valgt = x.dele && x.dele.length ? x.dele : STYR_DELE.map(function (d) { return d[0] });
  dlgin.innerHTML = '<h2>⚙️ Adgang for ' + esc(x.navn || x.kode) + '</h2><p class="muted" style="margin-top:-6px">Kode ' + esc(x.kode) + '</p>' +
    '<p style="margin:10px 0 4px"><b>Hvad må personen se?</b></p>' + STYR_DELE.map(function (d) { return '<label style="display:flex;gap:10px;align-items:center;padding:8px 0;font-size:17px"><input type="checkbox" class="styrdel" value="' + d[0] + '" ' + (valgt.indexOf(d[0]) >= 0 ? 'checked' : '') + ' style="width:22px;height:22px">' + d[1] + '</label>' }).join('') +
    '<p style="margin:12px 0 4px"><b>🎁 Prøvetid</b> <span class="muted" style="font-size:13px">– valget ovenfor gælder til denne dag, derefter får personen alt. Tom = altid.</span></p><input type="date" id="styrtil" value="' + (x.dele_til || '') + '" style="width:100%">' +
    '<p style="margin:12px 0 4px"><b>⏳ Koden slukker selv efter</b> <span class="muted" style="font-size:13px">– tom = aldrig</span></p><input type="date" id="styrudl" value="' + (x.udloeb || '') + '" style="width:100%">' +
    '<div class="row" style="margin-top:14px"><button class="b" style="flex:1" onclick="styringGemAdgang(\'' + esc(x.kode) + '\')">Gem</button><button class="l" onclick="tegnAndreBrugere()">Tilbage</button></div>';
}
async function styringGemAdgang(kode) {
  var dele = [].slice.call(document.querySelectorAll('.styrdel')).filter(function (c) { return c.checked }).map(function (c) { return c.value });
  if (!dele.length) { alert('Vælg mindst én del'); return }
  if (dele.length === STYR_DELE.length) dele = [];
  var til = document.getElementById('styrtil').value || null, udl = document.getElementById('styrudl').value || null;
  try {
    await rpc('ejer_ret_adgang', { k: ejerKode(), hvilken: kode, ny_udloeb: udl, nye_dele: dele, ny_dele_til: til });
    var x = ejerListe.find(function (y) { return y.kode === kode }); if (x) { x.dele = dele.length ? dele : null; x.dele_til = til; x.udloeb = udl }
    tegnAndreBrugere(); toast('Gemt ✔');
  } catch (e) { alert('Det virkede ikke. Tjek at du har internet, og prøv igen.') }
}

// ================= Beskyttelse mod kopiering (ikke for ejeren) =================
// Skærmbilleder kan ikke stoppes på iPhone/PC. Men tekst og billeder kan ikke markeres, kopieres eller gemmes med langt tryk,
// og der står et svagt mærke med brugerens kode på skærmen, så et skærmbillede kan spores.
(function () {
  var st = document.createElement('style');
  st.textContent = 'body.beskyt{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}' +
    'body.beskyt input,body.beskyt textarea,body.beskyt [contenteditable]{-webkit-user-select:text;user-select:text}' +
    'body.beskyt img{-webkit-user-drag:none}' +
    '#beskytmaerke{position:fixed;inset:0;pointer-events:none;z-index:2;opacity:.05}';
  document.head.appendChild(st);
  function stop(e) { var t = e.target; if (document.body.classList.contains('beskyt') && !(t && t.closest && t.closest('input,textarea,[contenteditable]'))) e.preventDefault() }
  ['copy', 'cut', 'contextmenu', 'dragstart'].forEach(function (n) { document.addEventListener(n, stop) });
})();
function styringBeskyt() {
  var paa = !!styrLoggetInd() && !erEjer();
  document.body.classList.toggle('beskyt', paa);
  var m = document.getElementById('beskytmaerke');
  if (paa) {
    if (!m) { m = document.createElement('div'); m.id = 'beskytmaerke'; document.body.appendChild(m) }
    var k = String(loginGemt().kode).replace(/[^A-Z0-9]/gi, '');
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="140"><text x="10" y="80" transform="rotate(-25 110 70)" font-family="Arial" font-size="20" font-weight="700" fill="#000">' + k + '</text></svg>';
    m.style.backgroundImage = 'url("data:image/svg+xml;utf8,' + encodeURIComponent(svg) + '")';
  } else if (m) m.remove();
}
styringBeskyt();
setInterval(styringBeskyt, 10000);

async function styringSendVejledning() {
  var tekst = 'Sådan lægger du Budget og Mad på din telefon 📲 Følg billederne 1 til 6. (6 er til Android.)';
  try {
    var filer = await Promise.all([1, 2, 3, 4, 5, 6].map(function (i) { return fetch('vejledning/' + i + '.jpg').then(function (r) { return r.blob() }).then(function (b) { return new File([b], 'vejledning-' + i + '.jpg', { type: 'image/jpeg' }) }) }));
    if (navigator.canShare && navigator.canShare({ files: filer })) { await navigator.share({ title: 'Vejledning til Budget og Mad', text: tekst, files: filer }); return }
  } catch (e) { if (e && e.name === 'AbortError') return }
  alert('Din browser kan ikke sende billeder herfra. Brug billederne i mappen »Vejledning til Budget og Mad« på skrivebordet, eller send dem fra din telefon.');
}
