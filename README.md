# zakat.sol — Solana Zakat Calculator

Implementation of the `Zakat Calculator.dc.html` mockups: seven screens that
price a Solana portfolio, check it against the nisab, and produce a report.

| Layer     | Choice                                                |
| --------- | ----------------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack), React 19          |
| Styling   | Tailwind CSS 4, design tokens in `src/app/globals.css` |
| Fonts     | Space Grotesk + IBM Plex Mono via `next/font`         |
| Database  | PostgreSQL 17 via Docker Compose (wired, unused)      |
| ORM       | Prisma 7 with the `@prisma/adapter-pg` driver adapter |
| Tooling   | TypeScript (strict), ESLint 9                         |

## Getting started

```bash
cp .env.example .env
pnpm install
pnpm dev
```

http://localhost:3000. The database is only needed once models exist —
`pnpm db:up` starts Postgres, `pnpm db:migrate` applies migrations.

## Screens

| Route          | Mockup                   | Notes                                        |
| -------------- | ------------------------ | -------------------------------------------- |
| `/`            | 01 Landing, 02 Connect   | Hero, stat band, endorsement, wallet modal   |
| `/portfolio`   | 03 Portfolio scan        | Per-asset include/exclude, filters, dust row |
| `/calculation` | 04 Calculation breakdown | Deductions, liabilities, CSV + print export  |
| `/nisab`       | 05 Nisab & dates         | Gold/silver basis, hawl, treatment rules     |
| `/history`     | 06 History               | Year chart, table, export all                |

Screen 07 (mobile) is the same routes rendered responsively, not separate pages.

Three public pages sit alongside them, outside the mockups:

| Route           | Notes                                                              |
| --------------- | ------------------------------------------------------------------ |
| `/blog`         | Card grid, `?topic=` filter as a real URL, reading time derived     |
| `/blog/[slug]`  | Prerendered per post, generated cover art, related posts            |
| `/privacy`      | Policy sections + a control that clears the stored settings         |
| `/sanctum`      | Liquid staking explainer with a hawl-length yield estimator         |

## How the numbers work

Nothing is hardcoded — every figure derives from `src/data/` through
`src/lib/zakat.ts`:

- **Gross holdings** — every mint the scan found, dust included.
- **Deductions** — holdings excluded by hand or by a treatment rule, plus
  manually entered liabilities.
- **Net zakatable** — gross minus deductions.
- **Zakat due** — 2.5% of net zakatable, but only once it meets the nisab.
- **Nisab** — 85g gold or 595g silver at the stored metal price.

Hijri dates come from `Intl.DateTimeFormat` with the `islamic-umalqura`
calendar rather than fixed strings, and every date is formatted in UTC so the
server and client always agree.

Two places where the mockup's own arithmetic did not add up, and this
implementation follows the maths instead:

- The mockup deducted $18.44 of dust from a gross that never included it. Here
  gross includes dust and the deduction removes it once.
- The mockup showed $966.11 of zakat on $38,604.50 of net wealth; 2.5% of that
  is $965.11.

## Layout

```
src/
  app/
    (marketing)/             # header + footer shell for the public pages
      page.tsx               # 01 landing
      blog/[slug]|privacy|sanctum/page.tsx
    (dashboard)/             # sidebar shell for the signed-in screens
      portfolio|calculation|nisab|history/page.tsx
  components/
    ui/                      # Button, Toggle, Panel, Segmented, RadioCard, …
    layout/                  # sidebar, mobile nav, logo, wallet badge
    marketing/               # landing sections, header, footer, backdrops
    content/                 # block renderer shared by blog + privacy
    wallet/                  # connect modal + trigger
    blog|legal|sanctum/
    portfolio|calculation|nisab|history/
  data/                      # sample scan, metal prices, posts, policy, pools
  lib/                       # zakat maths, staking maths, formatting, CSV
  state/                     # settings store + derived hooks
```

`src/state/settings-store.ts` keeps settings outside React and persists them to
`localStorage`; components read it through `useSyncExternalStore`, so the
server renders defaults and the client swaps in stored values after hydration.

## Not wired up yet

- **Wallet connection.** The modal hands off to the sample scan in
  `src/data/portfolio.ts`. A real `@solana/wallet-adapter` + RPC + price feed
  drops in behind that module without touching anything downstream.
- **Persistence.** History and settings are per-browser. Prisma and Postgres
  are configured but the schema has no models.
- **PDF export** uses the browser print dialog; CSV export is real.
- **Sanctum pool figures** in `src/data/sanctum.ts` are a sample snapshot. The
  estimator maths is real; the APYs and TVLs want the Sanctum API behind them.
- **The newsletter form** in the footer has no provider wired to it yet.
