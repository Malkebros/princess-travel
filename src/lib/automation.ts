import type { Booking } from "@/lib/types";

export type NewCallerPayload = {
  event: "new_caller";
  id: string;
  customerName: string;
  phone: string;
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  passengers: string;
  stage: string;
  notes: string;
  nextAction: string;
  createdAt: string;
  notifiedAt: string;
};

export function isAutomationConfigured() {
  return Boolean(process.env.AUTOMATION_WEBHOOK_URL?.trim());
}

export function bookingToNewCallerPayload(booking: Booking): NewCallerPayload {
  return {
    event: "new_caller",
    id: booking.id,
    customerName: booking.customerName,
    phone: booking.phone,
    from: booking.from,
    to: booking.to,
    departDate: booking.departDate,
    returnDate: booking.returnDate,
    passengers: booking.passengers,
    stage: booking.stage,
    notes: booking.notes,
    nextAction: booking.nextAction,
    createdAt: booking.createdAt,
    notifiedAt: new Date().toISOString(),
  };
}

/**
 * Fire-and-forget webhook for Make / Zapier / n8n.
 * Runs when a new caller is saved — no button click in the desk UI.
 */
export async function notifyNewCaller(
  booking: Booking
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const url = process.env.AUTOMATION_WEBHOOK_URL?.trim();
  if (!url) {
    return { ok: false, skipped: true, error: "AUTOMATION_WEBHOOK_URL not set" };
  }

  const payload = bookingToNewCallerPayload(booking);

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

export async function notifyNewCallers(bookings: Booking[]) {
  const results = await Promise.all(bookings.map((b) => notifyNewCaller(b)));
  return {
    attempted: bookings.length,
    sent: results.filter((r) => r.ok).length,
    skipped: results.filter((r) => r.skipped).length,
    failed: results.filter((r) => !r.ok && !r.skipped).length,
  };
}
