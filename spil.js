// Budget og Mad – spillet »Kurv-Kaos« (version 53).
// Et eget, nyt spil: fang det du skal bruge til retten, og pas på pengene.
// Ingen køb i spillet, ingen reklamer, ingen held-hjul om penge. Alt gemmes kun på telefonen.

function SP(){if(!D.spil||typeof D.spil!=='object'||Array.isArray(D.spil))D.spil={};const s=D.spil;
  ['best','spillet','retter'].forEach(k=>{if(typeof s[k]!=='number'||!isFinite(s[k]))s[k]=0});
  if(!s.dag||typeof s.dag!=='object')s.dag={};if(typeof s.lyd!=='boolean')s.lyd=true;return s}

const SP_RETTER=[
  ['Pasta med kødsovs',[['🍝','pasta'],['🍅','tomat'],['🧅','løg'],['🥩','kød']]],
  ['Pandekager',[['🥚','æg'],['🥛','mælk'],['🧈','smør'],['🍓','jordbær']]],
  ['Omelet',[['🥚','æg'],['🧀','ost'],['🍅','tomat'],['🧅','løg']]],
  ['Tacos',[['🌮','tacoskaller'],['🥩','kød'],['🧀','ost'],['🥑','avocado']]],
  ['Stegt ris',[['🍚','ris'],['🥚','æg'],['🥕','gulerod'],['🧅','løg']]],
  ['Burger',[['🍞','brød'],['🥩','kød'],['🧀','ost'],['🥬','salat']]],
  ['Pizza',[['🧀','ost'],['🍅','tomat'],['🍄','svampe'],['🫑','peber']]],
  ['Havregrød',[['🌾','havre'],['🥛','mælk'],['🍎','æble'],['🍯','honning']]],
  ['Kyllingekarry',[['🍗','kylling'],['🍚','ris'],['🧅','løg'],['🥥','kokos']]],
  ['Wok med nudler',[['🍜','nudler'],['🥦','broccoli'],['🥕','gulerod'],['🍗','kylling']]],
  ['Kartoffelsuppe',[['🥔','kartofler'],['🧅','løg'],['🥕','gulerod'],['🧈','smør']]],
  ['Bananpandekager',[['🍌','banan'],['🥚','æg'],['🌾','havre'],['🍯','honning']]]
];
const SP_VARER=(()=>{const m={};SP_RETTER.forEach(r=>r[1].forEach(([e,n])=>m[e]=n));return Object.entries(m)})();
const SP_FRI=[['🍫','chokolade',20],['🥤','sodavand',15],['🍩','donut',18],['🍟','pomfritter',25],['🍬','slik',22],['🧁','kage',20],['⚡','energidrik',25]];

// ---------- Siden ----------
let spV=null; // det kørende spil
function spilInfo(){const s=SP();return s.best?'Rekord: '+s.best.toLocaleString('da-DK')+' point':'Fang maden – pas på pengene'}
function spilSide(){const s=SP(),idag=iso(new Date()),dag=s.dag[idag];
  setTimeout(spStart0,0);
  return `<div class="spilwrap">
  <div id="spmenu" class="kort spkort">
    <div class="sptitel">🧺 Kurv-Kaos</div>
    <p class="sptekst">Tingene falder ned fra hylderne. Styr kurven med fingeren og fang det, du skal bruge til retten. Lav så mange retter som muligt, før pengene slipper op.</p>
    <div class="spregler">
      <div>✅ <b>På listen</b> – fang dem og lav retten</div>
      <div>🍫 <b>Fristelser</b> – koster 15–25 kr</div>
      <div>🥫 <b>Ikke på listen</b> – koster lidt</div>
      <div>🪙 <b>Mønt</b> +10 kr · 🏷️ <b>Tilbud</b> = alt falder langsomt</div>
    </div>
    <button class="b spstor" onclick="spNyt(false)">▶️ Spil</button>
    <button class="b spstor sp2" onclick="spNyt(true)">📅 Dagens udfordring</button>
    <p class="muted" style="font-size:14px;margin:6px 2px 0">Dagens udfordring er ens for alle i dag. Spil den og se, om dine venner kan slå dig.</p>
    <div class="sptal"><div><b>${s.best.toLocaleString('da-DK')}</b><span>Rekord</span></div><div><b>${dag?dag.toLocaleString('da-DK'):'–'}</b><span>I dag</span></div><div><b>${s.retter.toLocaleString('da-DK')}</b><span>Retter i alt</span></div></div>
    <label class="splyd"><input type="checkbox" ${s.lyd?'checked':''} onchange="SP().lyd=this.checked;save()"> 🔊 Lyd</label>
  </div>
  <div id="spbane" class="spbane" hidden>
    <canvas id="spcv"></canvas>
    <button id="sppause" class="sppause" onclick="spPause()" aria-label="Pause">⏸️</button>
    <div id="spover" class="spover" hidden></div>
  </div>
  </div>`}

