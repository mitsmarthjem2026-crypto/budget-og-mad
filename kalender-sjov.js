// Budget og Mad – sjovere kalender (version 75): farver pr. slags aftale, danske helligdage,
// flot månedsbillede, tydelig »i dag«, små bevægelser og stryg for at skifte måned.
(function(){
if(typeof kalSide!=='function')return;

// ---------- Danske helligdage og mærkedage (rigtige datoer, beregnet hvert år) ----------
function paaske(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),md=Math.floor((h+l-7*m+114)/31),dag=((h+l-7*m+114)%31)+1;return new Date(y,md-1,dag)}
const _hCache={};
function helligdage(y){if(_hCache[y])return _hCache[y];const p=paaske(y),r={};
  const fra=(n,navn,hel)=>{const d=new Date(p);d.setDate(d.getDate()+n);r[iso(d)]={navn,hel}};
  const fast=(md,navn,hel)=>{r[y+'-'+md]={navn,hel}};
  fast('01-01','Nytårsdag',1);fra(-49,'Fastelavn',0);fra(-7,'Palmesøndag',0);fra(-3,'Skærtorsdag',1);fra(-2,'Langfredag',1);fra(0,'Påskedag',1);fra(1,'2. påskedag',1);
  fra(39,'Kristi himmelfartsdag',1);fra(49,'Pinsedag',1);fra(50,'2. pinsedag',1);fast('06-05','Grundlovsdag',0);fast('06-23','Sankthansaften',0);
  fast('12-24','Juleaften',0);fast('12-25','Juledag',1);fast('12-26','2. juledag',1);fast('12-31','Nytårsaften',0);
  return _hCache[y]=r}
window.kalHelligdag=ds=>helligdage(+ds.slice(0,4))[ds]||null;

// ---------- Farver pr. slags aftale ----------
const KFARVER=[['groen','#22c55e','Andet'],['rod','#ef4444','Sundhed'],['pink','#ec4899','Fest'],['blaa','#3b82f6','Arbejde og skole'],['orange','#f97316','Sport'],['lilla','#8b5cf6','Rejse'],['gul','#eab308','Familie'],['turkis','#14b8a6','Hjemme']];
const KGAET=[['rod',/læge|tandlæge|sygehus|hospital|medicin|klinik|🦷|💊|🏥|🩺/i],['pink',/fest|fødselsdag|bryllup|jubil|🎉|🥳|🎂|🎁|❤️|💍/i],['blaa',/arbejde|møde|skole|eksamen|kursus|💼|📚/i],['orange',/træning|fodbold|svøm|løb|motion|fitness|håndbold|⚽|🏃|🏊/i],['lilla',/ferie|rejse|tog|fly|lufthavn|✈️|🚗|🚌/i],['gul',/mor|far|bedste|familie|barn|børn|🐶/i],['turkis',/rengør|vask|handle|indkøb|🏠|🛒/i]];
const fHex=n=>(KFARVER.find(f=>f[0]===n)||KFARVER[0])[1];
window.kFarveNavn=x=>{if(x.farve&&KFARVER.some(f=>f[0]===x.farve))return x.farve;const t=(x.titel||'')+' '+(x.note||'');const g=KGAET.find(([,re])=>re.test(t));return g?g[0]:'groen'};
const kFarve=x=>fHex(kFarveNavn(x));

// ---------- Helligdage med i dagens ting ----------
const _dt=dagensTing;
dagensTing=function(ds){const h=kalHelligdag(ds);return h?[{t:'h',navn:h.navn,hel:h.hel},..._dt(ds)]:_dt(ds)};
const _li=kTingLi;
kTingLi=function(z,ds){
  if(z.t==='h')return `<li class="kting khel"><span class="ktid"><span class="kflag kstor"></span></span><span class="n"><b>${esc(z.navn)}</b><br><span class="muted">${z.hel?'Helligdag':'Mærkedag'}${ds?' · '+kPaen(ds):''}</span></span></li>`;
  const s=_li(z,ds);if(z.t!=='a')return s.replace('<li class="kting">','<li class="kting kfod">');
  const c=kFarve(z.x);return s.replace('<li class="kting">',`<li class="kting kaft" style="--kf:${c}">`)};
kalInfo=function(){const t=dagensTing(iso(new Date()));const f=t.find(z=>z.t==='f');if(f)return '🎂 '+f.k.navn+' har fødselsdag';
  const n=t.filter(z=>z.t==='a').length;if(n)return 'I dag: '+n+(n===1?' aftale':' aftaler');const h=t.find(z=>z.t==='h');if(h)return '🎉 '+h.navn;
  return KA().length||KO().length?'Ingen aftaler i dag':'Aftaler, fødselsdage og kontakter'};

// ---------- Månedens udseende ----------
const MEMO=['❄️','💘','🌷','🐣','🌸','☀️','🏖️','🍦','🍎','🎃','🍂','🎄'];
const MGRAD=['#3b82f6,#06b6d4','#ec4899,#f43f5e','#22c55e,#84cc16','#facc15,#f97316','#f472b6,#a855f7','#f59e0b,#ef4444','#06b6d4,#3b82f6','#f97316,#ec4899','#ef4444,#f59e0b','#f97316,#7c3aed','#b45309,#f97316','#16a34a,#dc2626'];
const TOM=['Ingen planer – nyd dagen ☀️','En fri dag 😎','Tid til dig selv 🧘','Ingen aftaler – måske en tur? 🚶','Helt fri 🎈'];

const kalMaaned=function(){const idag=iso(new Date()),valgt=window._kd||idag,m=window._km||valgt.slice(0,7);
  const[y,mo]=m.split('-').map(Number),start=(new Date(y,mo-1,1).getDay()+6)%7,antal=new Date(y,mo,0).getDate();
  const ret=window._kdir>0?'kind-h':window._kdir<0?'kind-v':'';window._kdir=0;
  let celler='<span></span>'.repeat(start),n=0;
  for(let d=1;d<=antal;d++){const ds=m+'-'+String(d).padStart(2,'0'),t=dagensTing(ds),h=t.find(z=>z.t==='h'),fod=t.some(z=>z.t==='f'),af=t.filter(z=>z.t==='a');
    const prik=[...(fod?['<em style="--kf:#ec4899">🎂</em>']:[]),...af.map(z=>`<em style="--kf:${kFarve(z.x)}">${kEmo(z.x.titel)||''}</em>`),...(D.kalNoter&&D.kalNoter[ds]?['<em style="--kf:#94a3b8">✏️</em>']:[])].slice(0,3).join('');
    const kl=['kdag',ds===idag?'idag':'',ds===valgt?'valgt':'',(start+d-1)%7>4?'weekend':'',h?(h.hel?'khelig':'kmaerke'):'',fod?'kfodsel':'',af.length?'kharaft':''].filter(Boolean).join(' ');
    celler+=`<button class="${kl}" style="--i:${n++}" onclick="kalTryk('${ds}')" title="${h?esc(h.navn):''}">${ds===idag?'<span class="kidag">I DAG</span>':''}<b>${d}</b>${h?'<u class="kflag"></u>':''}<i>${prik}</i></button>`}
  const t=dagensTing(valgt),vd=kDag(valgt);let naeste=[];const d0=kDag(idag);
  for(let i=1;i<=60&&naeste.length<6;i++){const d=new Date(d0);d.setDate(d.getDate()+i);const ds=iso(d);dagensTing(ds).forEach(z=>{if(naeste.length<6)naeste.push(kTingLi(z,ds))})}
  const vh=kalHelligdag(valgt),tom=TOM[vd.getDate()%TOM.length];
  return `<div class="card khoved kfest${kLinjer()?' klinjer':''}">
  <div class="kmdbanner" style="--g1:${MGRAD[mo-1].split(',')[0]};--g2:${MGRAD[mo-1].split(',')[1]}"><span class="kflyd k1">${MEMO[mo-1]}</span><span class="kflyd k2">${MEMO[mo-1]}</span><span class="kflyd k3">${MEMO[mo-1]}</span>
   <button class="knav" onclick="kalMd(-1)" title="Forrige måned">‹</button><button class="ktitel" onclick="kalVaelgMd()"><span class="kmemo">${MEMO[mo-1]}</span> ${MDR[mo-1]} ${y} ▾</button><button class="knav" onclick="kalMd(1)" title="Næste måned">›</button></div>
  ${kVaerktoej()}
  <div class="kuge"><span>Man</span><span>Tir</span><span>Ons</span><span>Tor</span><span>Fre</span><span class="kw">Lør</span><span class="kw">Søn</span></div><div class="kgrid ${ret}" id="kgrid">${celler}</div>
  <div class="kstryg muted">👈 Stryg for at skifte måned 👉</div>
  <div class="row" style="margin-top:10px"><button class="l" style="flex:1" onclick="kalVaelg('${idag}')">⭐ I dag</button><label class="l kfind" style="flex:1">🔎 Find dag<input type="date" value="${valgt}" onchange="if(this.value)kalVaelg(this.value)"></label></div></div>
  <div class="card kdagkort"><div class="kstordag" style="--g1:${MGRAD[mo-1].split(',')[0]};--g2:${MGRAD[mo-1].split(',')[1]}"><b>${vd.getDate()}</b><span>${UGD[vd.getDay()].replace(/^./,c=>c.toUpperCase())}<br>${MDR[vd.getMonth()]} ${vd.getFullYear()}${valgt===idag?' · i dag ⭐':''}</span><button class="kseddag" style="margin-left:auto" onclick="kSaetVis('dag')">📄 Se dagen</button></div>
  ${vh?`<div class="khelbar"><span class="kflag"></span> ${esc(vh.navn)}${vh.hel?' – helligdag':''}</div>`:''}
  <ul class="list">${t.filter(z=>z.t!=='h').length?t.filter(z=>z.t!=='h').map(z=>kTingLi(z)).join(''):`<li class="empty ktom" style="justify-content:center">${tom}</li>`}</ul>
  <label class="kdagnotelab">✏️ Noter til dagen</label><textarea class="kskriv" rows="${Math.max(2,(KN()[valgt]||'').split('\n').length)}" placeholder="Skriv her…" oninput="kVoks(this)" onchange="kGemNote('${valgt}',this)" onblur="kGemNote('${valgt}',this)">${esc(KN()[valgt]||'')}</textarea>
  <button class="b" style="width:100%;font-size:18px;padding:14px;margin-top:10px" onclick="retAftale(null,'${valgt}')">➕ Ny aftale</button>
  <button class="l" style="width:100%;margin-top:8px" onclick="kSaetVis('dag')">📄 Se kun denne dag – time for time</button></div>
  ${naeste.length?`<div class="card"><b>⏭️ Det næste der sker</b><ul class="list">${naeste.join('')}</ul></div>`:''}`};

// ---------- Vis én dag ad gangen + linjer til/fra (husket i indstillinger) ----------
const kMode=()=>{const v=D.indstil&&D.indstil.kalVis;return v==='dag'||v==='uge'?v:'maaned'};
const kLinjer=()=>!!(D.indstil&&D.indstil.kalLinjer);
window.kSaetVis=v=>{D.indstil=D.indstil||{};D.indstil.kalVis=v;save();vis();scrollTo(0,0)};
window.kSaetLinjer=()=>{D.indstil=D.indstil||{};D.indstil.kalLinjer=!kLinjer();save();vis();toast(kLinjer()?'Kalenderen vises med linjer':'Kalenderen vises uden linjer')};
const kVaerktoej=()=>`<div class="kvaerk"><div class="kseg"><button class="${kMode()==='maaned'?'on':''}" onclick="kSaetVis('maaned')">🗓️ Måned</button><button class="${kMode()==='uge'?'on':''}" onclick="kSaetVis('uge')">📋 Uge</button><button class="${kMode()==='dag'?'on':''}" onclick="kSaetVis('dag')">📄 Én dag</button></div></div><div class="kvaerk2"><button class="l klinjeknap${kLinjer()?' on':''}" onclick="kSaetLinjer()" title="Linjer til eller fra">${kLinjer()?'▦ Med linjer':'▢ Uden linjer'}</button><button class="l" onclick="kGemAlt()">💾 Gem</button><button class="l" onclick="visSkrald()">🗑️ Skraldespand${(D.kalSkrald||[]).length?' ('+D.kalSkrald.length+')':''}</button></div>`;
window.kalTryk=ds=>{if(ds===(window._kd||iso(new Date()))){window._kd=ds;window._km=ds.slice(0,7);kSaetVis('dag')}else kalVaelg(ds)};
window.kalDag=n=>{const d=kDag(window._kd||iso(new Date()));d.setDate(d.getDate()+n);window._kdir=n;window._kd=iso(d);window._km=window._kd.slice(0,7);vis()};
window.kNyKl=(ds,h)=>{retAftale(null,ds);const t=document.getElementById('ka_tid');if(t)t.value=String(h).padStart(2,'0')+':00'};
function kalDagVis(){const idag=iso(new Date()),valgt=window._kd||idag,vd=kDag(valgt),mo=vd.getMonth()+1;
  const ret=window._kdir>0?'kind-h':window._kdir<0?'kind-v':'';window._kdir=0;
  const t=dagensTing(valgt),h=t.find(z=>z.t==='h'),fod=t.filter(z=>z.t==='f'),af=t.filter(z=>z.t==='a'),hele=af.filter(z=>!z.x.tid),medTid=af.filter(z=>z.x.tid);
  const timer=medTid.map(z=>+z.x.tid.slice(0,2)),fra=Math.min(6,...timer),nu=new Date(),nuT=valgt===idag?nu.getHours():-1;
  let raekker='';
  for(let hh=fra;hh<=23;hh++){const her=medTid.filter(z=>+z.x.tid.slice(0,2)===hh);
    raekker+=`<div class="ktime${hh===nuT?' knu':''}"><span class="kkl">${String(hh).padStart(2,'0')}:00</span><div class="kplads" onclick="if(event.target===this)kNyKl('${valgt}',${hh})">${her.map(z=>`<button class="kblok" style="--kf:${kFarve(z.x)}" onclick="retAftale('${z.x.id}')"><b>${esc(z.x.tid)}</b> ${esc(z.x.titel)}${z.x.note?`<small>${esc(z.x.note)}</small>`:''}</button>`).join('')}${hh===nuT?`<i class="knulinje" style="top:${Math.round(nu.getMinutes()/60*100)}%"></i>`:''}</div></div>`}
  return `<div class="card khoved kfest${kLinjer()?' klinjer':''}">
  <div class="kmdbanner" style="--g1:${MGRAD[mo-1].split(',')[0]};--g2:${MGRAD[mo-1].split(',')[1]}"><span class="kflyd k1">${MEMO[mo-1]}</span><span class="kflyd k2">${MEMO[mo-1]}</span>
   <button class="knav" onclick="kalDag(-1)" title="Dagen før">‹</button><label class="ktitel kdagtitel">${vd.getDate()}. ${MDR[mo-1]}${valgt===idag?' ⭐':''}<small>${UGD[vd.getDay()].replace(/^./,c=>c.toUpperCase())} ${vd.getFullYear()}${valgt===idag?' · i dag':''} · tryk for at vælge dag</small><input type="date" value="${valgt}" onchange="if(this.value){window._kd=this.value;window._km=this.value.slice(0,7);vis()}"></label><button class="knav" onclick="kalDag(1)" title="Dagen efter">›</button></div>
  ${kVaerktoej()}
  <div id="kdagvis" class="kdagvis ${ret}">
  ${h?`<div class="khelbar"><span class="kflag"></span> ${esc(h.navn)}${h.hel?' – helligdag':''}</div>`:''}
  ${fod.length||hele.length?`<div class="khele"><div class="kkl">Hele dagen</div><div class="kplads">${fod.map(z=>`<button class="kblok kfodblok" onclick="visKontakt('${z.k.id}')">🎂 <b>${esc(z.k.navn)}</b> har fødselsdag${z.alder!=null?' – '+z.alder+' år':''}</button>`).join('')}${hele.map(z=>`<button class="kblok" style="--kf:${kFarve(z.x)}" onclick="retAftale('${z.x.id}')">${esc(z.x.titel)}${z.x.note?`<small>${esc(z.x.note)}</small>`:''}</button>`).join('')}</div></div>`:''}
  <label class="kdagnotelab">✏️ Noter til dagen</label><textarea class="kskriv" rows="${Math.max(2,(KN()[valgt]||'').split('\n').length)}" placeholder="Skriv her…" oninput="kVoks(this)" onchange="kGemNote('${valgt}',this)" onblur="kGemNote('${valgt}',this)">${esc(KN()[valgt]||'')}</textarea>
  <div class="ktimer">${raekker}</div></div>
  <div class="kstryg muted">👈 Stryg for at skifte dag 👉 · Tryk på en tom time for at skrive en aftale</div>
  <div class="row" style="margin-top:10px"><button class="l" style="flex:1" onclick="window._kd='${idag}';window._km='${idag.slice(0,7)}';vis()">⭐ I dag</button><button class="b" style="flex:1" onclick="retAftale(null,'${valgt}')">➕ Ny aftale</button></div></div>`}

// ---------- Ugeplan: 7 dage + madplan, to do, noter og mål (man skriver direkte i den) ----------
const KN=()=>(D.kalNoter&&typeof D.kalNoter==='object'&&!Array.isArray(D.kalNoter))?D.kalNoter:(D.kalNoter={});
const KU=k=>{if(!D.kalUge||typeof D.kalUge!=='object'||Array.isArray(D.kalUge))D.kalUge={};const u=D.kalUge[k]||(D.kalUge[k]={});if(!Array.isArray(u.todo))u.todo=[];if(!Array.isArray(u.maal))u.maal=[];if(typeof u.noter!=='string')u.noter='';return u};
window.kGemNote=(ds,el)=>{const v=el.value.trim();if(v)KN()[ds]=el.value;else delete KN()[ds];save()};
window.kGemUgeNoter=(k,el)=>{KU(k).noter=el.value;save()};
window.kTilfoejPunkt=(k,hvad,el)=>{const v=el.value.trim();if(!v)return;KU(k)[hvad].push({id:id(),t:v,ok:false});save();vis();const n=document.getElementById('kny_'+hvad);if(n)n.focus()};
window.kSlaaPunkt=(k,hvad,pid)=>{const p=KU(k)[hvad].find(x=>x.id===pid);if(p){p.ok=!p.ok;save();vis()}};
window.kSletPunkt=(k,hvad,pid)=>{const s=snap();const u=KU(k);u[hvad]=u[hvad].filter(x=>x.id!==pid);save();vis();toast('Slettet 🗑️',fortrydTil(s))};
window.kVoks=el=>{el.style.height='auto';el.style.height=Math.max(el.scrollHeight,44)+'px'};
window.kalUge=n=>{const d=kDag(window._kd||iso(new Date()));d.setDate(d.getDate()+7*n);window._kdir=n;window._kd=iso(d);window._km=window._kd.slice(0,7);vis()};
window.kTilDag=ds=>{window._kd=ds;window._km=ds.slice(0,7);kSaetVis('dag')};
function kMadNavn(ds){const p=(D.madplan||{})[ds];if(!p)return '';if(p.opskrift){const o=(D.opskrifter||[]).find(x=>x.id===p.opskrift)||(typeof STD_OPSKRIFTER!=='undefined'?STD_OPSKRIFTER.find(x=>x.id===p.opskrift):null);if(o)return o.navn}return p.tekst||''}
function kPunkter(k,hvad,navn,ikon,pladsholder){const l=KU(k)[hvad];
  return `<div class="kboks"><div class="kbokstitel">${ikon} ${navn}</div><ul class="kpunkter">${l.map(p=>`<li class="${p.ok?'ok':''}"><button class="kflueben" onclick="kSlaaPunkt('${k}','${hvad}','${p.id}')" title="Færdig">${p.ok?'✅':'⬜'}</button><span>${esc(p.t)}</span><button class="kfjern" onclick="kSletPunkt('${k}','${hvad}','${p.id}')" title="Slet">✖️</button></li>`).join('')}</ul>
  <div class="kskrivrk"><input id="kny_${hvad}" placeholder="${pladsholder}" onkeydown="if(event.key==='Enter')kTilfoejPunkt('${k}','${hvad}',this)"><button class="kb" onclick="kTilfoejPunkt('${k}','${hvad}',document.getElementById('kny_${hvad}'))" title="Tilføj">➕</button></div></div>`}
function kalUgeVis(){const idag=iso(new Date()),valgt=window._kd||idag,man=mandag(kDag(valgt)),k=iso(man),nr=ugenr(man);
  const ret=window._kdir>0?'kind-h':window._kdir<0?'kind-v':'';window._kdir=0;
  const dage=[...Array(7)].map((_,i)=>{const d=new Date(man);d.setDate(d.getDate()+i);return iso(d)});
  const son=kDag(dage[6]),mo=man.getMonth()+1,u=KU(k);
  const dagboks=ds=>{const d=kDag(ds),t=dagensTing(ds),h=t.find(z=>z.t==='h'),fod=t.filter(z=>z.t==='f'),af=t.filter(z=>z.t==='a').sort((a,b)=>(a.x.tid||'').localeCompare(b.x.tid||''));
    return `<div class="kboks kugedag${ds===idag?' kidagboks':''}${h&&h.hel?' khelboks':''}"><div class="kbokstitel"><button class="kdagnavn" onclick="kTilDag('${ds}')">${UGD[d.getDay()].replace(/^./,c=>c.toUpperCase())} <span>${d.getDate()}/${d.getMonth()+1}</span></button>${ds===idag?'<span class="kidagmærke">I DAG</span>':''}${h?`<span class="kflag"></span><small>${esc(h.navn)}</small>`:''}<button class="kseddag" onclick="kTilDag('${ds}')">📄 Se dagen</button><button class="kb kplus" onclick="retAftale(null,'${ds}')" title="Ny aftale">➕</button></div>
    ${fod.length||af.length?`<div class="kchips">${fod.map(z=>`<button class="kchip" style="--kf:#ec4899" onclick="visKontakt('${z.k.id}')">🎂 ${esc(z.k.navn)}</button>`).join('')}${af.map(z=>`<button class="kchip" style="--kf:${kFarve(z.x)}" onclick="retAftale('${z.x.id}')">${z.x.tid?`<b>${esc(z.x.tid)}</b> `:''}${esc(z.x.titel)}</button>`).join('')}</div>`:''}
    <textarea class="kskriv" rows="${Math.max(1,(KN()[ds]||'').split('\n').length)}" placeholder="Skriv her…" oninput="kVoks(this)" onchange="kGemNote('${ds}',this)" onblur="kGemNote('${ds}',this)">${esc(KN()[ds]||'')}</textarea></div>`};
  const mad=dage.map(ds=>{const n=kMadNavn(ds),d=kDag(ds);return `<li><span class="kmadDag">${UGD[d.getDay()].slice(0,3)}</span><span class="kmadRet">${n?esc(n):'<span class="muted">–</span>'}</span></li>`}).join('');
  return `<div class="card khoved kfest${kLinjer()?' klinjer':''}">
  <div class="kmdbanner" style="--g1:${MGRAD[mo-1].split(',')[0]};--g2:${MGRAD[mo-1].split(',')[1]}"><span class="kflyd k1">${MEMO[mo-1]}</span><span class="kflyd k2">${MEMO[mo-1]}</span>
   <button class="knav" onclick="kalUge(-1)" title="Ugen før">‹</button><label class="ktitel kdagtitel">Uge ${nr}${dage.includes(idag)?' ⭐':''}<small>${man.getDate()}. ${MDR[man.getMonth()]} – ${son.getDate()}. ${MDR[son.getMonth()]} ${son.getFullYear()} · tryk for at vælge</small><input type="date" value="${valgt}" onchange="if(this.value){window._kd=this.value;window._km=this.value.slice(0,7);vis()}"></label><button class="knav" onclick="kalUge(1)" title="Ugen efter">›</button></div>
  ${kVaerktoej()}
  <div id="kugevis" class="kugeplan ${ret}"><div class="kugevenstre">${dage.map(dagboks).join('')}</div>
  <div class="kugehoejre">
   <div class="kboks"><div class="kbokstitel">🍽️ Madplan <button class="kb kplus" onclick="gaaTil('madplan')" title="Gå til Madplan">➜</button></div><ul class="kmadliste">${mad}</ul></div>
   ${kPunkter(k,'todo','To do','✅','Skriv noget, der skal gøres…')}
   <div class="kboks"><div class="kbokstitel">📝 Noter</div><textarea class="kskriv knoter" rows="4" placeholder="Skriv noter til ugen…" oninput="kVoks(this)" onchange="kGemUgeNoter('${k}',this)" onblur="kGemUgeNoter('${k}',this)">${esc(u.noter)}</textarea></div>
   ${kPunkter(k,'maal','Mål','🎯','Skriv et mål for ugen…')}
  </div></div>
  <div class="kstryg muted">👈 Stryg for at skifte uge 👉 · Tryk på en dag for at se den alene</div>
  <div class="row" style="margin-top:10px"><button class="l" style="flex:1" onclick="window._kd='${idag}';window._km='${idag.slice(0,7)}';vis()">⭐ Denne uge</button></div></div>`}

// ---------- Skraldespand: slettede aftaler, kontakter, to do, mål og noter kan findes og hentes igen ----------
const KS=()=>Array.isArray(D.kalSkrald)?D.kalSkrald:(D.kalSkrald=[]);
const tilSkrald=(hvad,data,ekstra)=>KS().unshift({id:id(),hvad,data:JSON.parse(JSON.stringify(data)),slettet:new Date().toISOString(),...(ekstra||{})});
const _sa=sletAftale;sletAftale=function(aid){const a=KA().find(x=>x.id===aid);const s=snap();_sa(aid);if(a&&!KA().some(x=>x.id===aid)){tilSkrald('aftale',a);save();vis();toast('Aftalen ligger i skraldespanden 🗑️',fortrydTil(s))}};
const _sk=sletKontakt;sletKontakt=function(kid){const k=KO().find(x=>x.id===kid);const s=snap();_sk(kid);if(k&&!KO().some(x=>x.id===kid)){tilSkrald('kontakt',k);save();vis();toast('Kontakten ligger i skraldespanden 🗑️',fortrydTil(s))}};
window.kSletPunkt=(k,hvad,pid)=>{const s=snap(),u=KU(k),p=u[hvad].find(x=>x.id===pid);if(!p)return;u[hvad]=u[hvad].filter(x=>x.id!==pid);tilSkrald(hvad,p,{uge:k});save();vis();toast('Ligger i skraldespanden 🗑️',fortrydTil(s))};
const _gn=kGemNote;window.kGemNote=(ds,el)=>{const foer=KN()[ds]||'';if(foer.trim()&&!el.value.trim())tilSkrald('note',{tekst:foer},{dato:ds});_gn(ds,el)};
window.kGemAlt=()=>{const a=document.activeElement;if(a&&a.blur)a.blur();save();toast('Alt er gemt 💾')};
const SKNAVN={aftale:'📅 Aftale',kontakt:'👤 Kontakt',todo:'✅ To do',maal:'🎯 Mål',note:'✏️ Note'};
const skTekst=x=>x.hvad==='aftale'?esc(x.data.titel)+' <span class="muted">· '+kPaen(x.data.dato)+'</span>':x.hvad==='kontakt'?esc(x.data.navn):x.hvad==='note'?esc(String(x.data.tekst).slice(0,80))+' <span class="muted">· '+kPaen(x.dato)+'</span>':esc(x.data.t);
window.visSkrald=()=>{const l=KS();
  dlgin.innerHTML=`<h2>🗑️ Skraldespand</h2><p class="muted" style="margin-top:-6px">Her ligger det, du har slettet i kalenderen. Tryk »↩️ Hent igen« for at få det tilbage.</p>
  <ul class="list">${l.length?l.map(x=>`<li><span class="n"><span class="muted" style="font-size:13px">${SKNAVN[x.hvad]||''} · slettet ${new Date(x.slettet).toLocaleDateString('da-DK',{day:'numeric',month:'short'})}</span><br>${skTekst(x)}</span><button class="l" onclick="skHent('${x.id}')">↩️ Hent igen</button></li>`).join(''):'<li class="empty" style="justify-content:center">Skraldespanden er tom 🎉</li>'}</ul>
  <div class="row" style="margin-top:12px">${l.length?'<button class="l" onclick="skToem()">Tøm skraldespanden</button>':''}<button class="b" style="flex:1" onclick="dlg.close()">Luk</button></div>`;kDlg()};
window.skHent=sid=>{const x=KS().find(y=>y.id===sid);if(!x)return;const s=snap();
  if(x.hvad==='aftale'){if(!KA().some(y=>y.id===x.data.id))KA().push(x.data)}
  else if(x.hvad==='kontakt'){if(!KO().some(y=>y.id===x.data.id))KO().push(x.data)}
  else if(x.hvad==='note'){const n=KN();n[x.dato]=(n[x.dato]?n[x.dato]+'\n':'')+x.data.tekst}
  else{const u=KU(x.uge);if(!u[x.hvad].some(y=>y.id===x.data.id))u[x.hvad].push(x.data)}
  D.kalSkrald=KS().filter(y=>y.id!==sid);save();vis();visSkrald();toast('Hentet tilbage ↩️',fortrydTil(s))};
window.skToem=()=>{if(!confirm('Vil du slette alt i skraldespanden for altid?\n\nDu kan fortryde lige bagefter med ↩️ Fortryd.'))return;const s=snap();D.kalSkrald=[];save();vis();visSkrald();toast('Skraldespanden er tømt',fortrydTil(s))};

kalSide=function(){const m=kMode();return m==='dag'?kalDagVis():m==='uge'?kalUgeVis():kalMaaned()};
const _md=kalMd;kalMd=function(n){window._kdir=n;_md(n)};

// Stryg til venstre/højre på kalenderen for at skifte måned
let sx=null,sy=0,sxDag='';
document.addEventListener('touchstart',e=>{const g=e.target.closest&&!e.target.closest('textarea,input')&&(e.target.closest('#kgrid')||e.target.closest('#kdagvis')||e.target.closest('#kugevis'));sxDag=g?g.id:'';if(!g){sx=null;return}sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
document.addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;sx=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)(sxDag==='kdagvis'?kalDag:sxDag==='kugevis'?kalUge:kalMd)(dx<0?1:-1)},{passive:true});

