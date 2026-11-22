import { NextResponse } from "next/server";
import { isAutomationConfigured, notifyNewCallers } from "@/lib/automation";
import { SEED_BOOKINGS } from "@/lib/seed-data";
import {
  bookingToRow,
  getSupabase,
  isCloudConfigured,
  rowToBooking,
  type BookingRow,
} from "@/lib/supabase";
import type { Booking } from "@/lib/types";

export const runtime = "nodejs";

const SEED_IDS = new Set(SEED_BOOKINGS.map((b) => b.id));

export async function GET() {
  if (!isCloudConfigured()) {
    return NextResponse.json({
      mode: "local",
      bookings: null,
      message:
        "Cloud database is not configured. This device will save callers only in the browser until Supabase keys are added.",
    });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Missing Supabase client" }, { status: 500 });
  }

  let data: BookingRow[] | null = null;
  let error: { message: string } | null = null;
  try {
    const result = await supabase
      .from("bookings")
      .select("*")
      .order("updated_at", { ascending: false });
    data = (result.data ?? null) as BookingRow[] | null;
    error = result.error;
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof Error
            ? e.message
            : "Could not reach Supabase. Check the project URL and that the project is not paused.",
      },
      { status: 500 }
    );
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let rows = (data ?? []) as BookingRow[];

  // First visit: seed sample callers so the desk is not empty
  if (rows.length === 0) {
    const seedRows = SEED_BOOKINGS.map(bookingToRow);
    const { error: seedError } = await supabase.from("bookings").upsert(seedRows);
    if (seedError) {
      return NextResponse.json({ error: seedError.message }, { status: 500 });
    }
    rows = seedRows;
  }

  return NextResponse.json({
    mode: "cloud",
    bookings: rows.map(rowToBooking),
    automationEnabled: isAutomationConfigured(),
  });
}

export async function PUT(request: Request) {
  if (!isCloudConfigured()) {
    return NextResponse.json(
      {
        error:
          "Cloud database is not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY, then redeploy.",
      },
      { status: 503 }
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Missing Supabase client" }, { status: 500 });
  }

  let body: { bookings?: Booking[] };
  try {
    body = (await request.json()) as { bookings?: Booking[] };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body.bookings)) {
    return NextResponse.json({ error: "bookings array required" }, { status: 400 });
  }

  const rows = body.bookings.map(bookingToRow);
  const ids = rows.map((r) => r.id);

  // Snapshot IDs before save so we can detect brand-new callers
  const { data: beforeRows, error: beforeError } = await supabase
    .from("bookings")
    .select("id");
  if (beforeError) {
    return NextResponse.json({ error: beforeError.message }, { status: 500 });
  }
  const beforeIds = new Set(
    ((beforeRows ?? []) as { id: string }[]).map((r) => r.id)
  );

  // Replace desk contents: upsert current rows, delete removed ones
  if (rows.length > 0) {
    const { error: upsertError } = await supabase.from("bookings").upsert(rows);
    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }
  }

  // Automation: new caller saved → webhook (Make / Zapier / n8n) with no button click
  const newlyCreated = body.bookings.filter(
    (b) => !beforeIds.has(b.id) && !SEED_IDS.has(b.id)
  );
  let automation = {
    attempted: 0,
    sent: 0,
    skipped: 0,
    failed: 0,
  };
  if (newlyCreated.length > 0) {
    automation = await notifyNewCallers(newlyCreated);
  }

  const { data: existing, error: listError } = await supabase
    .from("bookings")
    .select("id");
  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  const toDelete = ((existing ?? []) as { id: string }[])
    .map((r) => r.id)
    .filter((id) => !ids.includes(id));

  if (toDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("bookings")
      .delete()
      .in("id", toDelete);
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
  }

  // Empty list: clear table
  if (rows.length === 0 && (existing ?? []).length > 0) {
    const allIds = ((existing ?? []) as { id: string }[]).map((r) => r.id);
    const { error: clearError } = await supabase
      .from("bookings")
      .delete()
      .in("id", allIds);
    if (clearError) {
      return NextResponse.json({ error: clearError.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    mode: "cloud",
    ok: true,
    count: rows.length,
    automationEnabled: isAutomationConfigured(),
    automation,
  });
}
