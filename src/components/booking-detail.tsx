"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  STAGE_META,
  STAGES,
  type Booking,
  type PaymentMethod,
  type Stage,
  type Traveler,
  type TripType,
} from "@/lib/types";
import { formatPhone, newId } from "@/lib/storage";
import { Plus, Trash2 } from "lucide-react";

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

  function updateTraveler(id: string, partial: Partial<Traveler>) {
    patch({
      travelers: booking.travelers.map((t) =>
        t.id === id ? { ...t, ...partial } : t
      ),
    });
  }

  function addTraveler() {
    patch({
      travelers: [
        ...booking.travelers,
        {
          id: newId("tr"),
          fullName: "",
          dob: "",
          passportOrId: "",
          notes: "",
        },
      ],
    });
  }

  function removeTraveler(id: string) {
    patch({ travelers: booking.travelers.filter((t) => t.id !== id) });
  }

  const stageIndex = STAGES.indexOf(booking.stage);

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--pt-line)] bg-white/95 shadow-[0_18px_40px_-28px_rgb(11_79_108_/_0.55)]">
      <div className="border-b border-[var(--pt-line)] bg-[linear-gradient(120deg,#eef6fa_0%,#fffdf6_55%,#ffffff_100%)] px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">
              {formatPhone(booking.phone)} · {booking.language || "Language n/a"}
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
                  `Remove ${booking.customerName || "this booking"} from the desk?`
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

        <div className="mt-4 flex flex-wrap gap-1.5">
          {STAGES.map((stage, i) => {
            const done = i < stageIndex;
            const current = stage === booking.stage;
            return (
              <button
                key={stage}
                type="button"
                onClick={() => patch({ stage })}
                className={[
                  "rounded-full px-2.5 py-1 text-xs transition-colors",
                  current
                    ? "bg-[var(--pt-teal)] text-white"
                    : done
                      ? "bg-[var(--pt-teal-soft)] text-[var(--pt-teal-deep)]"
                      : "bg-white text-muted-foreground ring-1 ring-[var(--pt-line)] hover:text-[var(--pt-ink)]",
                ].join(" ")}
                title={STAGE_META[stage].hint}
              >
                {STAGE_META[stage].short}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-sm text-[var(--pt-ink-soft)]">
          {STAGE_META[booking.stage].hint}
        </p>
      </div>

      <div className="grid gap-6 px-5 py-5">
        <Section title="Contact">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <Input
                value={booking.customerName}
                onChange={(e) => patch({ customerName: e.target.value })}
              />
            </Field>
            <Field label="Phone / WhatsApp">
              <Input
                value={booking.phone}
                onChange={(e) => patch({ phone: e.target.value })}
                inputMode="tel"
              />
            </Field>
            <Field label="Email">
              <Input
                value={booking.email}
                onChange={(e) => patch({ email: e.target.value })}
                type="email"
              />
            </Field>
            <Field label="Preferred language">
              <Input
                value={booking.language}
                onChange={(e) => patch({ language: e.target.value })}
              />
            </Field>
          </div>
        </Section>

        <Section title="Trip">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="From">
              <Input
                value={booking.from}
                onChange={(e) =>
                  patch({ from: e.target.value.toUpperCase() })
                }
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
            <Field label="Trip type">
              <Select
                value={booking.tripType}
                onValueChange={(value) => {
                  if (value) patch({ tripType: value as TripType });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="domestic">Domestic</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </Section>

        <Section title="Sabre quote">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Airline">
              <Input
                value={booking.airline}
                onChange={(e) => patch({ airline: e.target.value })}
                placeholder="EgyptAir"
              />
            </Field>
            <Field label="Class">
              <Input
                value={booking.cabinClass}
                onChange={(e) => patch({ cabinClass: e.target.value })}
                placeholder="Economy"
              />
            </Field>
            <Field label="Quoted total (USD)">
              <Input
                value={booking.quoteAmount}
                onChange={(e) => patch({ quoteAmount: e.target.value })}
                inputMode="decimal"
                placeholder="1180"
              />
            </Field>
            <Field label="Payment">
              <Select
                value={booking.paymentMethod}
                onValueChange={(value) => {
                  if (value) patch({ paymentMethod: value as PaymentMethod });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="in_person">Paid in person</SelectItem>
                  <SelectItem value="phone">Paid by phone</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </Section>

        <Section
          title="Travelers"
          action={
            <Button size="sm" variant="outline" onClick={addTraveler}>
              <Plus data-icon="inline-start" />
              Add traveler
            </Button>
          }
        >
          {booking.travelers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No passenger details yet. Add each traveler when they are ready to
              book.
            </p>
          ) : (
            <div className="space-y-3">
              {booking.travelers.map((traveler, index) => (
                <div
                  key={traveler.id}
                  className="rounded-xl border border-[var(--pt-line)] bg-[var(--pt-sky)]/40 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-[var(--pt-ink)]">
                      Traveler {index + 1}
                    </p>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => removeTraveler(traveler.id)}
                      aria-label="Remove traveler"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Field label="Full name">
                      <Input
                        value={traveler.fullName}
                        onChange={(e) =>
                          updateTraveler(traveler.id, {
                            fullName: e.target.value,
                          })
                        }
                      />
                    </Field>
                    <Field label="Date of birth">
                      <Input
                        type="date"
                        value={traveler.dob}
                        onChange={(e) =>
                          updateTraveler(traveler.id, { dob: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Passport / ID">
                      <Input
                        value={traveler.passportOrId}
                        onChange={(e) =>
                          updateTraveler(traveler.id, {
                            passportOrId: e.target.value,
                          })
                        }
                      />
                    </Field>
                    <Field label="Notes">
                      <Input
                        value={traveler.notes}
                        onChange={(e) =>
                          updateTraveler(traveler.id, { notes: e.target.value })
                        }
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Before travel & follow-up">
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                ["confirmationEmailed", "Confirmation email forwarded"],
                ["customerNotified", "Customer notified of next steps"],
                ["passportChecked", "Passport / ID reviewed"],
                ["visaChecked", "Visa / entry rules checked"],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--pt-line)] bg-white px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--pt-teal)]"
                  checked={booking.checklist[key]}
                  onChange={(e) =>
                    patch({
                      checklist: {
                        ...booking.checklist,
                        [key]: e.target.checked,
                      },
                    })
                  }
                />
                {label}
                {key === "visaChecked" && booking.tripType === "domestic"
                  ? " (n/a domestic)"
                  : ""}
              </label>
            ))}
          </div>
          <div className="mt-3 grid gap-3">
            <Field label="Next action">
              <Input
                value={booking.nextAction}
                onChange={(e) => patch({ nextAction: e.target.value })}
                placeholder="What should happen next?"
              />
            </Field>
            <Field label="Desk notes">
              <Textarea
                value={booking.notes}
                onChange={(e) => patch({ notes: e.target.value })}
                placeholder="WhatsApp context, Sabre notes, mishap details…"
              />
            </Field>
          </div>
        </Section>

        <div className="flex flex-wrap gap-2 border-t border-[var(--pt-line)] pt-4">
          {stageIndex < STAGES.length - 1 ? (
            <Button
              onClick={() => patch({ stage: STAGES[stageIndex + 1] as Stage })}
              className="bg-[var(--pt-teal)] text-white hover:bg-[var(--pt-teal-deep)]"
            >
              Advance to {STAGE_META[STAGES[stageIndex + 1]].short}
            </Button>
          ) : null}
          {stageIndex > 0 ? (
            <Button
              variant="outline"
              onClick={() => patch({ stage: STAGES[stageIndex - 1] as Stage })}
            >
              Move back
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-display text-xl text-[var(--pt-ink)]">{title}</h3>
        {action}
      </div>
      {children}
    </section>
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
