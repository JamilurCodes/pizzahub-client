# PizzaHub — Client

PizzaHub is a pizza ordering and delivery platform with three roles: **customers** order from local
pizzerias, **vendors** publish menus and fulfil orders, and **admins** moderate the marketplace.

This repository is the Next.js client. The Express + MongoDB API, Stripe webhook and ImgBB uploads
live in the companion server repository.

## Features

- **Brand-first storefront** — cream/ink/red design system, responsive sticky navbar and a
  full-bleed pizza hero, all built on shadcn `base-nova` components.
- **Authentication** — email/password and Google sign-in through Better Auth, a shared split-screen
  auth layout, inline password rules, toast feedback and post-auth redirects.
- **Role-aware navigation** — the header swaps “Sign in / Join” for a profile menu once a session
  exists, hides private links when logged out and signs out without a reload.
- **JWT access to the API** — the client mints a short-lived Better Auth JWT and sends it as a
  bearer token to the Express API.
- **Protected dashboard** — server-side session gate that redirects unauthenticated visitors to
  `/sign-in`.
- **Responsive by default** — mobile menu with keyboard support, fluid type and layouts verified at
  390 px, 768 px and 1440 px.

### Roadmap

Menu browsing, item details, the order flow, vendor/customer/admin dashboards, Stripe success and
cancel pages, profile settings and Motion animations are being added next. See `AGENTS.md` for the
architecture and conventions.

## Tech stack

| Package | Purpose |
| --- | --- |
| `next` 16 (App Router, Turbopack) | Framework, server components, routing |
| `react` 19 | UI runtime |
| `tailwindcss` 4 | Styling and design tokens |
| `shadcn` / `@base-ui/react` | Accessible primitives (buttons, fields, cards, toast) |
| `better-auth` + `@better-auth/mongo-adapter` | Auth, sessions, JWT plugin |
| `mongodb` | Database driver used by the auth adapter |
| `lucide-react`, `react-icons` | Icons |
| `cn` | Class name merging |
| `tw-animate-css` | Enter/exit animations |

## Getting started

```bash
npm install
cp .env.example .env      # fill in the values
npm run dev               # http://localhost:3000
```

The API is expected at `NEXT_PUBLIC_API_URL` (default `http://localhost:5000`). Start the server
repository first if you want authenticated API calls to work.

```bash
npm run lint
npm run build
```

### Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `BETTER_AUTH_SECRET` | yes | Signs sessions and encrypts JWKS private keys |
| `BETTER_AUTH_URL` | yes | Public origin, also the JWT issuer/audience |
| `MONGODB_URI` | yes | MongoDB connection string (shared with the API) |
| `GOOGLE_CLIENT_ID` | for Google login | OAuth client id |
| `GOOGLE_CLIENT_SECRET` | for Google login | OAuth client secret |
| `NEXT_PUBLIC_API_URL` | no | Express API base URL (default `http://localhost:5000`) |

`.env` is git-ignored; only `.env.example` is committed.

## Project structure

```
src/
  app/
    (auth)/sign-in, sign-up   # split-screen auth pages
    api/auth/[...all]         # Better Auth handler
    dashboard/                # session-gated landing page
    layout.tsx, page.tsx      # shell, metadata, homepage
  components/
    site-header.tsx, user-menu.tsx, hero.tsx, logo.tsx
    auth/                     # Google button, password checklist
    ui/                       # shadcn primitives
  lib/
    auth.ts                   # Better Auth config (Mongo, Google, JWT)
    auth.client.ts            # typed client hooks
    api.ts                    # bearer-token fetch wrapper
    password.ts               # shared password rules
```

## Authentication design

- Better Auth runs inside Next.js so the session cookie stays same-origin.
- Public sign-up can only create `customer` or `vendor` accounts; a `databaseHooks` guard clamps any
  other requested role.
- The JWT plugin publishes keys at `/api/auth/jwks`; the Express API verifies tokens there and
  re-reads the user to enforce `role` and `isBlocked`.
- Roles: `customer`, `vendor`, `admin`. Admin accounts are promoted from the server script, never
  through registration.

## Deployment notes

- Set every environment variable in the hosting provider; never commit `.env`.
- `BETTER_AUTH_URL` must match the deployed origin exactly (JWT issuer/audience and cookie domain).
- Add the production origin to the Google OAuth console redirect URIs:
  `https://<your-domain>/api/auth/callback/google`.
- Set `NEXT_PUBLIC_API_URL` to the deployed API origin and allow the client origin in the API's
  `CLIENT_URL`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build and type check |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
