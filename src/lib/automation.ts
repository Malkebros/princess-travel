import type { Booking, Stage } from "@/lib/types";

/** Stages that still need Amira’s attention */
export const FOLLOW_UP_STAGES: Stage[] = ["open", "waiting_pay"];

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

/**
 * POST digest to Make / Zapier / n8n. No desk button — meant for cron / schedule.
 */
export async function sendFollowUpDigest(payload: FollowUpDigestPayload): Promise<{
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

export function isAuthorizedAutomationRequest(request: Request) {
  const cronHeader = request.headers.get("x-vercel-cron");
  if (cronHeader === "1") return true;

  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    // Dev / demos without a secret: allow only when webhook is configured locally
    return process.env.NODE_ENV !== "production";
  }

  const auth = request.headers.get("authorization") || "";
  if (auth === `Bearer ${secret}`) return true;

  const url = new URL(request.url);
  if (url.searchParams.get("secret") === secret) return true;

  return false;
}
