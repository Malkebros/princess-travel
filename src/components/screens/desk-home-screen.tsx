"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SAMPLE_BOOKINGS, STAGES } from "@/lib/design-data";
import { ArrowRight, Plane, Plus, Search } from "lucide-react";

export function DeskHomeScreen({
  highlightSearch,
  query = "",
}: {
  highlightSearch?: boolean;
  query?: string;
}) {
  const q = query.trim().toLowerCase();
  const bookings = SAMPLE_BOOKINGS.filter((b) => {
    if (!q) return true;
    return (
      b.name.toLowerCase().includes(q) ||
      b.phone.replace(/\D/g, "").includes(q.replace(/\D/g, "")) ||
      b.from.toLowerCase().includes(q) ||
      b.to.toLowerCase().includes(q)
    );
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--pt-line)] bg-white shadow-[0_24px_60px_-36px_rgb(11_79_108_/_0.55)]">
      <div className="border-b border-[var(--pt-line)] bg-[linear-gradient(120deg,#eef6fa_0%,#fffdf6_50%,#ffffff_100%)] px-5 py-5 sm:px-6">
        <div className="mb-1 flex items-center gap-2 text-sm text-[var(--pt-ink-soft)]">
          <Plane className="size-4 text-[var(--pt-gold)]" />
          Amira Aboudeeb · WhatsApp & phone desk
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-3xl text-[var(--pt-ink)] sm:text-4xl">
              Princess Travel
            </h2>
            <p className="mt-1 max-w-md text-sm text-[var(--pt-ink-soft)]">
              Find callers by name or number. Move each booking through Sabre
              quote, payment, and pre-travel.
            </p>
          </div>
          <Button className="bg-[var(--pt-teal)] text-white hover:bg-[var(--pt-teal-deep)]">
            <Plus data-icon="inline-start" />
            New caller
          </Button>
        </div>

        <div
          className={[
            "relative mt-5 max-w-xl",
            highlightSearch
              ? "rounded-xl ring-2 ring-[var(--pt-gold)] ring-offset-2"
              : "",
          ].join(" ")}
        >
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            readOnly
            value={query}
            placeholder="Search name, phone, route, or notes…"
            className="h-11 bg-white pl-9 text-base"
          />
        </div>
      </div>

      <div className="space-y-3 px-4 py-4 sm:px-5">
        <div className="flex flex-wrap gap-2">
          <Chip active label="All" count={SAMPLE_BOOKINGS.length} />
          <Chip
            label="Needs action"
            count={SAMPLE_BOOKINGS.filter((b) => b.nextAction).length}
            gold
          />
          {STAGES.map((stage) => (
            <Chip
              key={stage}
              label={stage}
              count={SAMPLE_BOOKINGS.filter((b) => b.stage === stage).length}
            />
          ))}
        </div>

        <ul className="space-y-2">
          {bookings.map((b) => (
            <li
              key={b.id}
              className="rounded-2xl border border-[var(--pt-line)] bg-[var(--pt-sky)]/35 px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-[var(--pt-ink)]">
                      {b.name}
                    </span>
                    <Badge variant="outline">{b.stage}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {b.phone} · {b.from} → {b.to}
                  </p>
                </div>
                <div className="shrink-0 text-right text-sm">
                  <div className="font-medium text-[var(--pt-ink)]">
                    {b.quote}
                  </div>
                  <div className="text-muted-foreground">{b.depart}</div>
                </div>
              </div>
              <p className="mt-2 flex items-start gap-1.5 text-sm text-[var(--pt-teal-deep)]">
                <ArrowRight className="mt-0.5 size-3.5 shrink-0" />
                <span>{b.nextAction}</span>
              </p>
            </li>
          ))}
          {bookings.length === 0 ? (
            <li className="rounded-2xl border border-dashed border-[var(--pt-line)] px-4 py-8 text-center text-sm text-muted-foreground">
              No bookings match this search.
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}

function Chip({
  label,
  count,
  active,
  gold,
}: {
  label: string;
  count: number;
  active?: boolean;
  gold?: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm",
        active
          ? "border-[var(--pt-teal)] bg-[var(--pt-teal)] text-white"
          : gold
            ? "border-[var(--pt-gold)]/40 bg-[var(--pt-gold-soft)] text-[var(--pt-ink)]"
            : "border-[var(--pt-line)] bg-white text-[var(--pt-ink-soft)]",
      ].join(" ")}
    >
      {label}
      <Badge
        variant="outline"
        className={
          active
            ? "border-transparent bg-white/20 text-white"
            : "bg-transparent"
        }
      >
        {count}
      </Badge>
    </span>
  );
}
