# Automation assignment — draft answers (Samuel / Princess Travel)

## Feature (what to demo)

**Customer status notify + Amira follow-up digest**

1. Amira changes a caller’s **status** (e.g. Working → Waiting pay) and taps Save.  
2. The desk POSTs `stage_changed` to Make with a ready-made SMS/WhatsApp text for that stage.  
3. Make texts the **customer**.  
4. Separately, a **daily cron** emails Amira a list of callers still open / waiting on pay.

No extra “Send” button — saving the stage is the trigger.

## Setup still needed for a live text

1. Make.com → Custom webhook + Router (see `docs/MAKE-AUTOMATION.md`).  
2. Paste the hook URL into Vercel env `AUTOMATION_WEBHOOK_URL`.  
3. Redeploy.

Until that URL is set, the desk still saves; the badge says connect Make.

## Demo video script (~60–90s)

1. Open [princess-travel-malkebros.vercel.app](https://princess-travel-malkebros.vercel.app) → unlock.  
2. Open a caller with a phone → change status to **Waiting pay** → Save.  
3. Show Make run history + the customer message.  
4. (Optional) Hit follow-ups once to show Amira’s digest email.

## Features / bugs list (short)

**Features**
- Phone-friendly caller desk (search, status filters, Call / Text / WhatsApp / Add contact)
- Shared Supabase cloud save (computer + iPhone)
- Desk passcode (no Vercel login)
- Status-change customer notify via Make
- Daily follow-up digest for Amira

**Bugs / limits**
- Customer texts only fire when `AUTOMATION_WEBHOOK_URL` is set and Make is ON
- No real WhatsApp Business API in-app (Make/WhatsApp module does the send)
- Hobby Vercel cron is once/day (fine for follow-ups)

## Owner feedback (Amira) — fill after demo

- What she liked:  
- What she wanted changed:  
- Would she use it daily?:  
