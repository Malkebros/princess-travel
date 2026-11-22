import type { Booking, Stage } from "@/lib/types";

/** Stages that still need Amira’s attention (daily digest) */
export const FOLLOW_UP_STAGES: Stage[] = ["open", "waiting_pay"];

/** SMS/text Amira can auto-send to the customer when status changes */
export const CUSTOMER_STAGE_MESSAGES: Record<Stage, string> = {
  open: "Hi {{name}}, this is Princess Travel. We received your trip request and will follow up soon.",
  working:
    "Hi {{name}}, Princess Travel here — we’re working on your {{from}} → {{to}} options now.",
  waiting_pay:
    "Hi {{name}}, your fare is ready{{price}}. Please reply here or call to complete payment. — Princess Travel",
  done: "Hi {{name}}, you’re ticketed for {{from}} → {{to}}{{depart}}. Safe travels! — Princess Travel",
  problem:
    "Hi {{name}}, we’re fixing an issue with your booking and will update you shortly. — Princess Travel",
};

export type FollowUpCaller = {
  id: string;
  customerName: string;
  phone: string;
  from: string;
  to: string;
  departDate: string;
  stage: string;
  nextAction: string;
  notes: string;
  updatedAt: string;
  daysStale: number;
};

export type FollowUpDigestPayload = {
  event: "follow_up_digest";
  count: number;
  daysThreshold: number;
  callers: FollowUpCaller[];
  summary: string;
  generatedAt: string;
};

export type StageChangedPayload = {
  event: "stage_changed";
  id: string;
  customerName: string;
  phone: string;
  email: string;
  from: string;
  to: string;
  departDate: string;
  price: string;
  previousStage: string;
  stage: Stage;
  /** Ready-to-send customer SMS/email body */
  message: string;
  /** Same as message — easier to find in Make’s field picker */
  text: string;
  body: string;
  notifiedAt: string;
};

export function isAutomationConfigured() {
  return Boolean(process.env.AUTOMATION_WEBHOOK_URL?.trim());
}

export function followUpAfterDays() {
  const raw = Number(process.env.FOLLOW_UP_AFTER_DAYS || "2");
  return Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 2;
}

function daysSince(iso: string, now: Date) {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return 0;
  return Math.floor((now.getTime() - t) / (1000 * 60 * 60 * 24));
}

function fillTemplate(
  template: string,
  booking: Booking
) {
  const priceBit = booking.price.trim() ? ` (about $${booking.price.trim()})` : "";
  const departBit = booking.departDate.trim()
    ? ` on ${booking.departDate.trim()}`
    : "";
  return template
    .replaceAll("{{name}}", booking.customerName.trim() || "there")
    .replaceAll("{{from}}", booking.from.trim() || "your city")
    .replaceAll("{{to}}", booking.to.trim() || "your destination")
    .replaceAll("{{price}}", priceBit)
    .replaceAll("{{depart}}", departBit);
}

export function customerMessageForStage(booking: Booking): string {
  return fillTemplate(CUSTOMER_STAGE_MESSAGES[booking.stage], booking);
}

/** Callers still open / waiting on pay for at least N days. */
export function pickFollowUps(bookings: Booking[], now = new Date()) {
  const threshold = followUpAfterDays();
  const callers: FollowUpCaller[] = [];

  for (const b of bookings) {
    if (!FOLLOW_UP_STAGES.includes(b.stage)) continue;
    const anchor = b.updatedAt || b.createdAt;
    const stale = daysSince(anchor, now);
    if (stale < threshold) continue;
    callers.push({
      id: b.id,
      customerName: b.customerName,
      phone: b.phone,
      from: b.from,
      to: b.to,
      departDate: b.departDate,
      stage: b.stage,
      nextAction: b.nextAction,
      notes: b.notes,
      updatedAt: b.updatedAt,
      daysStale: stale,
    });
  }

  callers.sort((a, b) => b.daysStale - a.daysStale);
  return { threshold, callers };
}