// ---------- Farve på aftalen ----------
const _ret=retAftale;
retAftale=function(aid,ds){_ret(aid,ds);const a=aid?KA().find(x=>x.id===aid):null;window._kfarveValgt=a&&a.farve||'';
  const note=document.getElementById('ka_note');if(!note)return;const lab=note.previousElementSibling;
  const html=`<label>Farve (ellers vælger appen selv)</label><div class="kfarver">${KFARVER.map(([n,c,t])=>`<button type="button" class="kfv${window._kfarveValgt===n?' on':''}" style="--kf:${c}" data-f="${n}" onclick="kVaelgFarve(this)"><i></i>${t}</button>`).join('')}</div>`;
  (lab&&lab.tagName==='LABEL'?lab:note).insertAdjacentHTML('beforebegin',html)};
window.kVaelgFarve=b=>{const on=b.classList.contains('on');document.querySelectorAll('.kfv').forEach(x=>x.classList.remove('on'));if(!on){b.classList.add('on');window._kfarveValgt=b.dataset.f}else window._kfarveValgt=''};
const _gem=gemAftale;
gemAftale=function(aid){const foer=KA().length,f=window._kfarveValgt||'';_gem(aid);
  const x=aid?KA().find(y=>y.id===aid):(KA().length>foer?KA()[KA().length-1]:null);
  if(x&&(x.farve||'')!==f){if(f)x.farve=f;else delete x.farve;save();vis()}};

