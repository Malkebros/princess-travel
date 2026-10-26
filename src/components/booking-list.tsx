"use client";

import { Badge } from "@/components/ui/badge";
import { stageLabel, type Lang, t } from "@/lib/i18n";
import type { Booking } from "@/lib/types";
import { formatMoney, formatPhone, formatShortDate } from "@/lib/storage";
import { ArrowRight } from "lucide-react";

export function BookingList({
  bookings,
  selectedId,
  onSelect,
  lang,
}: {
  bookings: Booking[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  lang: Lang;
}) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--pt-line)] bg-white/70 px-4 py-10 text-center text-base text-muted-foreground">
        {t(lang, "noMatch")}
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
            : t(lang, "noRoute");
        return (
          <li key={booking.id}>
            <button
              type="button"
              onClick={() => onSelect(booking.id)}
              className={[
                "w-full rounded-2xl border px-4 py-4 text-left transition-all",
                active
                  ? "border-[var(--pt-teal)] bg-white shadow-[0_10px_30px_-18px_rgb(11_79_108_/_0.7)] ring-1 ring-[var(--pt-teal)]/25"
                  : "border-[var(--pt-line)] bg-white/80 hover:border-[var(--pt-teal)]/40 hover:bg-white",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-lg font-medium text-[var(--pt-ink)]">
                      {booking.customerName || "—"}
                    </span>
                    <Badge variant="outline" className="h-6 px-2.5 text-sm font-normal">
                      {stageLabel(lang, booking.stage)}
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-base text-muted-foreground">
                    {formatPhone(booking.phone)} · {route}
                    {booking.passengers
                      ? ` · ${booking.passengers} ${t(lang, "pax")}`
                      : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right text-base">
                  <div className="font-medium text-[var(--pt-ink)]">
                    {formatMoney(booking.price)}
                  </div>
                  <div className="text-muted-foreground">
                    {formatShortDate(booking.departDate)}
                  </div>
                </div>
              </div>
              {booking.nextAction ? (
                <p className="mt-2.5 flex items-start gap-1.5 text-base text-[var(--pt-teal-deep)]">
                  <ArrowRight className="mt-1 size-4 shrink-0" />
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
