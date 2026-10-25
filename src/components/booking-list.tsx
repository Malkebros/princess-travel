"use client";

import { Badge } from "@/components/ui/badge";
import { STAGE_META, type Booking } from "@/lib/types";
import { formatMoney, formatPhone, formatShortDate } from "@/lib/storage";
import { ArrowRight } from "lucide-react";

export function BookingList({
  bookings,
  selectedId,
  onSelect,
}: {
  bookings: Booking[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--pt-line)] bg-white/70 px-4 py-10 text-center text-sm text-muted-foreground">
        No bookings match. Try another filter or clear search.
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {bookings.map((booking) => {
        const active = booking.id === selectedId;
        const route =
          booking.from || booking.to
            ? `${booking.from || "?"} → ${booking.to || "?"}`
            : "Route not set";
        return (
          <li key={booking.id}>
            <button
              type="button"
              onClick={() => onSelect(booking.id)}
              className={[
                "w-full rounded-2xl border px-4 py-3 text-left transition-all",
                active
                  ? "border-[var(--pt-teal)] bg-white shadow-[0_10px_30px_-18px_rgb(11_79_108_/_0.7)] ring-1 ring-[var(--pt-teal)]/25"
                  : "border-[var(--pt-line)] bg-white/80 hover:border-[var(--pt-teal)]/40 hover:bg-white",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-medium text-[var(--pt-ink)]">
                      {booking.customerName || "Unnamed caller"}
                    </span>
                    <Badge variant="outline" className="font-normal">
                      {STAGE_META[booking.stage].short}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatPhone(booking.phone)} · {route}
                  </p>
                </div>
                <div className="shrink-0 text-right text-sm">
                  <div className="font-medium text-[var(--pt-ink)]">
                    {formatMoney(booking.quoteAmount)}
                  </div>
                  <div className="text-muted-foreground">
                    {formatShortDate(booking.departDate)}
                  </div>
                </div>
              </div>
              {booking.nextAction ? (
                <p className="mt-2 flex items-start gap-1.5 text-sm text-[var(--pt-teal-deep)]">
                  <ArrowRight className="mt-0.5 size-3.5 shrink-0" />
                  <span className="line-clamp-2">{booking.nextAction}</span>
                </p>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
