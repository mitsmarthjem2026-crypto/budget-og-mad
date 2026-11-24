// Budget og Mad – Motion og vægttab (version 48).
// Alt gemmes kun på telefonen (i appens egne data), ligesom resten af appen.
// Rådene er almindelige, sunde råd – ikke lægeråd.

function MO(){if(!D.motion||typeof D.motion!=='object'||Array.isArray(D.motion))D.motion={};const m=D.motion;
  ['log','vaegt'].forEach(k=>{if(!Array.isArray(m[k]))m[k]=[]});
  ['udf','maal'].forEach(k=>{if(!m[k]||typeof m[k]!=='object'||Array.isArray(m[k]))m[k]={}});
  if(typeof m.lyd!=='boolean')m.lyd=true;return m}
const moIdag=()=>iso(new Date());
const moTal=v=>{const n=parseFloat(String(v||'').replace(',','.'));return isFinite(n)?n:NaN};
const moKg=n=>(Math.round(n*10)/10).toLocaleString('da-DK')+' kg';
let moFane='motion';

// ---------- Øvelser uden udstyr ----------
const MO_OEV={
  jj:['🤸','Sprællemand','Hop ud med arme og ben, og saml dem igen.'],
  squat:['🦵','Squat','Fødderne i skulderbredde. Sæt dig ned, som på en stol, og rejs dig igen.'],
  arm:['💪','Armbøjninger','Hold kroppen lige. Det er helt fint at stå på knæene.'],
  planke:['🧱','Planke','Hvil på underarme og tæer. Hold kroppen lige som et bræt.'],
  udfald:['🚶','Udfald','Tag et langt skridt frem, bøj begge knæ, og skift ben.'],
  knae:['🏃','Høje knæ','Løb på stedet, og løft knæene højt.'],
  bro:['🌉','Bækkenløft','Lig på ryggen med bøjede knæ. Løft numsen op, og sænk den igen.'],
  bjerg:['⛰️','Bjergbestiger','Stå som til armbøjninger, og træk knæene skiftevis op mod brystet.'],
  boks:['🥊','Skyggeboksning','Slå ud i luften – hurtigt og let på fødderne.'],
  vaeg:['🪑','Vægsid','Sæt dig op ad en væg, som om du sidder på en usynlig stol.'],
  superman:['🦸','Superman','Lig på maven. Løft arme og ben lidt fra gulvet, og hold.'],
  skoejte:['⛸️','Skøjteløber','Hop fra side til side som en skøjteløber.'],
  burpee:['🔥','Let burpee','Hænderne i gulvet, træd benene tilbage og frem igen, og rejs dig.'],
  dans:['💃','Fri dans','Sæt din yndlingssang på, og dans lige som du vil!'],
  s_arme:['🙆','Stræk armene','Stræk armene højt op, og gør dig lang. Træk vejret roligt.'],
  s_side:['🌙','Sidebøjning','Armen over hovedet, og bøj roligt til siden. Skift side halvvejs.'],
  s_baglaar:['🧘','Bagsiden af lårene','Læn dig roligt frem mod tæerne. Ingen vippen – bare hæng.'],
  s_hofte:['🦩','Forsiden af låret','Stå på ét ben, og tag fat om den anden fod bag dig. Skift halvvejs.'],
  s_ryg:['🐈','Kat og ko','På alle fire: skiftevis rund ryg og svaj ryg – roligt.'],
  s_vejr:['🌬️','Rolig vejrtrækning','Træk vejret ind i 4 sekunder og ud i 6 sekunder.']
};
const MO_STYRKE=['jj','squat','arm','planke','udfald','knae','bro','bjerg','boks','vaeg','superman','skoejte','burpee'];
const MO_TRAEN=[
  {id:'vaagn',e:'⚡',navn:'Vågn op',min:5,tekst:'5 min · nemt og hurtigt',arb:40,pause:10,oev:['jj','squat','knae','arm','bro','boks']},
  {id:'hele',e:'🔥',navn:'Hele kroppen',min:10,tekst:'10 min · få sved på panden',arb:40,pause:10,oev:['jj','squat','arm','udfald','planke','knae','bro','bjerg','vaeg','superman','skoejte','burpee']},
  {id:'random',e:'🎲',navn:'Overrask mig',min:7,tekst:'7 min · du ved ikke, hvad der kommer',arb:40,pause:10,oev:null},
  {id:'dans',e:'💃',navn:'Dansepause',min:3,tekst:'3 min · musik på og dans',arb:180,pause:0,oev:['dans']},
  {id:'stille',e:'🧘',navn:'Stræk ud',min:5,tekst:'5 min · roligt, fx før du sover',arb:45,pause:5,oev:['s_arme','s_side','s_baglaar','s_hofte','s_ryg','s_vejr']}
];
const MO_TYPER=[['gaa','🚶','Gåtur'],['cykel','🚲','Cykel'],['loeb','🏃','Løb'],['sport','⚽','Sport'],['dans','💃','Dans'],['fitness','🏋️','Fitness'],['andet','✨','Andet']];
const MO_UDF=['Tag trappen i stedet for elevatoren i dag 🪜','Gå en tur på 15 minutter – gerne med en ven 🚶','Lav 20 squats, mens du venter på, at vandet koger 🍝','Drik et glas vand til hvert måltid 💧','Dans til 2 sange i træk 🎶','Hold planken i 30 sekunder 🧱','Stå af bussen et stop før, og gå resten 🚌','Gå 10 minutter efter aftensmaden 🌙','Lav 10 armbøjninger – gerne på knæ 💪','Spis en grøntsag til hvert måltid i dag 🥕','Stræk ud i 5 minutter, før du sover 🧘','Gå rundt, mens du snakker i telefon 📱','Lav 1 minut høje knæ ⏱️','Tag cyklen i stedet for bussen i dag 🚲','Tag en frugt i stedet for slik i dag 🍎','Gå i seng en halv time før i aften 😴','Lav 30 sprællemænd på én gang 🤸','Gå 3.000 skridt mere end i går 👣'];
const MO_HJUL=[['🤸','20 sprællemænd'],['🦵','15 squats'],['🧱','30 sek. planke'],['💪','10 armbøjninger'],['🏃','1 min. høje knæ'],['💃','Dans til 1 sang'],['🚶','10 udfald på hvert ben'],['🪜','Trappen op og ned 2 gange']];
const MO_NIV=[[0,'🥔','Sofa-kartoffel'],[50,'🐣','Godt i gang'],[150,'🚶','Gå-helt'],[300,'💦','Svedperle'],[600,'⚡','Energibombe'],[1000,'🦸','Superhelt'],[2000,'🏆','Legende']];
const MO_HEP=['Sejt klaret! 🎉','Du er en maskine! 🤖','Høj-fem! ✋','Kroppen siger tak! 💚','Wow – det var stærkt! 💪','Godt gået – du gjorde det! 🌟'];

