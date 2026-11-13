# Driving School Simulator 2.0

Mobilní webový 3D prototyp simulátoru jízdy s manuální převodovkou. Projekt je připraven pro GitHub Pages a instalaci jako PWA.

## Co obsahuje verze 2.0
- Procedurální 3D městské prostředí: silnice, chodníky, budovy, stromy, lampy, přechody a značky.
- Procedurálně sestavený hatchback s koly, skly, světly a základními prvky kokpitu.
- Pohled z kokpitu a pohled za vozidlem.
- Dotykové ovládání spojky, plynu, brzdy, volantu a manuální převodovky R/N/1–6.
- Zjednodušený model akcelerace, odporu, brzdění, spojky a zhasnutí motoru.
- Okolní vozidla, orientační detekce kolize a upozornění při opuštění vozovky.
- Blinkry, světla, zpětné zrcátko, tachometr, otáčkoměr a rychlostní limit úseku.
- Procedurální zvuk motoru generovaný přes Web Audio po prvním dotyku.
- Volná jízda a základní sekvence lekcí autoškoly.
- PWA manifest a aktualizovaný service worker.

## Spuštění
Projekt používá ES moduly a Three.js z CDN. Spusť jej přes webový server, nikoli otevřením souboru `index.html` přímo.

```bash
python -m http.server 8000
```

Otevři `http://localhost:8000`.

## GitHub Pages
1. Nahraj obsah projektu do kořene repozitáře.
2. Otevři **Settings → Pages**.
3. Zvol **Deploy from a branch**, větev `main` a složku `/ (root)`.
4. Po publikování otevři adresu GitHub Pages.

## Ovládání
- **Spojka:** táhni prstem po zelené ploše spojky; horní část znamená uvolněnou spojku, spodní sešlápnutou.
- **Plyn / brzda:** podrž příslušný pedál.
- **Řazení:** při téměř úplně sešlápnuté spojce a nízké rychlosti vyber R, N nebo 1–6.
- **Volant:** posuvník doleva/doprava.
- **Kamera:** přepíná kokpit a pohled za vozem.
- **Blinkry / světla:** tlačítka v horní liště.

## Technické limity
Jde o rozšířený hratelný prototyp, nikoli profesionální fyzikální simulátor. Model auta i město jsou generovány procedurálně; nejde o licencované detailní 3D assety. Fyzika pneumatik, převodovky, kolizí a provozu je zjednodušená. Dopravní auta používají jednoduchý pohyb, nikoli plnohodnotnou AI. Zpětné zrcátko je zatím grafický panel, nikoli samostatný render kamery. Pro další realistický skok bude potřeba kvalitní optimalizovaný 3D model, fyzikální engine (např. Rapier/Cannon), skutečné zvukové vzorky, plnohodnotná AI doprava a testování na cílových telefonech.
