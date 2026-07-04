# Equity Guardians

Production site for **Equity Guardians** — foreclosure protection, curated savings, and foreclosure recovery services. Coverage is **free to the buyer** when represented by an affiliated Buyer's Realtor, and lasts for the life of the deed of trust. Built with [Astro](https://astro.build) (SSR via Node adapter), a small Airtable-backed contact form endpoint, and deployed on [Railway](https://railway.app).

> **SAVE — EARN — PROTECT**

## Stack

- **Astro 4** with the Node standalone adapter (SSR)
- Custom design system in vanilla CSS (no runtime framework)
- **Airtable REST API** for contact-form submissions
- **Railway** for hosting (auto-builds from GitHub `main`)

## Local development

```bash
npm install
cp .env.example .env    # fill in Airtable credentials (optional for browsing)
npm run dev
```

Open http://localhost:4321.

## Production build

```bash
npm run build
npm run preview         # serves the built app on $PORT (default 4321)
```

Railway automatically runs `npm run build` then `npm run preview` (via `start` in `railway.json`).

## Environment variables

Set these in **Railway → your service → Variables**:

| Variable                | Required | Purpose                                                              |
| ----------------------- | -------- | -------------------------------------------------------------------- |
| `AIRTABLE_TOKEN`        | Yes      | Airtable Personal Access Token with `data.records:write` on the base |
| `AIRTABLE_BASE_ID`      | Yes      | Airtable base id (starts with `app…`)                                |
| `AIRTABLE_TABLE`        | Yes      | Table name or table id where inquiries are written                   |
| `PUBLIC_CONTACT_EMAIL`  | No       | Display email; defaults to `admin@equityguardians.com`               |

The form gracefully falls back to a helpful error if credentials aren't set, so you can deploy first and configure Airtable second.

## Airtable table schema

Create a table (default name `Inquiries`) with these fields:

| Field name    | Type              |
| ------------- | ----------------- |
| Name          | Single line text  |
| Email         | Email             |
| Phone         | Phone number      |
| Address       | Single line text  |
| Subject       | Single line text  |
| Message       | Long text         |
| Submitted At  | Date (with time)  |
| Source        | Single line text  |

Extra fields are safely ignored by the endpoint.

## Deploy to Railway

1. Push this repo to GitHub (already done).
2. In Railway → **New Project → Deploy from GitHub repo** → pick `equityguardians`.
3. Railway detects `railway.json` and runs `npm run build`, then `npm run preview`.
4. Add the environment variables above.
5. Add a custom domain (`equityguardians.com`) under **Settings → Networking**.

## Project structure

```
src/
  components/    # Header, Footer, reusable UI
  layouts/       # Base HTML shell
  pages/         # Astro routes (index, about, services, team, contact, ...)
    api/         # Server endpoints (contact form → Airtable)
  styles/        # Global CSS + design tokens
public/
  logo.jpg       # Brand logo
  favicon.svg    # Favicon
```

## License

© Equity Guardians. All rights reserved.