// ---------- Tal ud fra dine egne data ----------
function moDageMedAkt(){const m=MO(),s=new Set();m.log.forEach(x=>{if(x.type==='skridt'?x.skridt>0:true)s.add(x.dato)});Object.keys(m.udf).forEach(k=>{if(m.udf[k])s.add(k)});return s}
function moStreak(){const s=moDageMedAkt(),d=new Date();d.setHours(12,0,0,0);if(!s.has(iso(d)))d.setDate(d.getDate()-1);let n=0;while(s.has(iso(d))){n++;d.setDate(d.getDate()-1)}return n}
function moBedsteStreak(){const l=[...moDageMedAkt()].sort();let best=0,n=0,forr=null;l.forEach(k=>{const t=new Date(k+'T12:00:00');n=(forr&&Math.round((t-forr)/864e5)===1)?n+1:1;forr=t;if(n>best)best=n});return best}
function moMin(dato){return MO().log.filter(x=>x.dato===dato&&x.min>0).reduce((a,x)=>a+x.min,0)}
function moSkridt(dato){const x=MO().log.find(x=>x.dato===dato&&x.type==='skridt');return x?x.skridt:0}
function moPoint(){const m=MO();let p=0;m.log.forEach(x=>{if(x.type==='skridt')p+=Math.floor((x.skridt||0)/1000);else if(x.type==='hjul')p+=5;else p+=Math.round(x.min||0)});p+=10*Object.values(m.udf).filter(Boolean).length;return p}
function moNiveau(p){let i=0;MO_NIV.forEach((n,j)=>{if(p>=n[0])i=j});const nu=MO_NIV[i],nx=MO_NIV[i+1];return{e:nu[1],navn:nu[2],nx,pct:nx?Math.round((p-nu[0])/(nx[0]-nu[0])*100):100}}
function moDagMaal(){return +MO().maal.min||30}
function moDagensUdf(){const m=MO(),d=moIdag(),skift=(m.udfSkift&&m.udfSkift.dato===d)?m.udfSkift.n:0;const n=Math.floor(new Date(d+'T12:00:00')/864e5);return MO_UDF[((n*7)+skift*5)%MO_UDF.length]}
function moVaegtSort(){return MO().vaegt.filter(x=>x&&x.kg>0&&x.dato).sort((a,b)=>a.dato<b.dato?-1:1)}

// ---------- Kort på forsiden ----------
function motionKort(){
  const st=moStreak(),min=moMin(moIdag()),mal=moDagMaal(),v=moVaegtSort(),sidst=v[v.length-1],pct=Math.min(100,Math.round(min/mal*100));
  const udfOk=!!MO().udf[moIdag()];
  return `<div class="card mokort" onclick="gaaTil('motion')" role="button">
  <div class="row" style="justify-content:space-between;flex-wrap:nowrap"><b style="font-size:19px">💪 Motion og vægttab</b><span class="mopil">›</span></div>
  <div class="mostat3"><div><span>🔥</span><b>${st}</b><small>${st===1?'dag i træk':'dage i træk'}</small></div><div><span>⏱️</span><b>${min}/${mal}</b><small>min i dag</small></div><div><span>⚖️</span><b>${sidst?moKg(sidst.kg):'–'}</b><small>${sidst?'seneste vægt':'ikke vejet'}</small></div></div>
  <div class="mobar"><i style="width:${pct}%"></i></div>
  <div class="row" style="margin-top:10px"><button class="b mobtn" style="flex:1" onclick="event.stopPropagation();moStart('vaagn')">▶ Træn 5 min</button><button class="l" style="flex:1" onclick="event.stopPropagation();moFane='motion';gaaTil('motion');setTimeout(()=>{const e=document.getElementById('moudf');if(e)e.scrollIntoView({behavior:'smooth',block:'center'})},50)">${udfOk?'✅ Udfordring klaret':'🎯 Dagens udfordring'}</button></div></div>`;
}

// Tekst på fotoknappen (version 52)
function motionInfo(){const st=moStreak(),v=moVaegtSort(),s=v[v.length-1];return st?'🔥 '+st+(st===1?' dag':' dage')+' i træk · '+moMin(moIdag())+' min i dag':s?'Seneste vægt: '+moKg(s.kg):'Træn, drej hjulet, følg din vægt'}

// ---------- Siden ----------
function motionSide(){
  const p=moPoint(),nv=moNiveau(p);
  return `<div class="mohero"><div class="moh2" style="margin-top:0">${nv.e} ${nv.navn} · ${p} point</div>
  <div class="mobar mobar2"><i style="width:${nv.pct}%"></i></div><div class="moh3">${nv.nx?`${nv.nx[0]-p} point til ${nv.nx[1]} ${nv.nx[2]}`:'Du har nået toppen! 🏆'}</div></div>
  <div class="mofaner">${[['motion','🏃 Motion'],['vaegt','⚖️ Vægt'],['maerker','🏅 Mærker']].map(([k,t])=>`<button class="${moFane===k?'on':''}" onclick="moFane='${k}';vis()">${t}</button>`).join('')}</div>
  ${moFane==='vaegt'?moVaegtFane():moFane==='maerker'?moMaerkerFane():moMotionFane()}`;
}