(function(){const st=document.createElement('style');st.textContent=`
.t-spil{grid-column:1/-1;background-position:center 40%}
@media (min-width:761px){.t-spil{grid-column:auto}}
.spilwrap{max-width:560px;margin:0 auto}
.spkort{background:var(--card);border-radius:22px;padding:16px;box-shadow:var(--skygge);margin:12px 0}
.sptitel{font-size:28px;font-weight:800}
.sptekst{font-size:17px;line-height:1.45;margin:8px 0 12px}
.spregler{display:grid;gap:6px;font-size:15.5px;background:var(--felt,rgba(0,0,0,.04));border-radius:14px;padding:12px;margin-bottom:14px}
.spstor{display:block;width:100%;font-size:20px;padding:16px;margin:8px 0;border-radius:16px}
.sp2{filter:saturate(.85) brightness(.95)}
.sptal{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0 6px;text-align:center}
.sptal div{background:var(--felt,rgba(0,0,0,.04));border-radius:14px;padding:10px 4px}
.sptal b{display:block;font-size:22px}.sptal span{font-size:13px;opacity:.75}
.splyd{display:flex;gap:8px;align-items:center;font-size:16px;margin-top:10px}
.spbane{position:relative;margin:10px 0;border-radius:22px;overflow:hidden;box-shadow:var(--skygge);touch-action:none;user-select:none;-webkit-user-select:none}
#spcv{display:block;width:100%;touch-action:none}
.sppause{position:absolute;right:8px;top:8px;width:44px;height:44px;border:0;border-radius:14px;background:rgba(255,255,255,.85);font-size:20px;cursor:pointer}
.spover{position:absolute;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:16px}
.spover[hidden]{display:none}
.spboks{background:var(--card);color:var(--tekst,inherit);border-radius:22px;padding:18px;width:100%;max-width:360px;text-align:center}
.spboks h2{margin:0 0 6px;font-size:26px}.spboks .stort{font-size:44px;font-weight:800;margin:4px 0}
.spboks button{width:100%;font-size:18px;padding:14px;margin-top:8px;border-radius:14px}`;document.head.appendChild(st)})();

// ---------- Lyd (lavet i telefonen, ingen filer) ----------
let spAC=null;
function spBip(f,t,typ){if(!SP().lyd)return;try{spAC=spAC||new (window.AudioContext||window.webkitAudioContext)();const o=spAC.createOscillator(),g=spAC.createGain();o.type=typ||'sine';o.frequency.value=f;g.gain.setValueAtTime(.12,spAC.currentTime);g.gain.exponentialRampToValueAtTime(.001,spAC.currentTime+(t||.12));o.connect(g);g.connect(spAC.destination);o.start();o.stop(spAC.currentTime+(t||.12))}catch(e){}}

