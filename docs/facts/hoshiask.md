# Hoshiask fact sheet

Hoshiask is a Laravel help desk for an organisation with field offices: clients file and follow tickets in a client portal, and staff assign, answer, escalate, close and report on them in a staff console.

All screenshots come from a local run of `main` at commit 0152c00 (version 1.0.1) on SQLite, with the project's seeders plus extra fictional demo tickets, clients and technicians. Desktop shots are 1440x900 at 2x (2880x1800 px); phone shots are 390x844 at 2x (780x1688 px).

## Screenshots

| File | Caption |
|---|---|
| sign-in.png | Sign in with a username or email, with a light and dark theme toggle. |
| dashboard.png | The staff dashboard shows open, aging and Severity 1 tickets at a glance. |
| dashboard-dark.png | The same staff dashboard in dark mode. |
| tickets.png | The ticket list has tabs, saved views, filters by office and severity, and bulk actions. |
| ticket.png | A ticket's conversation mixes public replies and internal notes the client never sees. |
| reports.png | Monthly reports compare tickets received and completed over the last 12 months. |
| client-ticket.png | The client sees the same ticket with only the public replies. |
| client-phone.png | The client portal dashboard on a phone. |
| ticket-phone.png | A client ticket and its conversation on a phone. |

## Stack (exact versions from composer.lock and package-lock.json)

- PHP: constraint `^8.3`
- Laravel framework: 13.36.0
- PDF export: barryvdh/laravel-dompdf 3.1.2
- Alpine.js: @alpinejs/csp 3.17.4 (the CSP build)
- Tailwind CSS: 4.3.3 (with @tailwindcss/postcss 4.3.3 and @tailwindcss/forms 0.5.11)
- Vite: 8.3.4 (laravel-vite-plugin 3.2.0)
- PHP tests: PHPUnit 12.5.36, ParaTest 7.20.0, Mockery 1.6.15
- PHP quality: PHPStan 2.3.1 with Larastan 3.13.0, Laravel Pint 1.32.1
- JavaScript tests: Vitest 5.0.5
- Browser tests: Playwright (@playwright/test) 1.64.1 with @axe-core/playwright 4.14.0
- Lint: ESLint 10.12.0
- Databases: PostgreSQL 16 in production and CI; SQLite and MySQL also work
- Node: 22.12 or newer (`engines` in package.json)

## Counts

From the latest green CI run on `main` (GitHub Actions run 41312501909, 2026-11-01, commit 0152c00):

- PHPUnit on SQLite: 1182 passed, 2 skipped (5212 assertions)
- PHPUnit again on PostgreSQL 16: 1183 passed, 1 skipped (5217 assertions)
- Vitest: 105 tests in 19 files, all passed
- Playwright: 20 tests passed, from 9 e2e spec files in `tests/e2e/`
- 3 architecture decision records in `docs/adr/`

## Standout features and decisions

1. Each ticket stores its own field office, so reports stay correct when a client moves or is deleted. Proof: `docs/adr/0001-field-office-stored-on-the-ticket.md`.
2. The privacy clean-up removes personal details but keeps the ticket row, so past reports and response times never change. Proof: `docs/adr/0002-retention-removes-personal-details-keeps-tickets.md`.
3. Backups are one AES-256-GCM encrypted file with its own key, a SHA-256 manifest, and verify and restore commands. Proof: `docs/adr/0003-backup-format.md` and `docs/backup-and-restore.md`.
4. A strict Content-Security-Policy, made possible by Alpine's CSP build: no inline scripts anywhere. Proof: `docs/security.md` and `docs/structure.md` (The front end).
5. Every SLA cut-off goes through one clock that can count round the clock or only working hours. Proof: `app/Support/BusinessHours.php` and `docs/report-metrics.md`.
6. CI runs a secret scan, PHPStan, Pint, the full PHP suite on SQLite and again on real PostgreSQL, then Playwright on Windows. Proof: `.github/workflows/ci.yml` and `docs/testing.md`.
7. Ticket lifecycle automation: resolved tickets close after a warning email, and Pending tickets nobody touches for 14 days are cancelled. Proof: `docs/ticket-system-workflow.md`.
