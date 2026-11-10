# Princess Travel Desk

## Business
- **Name:** Princess Travel
- **Owner:** Amira Aboudeeb (Chicago area travel agent)
- **Contact:** phone / WhatsApp heavy workflow; she books flights in **Sabre Red**

## Problem (bottleneck)
Amira takes caller details by phone and text, then relies on memory or scattered notes for names, routes, dates, prices, payment status, and follow-ups. The bottleneck is **organizing callers and next actions**, not searching Sabre.

## What we are building (MVP)
A simple, phone-friendly **caller & booking desk** (not a public marketing site, not a Sabre replacement).

### Main workflow (end to end)
1. Unlock the desk with a shared passcode (no Vercel account).
2. See the caller list (search + status filters).
3. Add / edit a caller: name, phone, from/to, dates, passengers, price, status, notes, next action.
4. Save to **Supabase** so computer and iPhone share the same data.
5. From a caller card: **Call**, **Text**, **WhatsApp**, or **Add contact** (iPhone vCard).
6. Lock the desk when done (session cookie clears next browser session).

### Out of scope for this MVP
Automations, AI features, WhatsApp bots, multi-user logins, custom public domain / Google SEO.

## Stack
- Next.js (App Router) + TypeScript + Tailwind + shadcn/ui
- Supabase Postgres table `bookings` (see `supabase/schema.sql`)
- Env: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DESK_PASSCODE`
- Deployed on Vercel project `princess-travel`

## Product rules for agents
- Keep the UI simple for Amira — large tap targets, English only.
- Prefer real working desk features over worksheets, slides, or dashboards.
- Do not invent Sabre quote calculators or passport/traveler subforms unless requested.
- Never print secrets (Supabase keys, passcodes) in chat or commits.