export function buildFollowUpDigest(
  bookings: Booking[],
  now = new Date()
): FollowUpDigestPayload {
  const { threshold, callers } = pickFollowUps(bookings, now);
  const lines = callers.map(
    (c) =>
      `• ${c.customerName || "Caller"} (${c.phone || "no phone"}) — ${c.stage}, ${c.daysStale}d stale${c.nextAction ? `; next: ${c.nextAction}` : ""}`
  );
  return {
    event: "follow_up_digest",
    count: callers.length,
    daysThreshold: threshold,
    callers,
    summary:
      callers.length === 0
        ? `No follow-ups. Nobody has been open/waiting_pay for ${threshold}+ days.`
        : `Princess Travel follow-ups (${callers.length}):\n${lines.join("\n")}`,
    generatedAt: now.toISOString(),
  };
}

export function findStageChanges(
  previous: Booking[],
  next: Booking[]
): {
  changes: StageChangedPayload[];
  skippedNoEmail: number;
  stageChanged: number;
} {
  const prevById = new Map(previous.map((b) => [b.id, b]));
  const changes: StageChangedPayload[] = [];
  let skippedNoEmail = 0;
  let stageChanged = 0;

  for (const booking of next) {
    const prev = prevById.get(booking.id);
    if (!prev) continue;
    if (prev.stage === booking.stage) continue;
    stageChanged += 1;
    // Customer email notify needs an address (Make Gmail To)
    if (!booking.email.trim()) {
      skippedNoEmail += 1;
      continue;
    }

    const message = customerMessageForStage(booking);
    changes.push({
      event: "stage_changed",
      id: booking.id,
      customerName: booking.customerName,
      phone: booking.phone,
      email: booking.email,
      from: booking.from,
      to: booking.to,
      departDate: booking.departDate,
      price: booking.price,
      previousStage: prev.stage,
      stage: booking.stage,
      message,
      text: message,
      body: message,
      notifiedAt: new Date().toISOString(),
    });
  }

  return { changes, skippedNoEmail, stageChanged };
}

async function postWebhook(payload: unknown): Promise<{
  ok: boolean;
  skipped?: boolean;
  error?: string;
}> {
  const url = process.env.AUTOMATION_WEBHOOK_URL?.trim();
  if (!url) {
    return { ok: false, skipped: true, error: "AUTOMATION_WEBHOOK_URL not set" };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Webhook HTTP ${res.status}${text ? `: ${text.slice(0, 200)}` : ""}`,
      };
    }
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Webhook request failed",
    };
  }
}

/** Daily digest → Amira (Make/Zapier). */
export async function sendFollowUpDigest(payload: FollowUpDigestPayload) {
  return postWebhook(payload);
}

/**
 * When Amira changes a caller’s status, notify the customer via Make/Zapier
 * (SMS / WhatsApp / email). No separate “send” button — saving the stage is enough.
 */
export async function notifyStageChanges(changes: StageChangedPayload[]) {
  const results = await Promise.all(changes.map((c) => postWebhook(c)));
  const sentDetails = changes
    .map((c, i) => ({ change: c, result: results[i] }))
    .filter((row) => row.result.ok)
    .map(({ change }) => ({
      customerName: change.customerName,
      stage: change.stage,
      message: change.message,
    }));
  return {
    attempted: changes.length,
    sent: results.filter((r) => r.ok).length,
    skipped: results.filter((r) => r.skipped).length,
    failed: results.filter((r) => !r.ok && !r.skipped).length,
    messages: changes.map((c) => c.message),
    sentDetails,
  };
}

export function isAuthorizedAutomationRequest(request: Request) {
  const cronHeader = request.headers.get("x-vercel-cron");
  if (cronHeader === "1") return true;

  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  const auth = request.headers.get("authorization") || "";
  if (auth === `Bearer ${secret}`) return true;

  const url = new URL(request.url);
  if (url.searchParams.get("secret") === secret) return true;

  return false;
}
