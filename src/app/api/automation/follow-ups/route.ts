import {
  buildFollowUpDigest,
  isAuthorizedAutomationRequest,
  isAutomationConfigured,
  sendFollowUpDigest,
} from "@/lib/automation";
import {
  getSupabase,
  isCloudConfigured,
  rowToBooking,
  type BookingRow,
} from "@/lib/supabase";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Scheduled automation (no UI button):
 * Vercel Cron or Make Schedule → finds open / waiting_pay callers that are stale
 * → POSTs a digest to AUTOMATION_WEBHOOK_URL (email/SMS to Amira).
 */
async function runFollowUps(request: Request) {
  if (!isAuthorizedAutomationRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCloudConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 }
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Missing Supabase client" }, { status: 500 });
  }

  const { data, error } = await supabase.from("bookings").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const bookings = ((data ?? []) as BookingRow[]).map(rowToBooking);
  const digest = buildFollowUpDigest(bookings);

  // Always return the digest for Make/Zapier to use; also push to webhook when set.
  let webhook: { ok: boolean; skipped?: boolean; error?: string } = {
    ok: false,
    skipped: true,
  };
  if (isAutomationConfigured()) {
    // Include "all clear" digests so Amira knows the daily job ran
    webhook = await sendFollowUpDigest(digest);
  }

  return NextResponse.json({
    ok: true,
    automationEnabled: isAutomationConfigured(),
    digest,
    webhook,
  });
}

export async function GET(request: Request) {
  return runFollowUps(request);
}

export async function POST(request: Request) {
  return runFollowUps(request);
}
