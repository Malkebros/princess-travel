"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function NewCallerScreen() {
  return (
    <div className="mx-auto max-w-lg overflow-hidden rounded-2xl border border-[var(--pt-line)] bg-white shadow-[0_24px_60px_-36px_rgb(11_79_108_/_0.55)]">
      <div className="border-b border-[var(--pt-line)] bg-[linear-gradient(120deg,#eef6fa_0%,#fffdf6_100%)] px-5 py-4">
        <p className="text-sm text-[var(--pt-ink-soft)]">Prototype form</p>
        <h2 className="font-display text-2xl text-[var(--pt-ink)]">
          New WhatsApp / phone caller
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Save contact info first — then add route details as you talk.
        </p>
      </div>

      <div className="grid gap-3 px-5 py-5">
        <Field label="Customer name">
          <Input defaultValue="Layla Mansour" readOnly />
        </Field>
        <Field label="Phone / WhatsApp">
          <Input defaultValue="3125550198" readOnly />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="From">
            <Input defaultValue="MDW" readOnly />
          </Field>
          <Field label="To">
            <Input defaultValue="LAX" readOnly />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Depart">
            <Input defaultValue="2026-10-28" readOnly />
          </Field>
          <Field label="Return">
            <Input placeholder="Optional" readOnly />
          </Field>
        </div>
        <Field label="Notes from the call">
          <Textarea
            defaultValue="Arabic speaker. One-way for daughter visiting university. Dates flexible ±2 days."
            readOnly
          />
        </Field>
      </div>

      <div className="flex justify-end gap-2 border-t border-[var(--pt-line)] bg-[var(--pt-sky)]/40 px-5 py-4">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-[var(--pt-teal)] text-white hover:bg-[var(--pt-teal-deep)]">
          Save caller
        </Button>
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
