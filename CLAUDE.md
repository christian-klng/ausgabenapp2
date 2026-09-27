# Ausgaben App (v2)

Persönliche Budget- und Ausgaben-App (mobile-first, installierbar als PWA). Neubau der alten App (`christian-klng/ausgaben-app`) auf neuem Stack, gleiche Datenbank.

## Tech Stack

- **Framework**: Next.js (App Router, Server Components + Server Actions)
- **Styling**: Tailwind CSS 4, Design-Tokens in `src/app/globals.css` (hell/dunkel via `prefers-color-scheme`)
- **Datenbank**: PostgreSQL, direkter Zugriff via `pg` (kein ORM)
- **Icons**: Lucide React (Icon-Namen kommen aus der DB-Spalte `categories.icon`)

## Befehle

- Dev-Server: `npm run dev`
- Production-Build: `npm run build`
- Typecheck: `npx tsc --noEmit`
- Lint: `npm run lint`

## Datenbank

⚠️ **`DATABASE_URL` in `.env.local` zeigt auf die produktive DB mit echten Daten** (Postgres 17 auf Coolify/Hetzner, DB `ausgaben`). Es gibt keine separate Dev-DB. Keine destruktiven Migrationen/Seeds ohne Rückfrage. Die App in Coolify nutzt die interne URL; der öffentliche Port (5432) ist nur für Wartung/Migration offen. Die alte Railway-DB wird nach dem Umzug abgeschaltet.

- `categories` – 18 Kategorien: `slug`, `name`, `icon` (Lucide-Name), `color` (Pastell-Hex), `sort_order`, `budget_cents`
- `expenses` – `category_id` (FK), `amount_cents`, `description`, `spent_at` (date), `created_at`
- Alle Geldbeträge als **Cent-Integer**; Datumswerte werden in SQL mit `to_char(...)` als Strings (`YYYY-MM-DD`) geliefert, nie als JS-Date

## Architektur

- `src/lib/db.ts` – pg-Pool (Singleton, HMR-sicher)
- `src/lib/data.ts` – Lese-Queries (nur in Server Components verwenden)
- `src/lib/actions.ts` – Server Actions für alle Mutationen (Ausgaben CRUD, Budget), revalidieren alle drei Routen
- `src/lib/format.ts` – Euro-/Datums-Formatierung (de-DE, Europe/Berlin), Betrags-Parsing (Komma-Eingabe)
- `src/app/page.tsx` – Erfassen: Kategorie-Grid, Eingabe im Bottom-Sheet
- `src/app/budget/page.tsx` – Monatsübersicht (`?monat=YYYY-MM`): Hero-Zahl, Meter pro Kategorie, Budget-Bearbeitung
- `src/app/ausgaben/page.tsx` – Liste (`?q=Suche`): nach Tag gruppiert, Bearbeiten/Löschen im Sheet
- Seiten sind `force-dynamic` (lesen live aus der DB); Client-Komponenten bekommen Daten als Props

## Konventionen

- UI-Sprache **Deutsch**, Formatierung mit `Intl` (`de-DE`)
- Meter-Farben folgen dem Status (blau → ab 85 % amber → über Budget rot), Tracks sind hellere Stufen derselben Rampe; Zahlen/Text nie in Datenfarben
- Kategorie-Farben/-Icons kommen ausschließlich aus der DB, nicht aus dem Code
- Kein Login/Auth (Single-User-App)
