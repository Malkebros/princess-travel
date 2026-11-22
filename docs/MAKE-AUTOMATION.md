# Follow-up reminder automation (Make / Zapier / n8n)

**Point of this automation:** Amira already knows when *she* adds a caller. What she needs is a nudge for callers she’s been meaning to get back to.

**What runs (no button click):** Every day, the app finds callers still **open** or **waiting_pay** for 2+ days and sends Amira an email/SMS digest through Make.

## How it works

1. **Vercel Cron** hits `/api/automation/follow-ups` daily at **14:00 UTC** (~8:00 AM Chicago in winter).  
2. Or **Make Schedule** can call that same URL (good for class demos).  
3. The app builds a digest and POSTs it to `AUTOMATION_WEBHOOK_URL`.  
4. Make emails/texts Amira the list.

## 1. Create the Make scenario

1. Open [make.com](https://www.make.com) → **Create a new scenario**.
2. Module 1: **Webhooks → Custom webhook** → copy the URL.
3. Module 2: **Email → Send an email** (or Gmail).
4. Map:
   - **To:** Amira’s email  
   - **Subject:** `Princess Travel follow-ups ({{count}})`  
   - **Body:** `{{summary}}`  
5. Turn the scenario **ON**.

### Optional: Make also triggers the check (for your demo video)

Add a second scenario (or first module):

1. **Scheduler → Every day** (e.g. 8:00 AM)  
2. **HTTP → Make a request**  
   - URL: `https://princess-travel-malkebros.vercel.app/api/automation/follow-ups?secret=YOUR_CRON_SECRET`  
   - Method: GET  
3. Then your webhook module receives the digest the app posts (or parse the HTTP response).

## 2. Env vars (local + Vercel)

```bash
AUTOMATION_WEBHOOK_URL=https://hook.us1.make.com/YOUR_HOOK_ID
CRON_SECRET=pick-a-long-random-string
FOLLOW_UP_AFTER_DAYS=2
```

Redeploy after saving on Vercel.

## 3. Demo for class (2–3 min video)

1. In the desk, leave (or set) a caller on **Open** or **Waiting pay** with an older “updated” time, or temporarily set `FOLLOW_UP_AFTER_DAYS=0` for the demo.  
2. Hit the follow-up URL once (or wait for cron).  
3. Show Amira’s email/SMS arriving with the digest — **you didn’t click Send in the desk**.

## Webhook payload

```json
{
  "event": "follow_up_digest",
  "count": 2,
  "daysThreshold": 2,
  "callers": [
    {
      "id": "bk-…",
      "customerName": "Hassan Farouk",
      "phone": "7735550142",
      "stage": "waiting_pay",
      "daysStale": 5,
      "nextAction": "Collect payment Saturday"
    }
  ],
  "summary": "Princess Travel follow-ups (2):\n• …",
  "generatedAt": "…"
}
```
