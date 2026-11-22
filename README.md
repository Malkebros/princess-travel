# Princess Travel Desk

A simple, phone-friendly caller list for **Princess Travel** (Amira Aboudeeb).

Save names, phones, trips, status, and what to do next. Sabre stays in Sabre — this is just organization.

## Built for easy use

- Large buttons and list rows (works on phone)  
- Search by name or phone  
- Tap a **phone number** or **Call** to dial (works on iPhone)  
- **WhatsApp** button on each caller  
- New caller starts with name + phone only  
- Email & price tucked under “More”  
- **Shared cloud save** (Supabase) so computer + iPhone see the same callers  
- **Desk passcode** (optional) so strangers with the link can’t open it — no Vercel login  
- **Follow-up reminders** — daily automation emails/texts Amira about callers still open or waiting on pay  

## Run locally

```bash
npm install
cp .env.example .env.local
# add your Supabase URL + anon key, then:
npm run dev -- --port 43141
```

Open [http://127.0.0.1:43141](http://127.0.0.1:43141).

Without Supabase keys, the desk still works and saves **on that device only**.

## Shared cloud database (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).  
2. Open **SQL Editor**, paste and run [`supabase/schema.sql`](supabase/schema.sql).  
3. Go to **Project Settings → API** and copy:
   - Project URL → `SUPABASE_URL`
   - `anon` `public` key → `SUPABASE_ANON_KEY`  
4. Put those in `.env.local` (local) and in **Vercel → Project → Settings → Environment Variables** (live site).  
5. Redeploy.

The header badge will say **Saved in the cloud** when sync is working.

## Desk passcode (private without Vercel login)

Vercel’s built-in password wall needs a paid plan. This app uses a simple shared passcode instead:

1. Set `DESK_PASSCODE` in `.env.local` and in Vercel env vars.  
2. Redeploy.  
3. Opening the site shows an unlock screen. Unlock lasts for the browser session only (and she can tap **Lock desk** anytime).

If `DESK_PASSCODE` is empty, the lock is off.

## Follow-up reminder automation (Make / Zapier / n8n)

A **daily cron** finds callers still **open** or **waiting_pay** for 2+ days and POSTs a digest to `AUTOMATION_WEBHOOK_URL` (Make emails/texts Amira). No button click.

Full setup: [`docs/MAKE-AUTOMATION.md`](docs/MAKE-AUTOMATION.md).

1. Make scenario: **Custom webhook → Email**.  
2. Set `AUTOMATION_WEBHOOK_URL` + `CRON_SECRET` on Vercel.  
3. Redeploy (cron path: `/api/automation/follow-ups`).  
4. Demo: leave a caller open → run the job → show Amira’s email.