function moMotionFane(){
  const m=MO(),d=moIdag(),st=moStreak(),min=moMin(d),mal=moDagMaal(),sk=moSkridt(d),udfOk=!!m.udf[d];
  const ring=Math.min(1,min/mal),R=34,O=2*Math.PI*R;
  const uge=[];for(let i=6;i>=0;i--){const t=new Date();t.setDate(t.getDate()-i);uge.push({k:iso(t),n:DAGE[(t.getDay()+6)%7].slice(0,3),min:moMin(iso(t))})}
  const maxU=Math.max(mal,...uge.map(u=>u.min));const ugeSum=uge.reduce((a,u)=>a+u.min,0);
  const seneste=m.log.slice().sort((a,b)=>(b.dato+(b.t||''))>(a.dato+(a.t||''))?1:-1).slice(0,8);
  return `<div class="card"><div class="row" style="flex-wrap:nowrap;gap:14px">
    <svg width="84" height="84" viewBox="0 0 84 84" style="flex:none"><circle cx="42" cy="42" r="${R}" fill="none" stroke="var(--felt,#eef)" stroke-width="10"/><circle cx="42" cy="42" r="${R}" fill="none" stroke="url(#mog)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${O}" stroke-dashoffset="${O*(1-ring)}" transform="rotate(-90 42 42)"/><defs><linearGradient id="mog"><stop offset="0" stop-color="#f97316"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><text x="42" y="40" text-anchor="middle" font-size="19" font-weight="700" fill="currentColor">${min}</text><text x="42" y="56" text-anchor="middle" font-size="11" fill="currentColor" opacity=".6">af ${mal} min</text></svg>
    <div style="flex:1"><div style="font-size:20px;font-weight:700">🔥 ${st} ${st===1?'dag':'dage'} i træk</div>
    <div class="muted">${min>=mal?'Dagens mål er nået – flot! 🎉':st&&!moDageMedAkt().has(d)?'Rør dig lidt i dag, så holder du din stime i live.':'Bare 10 minutter tæller. Alt er bedre end ingenting.'}</div>
    ${sk?`<div class="muted">👣 ${sk.toLocaleString('da-DK')} skridt i dag</div>`:''}</div></div></div>

  <div class="card moudf ${udfOk?'ok':''}" id="moudf"><div class="muted" style="font-weight:600">🎯 DAGENS UDFORDRING</div>
    <div style="font-size:19px;font-weight:700;margin:6px 0 10px">${esc(moDagensUdf())}</div>
    ${udfOk?`<div class="row"><b style="flex:1">✅ Klaret! +10 point</b><button class="l" onclick="moUdf(false)">Fortryd</button></div>`:`<div class="row"><button class="b mobtn" style="flex:1" onclick="moUdf(true)">✅ Klaret!</button><button class="l" onclick="moUdfSkift()">🔄 En anden</button></div>`}</div>

  <div class="card"><b style="font-size:18px">▶ Træn nu – uden udstyr</b><p class="muted" style="margin:2px 0 10px">Jeg tæller tiden og siger, hvad du skal. Du skal bare følge med.</p>
    <div class="motraen">${MO_TRAEN.map(t=>`<button onclick="moStart('${t.id}')"><span class="moe">${t.e}</span><b>${t.navn}</b><small>${t.tekst}</small></button>`).join('')}</div></div>

  <div class="card"><b style="font-size:18px">🎡 Lykkehjulet</b><p class="muted" style="margin:2px 0 8px">Drej hjulet, og lav det, det lander på. +5 point.</p>
    <div class="mohjulboks"><div class="mohjulpil">▼</div><div class="mohjul" id="mohjul">${MO_HJUL.map((h,i)=>`<span style="transform:rotate(${i*45+22.5}deg) translateY(-92px) rotate(${-(i*45+22.5)}deg)">${h[0]}</span>`).join('')}</div></div>
    <div id="mohjulres" class="mohjulres"></div>
    <button class="b mobtn" style="width:100%" id="mohjulknap" onclick="moDrej()">🎡 Drej hjulet</button></div>

  <div class="card"><b style="font-size:18px">✍️ Skriv hvad du har lavet</b><p class="muted" style="margin:2px 0 10px">Tryk på det, du har lavet i dag.</p>
    <div class="motyper">${MO_TYPER.map(t=>`<button onclick="moLogDlg('${t[0]}')"><span>${t[1]}</span>${t[2]}</button>`).join('')}</div>
    <div class="row" style="margin-top:12px"><label style="margin:0">👣 Skridt i dag</label><input id="moskridt" inputmode="numeric" style="flex:1;min-width:110px" placeholder="Fx 6500" value="${sk||''}"><button class="b" onclick="moGemSkridt()">Gem</button></div>
    <p class="muted" style="font-size:13px;margin:6px 0 0">Skridt kan du se i telefonens egen sundheds-app.</p></div>

  <div class="card"><div class="row" style="justify-content:space-between"><b style="font-size:18px">📊 Din uge</b><span class="muted">${ugeSum} min i alt</span></div>
    <div class="mouge">${uge.map(u=>`<div><small>${u.min||''}</small><i style="height:${Math.max(3,Math.round(u.min/maxU*100))}%;${u.min>=mal?'':'opacity:.45'}"></i><span${u.k===d?' style="font-weight:700"':''}>${u.n}</span></div>`).join('')}</div>
    <div class="row" style="margin-top:10px"><span class="muted">Mål pr. dag:</span>${[15,30,45,60].map(n=>`<button class="${n===mal?'b':'l'}" style="padding:6px 12px" onclick="moSaetMaal(${n})">${n} min</button>`).join('')}</div>
    <p class="muted" style="font-size:13px;margin:8px 0 0">Sundhedsstyrelsen anbefaler voksne mindst 150 min. om ugen, hvor du får pulsen op. For børn og unge op til 17 år er det 60 min. om dagen.</p></div>

  ${seneste.length?`<div class="card"><b>🕒 Det har du lavet</b><ul class="list">${seneste.map(x=>`<li><span style="flex:1">${moLogTekst(x)}</span><span class="muted" style="font-size:13px">${new Date(x.dato+'T12:00:00').toLocaleDateString('da-DK',{day:'numeric',month:'short'})}</span><button class="l" style="padding:4px 10px" title="Slet" onclick="moSletLog('${x.id}')">✕</button></li>`).join('')}</ul></div>`:''}`;
}
function moLogTekst(x){if(x.type==='skridt')return '👣 '+(x.skridt||0).toLocaleString('da-DK')+' skridt';if(x.type==='hjul')return '🎡 '+esc(x.navn||'Lykkehjul');if(x.type==='traening')return esc(x.navn||'Træning')+' · '+x.min+' min';const t=MO_TYPER.find(t=>t[0]===x.type)||['','✨','Aktivitet'];return t[1]+' '+t[2]+' · '+x.min+' min'}

