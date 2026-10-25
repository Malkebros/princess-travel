"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { STAGE_META, STAGES, type Booking, type Stage } from "@/lib/types";
import { formatPhone } from "@/lib/storage";
import { Trash2 } from "lucide-react";

export function BookingDetail({
  booking,
  onChange,
  onDelete,
}: {
  booking: Booking;
  onChange: (booking: Booking) => void;
  onDelete: (id: string) => void;
}) {
  function patch(partial: Partial<Booking>) {
    onChange({ ...booking, ...partial });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--pt-line)] bg-white/95 shadow-[0_18px_40px_-28px_rgb(11_79_108_/_0.45)]">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--pt-line)] bg-[linear-gradient(120deg,#eef6fa_0%,#fffdf6_55%,#ffffff_100%)] px-5 py-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {formatPhone(booking.phone)}
          </p>
          <h2 className="font-display text-3xl text-[var(--pt-ink)]">
            {booking.customerName || "Unnamed caller"}
          </h2>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            if (
              window.confirm(
                `Remove ${booking.customerName || "this caller"}?`
              )
            ) {
              onDelete(booking.id);
            }
          }}
        >
          <Trash2 data-icon="inline-start" />
          Remove
        </Button>
      </div>

      <div className="grid gap-5 px-5 py-5">
        <div>
          <p className="mb-2 text-sm font-medium text-[var(--pt-ink)]">Status</p>
          <div className="flex flex-wrap gap-1.5">
            {STAGES.map((stage) => {
              const current = stage === booking.stage;
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => patch({ stage: stage as Stage })}
                  className={[
                    "rounded-full px-3 py-1.5 text-sm transition-colors",
                    current
                      ? "bg-[var(--pt-teal)] text-white"
                      : "bg-white text-muted-foreground ring-1 ring-[var(--pt-line)] hover:text-[var(--pt-ink)]",
                  ].join(" ")}
                >
                  {STAGE_META[stage].short}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name">
            <Input
              value={booking.customerName}
              onChange={(e) => patch({ customerName: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <Input
              value={booking.phone}
              onChange={(e) => patch({ phone: e.target.value })}
              inputMode="tel"
            />
          </Field>
          <Field label="Email (optional)">
            <Input
              value={booking.email}
              onChange={(e) => patch({ email: e.target.value })}
              type="email"
            />
          </Field>
          <Field label="Passengers">
            <Input
              value={booking.passengers}
              onChange={(e) => patch({ passengers: e.target.value })}
              placeholder="2"
            />
          </Field>
          <Field label="From">
            <Input
              value={booking.from}
              onChange={(e) => patch({ from: e.target.value.toUpperCase() })}
              placeholder="ORD"
            />
          </Field>
          <Field label="To">
            <Input
              value={booking.to}
              onChange={(e) => patch({ to: e.target.value.toUpperCase() })}
              placeholder="CAI"
            />
          </Field>
          <Field label="Depart">
            <Input
              type="date"
              value={booking.departDate}
              onChange={(e) => patch({ departDate: e.target.value })}
            />
          </Field>
          <Field label="Return">
            <Input
              type="date"
              value={booking.returnDate}
              onChange={(e) => patch({ returnDate: e.target.value })}
            />
          </Field>
          <Field label="Price (optional)">
            <Input
              value={booking.price}
              onChange={(e) => patch({ price: e.target.value })}
              inputMode="decimal"
              placeholder="1180"
            />
          </Field>
        </div>

        <Field label="What to do next">
          <Input
            value={booking.nextAction}
            onChange={(e) => patch({ nextAction: e.target.value })}
            placeholder="e.g. Call back Saturday"
          />
        </Field>

        <Field label="Notes">
          <Textarea
            value={booking.notes}
            onChange={(e) => patch({ notes: e.target.value })}
            placeholder="Anything useful to remember…"
            className="min-h-24"
          />
        </Field>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
