// Budget og Mad · version 57
// 1) »👫 Eksempel: budget for 2 voksne« – ca. tal fra rigtige kilder (se kilder.txt)
// 2) »📥 Hent mine tal fra Mit Smart Hjem PRO« – kun for ejeren. Læser en »Gem alt i én fil«-fil
//    lokalt på telefonen. Intet sendes nogen steder hen.

// Danmarks Statistik, Forbrugsundersøgelsen 2024 (Nyt nr. 43, 26. feb. 2026):
// »2 voksne, hovedperson under 60 år, uden børn« – kr. pr. husstand pr. år.
const EKS2_FASTE = [
  ['🏠', 'Bolig, vand, el og varme', 120520],
  ['🚌', 'Transport (bus, tog, cykel, bil)', 61911],
  ['🛡️', 'Forsikring og bank', 24321],
  ['📱', 'Mobil, internet og TV', 15922]
];
const EKS2_LEVE = [
  ['🛒', 'Mad og drikke', 41730],
  ['🍕', 'Café, restaurant og hotel', 35800],
  ['🎉', 'Fritid, sport og kultur', 28090],
  ['🪑', 'Ting og hjælp til hjemmet', 18458],
  ['👕', 'Tøj og sko', 13355],
  ['🧴', 'Frisør, pleje og andet', 10149],
  ['🍷', 'Øl, vin og tobak', 8351],
  ['💊', 'Medicin, briller og tandlæge', 7663],
  ['📚', 'Kurser og skole', 666]
];
// Danmarks Statistik, Indkomster for personer 2025 (Nyt nr. 288, 13. nov. 2026):
// gennemsnitlig disponibel indkomst pr. person over 14 år = 300.100 kr. i 2025 → 2 personer ≈ 50.000 kr./md.
const EKS2_IND = 50000;
const eks2Md = aar => Math.round(aar / 12 / 100) * 100;

function eks2Data() {
  const e = D.budget.eks2 = (D.budget.eks2 && typeof D.budget.eks2 === 'object') ? D.budget.eks2 : {};
  if (e.ind == null) e.ind = EKS2_IND;
  if (e.bolig == null) e.bolig = 6000;
  if (e.buffer == null) e.buffer = 1500;
  if (e.ferie == null) e.ferie = 1500;
  if (e.pris == null) e.pris = 2000000;
  return e;
}
function eks2AftensMad() { // median af appens ca. priser for 2 personer
  try {
    const v = Object.values(CA_PRIS || {}).filter(x => x > 0).sort((a, b) => a - b);
    return v.length ? Math.round(v[v.length >> 1]) : 0;
  } catch (e) { return 0 }
}
function eksempelKort() {
  const e = eks2Data();
  const faste = EKS2_FASTE.reduce((s, x) => s + eks2Md(x[2]), 0);
  const leve = EKS2_LEVE.reduce((s, x) => s + eks2Md(x[2]), 0);
  const efterRegninger = e.ind - faste;
  const spar = (e.bolig || 0) + (e.buffer || 0) + (e.ferie || 0);
  const rest = e.ind - faste - leve - spar;
  const udb = Math.round((e.pris || 0) * 0.05);
  const mdr = e.bolig > 0 ? Math.ceil(udb / e.bolig) : 0;
  const aftens = eks2AftensMad();
  const linje = x => `<li><span style="width:30px">${x[0]}</span><span class="n">${x[1]}</span><b>ca. ${kr(eks2Md(x[2]))}</b></li>`;
  const felt = (k, v) => `<input type="text" inputmode="decimal" id="eks2-${k}" value="${String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}" style="width:130px" onchange="eks2Gem('${k}')">`;
  const harBoligMaal = D.budget.maal.some(g => /bolig|hus|lejlighed|udbetaling/i.test(g.navn));
  return `<div class="card"><details${D.budget.eks2Aaben ? ' open' : ''} ontoggle="D.budget.eks2Aaben=this.open;save()"><summary style="cursor:pointer;font-weight:700">👫 Eksempel: budget for 2 voksne <span class="muted" style="font-weight:400">– hvad har I at leve for?</span></summary>
  <p class="muted" style="margin:6px 0 0">Et eksempel med ca. tal. Det er ikke jeres eget budget – det er til at blive klogere og få lyst til at spare op. Ret gerne tallene i felterne.</p>

  <div style="background:var(--acc2);border-radius:12px;padding:12px;margin-top:10px">
   <div class="row" style="justify-content:space-between"><b>💵 Penge ind efter skat (begge to)</b>${felt('ind', e.ind)}</div>
   <div class="muted" style="font-size:13px;margin-top:4px">Ca. gennemsnit for voksne i Danmark. Unge tjener ofte mindre – skriv jeres eget tal.</div>
  </div>

  <div style="margin-top:12px"><b>🏦 Regninger hver måned</b> <span class="muted">(ca. ${kr(faste)})</span>
   <ul class="list">${EKS2_FASTE.map(linje).join('')}</ul></div>

  <div style="text-align:center;margin:12px 0;padding:12px;border:2px solid var(--acc);border-radius:12px">
   <div class="muted">Når regningerne er betalt, har I at leve for</div>
   <div class="big" style="font-size:34px;color:${efterRegninger < 0 ? 'var(--warn)' : 'var(--acc)'}">ca. ${kr(efterRegninger)}</div>
   <div class="muted">om måneden · ca. ${kr(Math.floor(Math.max(0, efterRegninger) / 30))} pr. dag</div>
   <div class="muted" style="font-size:13px;margin-top:6px">Banker regner med, at to voksne mindst skal have ca. 12.250 kr. at leve for om måneden.</div>
  </div>

  <div><b>🛍️ Det bruger et par i gennemsnit på at leve</b> <span class="muted">(ca. ${kr(leve)})</span>
   <ul class="list">${EKS2_LEVE.map(linje).join('')}</ul>
   ${aftens ? `<div style="background:var(--acc2);border-radius:12px;padding:10px;margin-top:6px">💡 Aftensmad fra appen koster ca. <b>${kr(aftens)}</b> for to. Hver dag i en måned er det ca. <b>${kr(aftens * 30)}</b>.</div>` : ''}
  </div>

  <div style="margin-top:14px"><b>🐷 Opsparing hver måned</b> <span class="muted">– eksempel, ret selv</span>
   <div class="row" style="justify-content:space-between;margin-top:8px"><span>🏠 Til egen bolig</span>${felt('bolig', e.bolig)}</div>
   <div class="row" style="justify-content:space-between;margin-top:6px"><span>🧯 Buffer (uventede ting)</span>${felt('buffer', e.buffer)}</div>
   <div class="row" style="justify-content:space-between;margin-top:6px"><span>✈️ Ferie og gaver</span>${felt('ferie', e.ferie)}</div>
  </div>

  <div style="text-align:center;margin:12px 0;padding:12px;background:var(--acc2);border-radius:12px">
   <div class="muted">Tilbage, når alt er betalt og sparet op</div>
   <div class="big" style="font-size:28px;color:${rest < 0 ? 'var(--warn)' : 'var(--acc)'}">ca. ${kr(rest)}</div>
   <div class="muted" style="font-size:13px">${rest < 0 ? 'Det går ikke op. Spar lidt mindre, eller brug mindre på café og take-away.' : 'Det kan bruges på mere opsparing – eller lidt ekstra sjov.'}</div>
  </div>

  ${e.bolig > 0 ? `<div style="margin-top:6px"><b>🏡 Drømmen om egen bolig</b>
   <div class="row" style="justify-content:space-between;margin-top:8px"><span>Boligens pris</span>${felt('pris', e.pris)}</div>
   <p style="margin:8px 0 0">Til at købe skal I selv have mindst 5 % af prisen: <b>ca. ${kr(udb)}</b>.</p>
   <p style="margin:6px 0 0">Sparer I <b>${kr(e.bolig)}</b> op om måneden, har I det om ca. <b>${mdr} måneder</b>${mdr >= 12 ? ` (${(Math.round(mdr / 12 * 10) / 10).toString().replace('.', ',')} år)` : ''}. 🎉</p>
   <ul class="list">${[1, 3, 5].map(a => `<li><span class="n">Efter ${a} år</span><b>${kr(e.bolig * 12 * a)}</b></li>`).join('')}</ul>
   ${harBoligMaal ? '' : `<button class="b" style="width:100%;margin-top:8px" onclick="eks2BoligMaal()">🐷 Lav et sparemål til egen bolig</button>`}
  </div>` : ''}

  <p class="muted" style="font-size:12px;margin-top:12px">Kilder: Danmarks Statistik (Forbrugsundersøgelsen 2024 og Indkomster 2025), Forbrugerrådet Tænk (rådighedsbeløb) og Bolius (5 % udbetaling). Tallene er ca. og afrundede.</p>
  </details></div>`;
}
function eks2Gem(k) {
  const e = eks2Data(), v = tal('eks2-' + k);
  e[k] = isFinite(v) && v >= 0 ? v : 0;
  save(); vis();
}
function eks2BoligMaal() {
  const e = eks2Data(), udb = Math.round((e.pris || 0) * 0.05);
  if (!udb) { alert('Skriv boligens pris først'); return }
  const s = snap();
  D.budget.maal.push({id: id(), navn: 'Egen bolig', emoji: '🏠', maal: udb, ind: []});
  save(); vis(); toast('Nyt sparemål: Egen bolig 🏠', fortrydTil(s));
}

