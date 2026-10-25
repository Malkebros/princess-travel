"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SAMPLE_BOOKINGS, STAGES } from "@/lib/design-data";
import { Plus } from "lucide-react";

export function BookingDetailScreen() {
  const b = SAMPLE_BOOKINGS[0];
  const stageIndex = STAGES.indexOf(
    b.stage as (typeof STAGES)[number]
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--pt-line)] bg-white shadow-[0_24px_60px_-36px_rgb(11_79_108_/_0.55)]">
      <div className="border-b border-[var(--pt-line)] bg-[linear-gradient(120deg,#eef6fa_0%,#fffdf6_55%,#ffffff_100%)] px-5 py-4">
        <p className="text-sm text-muted-foreground">
          {b.phone} · {b.language}
        </p>
        <h2 className="font-display text-3xl text-[var(--pt-ink)]">{b.name}</h2>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {STAGES.map((stage, i) => {
            const done = i < stageIndex;
            const current = stage === b.stage;
            return (
              <span
                key={stage}
                className={[
                  "rounded-full px-2.5 py-1 text-xs",
                  current
                    ? "bg-[var(--pt-teal)] text-white"
                    : done
                      ? "bg-[var(--pt-teal-soft)] text-[var(--pt-teal-deep)]"
                      : "bg-white text-muted-foreground ring-1 ring-[var(--pt-line)]",
                ].join(" ")}
              >
                {stage}
              </span>
            );
          })}
        </div>
        <p className="mt-2 text-sm text-[var(--pt-ink-soft)]">
          Total shared by call/email — pay in person or by phone
        </p>
      </div>

      <div className="grid gap-6 px-5 py-5">
        <Section title="Trip">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="From" value={b.from} />
            <Field label="To" value={b.to} />
            <Field label="Depart" value={b.depart} />
            <Field label="Return" value={b.returnDate} />
            <Field label="Trip type" value={b.tripType} />
          </div>
        </Section>

        <Section title="Sabre quote">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Airline" value={b.airline} />
            <Field label="Class" value={b.cabin} />
            <Field label="Quoted total" value={b.quote} />
            <Field label="Payment" value={b.payment} />
          </div>
        </Section>

        <Section
          title="Travelers"
          action={
            <Button size="sm" variant="outline">
              <Plus data-icon="inline-start" />
              Add traveler
            </Button>
          }
        >
          <div className="space-y-2">
            {b.travelers.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-[var(--pt-line)] bg-[var(--pt-sky)]/40 px-3 py-2 text-sm"
              >
                <div className="font-medium text-[var(--pt-ink)]">{t.name}</div>
                <div className="text-muted-foreground">
                  DOB {t.dob} · {t.doc}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Before travel & follow-up">
          <div className="grid gap-2 sm:grid-cols-2">
            {b.checklist.map((c) => (
              <label
                key={c.label}
                className="flex items-center gap-2 rounded-lg border border-[var(--pt-line)] bg-white px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--pt-teal)]"
                  checked={c.done}
                  readOnly
                />
                {c.label}
              </label>
            ))}
          </div>
          <div className="mt-3 grid gap-3">
            <div className="grid gap-1.5">
              <Label>Next action</Label>
              <Input defaultValue={b.nextAction} readOnly />
            </div>
            <div className="grid gap-1.5">
              <Label>Desk notes</Label>
              <Textarea defaultValue={b.notes} readOnly />
            </div>
          </div>
        </Section>

        <div className="flex flex-wrap gap-2 border-t border-[var(--pt-line)] pt-4">
          <Button className="bg-[var(--pt-teal)] text-white hover:bg-[var(--pt-teal-deep)]">
            Advance to Ticketed
          </Button>
          <Button variant="outline">Move back</Button>
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <Input defaultValue={value} readOnly />
    </div>
  );
}
