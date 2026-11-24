// Budget og Mad – regler (vilkår) og privatlivspolitik (version 49)
// Teksten vises én gang ved første start (efter koden) med »Jeg accepterer«,
// og kan altid læses under ⚙️ Indstillinger. Kilder står i kilder.txt.
// Ændres reglerne, så sæt JURA_VERSION én op – så bliver alle spurgt igen.
var JURA_VERSION = 1, JURA_DATO = '24. november 2026';
// Ejerens kontakt. Loven kræver navn og kontakt på den dataansvarlige.
// Udfyld fx 'Søren Jensen, mail: soeren@eksempel.dk'. Tom = kun knappen i appen.
var JURA_KONTAKT = '';
var JURA_KEY = 'madapp-v1-vilkaar';

function juraHvem() {
  return 'Søren (ejeren af appen)' + (JURA_KONTAKT ? ', ' + JURA_KONTAKT : '') +
    '. Du kan altid skrive til Søren under ⚙️ Indstillinger → »Brug for hjælp til appen?«.';
}

function juraVilkaar() {
  return `<h2>📜 Regler for brug</h2>
<p class="muted" style="font-size:13px">Gælder fra ${JURA_DATO} (regler nr. ${JURA_VERSION})</p>
<h3>1. Hvad er appen?</h3>
<p>Budget og Mad er en gratis hjælper til budget, mad, indkøb, lager, kalender og motion. Den er lavet af en privatperson, Søren. Der er ingen reklamer, og intet bliver solgt.</p>
<h3>2. Dine ting er dine</h3>
<p>Alt, hvad du skriver i appen, bliver gemt på din egen telefon eller computer. Søren kan ikke se det. Derfor er det også dig, der passer på det: Brug »Gem kopi« en gang imellem. Sletter du appen, browserens data eller mister telefonen, kan dine ting være væk.</p>
<h3>3. Gode råd – ikke en garanti</h3>
<p>Tal, priser, budget og råd i appen er en hjælp, ikke rådgivning fra en bank, læge eller ekspert. Tal fra fotos af bon, stregkoder og vareinfo (fra Open Food Facts) kan være forkerte. Tjek altid selv, før du bruger penge eller tager en beslutning.</p>
<h3>4. Mad og allergi</h3>
<p>Læs selv varedeklarationen, hvis du har allergi. Tjek holdbarhed, og steg kød og kylling godt igennem. Opskrifterne er forslag.</p>
<h3>5. Motion, vægt og sundhed</h3>
<p>Øvelser og råd om motion og vægt er almindelige gode råd – ikke lægehjælp. Stop, hvis noget gør ondt, eller du får det dårligt. Tal med en læge først, hvis du er syg, gravid, tager medicin eller har haft problemer med mad eller vægt. Er du under 18 og vil tabe dig, så tal med en voksen, din læge eller sundhedsplejersken. Har du det svært med mad, kan du få gratis hjælp hos LMS (lms.dk). Ved fare: ring 112.</p>
<h3>6. Andre mennesker i appen</h3>
<p>Kontakter, fødselsdage og billeder af andre må du gemme til dit eget private brug. Vil du dele billeder eller oplysninger om andre, så spørg dem først. Det er dit ansvar, hvad du deler.</p>
<h3>7. Din kode</h3>
<p>Din kode er personlig. Giv den ikke videre. Søren kan slukke en kode, fx hvis den bliver misbrugt eller delt. Prøv ikke at bryde ind i appen eller serveren.</p>
<h3>8. Appen kan ændre sig</h3>
<p>Appen er gratis og kommer, som den er. Den kan få fejl, blive ændret eller holde op med at virke. Der er ingen garanti for, at den altid virker.</p>
<h3>9. Ansvar</h3>
<p>Appen er en hjemmeside, der kører i telefonens browser – også når du har lagt den på hjemmeskærmen. Den kan ikke ændre telefonens system eller dine andre apps.</p>
<p>Så langt som dansk lov tillader det, er Søren ikke ansvarlig for tab eller skader, der kommer af at bruge appen – fx mistede data, forkerte tal eller priser, penge, beslutninger, skader ved madlavning eller motion, problemer med telefon eller computer, eller fejl hos andre tjenester og links.</p>
<p>Det gælder ikke, hvis Søren har gjort skade med vilje eller har været groft uforsigtig, eller hvor loven siger, at ansvar ikke kan fraskrives (fx ved visse personskader).</p>
<h3>10. Andre tjenester</h3>
<p>Nogle knapper åbner andre sider, fx eTilbudsavis, Google Maps og LMS, eller deler via din telefons SMS, mail osv. Der gælder deres egne regler.</p>
<h3>11. Nye regler</h3>
<p>Kommer der nye regler, viser appen dem, og du bliver spurgt igen.</p>
<p>Appen er gratis nu. Kommer den senere til at koste penge, får du besked først, og der kommer nye regler. Du betaler aldrig noget uden selv at have sagt ja til det.</p>
<h3>12. Alder</h3>
<p>Er du under 18, så vis gerne reglerne til en forælder.</p>
<h3>13. Appen tilhører Søren</h3>
<p>Appen, teksterne og opskrifterne må ikke kopieres, sælges eller lægges ud et andet sted uden Sørens lov. Fotos er fra Unsplash og bruges efter deres regler. Dine egne ting i appen er dine.</p>
<p><b>Hvis reglerne bliver brudt:</b> Giver du din kode videre, kopierer eller sælger appen eller prøver at bryde ind, kan Søren slukke din kode med det samme og uden varsel. Søren kan også kræve at få dækket et tab, han kan vise, og ved kopiering af appen kræve betaling og erstatning efter ophavsretsloven.</p>
<h3>14. Lov</h3>
<p>Dansk lov gælder. Har du et problem, så skriv til Søren først – så finder vi som regel en løsning.</p>`;
}

