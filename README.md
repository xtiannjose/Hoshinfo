# Hoshinfo

Christian Jose's portfolio: the Hoshi projects ([Hoshikopi](https://github.com/xtiannjose/Hoshikopi), [Hoshimono](https://github.com/xtiannjose/Hoshimono), [Hoshiask](https://github.com/xtiannjose/Hoshiask)) with screenshots and short case studies, plus a look at work built at iOne Resources (no links: that code is private).

Next.js 16 (Cache Components), TypeScript, Tailwind CSS 4, Geist and Phosphor icons. Every page is prerendered; there is no database.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build, the check before a push
```

## Where things are

| What | Where |
| --- | --- |
| Name, role, GitHub link | `src/content/site.ts` |
| Projects, case studies, iOne work | `src/content/projects.ts` |
| Screenshots | `public/shots/<project>/` |
| Where the numbers come from (test counts, versions, decisions) | `docs/facts/` |
| Colours and motion | `src/app/globals.css` |

## Screenshots

Desktop shots are 1440x900 at 2x (2880x1800 px), phone shots 390 or 412 px wide at 2x. Each shot records its pixel size in `projects.ts`. They are taken with Playwright from the live Hoshikopi site and from local runs of Hoshimono and Hoshiask on fictional demo data. Before adding one, check it shows no real names, phone numbers or addresses.

## Deploy

Vercel, imported from GitHub. No environment variables are needed.