// ---------- 📥 Hent mine tal fra Mit Smart Hjem PRO (kun ejeren) ----------
let msh = null; // forslag fra filen, vises før noget gemmes
function ejerHentKort() {
  let ejer = false; try { ejer = erEjer() } catch (e) {}
  if (!ejer) return '';
  return `<div class="card" style="border:2px dashed var(--acc)"><b>📥 Hent mine tal fra Mit Smart Hjem PRO</b> <span class="muted">– kun dig (ejer)</span>
  <p style="margin:6px 0 8px"><b>Nemmest:</b> I Mit Smart Hjem PRO: tryk ⚙ Indstillinger → knappen øverst »📋 Kopiér mit budget til Budget og Mad«. Kom så tilbage hertil, og tryk:</p>
  <button class="b" style="width:100%;font-size:19px;padding:14px" onclick="mshSaetInd()">📋 Sæt mit budget ind</button>
  <div id="mshfelt" style="display:none;margin-top:8px"><textarea placeholder="Tryk og hold her, og vælg »Indsæt«" style="width:100%;min-height:70px" oninput="mshFelt(this)"></textarea></div>
  <p class="muted" style="margin:8px 0 6px;font-size:13px">Det bliver på denne telefon – intet sendes nogen steder hen. Du ser tallene, før de bliver gemt.</p>
  <label class="l" style="font:inherit;display:block;text-align:center;cursor:pointer;margin:0;border-radius:10px;padding:8px 16px">📂 Eller vælg en fil<input type="file" accept=".json,application/json" hidden onchange="mshLaes(this)"></label>
  ${msh ? mshVis() : ''}</div>`;
}
function mshTal(v) { const n = parseFloat(String(v ?? '').replace(/\s/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.')); return isFinite(n) ? n : 0 }
function mshLaes(inp) {
  const f = inp.files && inp.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => { mshFraTekst(r.result, f.name); inp.value = ''; };
  r.readAsText(f);
}
// version 63: »📋 Sæt mit budget ind« – læser det, der er kopieret i Mit Smart Hjem PRO (ingen filer)
async function mshSaetInd() {
  let tekst = '';
  try { tekst = await navigator.clipboard.readText(); } catch (e) {}
  if (tekst && tekst.includes('Mit Smart Hjem PRO') && tekst.includes('privat-budget')) { mshFraTekst(tekst, 'kopieret'); return; }
  const fe = document.getElementById('mshfelt'); if (fe) { fe.style.display = 'block'; const ta = fe.querySelector('textarea'); ta.value = ''; ta.focus(); }
  toast('Tryk og hold i feltet, og vælg »Indsæt«');
}
function mshFelt(ta) { const v = ta.value.trim(); if (v.length > 20) mshFraTekst(v, 'kopieret') }
function mshFraTekst(tekst, navn) {
  const f = {name: navn};
  // version 64: tål tekst, der er kopieret fra en besked (fx med ``` eller pæne anførselstegn omkring)
  tekst = String(tekst || '');
  const s0 = tekst.indexOf('{'), s1 = tekst.lastIndexOf('}'); if (s0 >= 0 && s1 > s0) tekst = tekst.slice(s0, s1 + 1);
  try { JSON.parse(tekst); } catch (e) { tekst = tekst.replace(/[“”„]/g, '"'); }
  {
    try {
      const fil = JSON.parse(tekst);
      if (!fil || fil.app !== 'Mit Smart Hjem PRO' || !fil.ls) throw new Error('forkert fil');
      const fam = JSON.parse(fil.ls['privat-budget-familie-v2'] || '[]') || [];
      const md = iso(new Date()).slice(0, 7), dag = d => { const n = parseInt(String(d || '').slice(8, 10)); return n >= 1 && n <= 31 ? n : null };
      const poster = [];
      // version 62: som i Mit Smart Hjem PRO – en post, der gentages, kommer med i hver måned, hvor den hører til
      // (fra sin startdato og frem til december næste år). Hver post lander i sin egen måned.
      const slutAar = new Date().getFullYear() + 1;
      (Array.isArray(fam[0]) ? fam[0] : []).forEach(r => {
        if (!Array.isArray(r)) return;
        const navn = String(r[0] || '').trim(), belob = Math.abs(mshTal(r[1])), type = String(r[3] || 'Udgift'), gentag = String(r[4] || 'En gang');
        const m0 = String(r[2] || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (!navn || !(belob > 0) || !m0) return;
        const y = +m0[1], mo = +m0[2], d = +m0[3];
        const step = /kvartal/i.test(gentag) ? 3 : /år/i.test(gentag) ? 12 : /måned/i.test(gentag) ? 1 : 0;
        const hvor = /^indt/i.test(type) ? 'ind' : 'kob', tekst = (/^opspar/i.test(type) ? 'Opsparing: ' : '') + navn;
        for (let k = 0; ; k += step) {
          const t2 = (y * 12 + mo - 1) + k, aa = Math.floor(t2 / 12), mm = t2 % 12 + 1;
          if (aa > slutAar) break;
          const dd = Math.min(d, new Date(aa, mm, 0).getDate());
          poster.push({hvor, tekst, belob, dato: aa + '-' + String(mm).padStart(2, '0') + '-' + String(dd).padStart(2, '0')});
          if (!step) break;
        }
      });
      (Array.isArray(fam[2]) ? fam[2] : []).forEach(g => {
        if (!Array.isArray(g)) return;
        const navn = String(g[0] || '').trim(), maal = mshTal(g[1]), har = mshTal(g[2]);
        if (!navn || !(maal > 0) || /^Eksempel:/i.test(navn)) return;
        poster.push({hvor: 'maal', tekst: navn, belob: maal, har});
      });
      // »Privat Budget PRO« (6 felter: indtægt 1, indtægt 2, bolig, faste regninger, madbudget, transport og øvrige)
      try {
        const m = JSON.parse(fil.ls['privat-budget-pro-monthly'] || 'null');
        if (Array.isArray(m)) [['ind', 'Indtægt 1'], ['ind', 'Indtægt 2'], ['fast', 'Bolig'], ['fast', 'Faste regninger'], ['madb', 'Madbudget pr. måned'], ['fast', 'Transport og øvrige udgifter']].forEach(([hvor, tekst], i) => {
          const b = mshTal(m[i]); if (b > 0) poster.push(hvor === 'ind' ? {hvor, tekst, belob: b, dato: md + '-01'} : {hvor, tekst, belob: b});
        });
      } catch (e) {}
      poster.forEach(p => p.findes = mshFindes(p));
      poster.forEach(p => p.valgt = !p.findes);
      msh = {poster, navn: f.name};
      vis(); toast(poster.length ? poster.length + ' poster fundet – se dem igennem' : 'Der var ingen budgettal i filen');
    } catch (e) { alert('Det er ikke dit budget fra Mit Smart Hjem PRO. Tryk først »📋 Kopiér mit budget til Budget og Mad« i Mit Smart Hjem PRO (⚙ Indstillinger, øverst).') }
  }
}
function mshFindes(p) {
  const s = x => String(x || '').toLowerCase().trim();
  if (p.hvor === 'ind') return D.budget.ind.some(x => s(x.tekst) === s(p.tekst) && x.belob === p.belob && x.dato.slice(0, 7) === p.dato.slice(0, 7));
  if (p.hvor === 'fast') return D.budget.faste.some(x => s(x.tekst) === s(p.tekst) && x.belob === p.belob);
  if (p.hvor === 'kob') return D.budget.udgifter.some(x => s(x.tekst) === s(p.tekst) && x.belob === p.belob && x.dato === p.dato);
  if (p.hvor === 'madb') return (D.budget.maaned || 0) === p.belob;
  return D.budget.maal.some(x => s(x.navn) === s(p.tekst));
}
function mshVis() {
  const navn = {ind: '💵 Penge ind', fast: '🏦 Faste udgifter (hver måned)', kob: '🛒 Udgifter', madb: '🍽️ Budget til mad', maal: '🐷 Sparemål'};
  const valgt = msh.poster.filter(p => p.valgt).length, v = msh.poster.filter(p => p.valgt);
  const datoer = v.filter(p => p.dato).map(p => p.dato).sort(), mnd = x => new Date(x).toLocaleDateString('da-DK', {month: 'long', year: 'numeric'});
  const sumH = h => v.filter(p => p.hvor === h).reduce((s, p) => s + p.belob, 0);
  const knap = `<div class="row" style="margin-top:10px"><button class="b" style="flex:1;font-size:18px" onclick="mshGem()" ${valgt ? '' : 'disabled'}>✓ Læg ${valgt} ind i mit budget</button><button class="l" onclick="msh=null;vis()">Annullér</button></div>`;
  const har = msh.poster.filter(p => p.findes).length;
  const fjern = har ? `<div style="margin-top:10px;padding:10px;border:2px dashed var(--warn);border-radius:12px"><b>${har} af tallene har du allerede i dit budget.</b><div class="muted" style="font-size:13px;margin:4px 0 8px">Vil du have dem ud igen, så tryk her. Du kan fortryde bagefter.</div><button class="l" style="width:100%" onclick="mshFjern()">🗑️ Fjern de ${har} fra mit budget</button></div>` : '';
  return `<div style="margin-top:12px;background:var(--acc2);border-radius:12px;padding:12px"><b>Fundet:</b> ${valgt} poster${datoer.length ? ` fra ${mnd(datoer[0])} til ${mnd(datoer[datoer.length - 1])}` : ''}.
   <div style="margin-top:6px">💵 Penge ind i alt: <b>${kr(Math.round(sumH('ind')))}</b><br>🛒 Udgifter i alt: <b>${kr(Math.round(sumH('kob')))}</b></div>
   <div class="muted" style="font-size:13px;margin-top:4px">Hver post lægges i sin egen måned. Det, du allerede har, springes over.</div>${knap}${fjern}</div>
  <details style="margin-top:10px"><summary style="cursor:pointer"><b>Se alle poster</b> <span class="muted">– og fjern fluebenet ved det, du ikke vil have med</span></summary>
  ${['ind', 'fast', 'madb', 'kob', 'maal'].map(h => { const l = msh.poster.map((p, i) => [p, i]).filter(([p]) => p.hvor === h); return l.length ? `<div style="margin-top:10px"><b style="font-size:14px">${navn[h]}</b>${l.map(([p, i]) => `<label class="row" style="margin:6px 0;gap:8px;cursor:pointer;font-weight:400"><input type="checkbox" ${p.valgt ? 'checked' : ''} onchange="msh.poster[${i}].valgt=this.checked;vis()" style="width:22px;height:22px;flex:none"><span style="flex:1">${p.dato ? `<span class="muted">${new Date(p.dato).toLocaleDateString('da-DK', {day: 'numeric', month: 'short', year: '2-digit'})}</span> ` : ''}${esc(p.tekst)}${p.dag ? ` <span class="muted">d. ${p.dag}</span>` : ''}${p.findes ? ' <span class="muted">(har du allerede)</span>' : ''}</span><b>${kr(p.belob)}</b></label>`).join('')}</div>` : '' }).join('')}
  ${knap}</details></div>`;
}
// version 66: fjern tal, der kom fra Mit Smart Hjem PRO, igen (kun dem, der passer præcist)
function mshFjern() {
  if (!msh) return;
  const l = msh.poster.filter(p => p.findes);
  if (!l.length || !confirm('Fjern ' + l.length + ' poster fra dit budget?' + String.fromCharCode(10, 10) + 'Du kan fortryde bagefter.')) return;
  const s = snap(), sm = x => String(x || '').toLowerCase().trim();
  l.forEach(p => {
    if (p.hvor === 'ind') { const i = D.budget.ind.findIndex(x => sm(x.tekst) === sm(p.tekst) && x.belob === p.belob && x.dato.slice(0, 7) === p.dato.slice(0, 7)); if (i >= 0) D.budget.ind.splice(i, 1); }
    else if (p.hvor === 'kob') { const i = D.budget.udgifter.findIndex(x => sm(x.tekst) === sm(p.tekst) && x.belob === p.belob && x.dato === p.dato); if (i >= 0) D.budget.udgifter.splice(i, 1); }
    else if (p.hvor === 'fast') { const i = D.budget.faste.findIndex(x => sm(x.tekst) === sm(p.tekst) && x.belob === p.belob); if (i >= 0) D.budget.faste.splice(i, 1); }
    else if (p.hvor === 'maal') { const i = D.budget.maal.findIndex(x => sm(x.navn) === sm(p.tekst)); if (i >= 0) D.budget.maal.splice(i, 1); }
    else if (p.hvor === 'madb' && (D.budget.maaned || 0) === p.belob) { D.budget.maaned = 0; D.budget.madPeriode = null; }
  });
  msh = null; save(); vis(); toast(l.length + ' poster er fjernet fra dit budget', fortrydTil(s));
}
function mshGem() {
  if (!msh) return;
  const s = snap(); let n = 0;
  msh.poster.filter(p => p.valgt).forEach(p => {
    n++;
    if (p.hvor === 'ind') D.budget.ind.push({id: id(), dato: p.dato, tekst: p.tekst, belob: p.belob});
    else if (p.hvor === 'fast') D.budget.faste.push({id: id(), tekst: p.tekst, belob: p.belob, dag: p.dag || null});
    else if (p.hvor === 'kob') D.budget.udgifter.push({id: id(), dato: p.dato, tekst: p.tekst, belob: p.belob});
    else if (p.hvor === 'madb') { D.budget.maaned = p.belob; D.budget.madPeriode = {type: 'maaned', belob: p.belob}; }
    else D.budget.maal.push({id: id(), navn: p.tekst, emoji: maalEmoji(p.tekst), maal: p.belob, ind: p.har > 0 ? [{dato: '2000-01-01', belob: p.har}] : [] /* gammel dato, så det ikke trækkes fra »Tilbage« i denne måned */});
  });
  msh = null; save(); vis(); toast(n + ' poster lagt ind i dit budget. Se dem under »📅 Hele året«.', fortrydTil(s));
}

// ---------- 🏦 Hent fil fra banken (CSV) – version 59 ----------
// Filen læses kun på telefonen. Intet sendes nogen steder hen.
// Vejledninger fra bankernes egne hjælpesider (se kilder.txt).
let bankF = null; // forslag fra bankfilen, vises før noget gemmes
// version 74: vejledning for hver bank – kun trin fra bankens egen hjælpeside (kilder i kilder.txt)
const BANK_GUIDE = [
  ['Danske Bank', [['📱 I mobilbanken', ['Vælg kontoen', 'Tryk på de 3 prikker øverst til højre', 'Tryk »Eksporter kontobevægelser«', 'Vælg filtype CSV og periode', 'Tryk »Eksporter«']], ['💻 I netbanken', ['Gå til »Kontooversigt«, og vælg kontoen', 'Vælg perioden', 'Klik »Gem som fil« under listen', 'Vælg CSV, og klik »Gem«']]]],
  ['Nordea', [['💻 I netbanken (på PC)', ['Gå til »Oversigt« → »Transaktionskonti«', 'Klik på kontoen', 'Vælg datoerne', 'Klik på knappen »CSV (Excel)«']]], 'Nordeas vejledning nævner ikke, at det kan gøres i mobilbanken.'],
  ['Jyske Bank', [['📱💻 I mobil- eller netbanken', ['Vælg kontoen', 'Tryk på de 3 prikker øverst', 'Tryk »Print og eksporter«', 'Vælg periode og filtype (vælg CSV)', 'Tryk »OK«']]]],
  ['Sydbank', [['💻 I netbanken', ['Gå ind på kontoen', 'Klik på de 3 blå prikker, og vælg »Eksporter til fil«', 'Vælg perioden', 'Klik »Eksporter til CSV-fil«']]], 'Filen kommer i Overførsler.'],
  ['Nykredit', [['💻 I netbanken', ['Klik »Konti og kort« → »Konti«, og vælg kontoen', 'Vælg »Gem posteringer som fil« til højre', 'Vælg periode, og vælg eksportformat »CSV«', 'Klik »Næste« – filen hentes af sig selv']]]],
  ['Coop Bank', [['💻 I netbanken', ['Vælg »Konti og kort« → »Konti«', 'Klik på kontoen', 'Vælg »Gem posteringer som fil«', 'Vælg oplysninger og filtype (vælg CSV, hvis du kan)']]]],
  ['Lunar', [['📱 I appen', ['Vælg kontoen', 'Tryk »Mere« → »Detaljer«', 'Tryk »Eksporter kontoudtog«', 'Vælg start- og slutdato, og vælg CSV', 'Tryk »Hent kontoudtog«, og gem filen']]], 'Reserverede beløb kommer ikke med.'],
  ['Arbejdernes Landsbank', null],
  ['Spar Nord', null],
  ['Lån & Spar', null],
  ['Anden bank', null]
];
let bankValgt = null;
function bankGuide() {
  const g = BANK_GUIDE.find(x => x[0] === bankValgt);
  const valg = `<div class="chips" style="flex-wrap:wrap;overflow:visible;margin-top:8px">${BANK_GUIDE.map(([b]) => `<button class="chip ${b === bankValgt ? 'on' : ''}" onclick="bankValgt=${b === bankValgt ? 'null' : `'${b.replace(/'/g, "\\'")}'`};vis()">${esc(b)}</button>`).join('')}</div>`;
  if (!g) return valg + '<p class="muted" style="font-size:13px;margin:8px 0 0">Tryk på din bank.</p>';
  const [navn, dele, note] = g;
  const ingen = `<p style="margin:8px 0 0">Vi har ikke fundet en vejledning fra ${navn === 'Anden bank' ? 'din bank' : esc(navn)} til private. Prøv i netbanken: gå ind på kontoen, og kig efter »Eksporter« eller »Gem som fil«, og vælg CSV. Kan du ikke finde det, så spørg banken.</p>`;
  return valg + `<div style="margin-top:10px"><b>${esc(navn)}</b>${dele ? dele.map(([h, trin]) => `<div style="margin-top:8px"><b style="font-size:14px">${h}</b><ol style="margin:4px 0 0 20px;padding:0">${trin.map(x => `<li style="margin:3px 0">${x}</li>`).join('')}</ol></div>`).join('') : ingen}${note ? `<p class="muted" style="font-size:13px;margin:6px 0 0">${note}</p>` : ''}</div>`;
}
function bankKort() {
  return `<div class="card"><b>🏦 Hent fil fra banken</b> <span class="muted">– læg dine køb og penge ind på én gang</span>
  <p class="muted" style="margin:6px 0 8px">Hent en CSV-fil med dine kontobevægelser i din bank, og vælg den her. Filen bliver kun læst på din telefon – intet sendes nogen steder hen. Du ser det hele, før noget bliver gemt.</p>
  <details class="hjdel"${bankValgt ? ' open' : ''}><summary style="cursor:pointer"><b>📖 Sådan henter du filen i din bank</b> <span class="muted">– vælg din bank</span></summary>
   ${bankGuide()}
   <p class="muted" style="font-size:13px;margin:8px 0 0">På iPhone: gem filen i »Filer«. Vælg den derefter med knappen herunder.</p></details>
  <label class="b" style="font:inherit;display:block;text-align:center;cursor:pointer;margin:10px 0 0;color:#fff;background:var(--acc);border-radius:10px;padding:10px 16px">📂 Vælg filen fra banken<input type="file" accept=".csv,.txt,text/csv,text/plain" hidden onchange="bankLaes(this)"></label>
  ${bankF ? bankVis() : ''}</div>`;
}
function bankTekst(buf) {
  try { return new TextDecoder('utf-8', {fatal: true}).decode(buf) } catch (e) { return new TextDecoder('windows-1252').decode(buf) }
}
function bankDel(linje, sep) { // deler en CSV-linje, også med "…" omkring felterne
  const ud = []; let f = '', q = false;
  for (let i = 0; i < linje.length; i++) {
    const c = linje[i];
    if (q) { if (c === '"' && linje[i + 1] === '"') { f += '"'; i++ } else if (c === '"') q = false; else f += c }
    else if (c === '"') q = true; else if (c === sep) { ud.push(f.trim()); f = '' } else f += c;
  }
  ud.push(f.trim()); return ud;
}
function bankBelob(t) {
  t = String(t || '').replace(/\s|kr\.?|DKK/gi, '').replace(/−/g, '-');
  if (!t || !/^[-+]?[\d.,]+$/.test(t)) return NaN;
  if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.'); else if (/^[-+]?\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, '');
  return parseFloat(t);
}
function bankDato(t) {
  t = String(t || '').trim(); let m;
  if ((m = t.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/))) return m[1] + '-' + m[2].padStart(2, '0') + '-' + m[3].padStart(2, '0');
  if ((m = t.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/))) { const y = m[3].length === 2 ? '20' + m[3] : m[3]; return y + '-' + m[2].padStart(2, '0') + '-' + m[1].padStart(2, '0') }
  return '';
}
function bankLaes(inp) {
  const f = inp.files && inp.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const tekst = bankTekst(r.result).replace(/^﻿/, '');
      const linjer = tekst.split(/\r?\n/).filter(l => l.trim());
      if (!linjer.length) throw new Error('tom');
      const sep = [';', '\t', ','].map(s => [s, linjer.slice(0, 5).reduce((a, l) => a + l.split(s).length, 0)]).sort((a, b) => b[1] - a[1])[0][0];
      const rk = linjer.map(l => bankDel(l, sep));
      // find overskrift-linjen (Dato / Tekst / Beløb) – ellers gæt ud fra indholdet
      const h = rk.findIndex(x => x.some(c => /dato|date/i.test(c)) && x.some(c => /bel[øo]b|amount/i.test(c)));
      let iD, iT, iB, tekstKol = [];
      if (h >= 0) {
        const o = rk[h].map(c => c.toLowerCase());
        iD = o.findIndex(c => /^(bogf|dato|date|posteringsdato)/.test(c)); if (iD < 0) iD = o.findIndex(c => /dato|date/.test(c));
        iB = o.findIndex(c => /^(bel[øo]b|amount)/.test(c)); if (iB < 0) iB = o.findIndex(c => /bel[øo]b|amount/.test(c));
        iT = o.findIndex(c => /tekst|text|beskrivelse|navn|modtager|description/.test(c));
        tekstKol = ['tekst|text', 'beskrivelse|description', 'navn', 'modtager', 'afsender'].map(m => o.findIndex(c => new RegExp(m).test(c))).filter(i => i >= 0); // v74: første tekst, der ikke er tom
      } else {
        const p = rk[0]; iD = p.findIndex(c => bankDato(c)); iB = p.findIndex((c, i) => i !== iD && isFinite(bankBelob(c))); iT = p.findIndex((c, i) => i !== iD && i !== iB && /[a-zæøå]/i.test(c));
      }
      if (iD < 0 || iB < 0) throw new Error('kolonner');
      const poster = [];
      rk.slice(h + 1).forEach(x => {
        const dato = bankDato(x[iD]), b = bankBelob(x[iB]);
        if (!dato || !isFinite(b) || !b) return;
        const tx = (tekstKol.map(i => x[i]).find(v => v && v.trim()) || (iT >= 0 ? x[iT] : '')) || (b > 0 ? 'Penge ind' : 'Køb');
        poster.push({hvor: b > 0 ? 'ind' : 'kob', tekst: tx.slice(0, 60), belob: Math.round(Math.abs(b) * 100) / 100, dato});
      });
      if (!poster.length) throw new Error('ingen');
      poster.forEach(p => { p.findes = bankFindes(p); p.valgt = !p.findes });
      poster.sort((a, b) => b.dato.localeCompare(a.dato));
      bankF = {poster, navn: f.name};
      vis(); toast(poster.length + ' poster fundet – se dem igennem');
    } catch (e) { alert('Filen kunne ikke læses. Vælg en CSV-fil med kontobevægelser fra din bank (ikke PDF eller Excel).') }
    inp.value = '';
  };
  r.readAsArrayBuffer(f);
}
function bankFindes(p) {
  const s = x => String(x || '').toLowerCase().trim();
  const l = p.hvor === 'ind' ? D.budget.ind : D.budget.udgifter;
  return l.some(x => x.dato === p.dato && x.belob === p.belob && s(x.tekst) === s(p.tekst));
}
function bankAlle(v) { if (!bankF) return; bankF.poster.forEach(p => p.valgt = v && !p.findes); vis() }
function bankVis() {
  const valgt = bankF.poster.filter(p => p.valgt), ind = valgt.filter(p => p.hvor === 'ind').reduce((s, p) => s + p.belob, 0), ud = valgt.filter(p => p.hvor === 'kob').reduce((s, p) => s + p.belob, 0);
  const kort = d => new Date(d).toLocaleDateString('da-DK', {day: 'numeric', month: 'short'});
  return `<div style="margin-top:12px"><b>Er det rigtigt?</b> <span class="muted">Penge ind bliver til »Penge ind«, og det, der er gået fra, bliver til »Køb«. Fjern fluebenet ved det, du ikke vil have med.</span>
  <div class="row" style="margin-top:8px"><button class="l" onclick="bankAlle(true)">Vælg alle</button><button class="l" onclick="bankAlle(false)">Vælg ingen</button></div>
  <div style="max-height:420px;overflow:auto;margin-top:8px">${bankF.poster.map((p, i) => `<label class="row" style="margin:4px 0;gap:8px;cursor:pointer;font-weight:400;flex-wrap:nowrap"><input type="checkbox" ${p.valgt ? 'checked' : ''} onchange="bankF.poster[${i}].valgt=this.checked;vis()" style="width:22px;height:22px;flex:none"><span class="muted" style="width:54px;flex:none">${kort(p.dato)}</span><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis">${esc(p.tekst)}${p.findes ? ' <span class="muted">(har du)</span>' : ''}</span><b style="flex:none;color:${p.hvor === 'ind' ? 'var(--acc)' : 'inherit'}">${p.hvor === 'ind' ? '+' : '−'}${kr(p.belob)}</b></label>`).join('')}</div>
  <div class="muted" style="margin-top:8px">Valgt: ${valgt.length} · ind ${kr(ind)} · ud ${kr(ud)}</div>
  <div class="row" style="margin-top:10px"><button class="b" style="flex:1" onclick="bankGem()" ${valgt.length ? '' : 'disabled'}>✓ Læg ${valgt.length} ind i mit budget</button><button class="l" onclick="bankF=null;vis()">Annullér</button></div></div>`;
}
function bankGem() {
  if (!bankF) return;
  const s = snap(); let n = 0;
  bankF.poster.filter(p => p.valgt).forEach(p => {
    n++;
    if (p.hvor === 'ind') D.budget.ind.push({id: id(), dato: p.dato, tekst: p.tekst, belob: p.belob});
    else D.budget.udgifter.push({id: id(), dato: p.dato, tekst: p.tekst, belob: p.belob});
  });
  bankF = null; save(); vis(); toast(n + ' poster lagt ind i dit budget. Skift måned med pilene øverst.', fortrydTil(s));
}

// ---------- 📅 Hele året – alle 12 måneder på én gang (version 60) ----------
let aarVis = null; // hvilket år der vises (null = året for den valgte måned)
function aarKort(md) {
  const aar = aarVis || +md.slice(0, 4), nu = iso(new Date()).slice(0, 7);
  const rk = Array.from({length: 12}, (_, i) => {
    const m = aar + '-' + String(i + 1).padStart(2, '0'), b = budgetTal(m);
    const har = b.ind > 0 || b.kob > 0 || b.sparet !== 0;
    return {m, b, har, navn: new Date(m + '-01').toLocaleDateString('da-DK', {month: 'short'}).replace('.', '')};
  });
  const med = rk.filter(r => r.har), sum = k => med.reduce((s, r) => s + r.b[k], 0);
  const ud = r => r.b.faste + r.b.kob + r.b.sparet;
  const maxV = Math.max(1, ...med.map(r => Math.max(r.b.ind, ud(r))));
  const celle = 'text-align:right;white-space:nowrap;padding:6px 4px';
  // version 65: »Jævnt fordelt« – som en budgetkonto: årets tal delt ligeligt ud på månederne, opsparing for sig
  const jaevn = !!D.budget.aarJaevn;
  const opsI = m => D.budget.udgifter.filter(x => x.dato.slice(0, 7) === m && /^opsparing/i.test(x.tekst || '')).reduce((s, x) => s + x.belob, 0) + sparetI(m);
  const n = med.length || 1, jInd = sum('ind') / n, jOps = med.reduce((s, r) => s + opsI(r.m), 0) / n, jUd = med.reduce((s, r) => s + ud(r), 0) / n - jOps, jRest = jInd - jUd - jOps;
  const valg = `<div class="chips" style="margin-top:8px"><button class="chip ${jaevn ? '' : 'on'}" onclick="D.budget.aarJaevn=false;save();vis()">Måned for måned</button><button class="chip ${jaevn ? 'on' : ''}" onclick="D.budget.aarJaevn=true;save();vis()">⚖️ Jævnt fordelt</button></div>`;
  const jaevnBoks = `<div style="margin-top:10px">${med.length ? `<p class="muted" style="margin:0 0 8px">Som en budgetkonto: årets penge ind og ud er delt ligeligt ud på ${med.length} måneder med tal. Store regninger (fx hvert kvartal eller år) fylder så lige meget hver måned.</p>
   <ul class="list"><li><span class="n">💵 Ind pr. måned</span><b>${kr(Math.round(jInd))}</b></li><li><span class="n">🏦 Ud pr. måned (regninger og køb)</span><b>${kr(Math.round(jUd))}</b></li><li><span class="n">🐷 Opsparing pr. måned</span><b>${kr(Math.round(jOps))}</b></li></ul>
   <div style="text-align:center;margin-top:10px;padding:10px;border:2px solid var(--acc);border-radius:12px"><div class="muted">Tilbage pr. måned, når opsparingen er lagt til side</div><div class="big" style="font-size:28px;color:${jRest < 0 ? 'var(--warn)' : '#15803d'}">${kr(Math.round(jRest))}</div><div class="muted" style="font-size:13px">Uden opsparing: ${kr(Math.round(jRest + jOps))}</div></div>
   ${jRest < 0 ? `<p class="muted" style="font-size:13px;margin:8px 0 0">Er der minus, selv om I ikke mærker det, mangler der måske penge ind i tallene – fx fra jeres konti, børnepenge eller overskydende skat.</p>` : ''}` : '<p class="muted">Ingen tal for det år endnu.</p>'}</div>`;
  return `<div class="card"><details${D.budget.aarAaben ? ' open' : ''} ontoggle="D.budget.aarAaben=this.open;save()"><summary style="cursor:pointer;font-weight:700">📅 Hele året ${aar} <span class="muted" style="font-weight:400">– alle måneder på én gang</span></summary>
  <div class="row" style="margin-top:8px"><button class="l" onclick="aarVis=${aar - 1};vis()">‹ ${aar - 1}</button><b style="flex:1;text-align:center">${aar}</b><button class="l" onclick="aarVis=${aar + 1};vis()">${aar + 1} ›</button></div>
  ${valg}${jaevn ? jaevnBoks : ''}
  <div style="overflow-x:auto;margin-top:8px;${jaevn ? 'display:none' : ''}"><table style="width:100%;border-collapse:collapse;font-size:15px">
   <tr class="muted" style="font-size:13px"><th style="text-align:left;padding:6px 4px">Måned</th><th style="${celle}">💵 Ind</th><th style="${celle}">🏦 Ud</th><th style="${celle}">Tilbage</th></tr>
   ${rk.map(r => `<tr onclick="budgetMd='${r.m}';aarVis=null;vis();scrollTo(0,0)" style="cursor:pointer;border-top:1px dashed var(--line)${r.m === nu ? ';background:var(--acc2)' : ''}">
    <td style="padding:6px 4px"><b>${r.navn}</b>${r.har ? `<div style="height:5px;border-radius:3px;background:var(--line);margin-top:4px;width:100%"><i style="display:block;height:5px;border-radius:3px;background:var(--acc);width:${Math.round(Math.min(1, ud(r) / maxV) * 100)}%"></i></div>` : ''}</td>
    ${r.har ? `<td style="${celle};color:#15803d;font-weight:700">${kr(Math.round(r.b.ind))}</td><td style="${celle};color:#dc2626;font-weight:700">${kr(Math.round(ud(r)))}</td><td style="${celle};font-weight:800;color:${r.b.tilbage < 0 ? 'var(--warn)' : '#15803d'}">${kr(Math.round(r.b.tilbage))}</td>` : `<td colspan="3" class="muted" style="${celle}">ingen tal endnu</td>`}</tr>`).join('')}
   <tr style="border-top:2px solid var(--acc);font-weight:800"><td style="padding:8px 4px">I alt</td><td style="${celle};color:#15803d">${kr(Math.round(sum('ind')))}</td><td style="${celle};color:#dc2626">${kr(Math.round(med.reduce((s, r) => s + ud(r), 0)))}</td><td style="${celle};color:${sum('tilbage') < 0 ? 'var(--warn)' : '#15803d'}">${kr(Math.round(sum('tilbage')))}</td></tr>
  </table></div>
  <p class="muted" style="font-size:13px;margin:8px 0 0;${jaevn ? 'display:none' : ''}">»Ud« er faste udgifter + køb + opsparing (ikke det, der betales fra budget- eller feriekonto). I alt tæller kun måneder med tal. Tryk på en måned for at se den.</p>
  </details></div>`;
}

// ---------- 🏦 Betalt fra budgetkonto / feriekonto (version 67) ----------
// Regninger, der betales fra en budgetkonto eller feriekonto, tæller ikke med i »Tilbage« –
// ellers tæller de dobbelt (én gang som overførsel til kontoen, og én gang som regning).
const KONTO_GRP = [
  ['ferie', '✈️', 'Ferie og rejser', /ferie|rejse/i, /opsparing|feriepenge/i],
  ['forsikr', '🛡️', 'Forsikringer', /forsikr|tryg\b|tryg\s*\(|alm\.? ?brand|topdanmark|codan|\bgf\b|if skadeforsikring/i, null],
  ['el', '💡', 'El, vand og varme', /el, vand|vand og varme|forsyning|andel energi|\(el\)|fjernvarme|varmeværk|vandværk/i, null],
  ['laan', '🏠', 'Lån (Totalkredit, bil)', /lån|totalkredit|bilån|auto finans/i, null]
];
function kontoValg() {
  if (D.budget.fraKonto && typeof D.budget.fraKonto === 'object') return D.budget.fraKonto;
  let ejer = false; try { ejer = erEjer() } catch (e) {}
  return ejer ? {ferie: 1, forsikr: 1, el: 1, laan: 1} : {}; // v68: lån betales også fra budgetkontoen
}
function kontoGruppe(x) {
  const t = String((x && x.tekst) || '');
  if (/^opsparing/i.test(t)) return null;
  const g = KONTO_GRP.find(([k, , , rx, ikke]) => rx.test(t) && !(ikke && ikke.test(t)));
  return g ? g[0] : null;
}
function fraKonto(x) { const g = kontoGruppe(x); return !!(g && kontoValg()[g]); }
function kontoSkift(k) { const v = {...kontoValg()}; if (v[k]) delete v[k]; else v[k] = 1; D.budget.fraKonto = v; save(); vis(); }
function kontoKort(md) {
  const alle = D.budget.udgifter.filter(x => kontoGruppe(x));
  if (!alle.length) return '';
  const v = kontoValg(), iMd = D.budget.udgifter.filter(x => x.dato.slice(0, 7) === md && fraKonto(x)).reduce((s, x) => s + x.belob, 0);
  const brugte = KONTO_GRP.filter(([k]) => alle.some(x => kontoGruppe(x) === k));
  return `<div class="card"><b>🏦 Betales fra budgetkonto eller feriekonto</b>
  <p class="muted" style="margin:6px 0 8px">Det, der betales fra en budgetkonto eller feriekonto, tæller ikke med i »Tilbage« – ellers tæller det dobbelt. Tryk for at slå til og fra.</p>
  <div class="chips" style="flex-wrap:wrap;overflow:visible">${brugte.map(([k, ik, navn]) => `<button class="chip ${v[k] ? 'on' : ''}" onclick="kontoSkift('${k}')">${v[k] ? '✓ ' : ''}${ik} ${navn}</button>`).join('')}</div>
  ${iMd ? `<div class="muted" style="margin-top:8px">Denne måned betalt fra kontoen: <b>${kr(Math.round(iMd))}</b> (tæller ikke med i »Tilbage«)</div>` : ''}</div>`;
}

// ---------- Version 79: 📤 Send budget til banken ----------
// Laver en pæn oversigt (PDF via »Udskriv/Gem som PDF«) eller en CSV-fil, som du selv deler med banken
// (fx i bankens sikre post eller på mail). Intet sendes af appen selv – det sker først, når du deler det.
let sendAar = null, sendMd = null; // sendMd: null = hele året, ellers liste af måneder (1–12)
const MDK = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
function sendSkift(m) { if (m === 0) { sendMd = null } else { const s = new Set(sendMd || []); if (s.has(m)) s.delete(m); else s.add(m); sendMd = s.size && s.size < 12 ? [...s].sort((a, b) => a - b) : null } vis() }
function sendKort() {
  const aar = sendAar || new Date().getFullYear();
  return `<div class="card"><b>📤 Send budget til banken</b>
  <p class="muted" style="margin:6px 0 8px">Lav en pæn oversigt over dit budget for de måneder, du vælger, eller et helt år: penge ind, faste udgifter, køb, opsparing og hvad der er tilbage pr. måned. Du sender den selv – fx i bankens sikre post (mobilbank/netbank) eller på mail. Appen sender ikke noget.</p>
  <div class="row" style="margin-bottom:8px"><button class="l" onclick="sendAar=${aar - 1};vis()">‹ ${aar - 1}</button><b style="flex:1;text-align:center">${aar}</b><button class="l" onclick="sendAar=${aar + 1};vis()">${aar + 1} ›</button></div>
  <div class="muted" style="font-size:13px;margin:4px 0">Vælg måneder – én, flere eller hele året:</div>
  <div class="chips" style="flex-wrap:wrap;overflow:visible;margin-bottom:8px"><button class="chip ${sendMd ? '' : 'on'}" onclick="sendSkift(0)">📅 Hele året</button>${MDK.map((n, i) => `<button class="chip ${sendMd && sendMd.includes(i + 1) ? 'on' : ''}" onclick="sendSkift(${i + 1})">${n}</button>`).join('')}</div>
  <div class="row"><button class="b" style="flex:1" onclick="sendPdf(${aar})">📄 Lav PDF</button><button class="b" style="flex:1" onclick="sendCsv(${aar})">📊 Del som regneark (CSV)</button></div>
  <p class="muted" style="font-size:13px;margin:8px 0 0">PDF: Når udskriv-vinduet kommer på iPhone, så tryk »Del« øverst og gem eller send PDF'en. På PC: vælg »Gem som PDF«.</p></div>`;
}
function sendData(aar) {
  const md = Array.from({length: 12}, (_, i) => i).filter(i => !sendMd || sendMd.includes(i + 1)).map(i => { const m = aar + '-' + String(i + 1).padStart(2, '0'), b = budgetTal(m); return {m, b, har: b.ind > 0 || b.kob > 0 || b.sparet !== 0} });
  const med = md.filter(x => x.har), sum = k => med.reduce((s, x) => s + x.b[k], 0);
  return {md, med, ind: sum('ind'), faste: sum('faste'), kob: sum('kob'), sparet: sum('sparet'), tilbage: sum('tilbage')};
}
function sendPdf(aar) {
  const d = sendData(aar), k = n => kr(Math.round(n)), mn = m => new Date(m + '-01').toLocaleDateString('da-DK', {month: 'long'});
  const n = d.med.length || 1, konto = (typeof kontoValg === 'function') ? Object.keys(kontoValg()) : [];
  const html = `<!doctype html><html lang="da"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Budget ${aar}${sendMd ? ' – ' + sendMd.map(m => MDK[m - 1]).join(', ') : ''}</title>
<style>body{font:14px/1.45 system-ui,-apple-system,Segoe UI,sans-serif;color:#111;margin:24px;max-width:820px}h1{font-size:24px;margin:0 0 4px}h2{font-size:17px;margin:22px 0 6px;border-bottom:2px solid #333;padding-bottom:3px}table{width:100%;border-collapse:collapse}td,th{padding:5px 6px;border-bottom:1px solid #ddd;text-align:right}td:first-child,th:first-child{text-align:left}th{background:#f3f3f3}.m{color:#b91c1c}.p{color:#15803d}.lille{color:#555;font-size:12px}tr.sum td{font-weight:700;border-top:2px solid #333}@media print{body{margin:10mm}button{display:none}}</style></head><body>
<button onclick="print()" style="float:right;padding:10px 16px;font-size:15px">🖨️ Udskriv / Gem som PDF</button>
<h1>Budget ${aar}${sendMd ? ' – ' + sendMd.map(m => MDK[m - 1]).join(', ') : ' – hele året'}</h1><div class="lille">Lavet ${new Date().toLocaleDateString('da-DK', {day: 'numeric', month: 'long', year: 'numeric'})} med appen Budget og Mad. Beløb i kr.</div>
<h2>Kort fortalt (gennemsnit pr. måned, ${d.med.length} måneder med tal)</h2>
<table><tr><td>Penge ind</td><td>${k(d.ind / n)}</td></tr><tr><td>Faste udgifter</td><td>${k(d.faste / n)}</td></tr><tr><td>Køb og andre udgifter</td><td>${k(d.kob / n)}</td></tr><tr><td>Opsparing</td><td>${k(d.sparet / n)}</td></tr><tr class="sum"><td>Tilbage</td><td class="${d.tilbage < 0 ? 'm' : 'p'}">${k(d.tilbage / n)}</td></tr></table>
<h2>Måned for måned</h2>
<table><tr><th>Måned</th><th>Ind</th><th>Faste</th><th>Køb</th><th>Opsparing</th><th>Tilbage</th></tr>
${d.md.map(x => x.har ? `<tr><td>${mn(x.m)}</td><td>${k(x.b.ind)}</td><td>${k(x.b.faste)}</td><td>${k(x.b.kob)}</td><td>${k(x.b.sparet)}</td><td class="${x.b.tilbage < 0 ? 'm' : 'p'}">${k(x.b.tilbage)}</td></tr>` : `<tr><td>${mn(x.m)}</td><td colspan="5" class="lille">ingen tal</td></tr>`).join('')}
<tr class="sum"><td>I alt</td><td>${k(d.ind)}</td><td>${k(d.faste)}</td><td>${k(d.kob)}</td><td>${k(d.sparet)}</td><td class="${d.tilbage < 0 ? 'm' : 'p'}">${k(d.tilbage)}</td></tr></table>
${D.budget.faste.length ? `<h2>Faste udgifter hver måned</h2><table>${[...D.budget.faste].sort((a, b) => b.belob - a.belob).map(x => `<tr><td>${esc(x.tekst)}${x.dag ? ` <span class="lille">(d. ${x.dag})</span>` : ''}</td><td>${k(x.belob)}</td></tr>`).join('')}</table>` : ''}
${D.budget.maal.length ? `<h2>Opsparing</h2><table><tr><th>Mål</th><th>Sparet</th><th>Mål i kr</th></tr>${D.budget.maal.map(g => `<tr><td>${esc(g.navn)}</td><td>${k(g.ind.reduce((a, x) => a + x.belob, 0))}</td><td>${k(g.maal)}</td></tr>`).join('')}</table>` : ''}
${konto.length ? `<p class="lille">Betales fra budgetkonto/feriekonto og tæller derfor ikke med i »Tilbage«: ${konto.map(x => ({ferie: 'ferie og rejser', forsikr: 'forsikringer', el: 'el, vand og varme', laan: 'lån'})[x] || x).join(', ')}.</p>` : ''}
</body></html>`;
  // Udskriv inde i appen (virker også i iPhone-appen): kun oversigten kommer med på papiret/PDF'en
  let u = document.getElementById('udskrift');
  if (!u) { u = document.createElement('div'); u.id = 'udskrift'; document.body.appendChild(u); const st = document.createElement('style'); st.textContent = '#udskrift{display:none}@media print{body.udskriv>*:not(#udskrift){display:none!important}body.udskriv #udskrift{display:block!important}body.udskriv{background:#fff!important;zoom:1!important}}'; document.head.appendChild(st); }
  const krop = html.slice(html.indexOf('<style>'), html.indexOf('</style>') + 8).replace(/body\{/g, '#udskrift{').replace(/@media print\{#udskrift\{margin:10mm\}/, '@media print{#udskrift{margin:0}') + html.slice(html.indexOf('<h1>'), html.lastIndexOf('</body>'));
  u.innerHTML = krop;
  document.body.classList.add('udskriv');
  const slut = () => { document.body.classList.remove('udskriv'); window.removeEventListener('afterprint', slut) };
  window.addEventListener('afterprint', slut); setTimeout(() => { window.print(); setTimeout(slut, 1500) }, 100);
}
function sendCsv(aar) {
  const d = sendData(aar), f2 = n => String(Math.round(n * 100) / 100).replace('.', ',');
  const r = [['Måned', 'Ind', 'Faste udgifter', 'Køb', 'Opsparing', 'Tilbage']];
  d.md.forEach(x => r.push([x.m, f2(x.b.ind), f2(x.har ? x.b.faste : 0), f2(x.b.kob), f2(x.b.sparet), x.har ? f2(x.b.tilbage) : '']));
  r.push(['I alt', f2(d.ind), f2(d.faste), f2(d.kob), f2(d.sparet), f2(d.tilbage)], [], ['Faste udgifter', 'Beløb pr. måned']);
  D.budget.faste.forEach(x => r.push(['"' + String(x.tekst).replace(/"/g, '""') + '"', f2(x.belob)]));
  const tekst = '﻿' + r.map(x => x.join(';')).join('\r\n'), navn = 'Budget-' + aar + (sendMd ? '-' + sendMd.map(m => MDK[m - 1]).join('-') : '') + '.csv';
  const f = new File([tekst], navn, {type: 'text/csv'});
  if (navigator.canShare && navigator.canShare({files: [f]})) navigator.share({files: [f], title: 'Budget ' + aar}).catch(() => {});
  else { const a = document.createElement('a'); a.href = URL.createObjectURL(f); a.download = navn; a.click(); toast('Filen »' + navn + '« er gemt') }
}

// ---------- Version 80: 💡 Forslag til et budget ----------
// Kilde: 50/30/20-reglen (Elizabeth Warren, »All Your Worth«, 2005 – se Britannica »What is the 50/30/20 rule?«)
// og Forbrugerrådet Tænk om rådighedsbeløb (ca. 7.250 kr for enlige, ca. 12.250 kr for samlevende pr. måned).
function forslagKort() {
  const nu = iso(new Date()).slice(0, 7), b = budgetTal(nu);
  const egen = D.budget.forslagInd;
  const ind = egen > 0 ? egen : b.ind;
  const del = p => Math.round(ind * p / 100);
  const linje = (ik, navn, pct, tekst) => `<li style="display:block;padding:8px 0"><div class="row" style="justify-content:space-between"><b>${ik} ${navn}</b><b>${ind ? kr(del(pct)) : pct + ' %'}</b></div><div class="muted" style="font-size:13px">${pct} % · ${tekst}</div></li>`;
  return `<div class="card"><b>💡 Forslag til et budget</b>
  <div style="background:var(--acc2);border-radius:12px;padding:10px 12px;margin-top:8px"><b>FORSLAG – ikke dit eget budget.</b> En kendt og enkel tommelfingerregel for et sundt budget: del pengene, du får ind efter skat, i tre dele.</div>
  <div class="row" style="margin-top:10px;justify-content:space-between"><span>💵 Penge ind efter skat pr. måned</span><input type="text" inputmode="decimal" id="forslagind" value="${ind ? String(Math.round(ind)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}" placeholder="kr" style="width:130px" onchange="const v=tal('forslagind');D.budget.forslagInd=v>0?v:null;save();vis()"></div>
  ${!egen && b.ind ? '<div class="muted" style="font-size:12px">Taget fra »Penge ind« i denne måned. Du kan skrive et andet tal.</div>' : ''}
  <ul class="list" style="margin-top:6px">
   ${linje('🏠', 'Det nødvendige', 50, 'husleje, el og varme, mad, transport, forsikringer, mobil og lån')}
   ${linje('🎉', 'Det, du har lyst til', 30, 'café, tøj, fritid, ferie, streaming og gaver')}
   ${linje('🐷', 'Opsparing og afdrag', 20, 'buffer til uventede ting, opsparing og ekstra afdrag på gæld')}
  </ul>
  ${ind && b.ind ? `<div style="margin-top:8px;padding:10px;border:2px solid var(--acc);border-radius:12px">I denne måned har du <b>${kr(Math.round(b.tilbage))}</b> tilbage. Forslaget er at lægge ca. <b>${kr(del(20))}</b> til side.</div>` : ''}
  <p class="muted" style="font-size:13px;margin:8px 0 0">Er det nødvendige mere end halvdelen, så passer reglen ikke helt – det er helt normalt. Så kan du starte med en mindre opsparing. Banker regner med, at én voksen mindst skal have ca. 7.250 kr og to voksne ca. 12.250 kr om måneden at leve for, når de faste regninger er betalt.</p>
  <p class="muted" style="font-size:12px;margin:6px 0 0">Kilder: 50/30/20-reglen (Elizabeth Warren) og Forbrugerrådet Tænk.</p></div>`;
}

// ---------- Version 78: Budget – det vigtigste først, resten kan foldes ud ----------
// Øverst: måned, »Tilbage« med ind/faste/køb og »⚡ Hurtigt«. Alt andet ligger i bokse, man trykker på for at åbne.
// Intet er fjernet – det er kun foldet sammen. Appen husker, hvad du har åbnet.
function budgetFold(html) {
  try {
    const tpl = document.createElement('template'); tpl.innerHTML = html;
    let ud = document.createElement('div'), noder = [...tpl.content.childNodes].filter(n => n.nodeType === 1);
    // version 85: gode råd og forslag har deres egen side (åbnes med en knap) – intet er slettet
    const erRaad = n => n.classList.contains('godraad') || /^💡 (Forslag til et budget|Vis tips)/.test(((n.querySelector('b,button') || {}).textContent || '').trim());
    const raad = noder.filter(erRaad);
    window._raadHtml = raad.map(n => { const c = n.cloneNode(true); if (c.tagName === 'DETAILS') c.open = true; return c.outerHTML }).join('');
    noder = noder.filter(n => !erRaad(n));
    const aabne = (D.budget.aabne = D.budget.aabne && typeof D.budget.aabne === 'object' ? D.budget.aabne : {});
    const forsteKort = noder.find(n => n.classList.contains('card'));
    const vigtig = n => n.classList.contains('row') || n === forsteKort || /Hurtigt:/.test((n.querySelector('b') || {}).textContent || '');
    const titel = n => { const b = n.querySelector('b,h2,h3'); return ((b && b.textContent) || n.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60) };
    const pak = (navn, emne, indhold) => {
      const k = navn.replace(/[^a-zæøå0-9]/gi, '').slice(0, 30).toLowerCase() || 'boks';
      const d = document.createElement('details'); d.className = 'card bfold' + (/Penge ind/.test(navn) ? ' bf-ind' : /Bank-budget|Køb/.test(navn) ? ' bf-ud' : ''); if (aabne[k]) d.open = true;
      d.setAttribute('ontoggle', `D.budget.aabne=D.budget.aabne||{};if(this.open)D.budget.aabne['${k}']=1;else delete D.budget.aabne['${k}'];save()`);
      const s = document.createElement('summary'); s.innerHTML = `<b>${esc(navn)}</b>${emne ? ` <span class="muted" style="font-weight:400">${esc(emne)}</span>` : ''}`; d.append(s);
      indhold.forEach(x => { if (x.classList && x.classList.contains('card')) x.classList.add('bfold-ind'); d.append(x) });
      return d;
    };
    const top = document.createElement('div');
    // version 86: ind med grønt, udgifter med rødt – og større tal
    if (forsteKort) forsteKort.querySelectorAll('span').forEach(s => { const x = s.textContent; if (/^💵 Ind:/.test(x)) s.classList.add('bfarve', 'bfarve-ind'); else if (/^(🏠 Faste|🛒 Køb):/.test(x)) s.classList.add('bfarve', 'bfarve-ud'); });
    let i = 0;
    while (i < noder.length) {
      const n = noder[i];
      if (vigtig(n)) { top.append(n); if (n === forsteKort && typeof cirkelKort === 'function') { const c = cirkelKort(budgetMd); if (c) { const tt = document.createElement('template'); tt.innerHTML = c; top.append(tt.content); } } i++; continue }
      if (n.tagName === 'H2') { // »🛒 Køb« og alt herunder samles i én boks
        const rest = noder.slice(i + 1); ud.append(pak(n.textContent.trim(), '– det du har købt', rest)); break;
      }
      if (n.tagName === 'DETAILS') { ud.append(n); i++; continue } // kan allerede foldes
      if (n.classList.contains('card') && n.firstElementChild && n.firstElementChild.tagName === 'DETAILS' && n.children.length === 1) { ud.append(n); i++; continue } // kan allerede foldes
      if (n.classList.contains('card')) { ud.append(pak(titel(n), '', [n])); i++; continue }
      ud.append(n); i++;
    }
    const raadKnap = window._raadHtml ? `<button class="b" style="width:100%;margin:0 0 12px;padding:14px;font-size:18px" onclick="raadSide()">💡 Gode råd og forslag til et budget</button>` : '';
    setTimeout(() => { try { if (typeof dlg !== 'undefined' && dlg.open && dlg.dataset.raad) dlgin.innerHTML = raadIndhold() } catch (e) {} }, 0);
    return top.innerHTML + raadKnap + ud.innerHTML; // det vigtigste (måned, Tilbage, Hurtigt) står øverst
  } catch (e) { return html }
}
(function () {
  const st = document.createElement('style');
  st.textContent = '.bfarve{background:#fff!important;color:#333!important;border-radius:999px;padding:6px 14px!important;font-size:16px;display:inline-block;margin:3px 0}.bfarve b{font-size:21px;font-weight:900}.bfarve-ind b{color:#15803d}.bfarve-ud b{color:#dc2626}.bf-ind ul.list b{color:#15803d;font-size:17px}.bf-ud ul.list b{color:#dc2626;font-size:17px}.bfold-ind>b:first-child{display:none}details.card.bfold{padding:0!important;margin-bottom:10px}.bfold>summary{cursor:pointer;padding:12px 16px;list-style:none;font-size:17px}.bfold>summary::-webkit-details-marker{display:none}.bfold>summary::after{content:"▾";float:right;opacity:.5}.bfold[open]>summary::after{content:"▴"}.bfold-ind{box-shadow:none!important;margin:0!important;border-radius:0 0 18px 18px!important;border:0!important}.bfold>:not(summary){margin-left:0;margin-right:0}';
  document.head.appendChild(st);
  const virk = () => { try { if (typeof SIDER === 'object' && SIDER.budget && !SIDER.budget._fold) { const o = SIDER.budget; SIDER.budget = function () { let h = o.apply(this, arguments); const ekstra = (typeof forslagKort === 'function' ? forslagKort() : '') + (typeof sendKort === 'function' ? sendKort() : ''); const mk = h.match(/<h2[^>]*>\s*🛒 Køb\s*<\/h2>/), k = mk ? mk.index : -1; h = k >= 0 ? h.slice(0, k) + ekstra + h.slice(k) : h + ekstra; return budgetFold(h) }; SIDER.budget._fold = 1; if (typeof huskeLaegInd === 'function' && !huskeLaegInd._f) { const oh = huskeLaegInd; window.huskeLaegInd = function (h, tx) { const e = document.getElementById(h === 'ind' ? 'ibelob' : 'fbelob'), dd = e && e.closest('details.bfold'); if (dd) dd.open = true; return oh(h, tx) }; window.huskeLaegInd._f = 1 } return true } } catch (e) {} return false };
  if (!virk()) { document.addEventListener('DOMContentLoaded', virk); setTimeout(virk, 0) }
})();

// ---------- Version 85: 💡 Gode råd – side for sig selv ----------
function raadIndhold() {
  return `<h2>💡 Gode råd og forslag</h2><p class="muted" style="margin:-6px 0 10px">Råd og et forslag til et sundt budget – samlet ét sted.</p>${typeof hjaelperKort === 'function' ? hjaelperKort() : ''}${typeof spareKort === 'function' ? spareKort() : ''}<div class="card"><b>🍳 Mad derhjemme er billigst</b><p style="margin:6px 0 0">Fastfood og færdigretter er nemme, men hver dag bliver det hurtigt dyrt – ofte flere tusinde kroner om måneden. En hjemmelavet aftensmad fra appen koster ca. 45 kr for to. Et godt råd er at lave mad derhjemme de fleste dage og gemme take-away til en hyggeaften. Laver man dobbelt portion, er der mad til næste dag eller til fryseren.</p></div>${window._raadHtml || '<p class="muted">Ingen råd lige nu.</p>'}
  <button class="l" style="width:100%;margin-top:12px" onclick="raadLuk()">Luk</button>`;
}
function raadSide() { dlgin.innerHTML = raadIndhold(); dlg.dataset.raad = '1'; dlg.addEventListener('close', raadLuk, {once: true}); if (!dlg.open) dlg.showModal(); }
function raadLuk() { delete dlg.dataset.raad; if (dlg.open) dlg.close(); }

// ---------- Version 87: 🤝 Hjælp til økonomien (kun hvis man slår den til) ----------
// Kigger kun på dine egne tal i appen – på din telefon. Intet sendes nogen steder hen.
function hjaelperKort() {
  const til = !!D.budget.hjaelper;
  if (!til) return `<div class="card"><b>🤝 Hjælp til økonomien</b>
   <p class="muted" style="margin:6px 0 8px">Vil du have hjælp? Så kigger appen på dine egne tal og giver dig råd om, hvor du kan spare. Det sker kun på din telefon.</p>
   <button class="b" style="width:100%" onclick="D.budget.hjaelper=true;save();vis()">✅ Ja tak, slå hjælpen til</button></div>`;
  const r = hjaelperRaad();
  return `<div class="card"><b>🤝 Hjælp til økonomien</b> <span class="muted">– ud fra dine egne tal</span>
   ${r.length ? `<ul style="margin:8px 0 0;padding-left:20px">${r.map(x => `<li style="margin:7px 0">${x}</li>`).join('')}</ul>` : '<p class="muted" style="margin:8px 0 0">Skriv lidt flere tal ind (penge ind, faste udgifter og køb), så kan appen give dig råd.</p>'}
   <button class="l" style="width:100%;margin-top:10px;font-size:14px" onclick="D.budget.hjaelper=false;save();vis()">Slå hjælpen fra</button></div>`;
}
function hjaelperRaad() {
  const r = [], nu = new Date(), md = i => { const d = new Date(nu.getFullYear(), nu.getMonth() - i, 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') };
  const k = n => kr(Math.round(n));
  const denne = budgetTal(md(0));
  const tidl = [1, 2, 3].map(md).map(m => ({m, b: budgetTal(m)})).filter(x => x.b.ind > 0 || x.b.kob > 0);
  // 1) Køb denne måned i forhold til de sidste måneder
  if (tidl.length) {
    const snit = tidl.reduce((s, x) => s + x.b.kob, 0) / tidl.length;
    if (snit > 0 && denne.kob > snit * 1.15) r.push(`Du har brugt <b>${k(denne.kob - snit)}</b> mere på køb i denne måned end du plejer (ca. ${k(snit)} om måneden).`);
    else if (snit > 0 && denne.kob < snit * 0.85) r.push(`Flot! Du har brugt <b>${k(snit - denne.kob)}</b> mindre på køb end du plejer. 🎉`);
  }
  // 2) De største poster blandt køb de sidste 3 måneder (samme tekst)
  const fra = md(2) + '-01', grp = {};
  D.budget.udgifter.filter(x => x.dato >= fra && !/^opsparing/i.test(x.tekst || '') && !(typeof fraKonto === 'function' && fraKonto(x))).forEach(x => {
    const n = String(x.tekst || 'Køb').replace(/\s*\(.*?\)\s*/g, ' ').trim().toLowerCase(); (grp[n] = grp[n] || {navn: String(x.tekst || 'Køb').replace(/\s*\(.*?\)\s*/g, ' ').trim(), sum: 0, antal: 0}); grp[n].sum += x.belob; grp[n].antal++;
  });
  const top = Object.values(grp).sort((a, b) => b.sum - a.sum).slice(0, 3);
  if (top.length) r.push(`Mest penge de sidste 3 måneder: ${top.map(x => `<b>${esc(x.navn)}</b> ${k(x.sum)}`).join(', ')}. Kan du spare lidt på én af dem?`);
  // 3) Take-away, café og slik
  const ude = Object.values(grp).filter(x => /take|pizza|burger|café|cafe|kiosk|7-eleven|mcdonald|sushi|restaurant|slik|wolt|just eat|mad ude/i.test(x.navn));
  const udeSum = ude.reduce((s, x) => s + x.sum, 0);
  if (udeSum > 0) r.push(`Mad ude og take-away de sidste 3 måneder: <b>${k(udeSum)}</b>. Laver du mad fra appen, koster en aftensmad ca. 45 kr for to.`);
  // 3b) Fastfood og færdigretter den sidste måned – venligt og neutralt
  const fra30 = iso(new Date(Date.now() - 30 * 864e5));
  const ff = D.budget.udgifter.filter(x => x.dato >= fra30 && /take|pizza|burger|mcdonald|max|sunset|kebab|shawarma|sushi|wolt|just eat|grill|pølse|færdigret|færdig ret|mikroovn|frostpizza|frossen|7-eleven|kiosk/i.test(x.tekst || ''));
  if (ff.length >= 4) {
    const s = ff.reduce((a, x) => a + x.belob, 0), pr = s / ff.length, hjemme = 45, spar = Math.max(0, Math.round((pr - hjemme) * Math.ceil(ff.length / 2)));
    r.push(`Den sidste måned er der købt fastfood eller færdigretter <b>${ff.length} gange</b> for i alt <b>${k(s)}</b> – ca. ${k(pr)} pr. gang. En hjemmelavet ret fra appen koster ca. ${hjemme} kr for to. Laves halvdelen af gangene derhjemme, kan der spares ca. <b>${k(spar)}</b> om måneden.`);
  }
  // 4) Abonnementer i faste udgifter
  const abo = D.budget.faste.filter(x => /netflix|hbo|max|viaplay|disney|spotify|tv ?2|youtube|apple|prime|fitness|abonnement|mofibo|podimo|storytel/i.test(x.tekst || ''));
  if (abo.length >= 2) r.push(`Du har <b>${abo.length} abonnementer</b> for i alt <b>${k(abo.reduce((s, x) => s + x.belob, 0))}</b> om måneden (${abo.map(x => esc(x.tekst)).join(', ')}). Kan nogle sættes på pause?`);
  // 5) Faste udgifter i forhold til penge ind (50/30/20)
  if (denne.ind > 0 && denne.faste > denne.ind / 2) r.push(`Dine faste udgifter er <b>${Math.round(denne.faste / denne.ind * 100)} %</b> af det, du får ind. Et sundt budget bruger ca. halvdelen på det nødvendige.`);
  // 6) Opsparing
  if (denne.ind > 0) {
    const ops = denne.sparet + D.budget.udgifter.filter(x => x.dato.slice(0, 7) === md(0) && /^opsparing/i.test(x.tekst || '')).reduce((s, x) => s + x.belob, 0);
    if (ops < denne.ind * 0.1 && denne.tilbage > 500) r.push(`Du har <b>${k(denne.tilbage)}</b> tilbage i denne måned. Læg fx <b>${k(Math.min(denne.tilbage / 2, denne.ind * 0.2))}</b> til side under »🐷 Opsparing«.`);
  }
  if (denne.ind > 0 && denne.tilbage < 0) r.push(`Du er <b>${k(-denne.tilbage)}</b> i minus i denne måned. Kig på dine køb, og vent med det, der kan vente til næste løn.`);
  return r;
}

// ---------- 🥧 Hvad går pengene til? (cirkeldiagram øverst i Budget) ----------
// Regnes kun ud fra dine egne tal på telefonen.
const CIRKEL_GRP = [
  ['bolig', '🏠', 'Bolig og regninger', '#3b82f6', /husleje|leje|el\b|el,|vand|varme|forsyning|energi|internet|bredbånd|tv|forsikr|tryg|ejendomsskat|grundejer/i],
  ['mad', '🛒', 'Mad og dagligvarer', '#22c55e', /netto|rema|lidl|føtex|bilka|coop|kvickly|superbrugsen|meny|spar\b|aldi|365|lovable|dagligvare|mad og|indkøb/i],
  ['ude', '🍕', 'Mad ude og take-away', '#fb923c', /take|pizza|burger|café|cafe|kiosk|7-eleven|mcdonald|sushi|restaurant|wolt|just eat|mad ude|slik/i],
  ['transport', '🚗', 'Transport og bil', '#a855f7', /bil|benzin|diesel|ok\b|ok og|clever|oplad|bus|tog|dsb|rejsekort|brobizz|parkering|værksted|lån \(totalkredit og bil\)|auto/i],
  ['laan', '🏦', 'Lån og afdrag', '#14b8a6', /lån|afdrag|totalkredit|kredit/i],
  ['abo', '📱', 'Mobil og abonnementer', '#ec4899', /mobil|telefon|netflix|hbo|max|viaplay|disney|spotify|youtube|apple|prime|abonnement|fitness/i],
  ['fritid', '🎉', 'Fritid, tøj og gaver', '#facc15', /fritid|gave|tøj|sko|ferie|rejse|biograf|koncert|hobby|frisør|personlig/i],
  ['ops', '🐷', 'Opsparing', '#06b6d4', /^opsparing/i]
];
function cirkelData(md) {
  const sum = {};
  const læg = (tekst, belob) => { const g = CIRKEL_GRP.find(x => x[4].test(tekst || '')); const k = g ? g[0] : 'andet'; sum[k] = (sum[k] || 0) + belob; };
  D.budget.faste.forEach(x => læg(x.tekst, x.belob));
  D.budget.udgifter.filter(x => x.dato.slice(0, 7) === md).forEach(x => læg(x.tekst, x.belob));
  const sp = sparetI(md); if (sp > 0) sum.ops = (sum.ops || 0) + sp;
  const alle = [...CIRKEL_GRP.map(([k, ik, navn, farve]) => ({k, ik, navn, farve, v: sum[k] || 0})), {k: 'andet', ik: '📦', navn: 'Andet', farve: '#cbd5e1', v: sum.andet || 0}];
  return alle.filter(x => x.v > 0).sort((a, b) => b.v - a.v);
}
function cirkelKort(md) {
  const data = cirkelData(md), total = data.reduce((s, x) => s + x.v, 0);
  if (!total) return '';
  const R = 70, C = 2 * Math.PI * R; let pos = 0;
  const buer = data.map(x => { const l = x.v / total * C; const s = `<circle r="${R}" cx="100" cy="100" fill="none" stroke="${x.farve}" stroke-width="38" stroke-dasharray="${l.toFixed(2)} ${(C - l).toFixed(2)}" stroke-dashoffset="${(-pos).toFixed(2)}" transform="rotate(-90 100 100)"><title>${esc(x.navn)}: ${kr(Math.round(x.v))}</title></circle>`; pos += l; return s; }).join('');
  const navn = new Date(md + '-01').toLocaleDateString('da-DK', {month: 'long'});
  return `<div class="card"><b>🥧 Hvad går pengene til i ${navn}?</b>
  <div style="display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin-top:8px">
   <svg viewBox="0 0 200 200" width="170" height="170" style="flex:none;margin:0 auto" role="img" aria-label="Cirkeldiagram over udgifter"><defs>${data.map(x => `<linearGradient id="cg-${x.k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".18" stop-color="${x.farve}"/><stop offset="1" stop-color="${x.farve}" stop-opacity=".9"/></linearGradient>`).join('')}<radialGradient id="cglans" cx=".35" cy=".25" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".5" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><filter id="cskygge" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity=".25"/></filter></defs><g filter="url(#cskygge)">${buer}</g><circle r="89" cx="100" cy="100" fill="url(#cglans)" pointer-events="none"/><circle r="51" cx="100" cy="100" fill="#fff"/><text x="100" y="96" text-anchor="middle" font-size="13" fill="currentColor" opacity=".7">I alt</text><text x="100" y="116" text-anchor="middle" font-size="17" font-weight="800" fill="#dc2626">${kr(Math.round(total))}</text></svg>
   <ul style="list-style:none;margin:0;padding:0;flex:1;min-width:170px">${data.map(x => `<li style="display:flex;align-items:center;gap:8px;margin:5px 0"><span style="width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0,${x.farve} 45%);box-shadow:0 1px 3px #0003;flex:none"></span><span style="flex:1">${x.ik} ${esc(x.navn)}</span><span style="text-align:right;white-space:nowrap"><b>${Math.round(x.v / total * 100)} %</b><br><span class="muted" style="font-size:13px">${kr(Math.round(x.v))}</span></span></li>`).join('')}</ul>
  </div><p class="muted" style="font-size:12px;margin:6px 0 0">Faste udgifter, køb og opsparing i måneden. Appen gætter gruppen ud fra navnet.</p></div>`;
}

// ---------- 💰 Sådan kan I spare (råd-siden) ----------
// Tallene er regnet ud fra jeres egne tal (gennemsnit for de sidste måneder med tal). »Fx 10 %« er kun et regneeksempel.
function spareKort() {
  const nu = new Date(), md = i => { const d = new Date(nu.getFullYear(), nu.getMonth() - i, 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') };
  const mdr = [0, 1, 2].map(md), snit = {};
  mdr.forEach(m => cirkelData(m).forEach(x => { snit[x.k] = (snit[x.k] || 0) + x.v / mdr.length }));
  const k = n => kr(Math.round(n / 10) * 10), r = [];
  const abo = D.budget.faste.filter(x => /netflix|hbo|max|viaplay|disney|spotify|tv ?2|youtube|apple|prime|abonnement|mofibo|podimo|storytel|fitness/i.test(x.tekst || ''));
  if (abo.length) { const dyr = [...abo].sort((a, b) => b.belob - a.belob)[0]; r.push(['📺', 'Abonnementer', `Sættes <b>${esc(dyr.tekst)}</b> på pause i 3 måneder, spares der <b>${k(dyr.belob * 3)}</b>. Mange streamingtjenester kan slås til og fra en måned ad gangen.`]); }
  if (snit.mad) r.push(['🛒', 'Indkøb', `I bruger ca. <b>${k(snit.mad)}</b> om måneden på mad og dagligvarer. Handler I efter en madplan og en indkøbsliste, og bruger fx 10 % mindre, er det ca. <b>${k(snit.mad * 0.1)}</b> om måneden – <b>${k(snit.mad * 1.2)}</b> om året.`]);
  if (snit.ude) r.push(['🍕', 'Mad ude', `Mad ude og take-away koster ca. <b>${k(snit.ude)}</b> om måneden. Halveres det, spares der ca. <b>${k(snit.ude / 2)}</b> om måneden.`]);
  if (snit.transport) r.push(['🚗', 'Transport', `Transport og bil koster ca. <b>${k(snit.transport)}</b> om måneden. Cykles der eller samkøres nogle dage, og bruges fx 10 % mindre, er det ca. <b>${k(snit.transport * 0.1)}</b> om måneden.`]);
  const erEl = x => /el|el,|strøm|energi|varme|vand|forsyning/i.test(x.tekst || '');
  const s = D.budget.faste.filter(erEl).reduce((a, x) => a + x.belob, 0) + D.budget.udgifter.filter(x => mdr.includes(x.dato.slice(0, 7)) && erEl(x)).reduce((a, x) => a + x.belob, 0) / mdr.length;
  if (s > 0) { r.push(['💡', 'El, vand og varme', `I bruger ca. <b>${k(s)}</b> om måneden. Sluk standby, tag kortere bade og skru 1 grad ned – sparer I fx 10 %, er det ca. <b>${k(s * 0.1)}</b> om måneden.`]); }
  if (snit.fritid) r.push(['🎉', 'Fritid, tøj og gaver', `Det koster ca. <b>${k(snit.fritid)}</b> om måneden. Køb brugt, lån af hinanden og vent en uge med ting, I gerne vil have – så er det tit ikke så vigtigt alligevel.`]);
  r.push(['🏷️', 'Tilbud', 'Kig på tilbud, før I handler. Under »🛒 Indkøb« er der et »🔎 tilbud«-link ved hver vare.']);
  return `<div class="card"><b>💰 Sådan kan I spare</b> <span class="muted">– ud fra jeres egne tal</span>
  <ul class="list" style="margin-top:6px">${r.map(([ik, t, x]) => `<li style="display:block;padding:9px 0"><b>${ik} ${t}</b><div style="margin-top:3px">${x}</div></li>`).join('')}</ul>
  <p class="muted" style="font-size:12px;margin:6px 0 0">Beløbene er ca. og regnet ud fra jeres tal de sidste 3 måneder. »Fx 10 %« er kun et regneeksempel.</p></div>`;
}
