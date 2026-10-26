import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Booking, Stage } from "@/lib/types";

export type BookingRow = {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  from_code: string;
  to_code: string;
  depart_date: string;
  return_date: string;
  passengers: string;
  price: string;
  stage: string;
  notes: string;
  next_action: string;
  created_at: string;
  updated_at: string;
};

export function isCloudConfigured() {
  return Boolean(
    process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_ANON_KEY?.trim()
  );
}

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function rowToBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    customerName: row.customer_name ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    from: row.from_code ?? "",
    to: row.to_code ?? "",
    departDate: row.depart_date ?? "",
    returnDate: row.return_date ?? "",
    passengers: row.passengers ?? "1",
    price: row.price ?? "",
    stage: (row.stage as Stage) || "open",
    notes: row.notes ?? "",
    nextAction: row.next_action ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function bookingToRow(booking: Booking): BookingRow {
  return {
    id: booking.id,
    customer_name: booking.customerName,
    phone: booking.phone,
    email: booking.email,
    from_code: booking.from,
    to_code: booking.to,
    depart_date: booking.departDate,
    return_date: booking.returnDate,
    passengers: booking.passengers,
    price: booking.price,
    stage: booking.stage,
    notes: booking.notes,
    next_action: booking.nextAction,
    created_at: booking.createdAt,
    updated_at: booking.updatedAt,
  };
}