// ---------- Udseende ----------
const st=document.createElement('style');st.textContent=`
.kfest .kmdbanner{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;gap:6px;margin:-4px -4px 12px;padding:14px 10px;border-radius:20px;background:linear-gradient(135deg,var(--g1),var(--g2));box-shadow:0 8px 20px rgba(0,0,0,.15)}
.kfest .kmdbanner .ktitel{color:#fff;font-size:23px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 2px 6px rgba(0,0,0,.25);position:relative;z-index:1}
.kfest .kmdbanner .knav{background:rgba(255,255,255,.3);color:#fff;position:relative;z-index:1;backdrop-filter:blur(4px);flex:0 0 46px;width:46px;height:46px;font-size:28px;padding:0}
.kfest .kmdbanner .ktitel{flex:1;min-width:0;padding:4px}
.kmemo{display:inline-block;animation:kvip 2.4s ease-in-out infinite}
.kflyd{position:absolute;font-size:34px;opacity:.28;pointer-events:none;animation:kflyd 7s ease-in-out infinite}
.kflyd.k1{left:18%;top:-6px}.kflyd.k2{right:20%;bottom:-10px;font-size:44px;animation-delay:-2s}.kflyd.k3{left:55%;top:4px;font-size:22px;animation-delay:-4s}
@keyframes kflyd{0%,100%{transform:translateY(0) rotate(-8deg)}50%{transform:translateY(8px) rotate(8deg)}}
@keyframes kvip{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(10deg) scale(1.15)}}
.kfest .kuge span{background:var(--felt);border-radius:10px;padding:4px 0;color:var(--txt)}
.kfest .kuge span.kw{color:var(--acc)}
.kfest .kdag{position:relative;animation:kpop .35s cubic-bezier(.3,1.5,.6,1) both;animation-delay:calc(var(--i)*12ms);transition:transform .15s,box-shadow .15s}
.kfest .kdag:hover{transform:translateY(-2px);box-shadow:0 6px 14px rgba(0,0,0,.12)}
.kfest .kdag:active{transform:scale(.92)}
@keyframes kpop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
.kfest .kgrid.kind-h .kdag{animation-name:kindh}.kfest .kgrid.kind-v .kdag{animation-name:kindv}
@keyframes kindh{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}
@keyframes kindv{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:none}}
.kfest .kdag i{display:flex;gap:2px;justify-content:center;flex-wrap:wrap;letter-spacing:0}
.kfest .kdag i em{font-style:normal;min-width:16px;height:16px;border-radius:8px;background:var(--kf);display:inline-flex;align-items:center;justify-content:center;font-size:11px;line-height:1;padding:0 1px;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.kfest .kdag.kharaft{background:linear-gradient(180deg,var(--felt),#fff)}
.kfest .kdag.khelig{background:linear-gradient(180deg,#fee2e2,#fff1f2)}.kfest .kdag.khelig b{color:#dc2626}
.kfest .kdag.kmaerke{background:linear-gradient(180deg,#fef9c3,#fffbeb)}
.kfest .kdag u.kflag{position:static;margin:1px 0}
.kflag{display:inline-block;width:15px;height:11px;border-radius:2px;vertical-align:middle;background:linear-gradient(#fff,#fff) 4px 0/2.5px 100% no-repeat,linear-gradient(#fff,#fff) 0 4.25px/100% 2.5px no-repeat,#c8102e;box-shadow:0 1px 2px rgba(0,0,0,.25)}
.kflag.kstor{width:30px;height:22px;background:linear-gradient(#fff,#fff) 8px 0/5px 100% no-repeat,linear-gradient(#fff,#fff) 0 8.5px/100% 5px no-repeat,#c8102e}
.kfest .kdag.kfodsel{background:linear-gradient(180deg,#fce7f3,#fdf2f8)}
.kfest .kdag.idag{box-shadow:0 0 0 3px var(--acc);animation:kpop .35s both,kpuls 2s ease-in-out .6s infinite}
@keyframes kpuls{0%,100%{box-shadow:0 0 0 3px var(--acc)}50%{box-shadow:0 0 0 6px color-mix(in srgb,var(--acc) 35%,transparent)}}
.kidag{position:absolute;top:-7px;left:50%;transform:translateX(-50%);background:var(--acc);color:#fff;font-size:8.5px;font-weight:800;padding:1px 5px;border-radius:6px;white-space:nowrap;letter-spacing:.3px}
.kfest .kdag.valgt{background:var(--grad)!important;color:#fff;box-shadow:0 8px 18px rgba(0,0,0,.2)}.kfest .kdag.valgt b{color:#fff}
.kstryg{text-align:center;font-size:13px;margin-top:8px}
@media (hover:hover){.kstryg{display:none}}
.kdagkort .kstordag{display:flex;align-items:center;gap:14px;padding:12px 16px;border-radius:18px;color:#fff;background:linear-gradient(135deg,var(--g1),var(--g2));margin-bottom:8px;animation:kpop .35s both}
.kstordag b{font-size:46px;line-height:1;font-weight:900;text-shadow:0 2px 6px rgba(0,0,0,.2)}.kstordag span{font-size:17px;font-weight:700;line-height:1.3}
.khelbar{background:#fee2e2;color:#991b1b;border-radius:12px;padding:8px 12px;font-weight:700;margin:4px 0}
.kting.kaft{border-left:6px solid var(--kf);padding-left:8px!important;border-radius:6px;animation:kind .3s both}
.kting.kaft .ktid{color:var(--kf)}
.kting.kfod{background:linear-gradient(90deg,#fce7f3,transparent);border-radius:10px}
.kting.khel{background:linear-gradient(90deg,#fee2e2,transparent);border-radius:10px}
@keyframes kind{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.ktom{font-size:18px;padding:18px 4px!important}
.kfarver{display:flex;flex-wrap:wrap;gap:6px}
.kfv{font:inherit;font-size:14px;font-weight:600;display:flex;align-items:center;gap:6px;border:2px solid transparent;border-radius:20px;padding:6px 10px;background:var(--felt);color:var(--txt);cursor:pointer}
.kfv i{width:16px;height:16px;border-radius:50%;background:var(--kf)}
.kfv.on{border-color:var(--kf);background:color-mix(in srgb,var(--kf) 18%,transparent)}
.kvaerk{display:flex;gap:8px;align-items:center;justify-content:space-between;margin:0 0 10px;flex-wrap:wrap}
.kseg{flex:1;display:flex;background:var(--felt);border-radius:14px;padding:3px;gap:3px}
.kseg button,.klinjeknap{font:inherit;font-size:15px;font-weight:700;border:0;border-radius:11px;padding:8px 12px;background:none;color:var(--txt);cursor:pointer}
.kseg button.on{background:var(--grad);color:#fff;box-shadow:0 3px 8px rgba(0,0,0,.15)}
.klinjeknap{background:var(--felt)}.klinjeknap.on{outline:2px solid var(--acc)}
.kfest.klinjer .kgrid{gap:0;border:1.5px solid var(--line);border-radius:12px;overflow:hidden}
.kfest.klinjer .kgrid>*{border-right:1px solid var(--line);border-bottom:1px solid var(--line)}
.kfest.klinjer .kgrid>*:nth-child(7n){border-right:0}
.kfest.klinjer .kdag{border-radius:0;background:var(--card,#fff)}
.kfest.klinjer .kdag.valgt{border-radius:0}
.kfest.klinjer .kuge{gap:0}.kfest.klinjer .kuge span{border-radius:0;background:none;border-bottom:2px solid var(--acc)}
.kfest .kmdbanner .kdagtitel{position:relative;display:block;text-align:center;cursor:pointer;line-height:1.15;text-transform:none;font-size:20px;margin:0}
.kdagtitel small{display:block;white-space:normal;font-size:12px;font-weight:600;opacity:.9;text-shadow:none}
.kdagtitel input{position:absolute;inset:0;opacity:0;width:100%;height:100%;cursor:pointer}
.kdagvis{animation:kpop .3s both}.kdagvis.kind-h{animation:kindh .3s both}.kdagvis.kind-v{animation:kindv .3s both}
.khele,.ktime{display:flex;gap:8px;align-items:stretch}
.khele{background:var(--felt);border-radius:14px;padding:8px;margin:6px 0 10px}
.kkl{flex:0 0 52px;font-size:13px;font-weight:800;color:var(--acc);padding-top:6px}
.kplads{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;position:relative;min-height:44px;padding:3px 0;cursor:pointer}
.ktimer .ktime .kplads{border-radius:10px;background:color-mix(in srgb,var(--felt) 55%,transparent);margin:2px 0}
.kfest.klinjer .ktimer .ktime{border-top:1px solid var(--line)}.kfest.klinjer .ktimer .ktime .kplads{background:none;border-radius:0;margin:0}
.kfest.klinjer .ktimer{border-bottom:1px solid var(--line)}
.kblok{font:inherit;text-align:left;border:0;border-left:6px solid var(--kf);border-radius:10px;padding:8px 10px;background:color-mix(in srgb,var(--kf) 16%,var(--card,#fff));color:var(--txt);cursor:pointer;animation:kind .3s both;box-shadow:0 2px 6px rgba(0,0,0,.08)}
.kblok b{color:var(--kf)}.kblok small{display:block;opacity:.75;font-size:13px;white-space:pre-wrap}
.kfodblok{--kf:#ec4899}
.ktime.knu .kkl{color:#ef4444}
.knulinje{position:absolute;left:0;right:0;height:2px;background:#ef4444;pointer-events:none}.knulinje::before{content:"";position:absolute;left:-5px;top:-4px;width:10px;height:10px;border-radius:50%;background:#ef4444}
.kvaerk2{display:flex;gap:6px;margin:-2px 0 10px}.kvaerk2 .l{flex:1;font-weight:700;font-size:14px;padding:9px 6px;white-space:nowrap}
.kseg button{flex:1}
.kugeplan{display:grid;grid-template-columns:1fr;gap:10px}
@media (min-width:761px){.kugeplan{grid-template-columns:2fr 1fr;align-items:start}}
.kugevenstre,.kugehoejre{display:flex;flex-direction:column;gap:10px}
.kugeplan.kind-h{animation:kindh .3s both}.kugeplan.kind-v{animation:kindv .3s both}
.kboks{background:var(--felt);border-radius:16px;padding:10px 12px;animation:kind .3s both}
.kbokstitel{display:flex;align-items:center;gap:6px;font-weight:800;font-size:16px;margin-bottom:4px;flex-wrap:wrap}
.kseddag{margin-left:auto;font:inherit;font-size:13px;font-weight:700;border:0;border-radius:10px;padding:6px 9px;background:var(--card,#fff);color:var(--acc);cursor:pointer}
.kbokstitel .kplus{width:36px;height:36px;flex:0 0 36px;font-size:16px;background:var(--card,#fff)}
.kbokstitel small{font-weight:600;color:#dc2626;font-size:13px}
.kdagnavn{font:inherit;font-weight:800;font-size:16px;border:0;background:none;color:var(--txt);cursor:pointer;padding:0}
.kdagnavn span{color:var(--acc);font-weight:700}
.kidagmærke{background:var(--acc);color:#fff;font-size:11px;font-weight:800;padding:2px 7px;border-radius:8px}
.kidagboks{box-shadow:0 0 0 3px var(--acc) inset}
.khelboks{background:linear-gradient(180deg,#fee2e2,var(--felt) 60%)}
.kchips{display:flex;flex-wrap:wrap;gap:5px;margin:4px 0}
.kchip{font:inherit;font-size:14px;border:0;border-left:5px solid var(--kf);border-radius:9px;padding:5px 9px;background:color-mix(in srgb,var(--kf) 16%,var(--card,#fff));color:var(--txt);cursor:pointer;text-align:left}
.kchip b{color:var(--kf)}
.kskriv{width:100%;border:0!important;background:color-mix(in srgb,var(--card,#fff) 70%,transparent)!important;border-radius:10px!important;padding:8px 10px!important;font:inherit;font-size:16px;resize:none;min-height:44px;line-height:1.4;color:var(--txt)}
.kskriv:focus{outline:2px solid var(--acc);background:var(--card,#fff)!important}
.kdagnotelab{margin:10px 0 4px!important;font-weight:700;color:var(--txt)!important}
.kmadliste{list-style:none;margin:0;padding:0}.kmadliste li{display:flex;gap:8px;padding:5px 0;border-bottom:1px dashed var(--line)}
.kmadDag{flex:0 0 38px;font-weight:800;color:var(--acc);text-transform:capitalize}.kmadRet{flex:1}
.kpunkter{list-style:none;margin:0;padding:0}.kpunkter li{display:flex;align-items:center;gap:6px;padding:3px 0}
.kpunkter li span{flex:1}.kpunkter li.ok span{text-decoration:line-through;opacity:.55}
.kflueben,.kfjern{border:0;background:none;font-size:20px;cursor:pointer;padding:2px}.kfjern{font-size:13px;opacity:.6}
.kskrivrk{display:flex;gap:6px;margin-top:6px}.kskrivrk input{flex:1;min-width:0;background:color-mix(in srgb,var(--card,#fff) 70%,transparent)!important;border:0!important}
.kfest.klinjer .kboks{background:var(--card,#fff);border:1.5px solid var(--txt,#333);border-radius:4px}
.kfest.klinjer .kskriv,.kfest.klinjer .kskrivrk input{background:repeating-linear-gradient(transparent 0 26px,var(--line) 26px 27px)!important;border-radius:0!important;line-height:27px;padding:0 4px!important}
.kfest.klinjer .kidagboks{box-shadow:0 0 0 3px var(--acc) inset}
@media (prefers-color-scheme:dark){.kfest .kdag.kharaft{background:var(--felt)}.kfest .kdag.khelig{background:#3a1515}.kfest .kdag.kmaerke{background:#33300f}.kfest .kdag.kfodsel{background:#3a1530}.khelbar{background:#3a1515;color:#fecaca}.kting.kfod{background:linear-gradient(90deg,#3a1530,transparent)}.kting.khel{background:linear-gradient(90deg,#3a1515,transparent)}}
@media (max-width:430px){.kfest .kmdbanner .kmemo{display:none}}
@media (max-width:380px){.kfest .kmdbanner .ktitel{font-size:20px}.kidag{font-size:7.5px}}
`;document.head.appendChild(st);
if(typeof side!=='undefined'&&side==='kalender')vis();
})();
