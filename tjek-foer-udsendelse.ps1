# Tjek af Budget og Mad, FØR en ny version sendes ud.
# Kør: højreklik på filen > »Kør med PowerShell«.
# Den starter appen i en usynlig browser og stopper udsendelsen, hvis der er fejl.
$ErrorActionPreference = 'Continue'
$mappe = $PSScriptRoot
$fejl = @()
$html = [IO.File]::ReadAllText("$mappe\index.html")
$sw = [IO.File]::ReadAllText("$mappe\sw.js")
$ops = [IO.File]::ReadAllText("$mappe\opskrifter.js")
try { $ver = Get-Content "$mappe\version.json" -Raw | ConvertFrom-Json } catch { $fejl += 'version.json kan ikke læses' }
try { $null = Get-Content "$mappe\manifest.json" -Raw | ConvertFrom-Json } catch { $fejl += 'manifest.json kan ikke læses' }
if ($html -notmatch 'BOM-APP-OK') { $fejl += 'index.html mangler slut-mærket (filen er ikke hel)' }
$appV = [int]([regex]::Match($html, 'APP_VERSION=(\d+)').Groups[1].Value)
$swV = [int]([regex]::Match($sw, 'const VERSION = (\d+);').Groups[1].Value)
if ($appV -ne $swV) { $fejl += "Versionsnummer passer ikke: app $appV, sw.js $swV" }
if ($ver -and $ver.version -ne $appV) { $fejl += "version.json ($($ver.version)) passer ikke med appen ($appV)" }
if ($ops -notmatch 'STD_OPSKRIFTER') { $fejl += 'opskrifter.js er ikke hel' }
# Alle filer, som appen gemmer til brug uden internet, skal findes
[regex]::Matches($sw, "'\./([^']+)'") | ForEach-Object { $p = $_.Groups[1].Value; if ($p -and -not (Test-Path "$mappe\$p")) { $fejl += "Fil mangler: $p" } }
# Start appen i en usynlig browser og se, at den viser forsiden uden fejl
$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
if (Test-Path $edge) {
  $prof = Join-Path $env:TEMP ("bomtjek" + (Get-Random))
  $dom = & $edge --headless=new --disable-gpu --user-data-dir="$prof" --virtual-time-budget=6000 --dump-dom ("file:///" + ($mappe -replace '\\','/') + "/index.html") 2>$null | Out-String
  if ($dom -notmatch 'class="tiles"') { $fejl += 'Appen viser ikke forsiden, når den starter' }
  if ($dom -match '<main id="main"><div style="background:#fff') { $fejl += 'Appen viser en fejl ved start' }
  Remove-Item $prof -Recurse -Force -ErrorAction SilentlyContinue
}
if ($fejl.Count) {
  Write-Host "`nSTOP – der er fejl. Send IKKE denne version ud:" -ForegroundColor Red
  $fejl | ForEach-Object { Write-Host " • $_" -ForegroundColor Red }
  exit 1
} else {
  Write-Host "`nOK – version $appV er tjekket og kan sendes ud." -ForegroundColor Green
  exit 0
}