function juraPrivat() {
  return `<h2>🔒 Privatliv – hvad sker der med dine data?</h2>
<p class="muted" style="font-size:13px">Gælder fra ${JURA_DATO}</p>
<h3>Kort fortalt</h3>
<ul><li>Det, du skriver i appen, bliver på din egen telefon. Søren kan ikke se det.</li>
<li>Kun din kode bliver tjekket på en server.</li>
<li>Ingen reklamer, ingen sporing, ingen statistik om dig.</li></ul>
<h3>Hvem står for appen?</h3>
<p>${juraHvem()}</p>
<h3>Det, der bliver på din telefon</h3>
<p>Budget, opskrifter, madplan, indkøb, lager, kalender, kontakter, billeder, motion, vægt, indstillinger og fejl-log bliver gemt i browserens lager på din telefon. Søren har ikke adgang. Det bliver kun sendt videre, hvis du selv trykker »Del«, »Gem kopi«, »Skriv til Søren« eller »Send fejlrapport« – og du ser altid først, hvad der sendes.</p>
<p>Appen bruger ikke cookies til sporing eller reklamer. Den gemmer kun det på telefonen, som skal til for, at appen virker.</p>
<h3>Det, der bliver sendt ud</h3>
<ul>
<li><b>Din kode (Supabase):</b> Når du logger ind, sendes koden til Supabase (server i EU, Irland), som svarer ja eller nej. På serveren står kun koderne, det navn Søren har givet koden, og om den er tændt. Formålet er, at kun folk med en kode kan bruge appen. Koden gemmes, til Søren sletter den. Som alle servere ser Supabase din IP-adresse, og deres netværk (Cloudflare) sætter en kort teknisk cookie for at stoppe angreb.</li>
<li><b>Selve appen (GitHub Pages):</b> Appen hentes fra GitHub. GitHub ser din IP-adresse, som alle hjemmesider gør.</li>
<li><b>Stregkode, bon og køleskab:</b> Når du bruger dem første gang, henter appen gratis hjælpeprogrammer fra nettet (bl.a. jsDelivr). Selve billederne bliver behandlet på din telefon og bliver ikke sendt ud.</li>
<li><b>Vareinfo (Open Food Facts):</b> Scanner du en vare, sendes kun stregkodens nummer for at finde varens navn.</li>
<li><b>Links:</b> Trykker du på »Kort«, tilbud eller lignende, åbnes en anden side (fx Google Maps eller eTilbudsavis), og den får det, du søger på.</li>
</ul>
<h3>Andre mennesker i appen</h3>
<p>Kontakter og billeder af andre ligger kun på din telefon. Persondataloven (GDPR) gælder ikke for rent private ting, du gemmer for dig selv. Deler du dem med andre, er det dit ansvar at have lov.</p>
<h3>Dine rettigheder</h3>
<p>Du kan spørge Søren, hvad der står om dig på serveren (din kode og dens navn), få det rettet eller slettet. Dine egne data på telefonen sletter du selv: slet appen fra hjemmeskærmen og ryd browserens data for siden.</p>
<p>Er du utilfreds, kan du klage til Datatilsynet (datatilsynet.dk).</p>`;
}