// ---------- Handlinger ----------
function moTilfoj(o){const m=MO();m.log.push({id:id(),dato:moIdag(),t:new Date().toTimeString().slice(0,5),...o})}
function moUdf(ok){const s=snap(),m=MO();if(ok)m.udf[moIdag()]=true;else delete m.udf[moIdag()];save();vis();if(ok){moFest();toast(MO_HEP[Math.floor(Math.random()*MO_HEP.length)]+' +10 point',fortrydTil(s))}}
function moUdfSkift(){const m=MO(),d=moIdag();m.udfSkift={dato:d,n:((m.udfSkift&&m.udfSkift.dato===d)?m.udfSkift.n:0)+1};save();vis()}
function moSaetMaal(n){MO().maal.min=n;save();vis()}
function moSletLog(lid){const s=snap(),m=MO();m.log=m.log.filter(x=>x.id!==lid);save();vis();toast('Slettet',fortrydTil(s))}
function moGemSkridt(){const n=Math.round(moTal(document.getElementById('moskridt').value));if(!(n>=0)||n>100000){toast('Skriv et tal, fx 6500');return}
  const s=snap(),m=MO(),d=moIdag();m.log=m.log.filter(x=>!(x.dato===d&&x.type==='skridt'));if(n>0)m.log.push({id:id(),dato:d,type:'skridt',skridt:n,min:0});save();vis();toast(n>=10000?'👣 Over 10.000 skridt – vildt! 🎉':'👣 Skridt gemt',fortrydTil(s));if(n>=10000)moFest()}
function moLogDlg(type){const t=MO_TYPER.find(x=>x[0]===type);
  dlgin.innerHTML=`<h2>${t[1]} ${t[2]}</h2><p class="muted" style="margin-top:-6px">Hvor mange minutter?</p>
  <div class="motyper">${[10,15,20,30,45,60].map(n=>`<button onclick="moGemLog('${type}',${n})"><span>${n}</span>min</button>`).join('')}</div>
  <div class="row" style="margin-top:12px"><input id="mominut" inputmode="numeric" style="flex:1" placeholder="Andet antal minutter"><button class="b" onclick="moGemLog('${type}',document.getElementById('mominut').value)">Gem</button></div>
  <div class="row" style="margin-top:12px"><button class="l" style="flex:1" onclick="dlg.close()">Luk</button></div>`;dlg.showModal()}
function moGemLog(type,v){const n=Math.round(moTal(v));if(!(n>0&&n<=600)){toast('Skriv antal minutter, fx 20');return}const s=snap();moTilfoj({type,min:n});save();dlg.close();vis();moFest();toast(MO_HEP[Math.floor(Math.random()*MO_HEP.length)]+' +'+n+' point',fortrydTil(s))}

// ---------- Lykkehjul ----------
let moVinkel=0,moDrejer=false;
function moDrej(){if(moDrejer)return;const h=document.getElementById('mohjul');if(!h)return;moDrejer=true;
  const i=Math.floor(Math.random()*MO_HJUL.length);
  // Feltet i står ved (i*45+22.5) grader. Drej, så det ender under pilen øverst.
  const maal=360-(i*45+22.5);moVinkel+=1440+((maal-(moVinkel%360))+360)%360;
  h.style.transform='rotate('+moVinkel+'deg)';document.getElementById('mohjulres').innerHTML='';
  setTimeout(()=>{moDrejer=false;const r=document.getElementById('mohjulres');if(!r)return;const x=MO_HJUL[i];
    r.innerHTML=`<div style="font-size:22px;font-weight:800">${x[0]} ${esc(x[1])}</div><div class="row" style="margin-top:8px;justify-content:center"><button class="b mobtn" onclick="moHjulOk(${i})">✅ Klaret! +5</button></div>`;
    try{navigator.vibrate&&navigator.vibrate(60)}catch(e){}},3200)}
function moHjulOk(i){const s=snap();moTilfoj({type:'hjul',navn:MO_HJUL[i][1],min:0});save();vis();moFest();toast(MO_HEP[Math.floor(Math.random()*MO_HEP.length)]+' +5 point',fortrydTil(s))}

// ---------- Træning med tidtager ----------
let moP=null;
function moStart(tid){const t=MO_TRAEN.find(x=>x.id===tid);if(!t)return;
  let oev=t.oev;if(!oev){oev=MO_STYRKE.slice().sort(()=>Math.random()-.5).slice(0,8)}
  moStop(true);moP={t,oev,i:0,fase:'klar',tilbage:5,pause:false,brugt:0,timer:null};
  moTegn();if(!dlg.open)dlg.showModal();moP.timer=setInterval(moTik,1000);moSig('Gør dig klar. Første øvelse: '+MO_OEV[oev[0]][1]);
  if(!window._moLuk){window._moLuk=true;dlg.addEventListener('close',()=>moStop(false))}}
function moTik(){const p=moP;if(!p||p.pause)return;p.tilbage--;if(p.fase==='arb')p.brugt++;
  if(p.tilbage>0&&p.tilbage<=3)moBip(660);
  if(p.tilbage<=0){
    if(p.fase==='klar'){p.fase='arb';p.tilbage=p.t.arb;moBip(990,.25)}
    else if(p.fase==='arb'){if(p.i>=p.oev.length-1){moFaerdig();return}
      if(p.t.pause>0){p.fase='pause';p.tilbage=p.t.pause;moSig('Pause. Næste: '+MO_OEV[p.oev[p.i+1]][1])}else{p.i++;p.tilbage=p.t.arb;moSig(MO_OEV[p.oev[p.i]][1])}}
    else if(p.fase==='pause'){p.i++;p.fase='arb';p.tilbage=p.t.arb;moBip(990,.25)}
  }
  moTegn()}
