import { NextResponse } from "next/server";
import { SEED_BOOKINGS } from "@/lib/seed-data";
import {
  bookingToRow,
  getSupabase,
  isCloudConfigured,
} from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST() {
  if (!isCloudConfigured()) {
    return NextResponse.json({
      mode: "local",
      bookings: SEED_BOOKINGS,
    });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Missing Supabase client" }, { status: 500 });
  }

  const { data: existing, error: listError } = await supabase
    .from("bookings")
    .select("id");
  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  const ids = ((existing ?? []) as { id: string }[]).map((r) => r.id);
  if (ids.length > 0) {
    const { error: deleteError } = await supabase
      .from("bookings")
      .delete()
      .in("id", ids);
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
  }

  const rows = SEED_BOOKINGS.map(bookingToRow);
  const { error: seedError } = await supabase.from("bookings").upsert(rows);
  if (seedError) {
    return NextResponse.json({ error: seedError.message }, { status: 500 });
  }

  return NextResponse.json({ mode: "cloud", bookings: SEED_BOOKINGS });
}
