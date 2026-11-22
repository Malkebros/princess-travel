import type { Booking } from "@/lib/types";

export type SyncMode = "cloud" | "local" | "unknown";

export async function fetchBookings(): Promise<{
  mode: SyncMode;
  bookings: Booking[] | null;
  error?: string;
  automationEnabled?: boolean;
}> {
  try {
    const res = await fetch("/api/bookings", { cache: "no-store" });
    const data = (await res.json()) as {
      mode?: SyncMode;
      bookings?: Booking[] | null;
      error?: string;
      message?: string;
      automationEnabled?: boolean;
    };
    if (!res.ok) {
      return { mode: "unknown", bookings: null, error: data.error || res.statusText };
    }
    return {
      mode: data.mode === "cloud" ? "cloud" : "local",
      bookings: data.bookings ?? null,
      error: data.message,
      automationEnabled: Boolean(data.automationEnabled),
    };
  } catch (e) {
    return {
      mode: "unknown",
      bookings: null,
      error: e instanceof Error ? e.message : "Network error",
    };
  }
}

export async function persistBookings(bookings: Booking[]): Promise<{
  ok: boolean;
  mode: SyncMode;
  error?: string;
  automation?: {
    attempted: number;
    sent: number;
    skipped: number;
    failed: number;
  };
}> {
  try {
    const res = await fetch("/api/bookings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookings }),
    });
    const data = (await res.json()) as {
      error?: string;
      mode?: SyncMode;
      automation?: {
        attempted: number;
        sent: number;
        skipped: number;
        failed: number;
      };
    };
    if (res.status === 503) {
      return { ok: false, mode: "local", error: data.error };
    }
    if (!res.ok) {
      return { ok: false, mode: "unknown", error: data.error || res.statusText };
    }
    return { ok: true, mode: "cloud", automation: data.automation };
  } catch (e) {
    return {
      ok: false,
      mode: "unknown",
      error: e instanceof Error ? e.message : "Network error",
    };
  }
}

export async function resetBookingsCloud(): Promise<{
  mode: SyncMode;
  bookings: Booking[];
  error?: string;
}> {
  try {
    const res = await fetch("/api/bookings/reset", { method: "POST" });
    const data = (await res.json()) as {
      mode?: SyncMode;
      bookings?: Booking[];
      error?: string;
    };
    if (!res.ok) {
      return {
        mode: "unknown",
        bookings: [],
        error: data.error || res.statusText,
      };
    }
    return {
      mode: data.mode === "cloud" ? "cloud" : "local",
      bookings: data.bookings ?? [],
    };
  } catch (e) {
    return {
      mode: "unknown",
      bookings: [],
      error: e instanceof Error ? e.message : "Network error",
    };
  }
}