function moTegn(){const p=moP;if(!p)return;const o=MO_OEV[p.oev[p.i]],nx=p.oev[p.i+1]?MO_OEV[p.oev[p.i+1]]:null;
  const lbl=p.fase==='klar'?'Gør dig klar':p.fase==='pause'?'Pause – træk vejret':'Kør på!';
  const vis1=p.fase==='pause'&&nx?nx:o;
  const tot=p.fase==='klar'?5:p.fase==='pause'?p.t.pause:p.t.arb;
  dlgin.innerHTML=`<div class="moplay ${p.fase}"><div class="row" style="justify-content:space-between"><b>${p.t.e} ${p.t.navn}</b><span class="muted">Øvelse ${p.i+(p.fase==='pause'?2:1)} af ${p.oev.length}</span></div>
  <div class="mofase">${lbl}</div><div class="moemoji">${vis1[0]}</div><div class="monavn">${vis1[1]}</div><div class="muted mohow">${vis1[2]}</div>
  <div class="motid">${p.tilbage}</div><div class="mobar"><i style="width:${Math.round((tot-p.tilbage)/tot*100)}%"></i></div>
  <div class="muted" style="margin-top:8px;min-height:22px">${p.fase==='arb'&&nx?'Næste: '+nx[0]+' '+nx[1]:''}</div>
  <div class="row" style="margin-top:12px"><button class="b mobtn" style="flex:1" onclick="moPause()">${p.pause?'▶ Fortsæt':'⏸ Pause'}</button><button class="l" onclick="moSpring()">⏭ Spring over</button></div>
  <div class="row" style="margin-top:8px"><button class="l" style="flex:1" onclick="moLyd()">${MO().lyd?'🔊 Lyd til':'🔇 Lyd fra'}</button><button class="l" style="flex:1" onclick="dlg.close()">✕ Stop</button></div></div>`}
function moPause(){if(moP){moP.pause=!moP.pause;moTegn()}}
function moSpring(){const p=moP;if(!p)return;if(p.fase==='arb'&&p.i>=p.oev.length-1){moFaerdig();return}if(p.fase==='arb'&&p.t.pause>0){p.fase='pause';p.tilbage=p.t.pause}else{if(p.fase!=='klar')p.i++;p.fase='arb';p.tilbage=p.t.arb}moTegn()}
function moLyd(){const m=MO();m.lyd=!m.lyd;save();if(!m.lyd&&window.speechSynthesis)speechSynthesis.cancel();moTegn()}
function moStop(stille){const p=moP;if(!p)return;clearInterval(p.timer);moP=null;if(window.speechSynthesis)speechSynthesis.cancel();
  if(!stille&&!p.slut){const n=Math.floor(p.brugt/60);if(n>=1){const s=snap();moTilfoj({type:'traening',navn:p.t.e+' '+p.t.navn,min:n});save();vis();toast('Godt gået – '+n+' min er gemt 💪',fortrydTil(s))}}}
function moFaerdig(){const p=moP;if(!p)return;p.slut=true;clearInterval(p.timer);const n=Math.max(1,Math.round(p.brugt/60));
  const s=snap();moTilfoj({type:'traening',navn:p.t.e+' '+p.t.navn,min:n});save();
  const hep=MO_HEP[Math.floor(Math.random()*MO_HEP.length)];moSig(hep.replace(/[^\p{L}\p{N} !.,–-]/gu,''));
  dlgin.innerHTML=`<div class="moplay" style="text-align:center"><div class="moemoji">🏆</div><div class="monavn">${hep}</div><p class="muted">${p.t.navn}: ${n} min er gemt. +${n} point · 🔥 ${moStreak()} ${moStreak()===1?'dag':'dage'} i træk</p>
  <div class="row" style="margin-top:12px"><button class="b mobtn" style="flex:1" onclick="dlg.close()">Super!</button></div></div>`;
  moP=null;moFest();vis();window._moFortryd=s}