// Lille, venlig boks første gang (efter koden)
function juraAccepteret() {
  try { var a = JSON.parse(localStorage.getItem(JURA_KEY) || 'null'); return a && a.v >= JURA_VERSION ? a : null } catch (e) { return null }
}
function juraVisFoersteGang() {
  if (juraAccepteret() || document.getElementById('jurabox')) return;
  // Først når koden er skrevet (login-vinduet er lukket)
  var li = document.getElementById('logind');
  if (li && li.open) { setTimeout(juraVisFoersteGang, 600); return }
  var b = document.createElement('div'); b.id = 'jurabox';
  b.style.cssText = 'position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:16px';
  b.innerHTML = `<div style="background:var(--card);color:var(--txt);border-radius:26px;padding:22px;max-width:460px;width:100%;max-height:90vh;overflow:auto;box-shadow:var(--skygge)">
  <div style="font-size:40px;text-align:center">👋</div>
  <h2 style="text-align:center;margin:6px 0 12px">Velkommen til Budget og Mad</h2>
  <ul style="padding-left:20px;line-height:1.5;margin:0 0 12px">
   <li>Appen er gratis og uden reklamer.</li>
   <li>Det, du skriver, bliver på din egen telefon. Ingen andre kan se det.</li>
   <li>Råd om penge, mad og motion er gode råd – tjek selv, og spørg en læge, hvis du er i tvivl.</li>
   <li>Appen kommer, som den er. Husk »Gem kopi« en gang imellem.</li>
  </ul>
  <button class="l" style="width:100%;margin-bottom:10px" onclick="juraVis('alt')">📜 Læs alle regler</button>
  <button class="b" style="width:100%;font-size:19px;padding:14px" onclick="juraAccepter()">✅ Jeg accepterer</button>
  <p class="muted" style="font-size:13px;text-align:center;margin:10px 0 0">Du kan altid læse reglerne igen under ⚙️ Indstillinger.</p></div>`;
  document.body.appendChild(b);
}
function juraAccepter() {
  try { localStorage.setItem(JURA_KEY, JSON.stringify({ v: JURA_VERSION, dato: new Date().toISOString() })) } catch (e) {}
  var b = document.getElementById('jurabox'); if (b) b.remove();
  if (typeof toast === 'function') toast('Tak – god fornøjelse 🎉');
}
// Viser hele teksten. hvad = 'regler' | 'privat' | 'alt'
function juraVis(hvad) {
  var t = hvad === 'regler' ? juraVilkaar() : hvad === 'privat' ? juraPrivat() : juraVilkaar() + '<hr style="margin:20px 0;border:0;border-top:1px solid var(--line)">' + juraPrivat();
  var o = document.createElement('div'); o.id = 'juratekst';
  o.style.cssText = 'position:fixed;inset:0;z-index:9500;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:12px';
  o.innerHTML = '<div style="background:var(--card);color:var(--txt);border-radius:22px;padding:18px;max-width:640px;width:100%;max-height:92vh;overflow:auto;line-height:1.5">' + t +
    '<button class="b" style="width:100%;margin-top:14px" onclick="this.closest(\'#juratekst\').remove()">Luk</button></div>';
  // Åbent vindue (fx Indstillinger) ligger øverst – læg teksten inde i det
  var d = document.querySelector('dialog[open]');
  (d || document.body).appendChild(o);
}
// Afsnit under ⚙️ Indstillinger
function juraIndstil() {
  var a = juraAccepteret();
  return `<h3>📜 Regler og privatliv</h3>
  <div class="row"><button class="l" style="flex:1" onclick="juraVis('regler')">📜 Regler for brug</button><button class="l" style="flex:1" onclick="juraVis('privat')">🔒 Privatliv</button></div>
  <p class="muted" style="font-size:13px">${a ? 'Du accepterede reglerne den ' + new Date(a.dato).toLocaleDateString('da-DK') + '.' : 'Du har ikke accepteret reglerne endnu.'}</p>`;
}
