# Princess Travel automations (Make / Zapier / n8n)

Two automations, both **without a special “Send” button**:

| Event | When | Who gets notified | Why |
|---|---|---|---|
| `stage_changed` | Amira changes a caller’s **status** | **Customer** (SMS / WhatsApp / email) | They learn: working on it / pay now / ticketed |
| `follow_up_digest` | Daily cron | **Amira** | Nudge her about open / waiting-pay callers |

## 1. Make webhook (one scenario with a router)

1. [make.com](https://www.make.com) → **Create scenario**
2. **Webhooks → Custom webhook** → copy the URL  
3. Add a **Router** with two filters:

### Route A — text the customer
- Filter: `event` equals `stage_changed`
- Module: **SMS** / **WhatsApp** / **Email** / **Slack** (avoid Gmail if Google blocks Make)
  - To: `{{phone}}` (or email)
  - Text / body: **only** the webhook’s message field  

**Important (Make module numbers):** Look at the small grey number on the **Webhook** circle (examples: `2`, `12`). Put that number in the mapping:

```
{{12.message}}
```

Wrong number → email shows `undefined` and MIME `boundary_…` junk. Body must contain **only** that chip — no extra text.

**To (recipient):** use the caller’s email from the webhook. If Make says `email` is empty, that caller has no email on the card — open the caller → **More** → add an email → save, or in Make use:

```
{{ifempty(12.email; "your-demo@gmail.com")}}
```

(replace `12` with your webhook number)

### Route B — email Amira the daily follow-ups
- Filter: `event` equals `follow_up_digest`
- Module: **Email**
  - To: Amira  
  - Subject: `Princess Travel follow-ups ({{count}})`  
  - Body: `{{summary}}`

4. Turn the scenario **ON**.

## 2. Env vars (Vercel + local)

```bash
AUTOMATION_WEBHOOK_URL=https://hook.us1.make.com/YOUR_HOOK_ID
CRON_SECRET=pick-a-long-random-string
FOLLOW_UP_AFTER_DAYS=2
```

Redeploy after saving.

## 3. Customer messages by stage (built into the app)

| Status | Example message |
|---|---|
| Open | We received your trip request… |
| Working | We’re working on your ORD → CAI options… |
| Waiting pay | Your fare is ready — please complete payment… |
| Done | You’re ticketed… Safe travels! |
| Problem | We’re fixing an issue with your booking… |

## 4. Demo video tip

1. Open a caller → change status to **Waiting pay** → save.  
2. Show Make run + the customer text (or Make’s history).  
3. Optionally open `/api/automation/follow-ups?secret=…` once to show Amira’s digest.

## Payloads

### `stage_changed`
```json
{
  "event": "stage_changed",
  "customerName": "Hassan Farouk",
  "phone": "7735550142",
  "previousStage": "working",
  "stage": "waiting_pay",
  "message": "Hi Hassan Farouk, your fare is ready…"
}
```

### `follow_up_digest`
```json
{
  "event": "follow_up_digest",
  "count": 2,
  "summary": "Princess Travel follow-ups (2):\n• …"
}
```
