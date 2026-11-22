# Automation Feature Completion — fill-in for the Word doc

**Student:** Samuel Malke  
**Business:** Princess Travel (Amira Aboudeeb)  
**Date:** update to today when you submit  

---

## 1. GitHub repo link

https://github.com/Malkebros/princess-travel  

Live desk: https://princess-travel-malkebros.vercel.app  

---

## 2. Automation (no button click)

**Name:** Customer status notify (Make) + daily follow-up digest  

**How it works:**
1. Amira opens a caller and changes **status** (e.g. Working → Waiting for pay).  
2. Saving to Supabase posts `stage_changed` to Make (webhook).  
3. Make sends a Gmail to the customer with a ready-made message for that stage.  
4. Separately, Vercel Cron hits `/api/automation/follow-ups` daily and Make can email Amira a digest of callers still open / waiting on pay.  

**No “Send” button** — changing status + save is the trigger.

**Tools:** Make.com (Custom webhook → Gmail), Vercel Cron, Supabase  

---

## 3. Demo video script (2–3 min)

1. Unlock the desk → show caller list (search / status filters).  
2. Open a caller that has an **email** → change status → show cloud save.  
3. Switch to Make → green checkmarks on Webhook → Gmail.  
4. Open Gmail → show the Princess Travel update email with the stage message.  
5. (Optional) Mention daily follow-up cron for Amira.  
6. Quick pass: Call / Text / WhatsApp / Lock desk.  

---

## 4. Features finished

- Phone-friendly caller desk (list, search, status filters)  
- Add / edit caller: trip, price, status, notes, next action  
- Shared **Supabase** cloud save (computer + iPhone)  
- Desk **passcode** (no Vercel account login)  
- Call / Text / WhatsApp / Add contact (vCard)  
- **Make automation:** status change → customer email  
- **Daily follow-up digest** cron for Amira (open / waiting_pay)  
- Deployed on Vercel  

## Bugs / issues fixed

- Vercel password wall needs Pro → built app passcode instead  
- Supabase pause → cloud “fetch failed”; restore project in dashboard  
- Make webhook “not listening” → scenario Active + Save; recreate webhook if orphaned  
- Blank / `undefined` / `boundary_` emails → map `{{12.message}}` only; Raw HTML  
- Empty `12.email` → caller had no email on card; add email under More (or ifempty fallback)  
- Cron blocked by desk lock → allow `/api/automation/follow-ups` without session  

---

## 5. Owner feedback (fill after Amira tries it)

**Review date:** ______________  

What she liked:  
-  

What was confusing / broken:  
-  

Changes she asked for:  
-  

Would she use this on calls?: Yes / No / Maybe —  

---

## Paste-ready short answers

**Automation one-liner:**  
When Amira changes a caller’s status, Make emails the customer a stage-specific update with no extra button; a daily cron can also email Amira follow-ups.

**Features finished (one paragraph):**  
Finished the Princess Travel caller desk with cloud sync, passcode lock, phone actions, status-based Make email to customers, and a daily follow-up digest for Amira. Deployed at princess-travel-malkebros.vercel.app.
