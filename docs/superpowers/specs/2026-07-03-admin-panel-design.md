# Admin panel pro správu aktualit a akcí — návrh

Datum: 2026-07-03
Stav: návrh ke schválení

## Cíl

Heslem chráněný admin panel na `/admin`, přes který lze spravovat **úplně všechno**
u aktualit (`data/news.ts`) a připravovaných akcí (`data/events.ts`) — přidávat,
upravovat i mazat položky včetně nahrávání fotek. Každé uložení vytvoří commit
v GitHub repozitáři `vencoslav1357/sdhporin` (větev `main`), což automaticky
spustí redeploy na Vercelu — stejné flow, jaké dnes probíhá ručně.

Souvislost: „nezobrazující se secondary texty" na kartách nejsou bug v kódu —
pole `preview` (aktuality) a `text` (akce) jsou v datech prázdné řetězce.
Rozhodnutí uživatele: kód se nemění, texty doplní přes nový admin panel.

## Zvolený přístup

Admin sekce přímo ve stávající Next.js 14 aplikaci (App Router) + zápis přes
GitHub API. Bez databáze, bez externích služeb.

Zvažované alternativy: hotové git-based CMS (Decap — vyžaduje GitHub OAuth,
anglické UI) a databáze (Supabase — opouští požadavek „uložení = commit").
Obě zamítnuty.

## Architektura

### Datová vrstva

- `data/news.ts` a `data/events.ts` se převedou na **`data/news.json`**
  a **`data/events.json`** (obsah 1:1, komentáře s návodem odpadnou —
  nahradí je admin panel).
- Typy v novém `data/types.ts`:
  - `EventDate { day: number; month: number; year: number }`
  - `NewsItem { date: EventDate; title: string; mainImage: string; preview: string; fullText: string; gallery: string[] }`
  - `EventItem { date: EventDate; title: string; text: string }`
- `NewsSection.tsx` a `EventsSection.tsx` se upraví, aby importovaly JSON
  (alias `@data/*` už existuje; v `tsconfig.json` se ověří/zapne
  `resolveJsonModule`). Vzhled a chování webu se nemění.

### Nové soubory (App Router)

| Soubor | Účel |
|---|---|
| `src/app/admin/page.tsx` | Klientská admin aplikace (login + editor) |
| `src/app/admin/layout.tsx` | Metadata `robots: noindex` pro /admin |
| `src/app/api/admin/login/route.ts` | POST heslo → nastaví session cookie |
| `src/app/api/admin/logout/route.ts` | POST → smaže cookie |
| `src/app/api/admin/session/route.ts` | GET → je přihlášeno? |
| `src/app/api/admin/data/route.ts` | GET aktuální news+events z GitHubu (vč. SHA souborů) |
| `src/app/api/admin/upload/route.ts` | POST jednoho obrázku → git blob, vrátí SHA blobu |
| `src/app/api/admin/save/route.ts` | POST změn → jeden commit přes Git Data API |
| `src/lib/adminAuth.ts` | Ověření hesla, podpis/ověření cookie, rate limit |
| `src/lib/github.ts` | Klient GitHub API (contents, blobs, trees, commits, refs) |
| `.env.example` | Vzor proměnných pro lokální vývoj |

### Autentizace a bezpečnost

- **`ADMIN_PASSWORD`** — env proměnná. Na Vercelu v nastavení projektu,
  lokálně v **`.env.local`** (už je v `.gitignore`). Heslo není nikde v kódu
  ani v repu.
- Login: POST hesla, porovnání časově bezpečné (`crypto.timingSafeEqual`).
- Session: HTTP-only cookie s tokenem `exp.podpis`, podpis HMAC-SHA256.
  Klíč se derivuje z `ADMIN_PASSWORD` (SHA-256 s pevným prefixem) — žádná
  další env proměnná; změna hesla zneplatní všechny session. Platnost 7 dní,
  `secure` v produkci, `sameSite=lax`.
- Všechny `/api/admin/*` handlery (kromě login/session) ověřují cookie
  helperem `requireAdmin()`; při neplatné session vrací 401.
- Rate limit loginu: in-memory počítadlo neúspěšných pokusů dle IP,
  po 5 neúspěších blokace 30 s (best-effort na serverless, pro malý web stačí).
- `/admin` má `noindex` metadata a přidá se `disallow: /admin` do `robots.ts`.
- GitHub token nikdy neopouští server.

### Zápis na GitHub

- **`GITHUB_TOKEN`** — fine-grained PAT s právem *Contents: Read and write*
  pouze pro repo `vencoslav1357/sdhporin`. Na Vercelu i v `.env.local`.
- Volitelné env s defaulty: `GITHUB_REPO` (`vencoslav1357/sdhporin`),
  `GITHUB_BRANCH` (`main`).
- **Nahrání fotky**: klient fotku zmenší (max delší strana 1600 px,
  JPEG ~80 %) a pošle na `/api/admin/upload`; server vytvoří **git blob**
  (zatím bez commitu) a vrátí jeho SHA. Každá fotka zvlášť → bezpečně pod
  limitem 4,5 MB na request.
- **Uložení**: `/api/admin/save` dostane nový obsah `news.json`/`events.json`
  + seznam nových souborů (cesta → blob SHA). Server vytvoří strom, **jeden
  commit** (zpráva např. `Admin: úprava aktuality Masopust`) s rodičem
  = aktuální HEAD větve a posune ref. Jedno uložení = jeden commit
  = jeden deploy.
- **Ochrana proti přepsání**: panel při načtení dostane SHA datových souborů;
  save je porovná s aktuálním stavem na GitHubu — při nesouladu vrátí 409
  a panel vyzve k obnovení dat (nic se nepřepíše).
- Panel čte data vždy živě z GitHubu (ne z buildu), takže úpravy fungují
  správně i těsně po předchozím uložení, než doběhne redeploy.

### UI panelu (česky)

- Přihlašovací obrazovka: jedno pole na heslo.
- Dvě záložky: **Aktuality** a **Připravované akce**. Seznam položek seřazený
  jako na webu, u každé tlačítka *Upravit* / *Smazat* (s potvrzením),
  nahoře *Přidat*.
- Formulář akce: datum (den/měsíc/rok), název, text.
- Formulář aktuality: datum, název, krátký popis (preview), plný text,
  hlavní fotka (nahrání souboru, náhled), galerie (vícenásobné nahrání,
  mazání, změna pořadí šipkami). U existujících fotek zůstává cesta
  (`terka/foto.jpeg`), nové se ukládají do
  `public/images/upload/<rok>/<timestamp>-<nazev>.jpeg`.
- Po uložení: potvrzení „Uloženo — web se aktualizuje během ~2 minut."
  Chyby (špatné heslo, 409, GitHub nedostupný) se zobrazují srozumitelně česky.

### Chování v dev vs. produkce

Identické — obojí čte/zapisuje přes GitHub API podle env proměnných.
Lokální `.env.local` umožní vývoj a testy panelu; pozor: i lokální uložení
commitne do `main` a vyvolá deploy (záměr — jedno chování, žádné větve kódu).

## Chybové stavy

- Chybějící `ADMIN_PASSWORD`/`GITHUB_TOKEN` → API vrátí 500 s jasnou hláškou
  („Chybí konfigurace ADMIN_PASSWORD"), panel ji zobrazí.
- GitHub API chyba/timeout → hláška s doporučením zkusit znovu; commit je
  atomický (ref se posune až na konci), takže polovičaté uložení nehrozí.
- Neplatný obrázek / příliš velký po kompresi → validace na klientu i serveru.

## Testování

- Jednotkové testy nejsou v projektu zavedené — ověření proběhne end-to-end:
  lokální `next dev` + reálné přihlášení, CRUD obou typů položek, nahrání
  fotky, kontrola commitů na GitHubu a nasazené verze.
- Ruční kontrola: špatné heslo, vypršelá cookie, 409 konflikt, prázdná pole.

## Mimo rozsah

- Správa jiných částí webu (kontakty, texty sekcí) — jen aktuality a akce.
- Více uživatelů / role — jedno sdílené heslo.
- Náhled před publikací (preview deploy) — uložení jde rovnou do `main`.

## Jednorázové kroky uživatele

1. Vytvořit fine-grained PAT na GitHubu (Contents: Read/Write, jen toto repo).
2. Na Vercelu nastavit `ADMIN_PASSWORD` a `GITHUB_TOKEN`.
3. Lokálně vytvořit `.env.local` podle `.env.example`.
