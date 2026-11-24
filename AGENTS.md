<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# PizzaHub client

PizzaHub is a multi-role pizza ordering platform: customers browse restaurant menus and order,
vendors publish menus and fulfil orders, and admins moderate the marketplace.

This repository is the **client** — a Next.js 16 App Router app that renders the storefront, the
auth screens and the role dashboards. The REST API, JWT middleware and Stripe webhook live in a
separate Express + MongoDB service (see `../pizzhub-server`).

## Commands

| Command             | Purpose                                                    |
| ------------------- | ---------------------------------------------------------- |
| `npm run dev`       | Dev server at http://localhost:3000                        |
| `npm run build`     | Production build; also type-checks the whole project       |
| `npm run lint`      | ESLint (`eslint`, flat config)                             |
| `npx tsc --noEmit`  | Fast type-check without emitting                           |

Run `npm run lint` and `npm run build` before every commit. A build is the only reliable check
that App Router pages, `"use client"` boundaries and Better Auth types still line up.

## Stack

- **Next.js 16** (App Router, Turbopack, React Compiler enabled)
- **React 19**
- **Tailwind CSS v4** with the shadcn `base-nova` preset
- **Base UI** (`@base-ui/react`) — not Radix — for primitives such as Toast
- **Better Auth** with the MongoDB adapter, email/password and Google
- **MongoDB** (database `pizzahub`)

## Structure

```
src/
  app/
    (auth)/              # shared split-screen auth layout
      sign-in/page.tsx
      sign-up/page.tsx
    api/auth/[...all]/   # Better Auth handler (GET + POST)
    dashboard/page.tsx   # session-gated landing page for every role
    layout.tsx           # fonts, metadata, header, Toaster
    page.tsx             # marketing homepage (hero)
    globals.css          # brand tokens + shadcn theme
  components/
    site-header.tsx      # responsive navbar, session-aware
    user-menu.tsx        # avatar dropdown + sign out
    hero.tsx, logo.tsx, user-avatar.tsx
    auth/                # Google button, password checklist
    ui/                  # shadcn primitives (card, field, input, button, toast, …)
  lib/
    auth.ts              # Better Auth server config (server-only)
    auth.client.ts       # createAuthClient + typed hooks
    api.ts               # bearer-token fetch wrapper for the Express API
    password.ts          # shared password rules
    utils.ts             # cn helper
```

## Auth

- Better Auth is mounted at `/api/auth/[...all]` and runs **inside** Next.js so session cookies
  stay same-origin. Do not move it to the Express server.
- Server code reads the session with
  `auth.api.getSession({ headers: await headers() })`; client code uses
  `authClient.useSession()` / `authClient.signIn.*` / `authClient.signUp.email`.
- Extra user fields are declared in `src/lib/auth.ts` under `user.additionalFields` and typed on
  the client through `inferAdditionalFields<typeof auth>()`:
  `role` (`customer | vendor | admin`), `isBlocked`, `businessName`, `subscriptionPlan`,
  `subscriptionExpiresAt`.
- A `databaseHooks.user.create.before` hook clamps public sign-ups to `customer` or `vendor` so a
  crafted request cannot self-assign `admin`. Never trust a role from the client without this hook.
- Google sign-in needs `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`; without them Better Auth logs
  a warning and the button fails at runtime.
- The Express API verifies the same JWT through the Better Auth JWKS endpoint and then re-reads
  the user from MongoDB to enforce `role` and `isBlocked`.
- The JWT plugin signs tokens for the API; the client mints one with
  `GET /api/auth/token` (see `src/lib/api.ts`) and sends it as `Authorization: Bearer …`.
  Issuer and audience both default to `BETTER_AUTH_URL`, so the API must use the same value.

## UI conventions

- Brand tokens live in `src/app/globals.css`: `--brand`, `--brand-dark`, `--brand-orange`,
  `--ink`, `--cream`. Use `bg-brand`, `text-ink`, `border-black/[0.06]` etc. instead of raw hex.
- Compose pages from `src/components/ui/*`. `Field`, `FieldGroup`, `FieldLabel` and `Input` are the
  standard form building blocks; keep labels wired with `htmlFor`/`id`.
- Feedback uses the Base UI toast manager — `toast.add({ type, title, description })` from
  `@/components/ui/toast`. `alert()` and `console.log` are not acceptable user feedback.
- `Toaster` is mounted once in `src/app/layout.tsx`; do not add another.
- Use `next/image` with `loading="eager"` (or `fetchPriority="high"`) for above-the-fold images;
  the `priority` prop is deprecated in Next.js 16. Use `size-*` utilities instead of `w-* h-*` pairs.
- The mobile breakpoint for the header is `lg`; keep the mobile menu keyboard accessible (Escape
  closes it) and close it on navigation.

## Environment

`.env` is git-ignored — never commit secrets or paste real values into docs.

```
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

`NEXT_PUBLIC_*` values are the only ones exposed to the browser; `BETTER_AUTH_URL` is server-only,
so `createAuthClient` intentionally relies on the same-origin default.

## Conventions

- TypeScript strict; no `any` in new code.
- Prefer server components. Add `"use client"` only for state, effects or event handlers.
- Keep validation in `src/lib` when it is shared between pages, and validate on the client before
  calling Better Auth so users get an inline, specific message.
- Redirect authenticated users with `router.push("/dashboard")` + `router.refresh()` after auth so
  the header picks up the new session.
- Commits follow `feat(scope): …`, `fix(scope): …`, `chore: …`, `docs: …`.

## Roadmap / known gaps

- Vendor, admin and customer dashboards are placeholders; only the shared `/dashboard` landing
  exists today.
- `/menu` and `/orders` are linked from the header but not implemented yet.
- Stripe checkout/webhook, ImgBB uploads and the Express API live in the server repository.
- Google credentials are still missing locally, so the social button is untested end to end.
