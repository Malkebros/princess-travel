"use client";

import { useEffect, useMemo, useState } from "react";
import { BookingDetail } from "@/components/booking-detail";
import { BookingList } from "@/components/booking-list";
import { NewBookingDialog } from "@/components/new-booking-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEED_BOOKINGS } from "@/lib/seed-data";
import {
  STAGE_META,
  STAGES,
  type Booking,
  type Stage,
} from "@/lib/types";
import {
  digitsOnly,
  emptyBooking,
  loadBookings,
  saveBookings,
} from "@/lib/storage";
import { Plane, Plus, RotateCcw, Search } from "lucide-react";

type StageFilter = Stage | "all" | "needs_action";

export function DeskApp() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<StageFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const loaded = loadBookings();
    setBookings(loaded);
    setSelectedId(loaded[0]?.id ?? null);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveBookings(bookings);
  }, [bookings, hydrated]);

  const counts = useMemo(() => {
    const map = Object.fromEntries(STAGES.map((s) => [s, 0])) as Record<
      Stage,
      number
    >;
    let needsAction = 0;
    for (const b of bookings) {
      map[b.stage] += 1;
      if (b.nextAction.trim()) needsAction += 1;
    }
    return { map, needsAction, total: bookings.length };
  }, [bookings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const qDigits = digitsOnly(query);
    return bookings
      .filter((b) => {
        if (stageFilter === "needs_action") {
          if (!b.nextAction.trim()) return false;
        } else if (stageFilter !== "all" && b.stage !== stageFilter) {
          return false;
        }
        if (!q && !qDigits) return true;
        const hay = [
          b.customerName,
          b.phone,
          b.email,
          b.from,
          b.to,
          b.airline,
          b.notes,
          b.nextAction,
          ...b.travelers.map((t) => t.fullName),
        ]
          .join(" ")
          .toLowerCase();
        const phoneHit = qDigits
          ? digitsOnly(b.phone).includes(qDigits)
          : false;
        return hay.includes(q) || phoneHit;
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [bookings, query, stageFilter]);

  const selected =
    filtered.find((b) => b.id === selectedId) ??
    bookings.find((b) => b.id === selectedId) ??
    filtered[0] ??
    null;

  function upsert(booking: Booking) {
    setBookings((prev) => {
      const i = prev.findIndex((b) => b.id === booking.id);
      if (i === -1) return [booking, ...prev];
      const next = [...prev];
      next[i] = { ...booking, updatedAt: new Date().toISOString() };
      return next;
    });
    setSelectedId(booking.id);
  }

  function removeBooking(id: string) {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setSelectedId((cur) => (cur === id ? null : cur));
  }

  function resetDemo() {
    setBookings(SEED_BOOKINGS);
    setSelectedId(SEED_BOOKINGS[0]?.id ?? null);
    setQuery("");
    setStageFilter("all");
  }

  function createBooking(partial: Partial<Booking>) {
    const booking = emptyBooking(partial);
    upsert(booking);
    setDialogOpen(false);
    setStageFilter("all");
    setQuery("");
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Opening Princess Travel desk…
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="relative overflow-hidden border-b border-[var(--pt-line)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_10%_0%,#cfe6ef_0%,transparent_55%),radial-gradient(ellipse_60%_50%_at_100%_10%,#f3e6c0_0%,transparent_45%),linear-gradient(180deg,#f7fbfd_0%,#ffffff_100%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-[var(--pt-ink-soft)]">
                <Plane className="size-4 text-[var(--pt-gold)]" />
                Amira Aboudeeb · WhatsApp & phone desk
              </div>
              <h1 className="font-display text-4xl tracking-tight text-[var(--pt-ink)] sm:text-5xl">
                Princess Travel
              </h1>
              <p className="mt-2 max-w-xl text-[var(--pt-ink-soft)]">
                Find every caller by name or number, then move each booking
                through Sabre quote, payment, and pre-travel.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={resetDemo}
                className="bg-white/70"
              >
                <RotateCcw data-icon="inline-start" />
                Reset sample data
              </Button>
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-[var(--pt-teal)] text-white hover:bg-[var(--pt-teal-deep)]"
              >
                <Plus data-icon="inline-start" />
                New caller
              </Button>
            </div>
          </div>

          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, phone, route, or notes…"
              className="h-11 bg-white/90 pl-9 text-base shadow-sm"
              aria-label="Search bookings"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-6 lg:px-8 lg:py-7">
        <section className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={stageFilter === "all"}
              onClick={() => setStageFilter("all")}
              label="All"
              count={counts.total}
            />
            <FilterChip
              active={stageFilter === "needs_action"}
              onClick={() => setStageFilter("needs_action")}
              label="Needs action"
              count={counts.needsAction}
              emphasize
            />
            {STAGES.map((stage) => (
              <FilterChip
                key={stage}
                active={stageFilter === stage}
                onClick={() => setStageFilter(stage)}
                label={STAGE_META[stage].short}
                count={counts.map[stage]}
              />
            ))}
          </div>

          <BookingList
            bookings={filtered}
            selectedId={selected?.id ?? null}
            onSelect={setSelectedId}
          />
        </section>

        <section>
          {selected ? (
            <BookingDetail
              key={selected.id}
              booking={selected}
              onChange={upsert}
              onDelete={removeBooking}
            />
          ) : (
            <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--pt-line)] bg-white/50 px-6 text-center">
              <p className="font-display text-2xl text-[var(--pt-ink)]">
                No booking selected
              </p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Add a new WhatsApp or phone caller, or clear your search.
              </p>
              <Button
                className="mt-4 bg-[var(--pt-teal)] text-white hover:bg-[var(--pt-teal-deep)]"
                onClick={() => setDialogOpen(true)}
              >
                <Plus data-icon="inline-start" />
                New caller
              </Button>
            </div>
          )}
        </section>
      </main>

      <NewBookingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={createBooking}
      />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
  emphasize,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  emphasize?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all",
        active
          ? "border-[var(--pt-teal)] bg-[var(--pt-teal)] text-white shadow-sm"
          : emphasize
            ? "border-[var(--pt-gold)]/50 bg-[var(--pt-gold-soft)] text-[var(--pt-ink)] hover:border-[var(--pt-gold)]"
            : "border-[var(--pt-line)] bg-white/80 text-[var(--pt-ink-soft)] hover:border-[var(--pt-teal)]/40 hover:text-[var(--pt-ink)]",
      ].join(" ")}
    >
      {label}
      <Badge
        variant={active ? "secondary" : "outline"}
        className={
          active
            ? "border-transparent bg-white/20 text-white"
            : "bg-transparent"
        }
      >
        {count}
      </Badge>
    </button>
  );
}
