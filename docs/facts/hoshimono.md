# Hoshimono: fact sheet

Hoshimono is an online supermarket for Metro Manila where shoppers fill a cart, choose a two-hour delivery slot and pay by GCash, card or cash on delivery, and Hub staff pick, dispatch and keep stock in the same Next.js app.

Captured 2026-11-01 from a local production build (`next build` + `next start`) on seeded demo data. Product photos are not in the seed, so every Product shows the app's designed category-icon placeholder instead of a photo.

## Screenshots

Desktop shots are 1440x900 at 2x (2880x1800) unless noted. Phone shots are 2x.

| File | Caption |
| --- | --- |
| home.png | The storefront home with delivery promise, aisles, fresh picks and weekly sale. |
| home-dark.png | The same home page in dark mode, which follows the system setting. |
| category.png | An aisle page with sub-aisles, price and brand filters, and stock and by-weight tags. |
| search.png | Searching the Filipino word "gatas" finds six kinds of milk. |
| product.png | A Product sold by weight, with its unit price and a plain note on how the final price is set. |
| recipe.png | A recipe that puts its ingredients in the cart, scaled to the servings (full page, 2880x3506). |
| cart.png | The cart with per-item substitution choices, picker notes and an estimated total. |
| checkout.png | Checkout with two-hour delivery slots (the chosen one held for the shopper), payment choices and the order summary. |
| stock.png | The staff stock screen: on the shelf, reserved, free and a low-stock flag per Product. |
| staff-home.png | The staff home, with every Hub tool grouped by job. |
| home-phone.png | The storefront home on a 390 px wide phone (780x1688). |
| product-phone.png | A Product page on a 390 px wide phone (780x1688). |
| home-phone-412.png | The storefront home on a 412 px wide phone (824x1830). |
| product-phone-412.png | A Product page on a 412 px wide phone (824x1830). |

Note: at 390 px the header row is 399 px wide, so the search box and the theme button are clipped by 9 px on the right in the two 390 shots. The 412 px shots do not have this problem.

## Stack

Versions installed from `package-lock.json` (package.json pins Next and React exactly; the rest are caret ranges).

- Next.js 16.4.2 (App Router, Cache Components, Server Actions)
- React 19.3.0 and React DOM 19.3.0
- TypeScript 5.9.3
- Prisma 7.10.1 (`prisma`, `@prisma/client`, `@prisma/adapter-pg`) on PostgreSQL 17
- Tailwind CSS 4.3.3
- Better Auth 1.7.10 (magic link, text code, Google, staff roles)
- Zod 4.6.7, Motion 14.3.0, next-themes 0.4.6, vaul 1.1.2, Phosphor icons
- Vitest 5.0.5 with Testing Library React 16.3.3 and jsdom
- Playwright 1.64.1 with @axe-core/playwright 4.14.0
- Lighthouse CI (`@lhci/cli` 0.15.1 in CI, budgets in `lighthouserc.json`)
- ESLint 9.39.5, Prettier, Husky and lint-staged

## Counts

- 22 Architecture Decision Records in `docs/adr` (0001 to 0022).
- 36 Vitest test files (14 in `src`, 22 in `tests`) and 25 Playwright spec files in `e2e`.
- Last green CI run on `main` (run 41310345102, 1 Nov 2026, jobs check, e2e and lighthouse all passed): 391 Vitest tests passed in 36 files; 81 Playwright tests passed and 1 skipped.
- 13 domain modules in `src/modules`, 26 database migrations.
- Seed data: 155 Products in 41 categories (9 top level), 3 recipes, 3 delivery Zones, 6 delivery slots a day.

## Standout features and decisions

- Money is integer centavos everywhere and is formatted only at the UI edge, so there is no floating-point money. Proof: `docs/adr/0002-money-as-integer-centavos.md`, `src/lib/money.ts`.
- Items sold by weight charge an estimate at checkout, settle to the packed weight at picking (never above the estimate) and refund the difference in one go. Proof: `docs/adr/0008-weighed-items-online-and-refunds.md`.
- Stock and slot capacity are safe under concurrent checkouts: tests race orders for the last unit and carts for one slot against a real Postgres database. Proof: `tests/db/orders.test.ts` ("sell the last unit once"), `tests/db/delivery.test.ts`.
- Payments sit behind a provider interface (PayMongo, plus a stand-in provider for local and e2e runs), and every webhook is deduplicated on the provider event id before it touches an Order. Proof: `docs/adr/0003-payment-provider-interface.md`, `src/modules/payments/internal/webhooks.ts`.
- A modular monolith: modules import each other only through `index.ts`, enforced by an ESLint rule that has its own test. Proof: `docs/adr/0001-modular-monolith-nextjs.md`, `tests/module-boundary.test.ts`.
- Bilingual, typo-tolerant search on plain Postgres (full text, `pg_trgm`, `unaccent`, a Filipino and English synonym list), plus the whole shop in Filipino at `/fil`. Proof: `docs/03-ARCHITECTURE.md` (search section), `src/modules/catalog/internal/search/synonyms.ts`, `docs/adr/0017-filipino-pwa-and-funnel.md`.
- Recipe to cart: ingredients scale with the servings, pantry staples start unticked, and one button adds the rest. Proof: `docs/adr/0013-recipes-articles-and-content-editors.md`, `src/components/recipe/recipe-cart.tsx`.
