# New-caller alert automation (Make / Zapier / n8n)

**What it does:** When Amira (or you) adds a **new caller** in the Princess Travel desk, the server automatically POSTs JSON to a webhook. Make/Zapier/n8n receives it and emails or texts Amira — **no button click**.

## 1. Create the Make scenario (free)

1. Sign up / log in at [make.com](https://www.make.com).
2. **Create a new scenario**.
3. Add module: **Webhooks → Custom webhook**.
4. Click **Add** → copy the webhook URL (looks like `https://hook.us1.make.com/...`).
5. Add a second module: **Email → Send an email** (or Gmail / SMS).
6. Map fields from the webhook, for example:

   - **To:** Amira’s email (`aboudeeb@sbcglobal.net`)
   - **Subject:** `New Princess Travel caller: {{customerName}}`
   - **Body:**
     ```
     New caller saved on the desk.

     Name: {{customerName}}
     Phone: {{phone}}
     Route: {{from}} → {{to}}
     Depart: {{departDate}}
     Notes: {{notes}}
     ```

7. Turn the scenario **ON**.

## 2. Add the webhook URL to the app

Set this environment variable (local `.env.local` **and** Vercel → Project → Environment Variables):

```bash
AUTOMATION_WEBHOOK_URL=https://hook.us1.make.com/YOUR_HOOK_ID
```

Redeploy Vercel after saving.

## 3. Demo / test

1. Open the live desk and unlock.
2. Confirm the header shows **New-caller alerts on**.
3. Tap **New caller**, enter a name + phone, save.
4. Within a few seconds, Amira should get the email/SMS from Make.
5. Record that for your 2–3 minute assignment video.

## Webhook payload (JSON)

```json
{
  "event": "new_caller",
  "id": "bk-…",
  "customerName": "Layla Mansour",
  "phone": "3125550198",
  "from": "ORD",
  "to": "BEY",
  "departDate": "2026-11-05",
  "returnDate": "",
  "passengers": "1",
  "stage": "open",
  "notes": "…",
  "nextAction": "",
  "createdAt": "…",
  "notifiedAt": "…"
}
```

## Zapier / n8n

Same idea: **Catch Hook** (Zapier) or **Webhook** (n8n) → Email/SMS module. Paste that hook URL into `AUTOMATION_WEBHOOK_URL`.
