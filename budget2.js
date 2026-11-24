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
  <p class="muted" style="margin:6px 0 8px">I Mit Smart Hjem PRO: tryk »Gem alt i én fil« og gem filen i Filer. Vælg filen her. Den læses kun på denne telefon – intet sendes nogen steder hen. Du ser tallene, før de bliver gemt.</p>
  <label class="b" style="font:inherit;display:block;text-align:center;cursor:pointer;margin:0;color:#fff;background:var(--acc);border-radius:10px;padding:10px 16px">📂 Vælg filen<input type="file" accept=".json,application/json" hidden onchange="mshLaes(this)"></label>
  ${msh ? mshVis() : ''}</div>`;
}
function mshTal(v) { const n = parseFloat(String(v ?? '').replace(/\s/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.')); return isFinite(n) ? n : 0 }
function mshLaes(inp) {
  const f = inp.files && inp.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const fil = JSON.parse(r.result);
      if (!fil || fil.app !== 'Mit Smart Hjem PRO' || !fil.ls) throw new Error('forkert fil');
      const fam = JSON.parse(fil.ls['privat-budget-familie-v2'] || '[]') || [];
      const md = iso(new Date()).slice(0, 7), dag = d => { const n = parseInt(String(d || '').slice(8, 10)); return n >= 1 && n <= 31 ? n : null };
      const poster = [];
      (Array.isArray(fam[0]) ? fam[0] : []).forEach(r => {
        if (!Array.isArray(r)) return;
        const navn = String(r[0] || '').trim(), belob = mshTal(r[1]), type = r[3] || 'Udgift', gentag = r[4] || 'En gang';
        if (!navn || !(belob > 0)) return;
        const deler = gentag === 'Hvert kvartal' ? 3 : gentag === 'Hvert år' ? 12 : 1;
        const tekst = navn + (deler > 1 ? (deler === 3 ? ' (kvartal, delt pr. md.)' : ' (år, delt pr. md.)') : '');
        const b = Math.round(belob / deler * 100) / 100;
        if (/^indt/i.test(type)) poster.push({hvor: 'ind', tekst, belob: b, dato: gentag === 'En gang' ? (r[2] || iso(new Date())) : md + '-' + String(dag(r[2]) || 1).padStart(2, '0')});
        else if (gentag === 'En gang') poster.push({hvor: 'kob', tekst: navn, belob, dato: r[2] || iso(new Date())});
        else poster.push({hvor: 'fast', tekst: (/^opspar/i.test(type) ? 'Opsparing: ' : '') + tekst, belob: b, dag: dag(r[2])});
      });
      (Array.isArray(fam[2]) ? fam[2] : []).forEach(g => {
        if (!Array.isArray(g)) return;
        const navn = String(g[0] || '').trim(), maal = mshTal(g[1]), har = mshTal(g[2]);
        if (!navn || !(maal > 0) || /^Eksempel:/i.test(navn)) return;
        poster.push({hvor: 'maal', tekst: navn, belob: maal, har});
      });
      poster.forEach(p => p.findes = mshFindes(p));
      poster.forEach(p => p.valgt = !p.findes);
      msh = {poster, navn: f.name};
      vis(); toast(poster.length ? poster.length + ' poster fundet – se dem igennem' : 'Der var ingen budgettal i filen');
    } catch (e) { alert('Det er ikke en fil fra Mit Smart Hjem PRO (»Gem alt i én fil«).') }
    inp.value = '';
  };
  r.readAsText(f);
}
function mshFindes(p) {
  const s = x => String(x || '').toLowerCase().trim();
  if (p.hvor === 'ind') return D.budget.ind.some(x => s(x.tekst) === s(p.tekst) && x.belob === p.belob && x.dato.slice(0, 7) === p.dato.slice(0, 7));
  if (p.hvor === 'fast') return D.budget.faste.some(x => s(x.tekst) === s(p.tekst) && x.belob === p.belob);
  if (p.hvor === 'kob') return D.budget.udgifter.some(x => s(x.tekst) === s(p.tekst) && x.belob === p.belob && x.dato === p.dato);
  return D.budget.maal.some(x => s(x.navn) === s(p.tekst));
}
function mshVis() {
  const navn = {ind: '💵 Penge ind', fast: '🏦 Faste udgifter (hver måned)', kob: '🛒 Køb (én gang)', maal: '🐷 Sparemål'};
  const valgt = msh.poster.filter(p => p.valgt).length;
  return `<div style="margin-top:12px"><b>Er det rigtigt?</b> <span class="muted">Fjern fluebenet ved det, du ikke vil have med.</span>
  ${['ind', 'fast', 'kob', 'maal'].map(h => { const l = msh.poster.map((p, i) => [p, i]).filter(([p]) => p.hvor === h); return l.length ? `<div style="margin-top:10px"><b style="font-size:14px">${navn[h]}</b>${l.map(([p, i]) => `<label class="row" style="margin:6px 0;gap:8px;cursor:pointer;font-weight:400"><input type="checkbox" ${p.valgt ? 'checked' : ''} onchange="msh.poster[${i}].valgt=this.checked;vis()" style="width:22px;height:22px;flex:none"><span style="flex:1">${esc(p.tekst)}${p.dag ? ` <span class="muted">d. ${p.dag}</span>` : ''}${p.findes ? ' <span class="muted">(har du allerede)</span>' : ''}</span><b>${kr(p.belob)}</b></label>`).join('')}</div>` : '' }).join('')}
  <div class="row" style="margin-top:12px"><button class="b" style="flex:1" onclick="mshGem()" ${valgt ? '' : 'disabled'}>✓ Læg ${valgt} ind i mit budget</button><button class="l" onclick="msh=null;vis()">Annullér</button></div></div>`;
}
function mshGem() {
  if (!msh) return;
  const s = snap(); let n = 0;
  msh.poster.filter(p => p.valgt).forEach(p => {
    n++;
    if (p.hvor === 'ind') D.budget.ind.push({id: id(), dato: p.dato, tekst: p.tekst, belob: p.belob});
    else if (p.hvor === 'fast') D.budget.faste.push({id: id(), tekst: p.tekst, belob: p.belob, dag: p.dag || null});
    else if (p.hvor === 'kob') D.budget.udgifter.push({id: id(), dato: p.dato, tekst: p.tekst, belob: p.belob});
    else D.budget.maal.push({id: id(), navn: p.tekst, emoji: maalEmoji(p.tekst), maal: p.belob, ind: p.har > 0 ? [{dato: '2000-01-01', belob: p.har}] : [] /* gammel dato, så det ikke trækkes fra »Tilbage« i denne måned */});
  });
  msh = null; save(); vis(); toast(n + ' poster lagt ind i dit budget', fortrydTil(s));
}

// ---------- 🏦 Hent fil fra banken (CSV) – version 59 ----------
// Filen læses kun på telefonen. Intet sendes nogen steder hen.
// Vejledninger fra bankernes egne hjælpesider (se kilder.txt).
let bankF = null; // forslag fra bankfilen, vises før noget gemmes
const BANK_GUIDE = [
  ['Danske Bank', 'I mobilbanken: Vælg konto → tryk på de 3 prikker øverst til højre → »Eksporter kontobevægelser« → vælg CSV og periode → »Eksporter«.'],
  ['Jyske Bank', 'I net- eller mobilbanken: Vælg kontoen → tryk på de 3 prikker øverst → »Print og eksporter« → vælg periode og filtype (CSV, hvis du kan vælge det) → »OK«.'],
  ['Nykredit', 'I netbanken på PC: »Konti og kort« → »Konti« → vælg konto → »Gem posteringer som fil« → vælg periode → eksportformat »CSV« → »Næste«.'],
  ['Andre banker', 'Kig efter »Eksporter«, »Gem som fil« eller »Udlæs til fil« ved kontoens bevægelser, og vælg CSV. Kan det ikke lade sig gøre i mobilbanken, så prøv netbanken på en PC.']
];
function bankKort() {
  return `<div class="card"><b>🏦 Hent fil fra banken</b> <span class="muted">– læg dine køb og penge ind på én gang</span>
  <p class="muted" style="margin:6px 0 8px">Hent en CSV-fil med dine kontobevægelser i din bank, og vælg den her. Filen bliver kun læst på din telefon – intet sendes nogen steder hen. Du ser det hele, før noget bliver gemt.</p>
  <details class="hjdel"><summary style="cursor:pointer"><b>📖 Sådan henter du filen i din bank</b></summary>
   ${BANK_GUIDE.map(([b, t]) => `<p style="margin:8px 0 0"><b>${b}:</b> ${t}</p>`).join('')}
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
      let iD, iT, iB;
      if (h >= 0) {
        const o = rk[h].map(c => c.toLowerCase());
        iD = o.findIndex(c => /^(bogf|dato|date|posteringsdato)/.test(c)); if (iD < 0) iD = o.findIndex(c => /dato|date/.test(c));
        iB = o.findIndex(c => /^(bel[øo]b|amount)/.test(c)); if (iB < 0) iB = o.findIndex(c => /bel[øo]b|amount/.test(c));
        iT = o.findIndex(c => /tekst|text|beskrivelse|navn|modtager|description/.test(c));
      } else {
        const p = rk[0]; iD = p.findIndex(c => bankDato(c)); iB = p.findIndex((c, i) => i !== iD && isFinite(bankBelob(c))); iT = p.findIndex((c, i) => i !== iD && i !== iB && /[a-zæøå]/i.test(c));
      }
      if (iD < 0 || iB < 0) throw new Error('kolonner');
      const poster = [];
      rk.slice(h + 1).forEach(x => {
        const dato = bankDato(x[iD]), b = bankBelob(x[iB]);
        if (!dato || !isFinite(b) || !b) return;
        const tx = (iT >= 0 ? x[iT] : '') || (b > 0 ? 'Penge ind' : 'Køb');
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
