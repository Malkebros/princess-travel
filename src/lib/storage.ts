import { SEED_BOOKINGS } from "@/lib/seed-data";
import type { Booking } from "@/lib/types";

export const STORAGE_KEY = "princess-travel-desk-v3";

export function loadBookings(): Booking[] {
  if (typeof window === "undefined") return SEED_BOOKINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_BOOKINGS;
    const parsed = JSON.parse(raw) as { bookings?: Booking[] };
    if (!parsed?.bookings || !Array.isArray(parsed.bookings)) {
      return SEED_BOOKINGS;
    }
    return parsed.bookings;
  } catch {
    return SEED_BOOKINGS;
  }
}

export function saveBookings(bookings: Booking[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ bookings }));
}

export function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function emptyBooking(partial?: Partial<Booking>): Booking {
  const now = new Date().toISOString();
  return {
    id: newId("bk"),
    customerName: "",
    phone: "",
    email: "",
    from: "",
    to: "",
    departDate: "",
    returnDate: "",
    passengers: "1",
    price: "",
    stage: "open",
    notes: "",
    nextAction: "",
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function formatPhone(value: string) {
  const d = digitsOnly(value);
  if (d.length === 10) {
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  return value.trim() || "—";
}

export function formatMoney(value: string) {
  const n = Number(value);
  if (!value || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatShortDate(value: string) {
  if (!value) return "—";
  const d = new Date(`${value}T12:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
