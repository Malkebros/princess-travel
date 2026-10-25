"use client";

import { Plane, Smartphone, Ticket } from "lucide-react";

export function IntroScreen() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--pt-line)] bg-white shadow-[0_24px_60px_-36px_rgb(11_79_108_/_0.55)]">
      <div className="relative overflow-hidden border-b border-[var(--pt-line)] px-6 py-10 sm:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_10%_0%,#cfe6ef_0%,transparent_55%),radial-gradient(ellipse_60%_50%_at_100%_10%,#f3e6c0_0%,transparent_45%),linear-gradient(180deg,#f7fbfd_0%,#ffffff_100%)]" />
        <div className="relative">
          <p className="mb-2 inline-flex items-center gap-2 text-sm text-[var(--pt-ink-soft)]">
            <Plane className="size-4 text-[var(--pt-gold)]" />
            Desk design preview · Princess Travel
          </p>
          <h2 className="font-display text-4xl tracking-tight text-[var(--pt-ink)] sm:text-5xl">
            Princess Travel
          </h2>
          <p className="mt-3 max-w-xl text-[var(--pt-ink-soft)]">
            A private desk for Amira Aboudeeb to track WhatsApp callers, Sabre
            quotes, payments, and follow-ups — without relying on memory alone.
          </p>
        </div>
      </div>

      <div className="grid gap-4 px-6 py-6 sm:grid-cols-3 sm:px-8">
        <Point
          icon={<Smartphone className="size-5 text-[var(--pt-teal)]" />}
          title="For the owner"
          body="Amira uses this on phone or laptop during calls. Customers do not log in."
        />
        <Point
          icon={<Ticket className="size-5 text-[var(--pt-teal)]" />}
          title="Alongside Sabre"
          body="Price flights in Sabre Red, then paste airline, class, and total into the desk."
        />
        <Point
          icon={<Plane className="size-5 text-[var(--pt-teal)]" />}
          title="Real workflow"
          body="Inquiry → quote → travelers → payment → ticketed → pre-travel → support."
        />
      </div>
    </div>
  );
}

function Point({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--pt-line)] bg-[var(--pt-sky)]/40 px-4 py-4">
      <div className="mb-2">{icon}</div>
      <h3 className="font-display text-xl text-[var(--pt-ink)]">{title}</h3>
      <p className="mt-1 text-sm text-[var(--pt-ink-soft)]">{body}</p>
    </div>
  );
}
