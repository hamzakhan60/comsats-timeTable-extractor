This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:
---

# Com-vet — Veterinary Software Comparison

Com-vet is a small Next.js application for listing and comparing veterinary practice software. It fetches software entries and nested reviews from a Supabase backend and renders them using React components.

## Table of contents

- About
- Tech stack
- Repository layout
- Getting started
	- Prerequisites
	- Environment variables
	- Local development
- Database schema (Supabase)
- API helper
- Key components
- Scripts
- Deployment
- Troubleshooting
- Contributing
- License

## About

This project provides a simple frontend to browse veterinary practice software, view features, ratings and user reviews. Software records and reviews are stored in Supabase tables and fetched with the helper functions in `src/lib/api.js`.

## Tech stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS 4 (configured via `postcss.config.mjs`)
- Supabase (using `@supabase/supabase-js`)
- Lucide icons (`lucide-react`)

## Repository layout

- `src/app/` — Next.js app router entries (`layout.js`, `page.js`) and global styles
- `src/components/` — Reusable UI components (Navbar, Footer, SoftwareCardList, etc.)
- `src/lib/` — Client and API helpers (`supabaseClient.js`, `api.js`)
- `public/` — Static assets (logos, images)
- Configuration files: `package.json`, `next.config.mjs`, `eslint.config.mjs`, `postcss.config.mjs`

## Getting started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm (or yarn / pnpm)
- A Supabase project (https://supabase.com)

### Environment variables

Create a `.env.local` file in the project root with these values (replace with your Supabase values):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The app reads these values in `src/lib/supabaseClient.js` to construct the Supabase client.

### Install dependencies

Run (PowerShell):

```powershell
npm install
```

### Run locally

Start the dev server (PowerShell):

```powershell
npm run dev
```

Open http://localhost:3000 to view the app.

## Database schema (Supabase)

The frontend queries a `software` table and a related `bewertungen` (reviews) table. Below are SQL examples you can run in the Supabase SQL editor to create equivalent tables. Adjust column types to your needs.

```sql
-- software table
create table public.software (
	id serial primary key,
	name text not null,
	url text,
	eigenschaften jsonb,
	kurzbeschreibung text,
	logo_url text,
	screenshot_url text,
	clients_installation boolean default false,
	live boolean default false,
	land text,
	award text,
	rating numeric,
	created_on timestamptz default now()
);

-- bewertungen (reviews) table
create table public.bewertungen (
	id serial primary key,
	software_id integer references public.software(id) on delete cascade,
	vorname_nachname text,
	bewertung integer,
	erfahrung text,
	created_on timestamptz default now()
);

create index on public.bewertungen (software_id);
```

Notes:
- The `api.js` helper uses a nested select `bewertungen (...)`. That requires `bewertungen.software_id` to reference `software.id`.

## API helper

`src/lib/api.js` contains helper functions for querying Supabase. The main exported function in the current code is `getAllSoftwareWithReviews()` which returns software rows with nested review records.

Usage example (server component or server-side code):

```js
import { getAllSoftwareWithReviews } from '@/lib/api'

export default async function Page() {
	const softwareList = await getAllSoftwareWithReviews()
	// render list
}
```

Error handling: the helper throws an Error when Supabase returns an error — catch it in server components or API routes.

## Key components

A brief overview of important UI components in `src/components/`:

- `Navbar.js` — Top navigation
- `Footer.js` — Footer content
- `VeterinaryHero.js` — Hero section for the landing page
- `SoftwareCardList.js` — Renders a list of software cards
- `PraxisSoftwareInfo.js` — Detailed software information
- `Button.js`, `CTASection.js`, `FAQSection.js` — Small UI pieces

Open the `src/components` files to inspect prop shapes and implementation details.

## Scripts

From `package.json`:

- `npm run dev` — Starts Next.js dev server with Turbopack
- `npm run build` — Builds the app for production
- `npm run start` — Runs the production server
- `npm run lint` — Runs ESLint

## Deployment

This is a standard Next.js app and can be deployed to Vercel or any platform that supports Node.js and Next.js. For Vercel:

1. Connect your GitHub repository to Vercel.
2. Add the environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings.
3. Deploy the `main` branch.

Vercel will run `npm run build` automatically. If you use a different host, ensure Node.js 18+ is available.

## Troubleshooting

- If Supabase returns `authorization` or `invalid token` errors, verify your anon key and project URL.
- If the nested `bewertungen` data is empty, check that the `bewertungen.software_id` foreign key exists and has rows.
- If styles look off, ensure Tailwind CSS is configured and `src/app/globals.css` is imported in `layout.js`.

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repo
2. Create a feature branch
3. Open a PR with a clear description

Please follow the existing code style and run `npm run lint` before opening PRs.

## License

This repository does not specify a license. Add a `LICENSE` file if you want to make it open source.

---

Optional next additions I can make:
- Add an `.env.sample` and ensure `.env.local` is in `.gitignore`.
- Add SQL migration scripts under a `db/` folder.
- Add a small components reference section that lists prop shapes inferred from the components.

Tell me which extras you want or let me retry saving the appended README file directly in the repo.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