function moSig(t){try{if(!MO().lyd||!window.speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='da-DK';u.rate=1.05;speechSynthesis.speak(u)}catch(e){}}
let moAC=null;function moBip(f,l){try{if(!MO().lyd)return;moAC=moAC||new (window.AudioContext||window.webkitAudioContext)();const o=moAC.createOscillator(),g=moAC.createGain();o.frequency.value=f;o.connect(g);g.connect(moAC.destination);g.gain.setValueAtTime(.15,moAC.currentTime);g.gain.exponentialRampToValueAtTime(.001,moAC.currentTime+(l||.12));o.start();o.stop(moAC.currentTime+(l||.12))}catch(e){}}

// ---------- Fest (konfetti) ----------
function moFest(){try{const b=document.createElement('div');b.className='mofest';const e=['🎉','⭐','💪','🔥','✨','💚','🏅'];
  for(let i=0;i<26;i++){const s=document.createElement('span');s.textContent=e[i%e.length];s.style.left=Math.random()*100+'vw';s.style.animationDelay=(Math.random()*.5)+'s';s.style.fontSize=(18+Math.random()*18)+'px';b.appendChild(s)}
  document.body.appendChild(b);setTimeout(()=>b.remove(),2600);navigator.vibrate&&navigator.vibrate([40,40,80])}catch(e){}}

// ---------- Vægt ----------
function moVaegtFane(){
  const m=MO(),v=moVaegtSort(),maal=+m.maal.kg||0,hoejde=+m.maal.hoejde||0,start=v[0],nu=v[v.length-1];
  let tempo=null;if(v.length>=2){const fra=new Date(nu.dato+'T12:00:00');fra.setDate(fra.getDate()-28);const l=v.filter(x=>new Date(x.dato+'T12:00:00')>=fra);const a=l[0],dage=(new Date(nu.dato)-new Date(a.dato))/864e5;if(dage>=7)tempo=(nu.kg-a.kg)/dage*7}
  const bmi=k=>hoejde?k/((hoejde/100)**2):null;
  let besked='';
  if(nu&&hoejde&&bmi(nu.kg)<18.5)besked=`<div class="card moadv">💚 <b>Din vægt er allerede lav for din højde.</b> Du behøver ikke tabe dig. Fokusér på at spise nok og have det godt – tal gerne med din læge.</div>`;
  else if(tempo!==null&&tempo<-1)besked=`<div class="card moadv">⚠️ <b>Det går meget stærkt</b> (${moKg(-tempo)} om ugen). Sæt tempoet lidt ned. Ca. ½ kg om ugen er sundt – og det bliver nemmere at holde vægten bagefter.</div>`;
  else if(tempo!==null&&tempo<=-0.2)besked=`<div class="card mook">👍 <b>Flot, roligt tempo</b> – ${moKg(-tempo)} om ugen. Bare fortsæt sådan.</div>`;
  else if(tempo!==null)besked=`<div class="card">📈 Vægten svinger fra dag til dag – det er helt normalt (vand, mad, salt). Kig på hele kurven over flere uger.</div>`;
  let maalTxt='';
  if(maal&&nu){const rest=nu.kg-maal;if(rest<=0)maalTxt=`🎉 <b>Du har nået dit mål!</b>`;else{const uger=Math.ceil(rest/0.5),dt=new Date();dt.setDate(dt.getDate()+uger*7);maalTxt=`Der er <b>${moKg(rest)}</b> til dit mål. Med ½ kg om ugen er du der ca. <b>${dt.toLocaleDateString('da-DK',{day:'numeric',month:'long',year:'numeric'})}</b>.`}}
  const maalLav=maal&&hoejde&&bmi(maal)<18.5;
  return `<div class="card"><b style="font-size:18px">⚖️ Skriv din vægt</b>
    <div class="row" style="margin-top:8px"><input id="movkg" inputmode="decimal" style="flex:1;min-width:100px" placeholder="Fx 72,5"><span>kg</span><input type="date" id="movdato" value="${moIdag()}" style="flex:1;min-width:130px"><button class="b mobtn" onclick="moGemVaegt()">Gem</button></div>
    <p class="muted" style="font-size:13px;margin:6px 0 0">Tip: Vej dig fx én gang om ugen, om morgenen, før du spiser.</p></div>
  ${v.length?`<div class="card"><b>📉 Din kurve</b><div class="mostat3 mostatv"><div><small>Start</small><b>${moKg(start.kg)}</b></div><div><small>Nu</small><b>${moKg(nu.kg)}</b></div><div><small>Ændring</small><b style="color:${nu.kg<start.kg?'#059669':'inherit'}">${nu.kg-start.kg>0?'+':''}${moKg(nu.kg-start.kg)}</b></div></div>${moGraf(v,maal)}${maalTxt?`<p style="margin:8px 0 0">${maalTxt}</p>`:''}</div>`:`<div class="card empty" style="text-align:center"><div style="font-size:40px">⚖️</div>Skriv din første vægt – så tegner jeg din kurve.</div>`}
  ${besked}
  <div class="card"><b>🎯 Dit mål</b><p class="muted" style="margin:2px 0 8px">Højde er valgfri. Den bruges kun til at tjekke, at målet er sundt.</p>
    <div class="row"><label style="margin:0">Mål</label><input id="momaal" inputmode="decimal" style="flex:1;min-width:80px" value="${maal?String(maal).replace('.',','):''}" placeholder="kg"><label style="margin:0">Højde</label><input id="mohoejde" inputmode="numeric" style="flex:1;min-width:80px" value="${hoejde||''}" placeholder="cm"><button class="b" onclick="moGemMaal()">Gem</button></div>
    ${maalLav?`<p style="color:var(--warn);margin:8px 0 0">⚠️ Det mål er under en sund vægt for din højde. Vælg et højere mål – eller tal med din læge.</p>`:''}</div>
  ${moRaad()}
  ${v.length?`<details class="card"><summary><b>📋 Alle vejninger (${v.length})</b></summary><ul class="list">${v.slice().reverse().map(x=>`<li><span style="flex:1">${new Date(x.dato+'T12:00:00').toLocaleDateString('da-DK',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}</span><b>${moKg(x.kg)}</b><button class="l" style="padding:4px 10px" title="Slet" onclick="moSletVaegt('${x.id}')">✕</button></li>`).join('')}</ul></details>`:''}
  <div class="card mosikker"><b>💬 Godt at vide</b><p class="muted" style="margin:4px 0">Er du under 18, så tal med en voksen eller din læge, før du prøver at tabe dig.</p><p class="muted" style="margin:4px 0">Tænker du meget på mad og vægt, og fylder det for meget? Du kan få gratis og anonym rådgivning hos <a href="https://www.lms.dk" target="_blank" rel="noopener">LMS – Landsforeningen mod spiseforstyrrelser og selvskade</a>.</p></div>`;
}
function moGraf(v,maal){if(v.length<2)return `<p class="muted">Når du har vejet dig to gange, kommer din kurve her.</p>`;
  const W=600,H=260,pl=50,pr=12,pt=26,pb=34;const t0=new Date(v[0].dato).getTime(),t1=new Date(v[v.length-1].dato).getTime()||t0+1;
  const ks=v.map(x=>x.kg).concat(maal?[maal]:[]);let lo=Math.floor(Math.min(...ks)-1),hi=Math.ceil(Math.max(...ks)+1);
  const X=t=>pl+(t1===t0?0:(t-t0)/(t1-t0))*(W-pl-pr),Y=k=>pt+(hi-k)/(hi-lo)*(H-pt-pb);
  const pts=v.map(x=>[X(new Date(x.dato).getTime()),Y(x.kg)]);const linje=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const trin=Math.max(1,Math.ceil((hi-lo)/4));let gr='';for(let k=lo;k<=hi;k+=trin)gr+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(k)}" y2="${Y(k)}" stroke="currentColor" opacity=".08"/><text x="${pl-6}" y="${Y(k)+4}" text-anchor="end" font-size="19" fill="currentColor" opacity=".55">${k}</text>`;
  const fd=d=>new Date(d+'T12:00:00').toLocaleDateString('da-DK',{day:'numeric',month:'short'});
  return `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;margin-top:6px;color:var(--txt)">${gr}
  ${maal?`<line x1="${pl}" x2="${W-pr}" y1="${Y(maal)}" y2="${Y(maal)}" stroke="#ec4899" stroke-dasharray="6 5" stroke-width="2"/><text x="${W-pr}" y="${Y(maal)-6}" text-anchor="end" font-size="19" fill="#ec4899">Mål ${String(maal).replace('.',',')} kg</text>`:''}
  <path d="${linje} L${pts[pts.length-1][0]} ${H-pb} L${pts[0][0]} ${H-pb} Z" fill="#10b981" opacity=".12"/><path d="${linje}" fill="none" stroke="#10b981" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
  ${pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="#fff" stroke="#10b981" stroke-width="2.5"/>`).join('')}
  <text x="${pl}" y="${H-6}" font-size="19" fill="currentColor" opacity=".55">${fd(v[0].dato)}</text><text x="${W-pr}" y="${H-6}" text-anchor="end" font-size="19" fill="currentColor" opacity=".55">${fd(v[v.length-1].dato)}</text></svg>`}
function moGemVaegt(){const kg=moTal(document.getElementById('movkg').value),dato=document.getElementById('movdato').value||moIdag();
  if(!(kg>=25&&kg<=300)){toast('Skriv din vægt i kg, fx 72,5');return}
  const s=snap(),m=MO();m.vaegt=m.vaegt.filter(x=>x.dato!==dato);m.vaegt.push({id:id(),dato,kg:Math.round(kg*10)/10});save();vis();toast('⚖️ Vægt gemt',fortrydTil(s))}
function moSletVaegt(vid){const s=snap(),m=MO();m.vaegt=m.vaegt.filter(x=>x.id!==vid);save();vis();toast('Slettet',fortrydTil(s))}
function moGemMaal(){const k=moTal(document.getElementById('momaal').value),h=Math.round(moTal(document.getElementById('mohoejde').value));const s=snap(),m=MO();
  if(k>=25&&k<=300)m.maal.kg=Math.round(k*10)/10;else delete m.maal.kg;if(h>=100&&h<=230)m.maal.hoejde=h;else delete m.maal.hoejde;save();vis();toast('🎯 Mål gemt',fortrydTil(s))}

// ---------- Gode råd + billige retter der mætter ----------
const MO_RAAD=[
  ['🥦','Fyld halvdelen af tallerkenen med grøntsager. De mætter og koster lidt – frosne grøntsager er billige.'],
  ['💧','Drik vand i stedet for sodavand og juice. Det sparer både sukker og penge.'],
  ['🥣','Spis morgenmad, fx havregrød. Det er billigt og holder dig mæt længe.','std-havregroed'],
  ['🫘','Linser og bønner mætter godt og er nogle af de billigste ting i butikken.','std-linsesuppe'],
  ['🍽️','Tag en lidt mindre tallerken. Så bliver portionen af sig selv lidt mindre.'],
  ['🐢','Spis langsomt, og læg gaflen mellem bidderne. Så mærker du bedre, når du er mæt.'],
  ['😴','Sov nok. Når man er træt, får man mere lyst til sukker og fastfood.'],
  ['🍫','Ingen mad er forbudt. Det handler om, hvor meget og hvor tit.'],
  ['🐌','Gå efter ca. ½ kg om ugen. Hurtigt vægttab kommer tit hurtigt tilbage.'],
  ['📅','Lav en madplan for ugen. Så køber du mindre slik og fastfood i farten.'],
  ['🍲','Suppe er billigt og mætter godt.','std-tomatsuppe'],
  ['🚶','Gå eller cykel, når du kan. Hverdags-bevægelse tæller med.']
];
const MO_RETTER=['std-havregroed','std-linsesuppe','std-tomatsuppe','std-dhal','std-chili-sin-carne','p-linsebolognese','std-omelet','std-wok'];
function moRaad(){const d=Math.floor(Date.now()/864e5),start=(d*3)%MO_RAAD.length,l=[0,1,2].map(i=>MO_RAAD[(start+i)%MO_RAAD.length]);
  const retter=MO_RETTER.map(i=>D.opskrifter.find(o=>o.id===i)).filter(Boolean);
  return `<div class="card" style="background:#fffbea;border-color:#f0dc9a"><b>💡 Dagens gode råd</b>
  <ul class="moraad">${l.map(r=>`<li><span>${r[0]}</span><span>${r[1]}${r[2]&&D.opskrifter.some(o=>o.id===r[2])?` <a href="#" onclick="event.preventDefault();visOpskrift('${r[2]}')">Se opskrift ›</a>`:''}</span></li>`).join('')}</ul>
  ${retter.length?`<b style="display:block;margin-top:10px">🍲 Billige retter, der mætter godt</b><div class="mini">${retter.map(o=>`<button class="minikort" onclick="visOpskrift('${o.id}')">${o.foto?`<img src="${o.foto}" alt="" loading="lazy">`:''}<span>${esc(o.navn)}</span></button>`).join('')}</div>`:''}</div>`}

// ---------- Mærker ----------
function moMaerker(){const m=MO(),v=moVaegtSort(),bs=moBedsteStreak(),tot=m.log.reduce((a,x)=>a+(x.min||0),0),n=t=>m.log.filter(x=>x.type===t||(x.navn||'').includes(t)).length,udf=Object.values(m.udf).filter(Boolean).length;
  return [['👟','Første skridt','Gem din første aktivitet',m.log.length>0||udf>0],['🔥','3 dage i træk','Rør dig 3 dage i træk',bs>=3],['🌟','En hel uge','7 dage i træk',bs>=7],['👑','En hel måned','30 dage i træk',bs>=30],
    ['⏱️','100 minutter','100 min i alt',tot>=100],['🚀','500 minutter','500 min i alt',tot>=500],['💎','1.000 minutter','1.000 min i alt',tot>=1000],
    ['🎯','Udfordrer','Klar 5 udfordringer',udf>=5],['🎡','Hjul-mester','Drej hjulet og klar det 10 gange',n('hjul')>=10],['💃','Dansemaskine','Dans 3 gange',n('Dans')+n('dans')>=3],['🧘','Zen-mester','Stræk ud 3 gange',n('Stræk ud')>=3],
    ['👣','10.000 skridt','Gå 10.000 skridt på én dag',m.log.some(x=>x.type==='skridt'&&x.skridt>=10000)],['⚖️','Godt i gang','Skriv din vægt første gang',v.length>0],['📉','Første kilo','1 kg ned fra start',v.length>1&&v[0].kg-v[v.length-1].kg>=1]]}
function moMaerkerFane(){const l=moMaerker(),har=l.filter(x=>x[3]).length;
  return `<div class="card" style="text-align:center"><div style="font-size:34px">🏅</div><b style="font-size:20px">${har} af ${l.length} mærker</b><p class="muted" style="margin:4px 0 0">Bedste stime: 🔥 ${moBedsteStreak()} dage i træk</p></div>
  <div class="momaerker">${l.map(x=>`<div class="${x[3]?'har':''}"><span>${x[3]?x[0]:'🔒'}</span><b>${x[1]}</b><small>${x[2]}</small></div>`).join('')}</div>`}

// ---------- Udseende ----------
(function(){const s=document.createElement('style');s.id='motion-look';s.textContent=`
.card.mokort{cursor:pointer;background:linear-gradient(135deg,#fff7ed 0%,#fdf2f8 100%)!important;border:2px solid #fbcfe8!important;margin-top:14px}
.mopil{font-size:28px;line-height:1;color:#ec4899}
.mostat3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px;text-align:center}
.mostat3>div{background:#fff;border-radius:12px;padding:8px 4px;display:flex;flex-direction:column;align-items:center}
.mostatv>div{background:var(--felt,#f4f8f6)}
.mostat3 span{font-size:22px}.mostat3 b{font-size:18px;white-space:nowrap}.mostat3 small{color:var(--muted);font-size:12px}
.mobar{height:10px;background:rgba(0,0,0,.08);border-radius:99px;overflow:hidden;margin-top:10px}
.mobar i{display:block;height:100%;background:linear-gradient(90deg,#f97316,#ec4899);border-radius:99px;transition:width .4s}
.mobtn{background:linear-gradient(135deg,#f97316,#ec4899)!important;font-weight:700}
.mohero{background:linear-gradient(135deg,#f97316 0%,#ec4899 55%,#8b5cf6 100%);color:#fff;border-radius:18px;padding:18px 18px 14px;margin-bottom:12px}
.moh1{font-size:24px;font-weight:800}.moh2{font-size:17px;margin-top:4px;font-weight:600}.moh3{font-size:13px;opacity:.9;margin-top:6px}
.mobar2{background:rgba(255,255,255,.3)}.mobar2 i{background:#fff}
.mofaner{display:flex;gap:6px;margin-bottom:12px}.mofaner button{flex:1;font:inherit;font-weight:600;border:1px solid var(--line);background:#fff;border-radius:12px;padding:10px 4px;cursor:pointer}
.mofaner button.on{background:#1f2937;color:#fff;border-color:#1f2937}
.moudf{border:2px dashed #f97316}.moudf.ok{border:2px solid #10b981;background:#ecfdf5}
.motraen{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.motraen button{font:inherit;text-align:left;border:1px solid var(--line);background:#fff;border-radius:14px;padding:12px;cursor:pointer;display:flex;flex-direction:column;gap:2px;transition:transform .15s}
.motraen button:hover{transform:translateY(-2px);border-color:#f97316}.motraen .moe{font-size:30px}.motraen small{color:var(--muted);font-size:13px}
.motyper{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:8px}
.motyper button{font:inherit;font-size:14px;border:1px solid var(--line);background:#fff;border-radius:12px;padding:10px 4px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px}
.motyper button span{font-size:24px;font-weight:700}
.mouge{display:flex;gap:6px;align-items:flex-end;height:150px;margin-top:10px}
.mouge>div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%}
.mouge i{display:block;width:100%;max-width:44px;background:linear-gradient(180deg,#ec4899,#f97316);border-radius:8px 8px 3px 3px}
.mouge small{font-size:12px;color:var(--muted);min-height:16px}.mouge span{font-size:13px;margin-top:4px}
.mohjulboks{position:relative;width:230px;height:230px;margin:6px auto 4px}
.mohjulpil{position:absolute;top:-6px;left:50%;transform:translateX(-50%);z-index:2;font-size:26px;color:#1f2937}
.mohjul{width:230px;height:230px;border-radius:50%;position:relative;transition:transform 3s cubic-bezier(.17,.67,.2,1);border:6px solid #fff;box-shadow:0 6px 20px rgba(0,0,0,.15);
 background:conic-gradient(#fb923c 0 45deg,#f472b6 45deg 90deg,#a78bfa 90deg 135deg,#34d399 135deg 180deg,#fbbf24 180deg 225deg,#60a5fa 225deg 270deg,#f87171 270deg 315deg,#4ade80 315deg 360deg)}
.mohjul span{position:absolute;left:50%;top:50%;width:40px;height:40px;margin:-20px 0 0 -20px;font-size:28px;display:flex;align-items:center;justify-content:center}
.mohjulres{text-align:center;min-height:30px;margin:8px 0}
.moplay{text-align:center}.moplay .row{text-align:left}
.mofase{margin-top:14px;font-weight:700;font-size:15px;text-transform:uppercase;letter-spacing:.06em;color:#ec4899}.moplay.pause .mofase{color:#10b981}
.moemoji{font-size:72px;line-height:1.1;margin-top:6px}.monavn{font-size:26px;font-weight:800;margin-top:4px}.mohow{max-width:420px;margin:6px auto 0;min-height:44px}
.motid{font-size:84px;font-weight:800;line-height:1;margin-top:8px;font-variant-numeric:tabular-nums;background:linear-gradient(135deg,#f97316,#ec4899);-webkit-background-clip:text;background-clip:text;color:transparent}
.moplay.pause .motid{background:none;color:#10b981}
.moadv{background:#fff4e5;border-color:#fdba74}.mook{background:#ecfdf5;border-color:#6ee7b7}
.mosikker{background:#f5f3ff;border-color:#ddd6fe}
.moraad{list-style:none;padding:0;margin:8px 0 0}.moraad li{display:flex;gap:10px;padding:6px 0;border-bottom:1px solid #f3e8b0}.moraad li:last-child{border:0}.moraad li>span:first-child{font-size:22px}
.momaerker{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px}
.momaerker>div{background:#fff;border:1px solid var(--line);border-radius:14px;padding:12px 8px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:2px;opacity:.55;filter:grayscale(1)}
.momaerker>div.har{opacity:1;filter:none;border:2px solid #fbbf24;background:linear-gradient(180deg,#fffbeb,#fff)}
.momaerker span{font-size:36px}.momaerker small{font-size:12px;color:var(--muted)}
.mofest{position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden}
.mofest span{position:absolute;top:-40px;animation:mofald 2.2s ease-in forwards}
@keyframes mofald{to{transform:translateY(110vh) rotate(540deg);opacity:.9}}
@media (max-width:760px){.motid{font-size:72px}.moemoji{font-size:60px}.monavn{font-size:22px}.mostat3 b{font-size:16px}}
`;document.head.appendChild(s)})();