// ---------- Tilfældige tal (samme for alle ved Dagens udfordring) ----------
function spRnd(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

// Emoji tegnes én gang og gemmes
const spEmo={};
function spBillede(e,st){const k=e+st;if(spEmo[k])return spEmo[k];const c=document.createElement('canvas'),p=Math.ceil(st*1.3);c.width=c.height=p;const x=c.getContext('2d');x.font=`${st}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(e,p/2,p/2+st*.06);return spEmo[k]=c}

function spStart0(){/* siden er tegnet – intet at gøre før man trykker Spil */}

function spNyt(dagens){const bane=document.getElementById('spbane'),menu=document.getElementById('spmenu');if(!bane)return;
  menu.hidden=true;bane.hidden=false;const cv=document.getElementById('spcv');
  const W=bane.clientWidth,H=Math.round(Math.min(620,Math.max(420,innerHeight*.68)));const dpr=Math.min(2,devicePixelRatio||1);
  cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+'px';const ctx=cv.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);
  const idag=iso(new Date());const seed=dagens?[...idag].reduce((a,c)=>a*31+c.charCodeAt(0)|0,7):(Math.random()*1e9|0);
  const rnd=spRnd(seed);
  spV={cv,ctx,W,H,rnd,dagens,idag,penge:100,point:0,retter:0,kombi:0,tid:0,fart:1,ting:[],tekster:[],slow:0,kurvX:W/2,maalX:W/2,kurvB:Math.max(70,Math.min(96,W*.2)),pause:false,slut:false,sidst:0,spawn:0,ryst:0,ret:null,fanget:{}};
  spNyRet();
  const flyt=ev=>{if(!spV)return;const r=cv.getBoundingClientRect();spV.maalX=Math.max(0,Math.min(spV.W,ev.clientX-r.left))};
  cv.onpointerdown=ev=>{flyt(ev);try{cv.setPointerCapture(ev.pointerId)}catch(e){}};cv.onpointermove=flyt;
  document.onkeydown=ev=>{if(!spV||spV.slut)return;if(ev.key==='ArrowLeft'||ev.key==='a')spV.maalX=Math.max(0,spV.kurvX-60);if(ev.key==='ArrowRight'||ev.key==='d')spV.maalX=Math.min(spV.W,spV.kurvX+60);if(ev.key===' '||ev.key==='p'){ev.preventDefault();spPause()}};
  document.getElementById('spover').hidden=true;document.getElementById('sppause').hidden=false;
  bane.scrollIntoView({behavior:'smooth',block:'center'});
  spV.sidst=performance.now();requestAnimationFrame(spLoop);spBip(660,.1)}

function spNyRet(){const v=spV;let r;do{r=SP_RETTER[Math.floor(v.rnd()*SP_RETTER.length)]}while(v.ret&&r[0]===v.ret[0]);v.ret=r;v.fanget={}}
function spMangler(){return spV.ret[1].filter(([e])=>!spV.fanget[e])}

function spLaegTing(){const v=spV,r=v.rnd(),st=Math.max(38,Math.min(52,v.W*.11));let t;
  const fri=Math.min(.34,.18+v.retter*.02);
  if(r<.38){const m=spMangler();const x=m[Math.floor(v.rnd()*m.length)];t={e:x[0],navn:x[1],slags:'liste'}}
  else if(r<.38+fri){const x=SP_FRI[Math.floor(v.rnd()*SP_FRI.length)];t={e:x[0],navn:x[1],slags:'fri',pris:x[2]}}
  else if(r<.38+fri+.09){t={e:'🪙',navn:'mønt',slags:'moent'}}
  else if(r<.38+fri+.125){t={e:'🏷️',navn:'tilbud',slags:'tilbud'}}
  else{const paa=v.ret[1].map(x=>x[0]);const andre=SP_VARER.filter(([e])=>!paa.includes(e));const x=andre[Math.floor(v.rnd()*andre.length)];t={e:x[0],navn:x[1],slags:'anden',pris:5+Math.floor(v.rnd()*4)*2}}
  t.st=st;t.x=st/2+v.rnd()*(v.W-st);t.y=-st;t.vy=(90+v.rnd()*60)*v.fart;t.rot=(v.rnd()-.5)*.6;v.ting.push(t)}

function spTekst(x,y,tx,farve){spV.tekster.push({x,y,tx,farve,liv:1})}

function spFang(t){const v=spV;
  if(t.slags==='liste'){if(v.fanget[t.e]){v.point+=5;spTekst(t.x,t.y,'+5','#2e7d32');return}
    v.fanget[t.e]=1;v.kombi++;const p=10*Math.min(5,v.kombi);v.point+=p;spTekst(t.x,t.y,'+'+p+(v.kombi>1?' ×'+Math.min(5,v.kombi):''),'#2e7d32');spBip(520+v.kombi*60,.1);
    if(!spMangler().length){v.retter++;const bonus=100*v.retter;v.point+=bonus;v.penge+=25;spTekst(v.W/2,v.H*.42,'🍽️ '+v.ret[0]+' er klar! +'+bonus,'#1b5e20');spTekst(v.W/2,v.H*.42+34,'Mad hjemme sparer penge: +25 kr','#1b5e20');
      spBip(784,.12);setTimeout(()=>spBip(988,.18),120);v.fart=Math.min(2.6,v.fart*1.1);spNyRet()}}
  else if(t.slags==='fri'){v.penge-=t.pris;v.kombi=0;v.ryst=.3;spTekst(t.x,t.y,'Fristelse! −'+t.pris+' kr','#c62828');spBip(180,.25,'sawtooth');try{navigator.vibrate&&navigator.vibrate(60)}catch(e){}}
  else if(t.slags==='anden'){v.penge-=t.pris;spTekst(t.x,t.y,'Ikke på listen −'+t.pris+' kr','#e65100');spBip(300,.12,'triangle')}
  else if(t.slags==='moent'){v.penge+=10;v.point+=10;spTekst(t.x,t.y,'+10 kr','#f9a825');spBip(1046,.08);setTimeout(()=>spBip(1318,.1),70)}
  else if(t.slags==='tilbud'){v.slow=5;spTekst(t.x,t.y,'Tilbud! Alt går langsomt','#6a1b9a');spBip(880,.2)}
  if(v.penge<=0){v.penge=0;spSlut()}}

function spLoop(nu){const v=spV;if(!v||v.slut)return;if(!document.getElementById('spcv')||v.cv!==document.getElementById('spcv')){spV=null;document.onkeydown=null;return}
  let dt=Math.max(0,Math.min(.05,(nu-v.sidst)/1000));v.sidst=Math.max(v.sidst,nu);if(v.pause){requestAnimationFrame(spLoop);return}
  v.tid+=dt;v.fart+=dt*.004;if(v.slow>0)v.slow-=dt;const f=v.slow>0?.45:1;
  v.kurvX+=(v.maalX-v.kurvX)*Math.min(1,dt*14);
  v.spawn-=dt;if(v.spawn<=0){spLaegTing();v.spawn=Math.max(.32,.95-v.tid*.006-v.retter*.03)/Math.max(1,f*1.2)}
  const ky=v.H-58,kb=v.kurvB;
  for(let i=v.ting.length-1;i>=0;i--){const t=v.ting[i];t.y+=t.vy*dt*f;
    if(t.y>ky-t.st*.35&&t.y<ky+20&&Math.abs(t.x-v.kurvX)<kb/2+t.st*.25){v.ting.splice(i,1);spFang(t);if(v.slut)return;continue}
    if(t.y>v.H+t.st){v.ting.splice(i,1);if(t.slags==='liste')v.kombi=0}}
  v.tekster.forEach(t=>{t.y-=36*dt;t.liv-=dt*.7});v.tekster=v.tekster.filter(t=>t.liv>0);if(v.ryst>0)v.ryst-=dt;
  spTegn();requestAnimationFrame(spLoop)}

function spTegn(){const v=spV,c=v.ctx,W=v.W,H=v.H;c.save();if(v.ryst>0)c.translate((Math.random()-.5)*8,0);
  const cs=getComputedStyle(document.body),acc=(cs.getPropertyValue('--acc')||'#2a9d8f').trim()||'#2a9d8f';
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#fff8ec');g.addColorStop(1,'#ffe9cc');c.fillStyle=g;c.fillRect(-10,0,W+20,H);
  // hylder i baggrunden
  c.globalAlpha=.18;c.fillStyle='#8d6e63';for(let y=150;y<H-90;y+=95)c.fillRect(0,y,W,8);c.globalAlpha=1;
  if(v.slow>0){c.fillStyle='rgba(106,27,154,.08)';c.fillRect(0,0,W,H)}
  // ting der falder
  v.ting.forEach(t=>{const b=spBillede(t.e,t.st),s=t.st*1.3;c.save();c.translate(t.x,t.y);c.rotate(t.rot*Math.sin(v.tid*2+t.x));
    if(t.slags==='liste'&&!v.fanget[t.e]){c.beginPath();c.arc(0,0,t.st*.62,0,7);c.fillStyle='rgba(46,125,50,.18)';c.fill();c.strokeStyle='#2e7d32';c.lineWidth=2;c.stroke()}
    c.drawImage(b,-s/2,-s/2,s,s);
    if(t.pris){c.font='800 12px system-ui';c.textAlign='center';const tx='−'+t.pris;c.fillStyle=t.slags==='fri'?'#c62828':'#e65100';spRund(c,-16,t.st*.42,32,17,8);c.fill();c.fillStyle='#fff';c.fillText(tx,0,t.st*.42+13)}
    c.restore()});
  // øverst: penge, point og retten
  c.fillStyle='rgba(255,255,255,.92)';spRund(c,8,8,W-64,96,16);c.fill();
  c.fillStyle=v.penge<30?'#c62828':'#1b5e20';c.font='800 22px system-ui,sans-serif';c.textAlign='left';c.textBaseline='alphabetic';c.fillText('💰 '+Math.round(v.penge)+' kr',18,36);
  c.fillStyle='#333';c.textAlign='right';c.fillText(v.point.toLocaleString('da-DK')+' p',W-66,36);
  c.textAlign='left';c.font='700 15px system-ui,sans-serif';c.fillStyle='#555';c.fillText('Lav: '+v.ret[0]+(v.kombi>1?'   ×'+Math.min(5,v.kombi):''),18,58);
  v.ret[1].forEach(([e],i)=>{const har=v.fanget[e];c.globalAlpha=har?1:.28;c.drawImage(spBillede(e,26),18+i*40,64,34,34);if(har){c.globalAlpha=1;c.fillStyle='#2e7d32';c.font='700 15px system-ui';c.fillText('✓',44+i*40,96)}});c.globalAlpha=1;
  // kurven
  const ky=H-58,kb=v.kurvB;c.fillStyle=acc;spRund(c,v.kurvX-kb/2,ky,kb,34,10);c.fill();c.fillStyle='rgba(255,255,255,.35)';for(let i=1;i<4;i++)c.fillRect(v.kurvX-kb/2+i*kb/4-1.5,ky+5,3,24);
  c.strokeStyle=acc;c.lineWidth=5;c.beginPath();c.arc(v.kurvX,ky+2,kb*.34,Math.PI,0);c.stroke();
  c.fillStyle='rgba(0,0,0,.35)';c.font='600 13px system-ui';c.textAlign='center';if(v.tid<4)c.fillText('Træk med fingeren ↔',W/2,H-10);
  // flyvende tekst
  v.tekster.forEach(t=>{c.globalAlpha=Math.max(0,Math.min(1,t.liv*1.5));c.font='800 17px system-ui,sans-serif';c.textAlign='center';c.lineWidth=4;c.strokeStyle='#fff';const x=Math.max(90,Math.min(W-90,t.x));c.strokeText(t.tx,x,t.y);c.fillStyle=t.farve;c.fillText(t.tx,x,t.y)});c.globalAlpha=1;
  c.restore()}
function spRund(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}

function spPause(){const v=spV;if(!v||v.slut)return;v.pause=!v.pause;const o=document.getElementById('spover');
  if(v.pause){o.innerHTML=`<div class="spboks"><h2>⏸️ Pause</h2><button class="b" onclick="spPause()">▶️ Fortsæt</button><button class="l" onclick="spLuk()">Stop spillet</button></div>`;o.hidden=false}
  else{o.hidden=true;v.sidst=performance.now()}}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&spV&&!spV.slut&&!spV.pause)spPause()});

function spSlut(){const v=spV;v.slut=true;spTegn();const s=SP();s.spillet++;s.retter+=v.retter;const rekord=v.point>s.best;if(rekord)s.best=v.point;
  if(v.dagens)s.dag[v.idag]=Math.max(s.dag[v.idag]||0,v.point);
  const dage=Object.keys(s.dag).sort();while(dage.length>30)delete s.dag[dage.shift()];
  try{save()}catch(e){}
  spBip(330,.2,'triangle');setTimeout(()=>spBip(220,.35,'triangle'),180);
  document.getElementById('sppause').hidden=true;const o=document.getElementById('spover');
  o.innerHTML=`<div class="spboks"><h2>${rekord?'🏆 Ny rekord!':'Pengene slap op 💸'}</h2>
    <div class="stort">${v.point.toLocaleString('da-DK')} p</div>
    <div style="font-size:17px">Du lavede <b>${v.retter}</b> ${v.retter===1?'ret':'retter'}${v.dagens?' i Dagens udfordring':''}</div>
    <button class="b" onclick="spNyt(${v.dagens})">🔁 Spil igen</button>
    <button class="b" onclick="spDel(${v.point},${v.retter},${v.dagens})">📤 Udfordr en ven</button>
    <button class="l" onclick="spLuk()">Tilbage</button></div>`;o.hidden=false}

function spLuk(){spV=null;document.onkeydown=null;vis()}
async function spDel(p,r,dagens){const tx=`Jeg fik ${p.toLocaleString('da-DK')} point og lavede ${r} ${r===1?'ret':'retter'} i Kurv-Kaos${dagens?' (Dagens udfordring '+new Date().toLocaleDateString('da-DK')+')':''} i Budget og Mad. Kan du slå mig? 🧺`;
  if(navigator.share){try{await navigator.share({text:tx});return}catch(e){if(e.name==='AbortError')return}}
  try{await navigator.clipboard.writeText(tx);toast('Teksten er kopieret – sæt den ind i en besked')}catch(e){prompt('Kopier teksten:',tx)}}
