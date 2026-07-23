# KitWeight

KitWeight is a private-by-default hiking gear planner. Build a pack list, compare
carried, worn, and consumable weight, and export the result without creating an
account or sending the list to a server.

[![MIT licensed](https://img.shields.io/badge/license-MIT-2e5d44.svg)](LICENSE)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fandreedd%2Fkitweight)

## Features

- Local-first persistence in browser storage
- Carried, worn, and consumable weight totals
- Category charts and a visual pack layout
- CSV file and clipboard import/export
- Shareable pack-list image generation
- Responsive, installable web-app experience

## Local development

KitWeight requires Node.js 20.9 or newer and npm 10 or newer.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Useful checks:

```bash
npm run lint
npm run typecheck
npm run build
```

`npm run check` runs all three release checks in sequence.

## Deploy to Vercel

Import the GitHub repository into a Vercel Hobby project and keep the framework
preset set to Next.js. No database, third-party service, or required environment
variable is needed.

Vercel's production URL is used automatically for canonical, Open Graph, robots,
and sitemap URLs. To use a custom domain before it is attached to the project,
set `SITE_URL` to its full origin (for example, `https://kitweight.example.com`)
for the Production environment and redeploy.

## Data and privacy

Gear data remains in the current browser's local storage. Clearing site data
removes the list, so use CSV export for backups or transfers between devices.
KitWeight has no analytics or user accounts by default.

## Contributing

Bug reports and focused pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md)
before opening a pull request.

## License

KitWeight is released under the [MIT License](LICENSE).
