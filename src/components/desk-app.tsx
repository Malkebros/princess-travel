"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BookingDetail } from "@/components/booking-detail";
import { BookingList } from "@/components/booking-list";
import { NewBookingDialog } from "@/components/new-booking-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEED_BOOKINGS } from "@/lib/seed-data";
import {
  fetchBookings,
  persistBookings,
  resetBookingsCloud,
  type SyncMode,
} from "@/lib/bookings-api";
import {
  loadSelectedId,
  saveSelectedId,
  stageLabel,
  t,
} from "@/lib/i18n";
import { STAGES, type Booking, type Stage } from "@/lib/types";
import {
  digitsOnly,
  emptyBooking,
  loadAutomationLog,
  loadBookings,
  pushAutomationLog,
  saveBookings,
  type AutomationLogEntry,
} from "@/lib/storage";
import {
  Bell,
  Cloud,
  CloudOff,
  Lock,
  Plane,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";

type StageFilter = Stage | "all";

export function DeskApp() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<StageFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);
  const [syncMode, setSyncMode] = useState<SyncMode>("unknown");
  const [syncLabel, setSyncLabel] = useState("Loading…");
  const [automationEnabled, setAutomationEnabled] = useState(false);
  const [automationNote, setAutomationNote] = useState("");
  const [automationLog, setAutomationLog] = useState<AutomationLogEntry[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const skipNextPersist = useRef(true);
  const toastTimer = useRef<number | null>(null);
  const lang = "en" as const;

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4500);
  }

  async function lockDesk() {
    try {
      await fetch("/api/unlock", { method: "DELETE" });
    } catch {
      // Still send her to unlock; cookie clear may have failed offline.
    }
    router.replace("/unlock");
    router.refresh();
  }

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      const savedId = loadSelectedId();
      const remote = await fetchBookings();
      if (cancelled) return;

      let next: Booking[];
      setAutomationEnabled(Boolean(remote.automationEnabled));

      if (remote.mode === "cloud" && remote.bookings) {
        next = remote.bookings;
        setSyncMode("cloud");
        setSyncLabel("Saved in the cloud — works on phone & computer");
      } else if (remote.error) {
        next = loadBookings();
        setSyncMode("local");
        setSyncLabel(
          "Cloud unavailable — saving on this device only (check Supabase)"
        );
      } else {
        next = loadBookings();
        setSyncMode("local");
        setSyncLabel(
          "Saved on this device only — add Supabase to sync everywhere"
        );
      }

      setBookings(next);
      const initial =
        (savedId && next.find((b) => b.id === savedId)?.id) ||
        next[0]?.id ||
        null;
      setSelectedId(initial);
      setAutomationLog(loadAutomationLog());
      setHydrated(true);
      skipNextPersist.current = true;
      window.setTimeout(() => searchRef.current?.focus(), 200);
    }

    void boot();
    return () => {
      cancelled = true;
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveSelectedId(selectedId);
  }, [selectedId, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }

    // Always keep a local backup
    saveBookings(bookings);

    if (syncMode !== "cloud") return;

    const handle = window.setTimeout(() => {
      void persistBookings(bookings).then((result) => {
        if (result.ok) {
          setSyncLabel("Saved in the cloud — works on phone & computer");
          const n = result.customerNotify;
          if (n && (n.attempted > 0 || (n.stageChanged ?? 0) > 0)) {
            if (n.sent > 0) {
              const detail = n.sentDetails?.[0];
              const msg = detail?.message || n.messages?.[0];
              const who = detail?.customerName?.trim() || "customer";
              const stageTxt = detail?.stage
                ? stageLabel(lang, detail.stage)
                : "status update";
              const toastMsg = `Emailed ${who} — ${stageTxt}`;
              setAutomationNote(
                `${toastMsg}. Check inbox/spam if you don’t see it.`
              );
              showToast(toastMsg);
              pushAutomationLog({
                summary: toastMsg,
                message: msg,
              });
              setAutomationLog(loadAutomationLog());
            } else if ((n.skippedNoEmail ?? 0) > 0) {
              setAutomationNote(
                "Status saved — add email on the caller to notify them"
              );
              showToast("Add email on the caller to send a status email");
              pushAutomationLog({
                summary: "Status changed — skipped (caller has no email)",
              });
              setAutomationLog(loadAutomationLog());
            } else if (n.skipped > 0) {
              setAutomationNote(
                "Status saved — connect Make webhook to email the customer"
              );
            } else if (n.failed > 0) {
              setAutomationNote("Customer notify failed — check webhook URL");
              showToast("Customer email failed — check Make");
              pushAutomationLog({
                summary: "Customer notify failed — check Make webhook",
              });
              setAutomationLog(loadAutomationLog());
            }
          }
        } else if (result.mode === "local") {
          setSyncMode("local");
          setSyncLabel("Cloud unavailable — saving on this device only");
        } else {
          setSyncLabel(result.error || "Could not save to cloud");
        }
      });
    }, 450);

    return () => window.clearTimeout(handle);
  }, [bookings, hydrated, syncMode]);

  const counts = useMemo(() => {
    const map = Object.fromEntries(STAGES.map((s) => [s, 0])) as Record<
      Stage,
      number
    >;
    for (const b of bookings) map[b.stage] += 1;
    return { map, total: bookings.length };
  }, [bookings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const qDigits = digitsOnly(query);
    return bookings
      .filter((b) => {
        if (stageFilter !== "all" && b.stage !== stageFilter) return false;
        if (!q && !qDigits) return true;
        const hay = [
          b.customerName,
          b.phone,
          b.email,
          b.from,
          b.to,
          b.notes,
          b.nextAction,
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

  function selectCaller(id: string) {
    setSelectedId(id);
    setMobileShowDetail(true);
  }

  function upsert(booking: Booking) {
    setBookings((prev) => {
      const i = prev.findIndex((b) => b.id === booking.id);
      if (i === -1) return [booking, ...prev];
      const next = [...prev];
      next[i] = { ...booking, updatedAt: new Date().toISOString() };
      return next;
    });
    setSelectedId(booking.id);
    setMobileShowDetail(true);
  }

  function removeBooking(id: string) {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setSelectedId((cur) => (cur === id ? null : cur));
    setMobileShowDetail(false);
  }

  async function resetDemo() {
    const result = await resetBookingsCloud();
    const next =
      result.bookings.length > 0 ? result.bookings : SEED_BOOKINGS;
    skipNextPersist.current = true;
    setBookings(next);
    saveBookings(next);
    if (result.mode === "cloud") {
      setSyncMode("cloud");
      setSyncLabel("Saved in the cloud — works on phone & computer");
    }
    setSelectedId(next[0]?.id ?? null);
    setQuery("");
    setStageFilter("all");
    setMobileShowDetail(false);
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
        {t("en", "opening")}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      {toast ? (
        <div
          role="status"
          className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 pointer-events-none"
        >
          <div className="pointer-events-auto max-w-lg rounded-2xl border border-[var(--pt-teal)] bg-[var(--pt-teal)] px-4 py-3 text-center text-base font-medium text-white shadow-lg">
            {toast}
          </div>
        </div>
      ) : null}
      <header className="relative overflow-hidden border-b border-[var(--pt-line)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_10%_0%,#cfe6ef_0%,transparent_55%),radial-gradient(ellipse_60%_50%_at_100%_10%,#f3e6c0_0%,transparent_45%),linear-gradient(180deg,#f7fbfd_0%,#ffffff_100%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2 text-base text-[var(--pt-ink-soft)]">
                <Plane className="size-4 text-[var(--pt-gold)]" />
                {t(lang, "brandSub")}
              </div>
              <h1 className="font-display text-4xl tracking-tight text-[var(--pt-ink)] sm:text-5xl">
                Princess Travel
              </h1>
              <p className="mt-2 max-w-lg text-base text-[var(--pt-ink-soft)]">
                {t(lang, "tagline")}
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <p
                  className={[
                    "inline-flex max-w-xl items-start gap-2 rounded-full px-3 py-1.5 text-sm",
                    syncMode === "cloud"
                      ? "bg-[var(--pt-teal-soft)] text-[var(--pt-teal-deep)]"
                      : "bg-[var(--pt-gold-soft)] text-[var(--pt-ink)]",
                  ].join(" ")}
                >
                  {syncMode === "cloud" ? (
                    <Cloud className="mt-0.5 size-4 shrink-0" />
                  ) : (
                    <CloudOff className="mt-0.5 size-4 shrink-0" />
                  )}
                  <span>{syncLabel}</span>
                </p>
                <p
                  className={[
                    "inline-flex max-w-xl items-start gap-2 rounded-full px-3 py-1.5 text-sm",
                    automationEnabled
                      ? "bg-[var(--pt-teal-soft)] text-[var(--pt-teal-deep)]"
                      : "bg-white/80 text-[var(--pt-ink-soft)]",
                  ].join(" ")}
                >
                  <Bell className="mt-0.5 size-4 shrink-0" />
                  <span>
                    {automationNote ||
                      (automationEnabled
                        ? "Automations on — status texts customer; daily follow-ups for Amira"
                        : "Automations off — add AUTOMATION_WEBHOOK_URL in Make")}
                  </span>
                </p>
                {automationLog.length > 0 ? (
                  <div className="max-w-xl rounded-2xl border border-[var(--pt-line)] bg-white/80 px-3 py-2 text-sm text-[var(--pt-ink-soft)]">
                    <p className="font-medium text-[var(--pt-ink)]">
                      Automation log
                    </p>
                    <ul className="mt-1 space-y-1.5">
                      {automationLog.slice(0, 5).map((entry) => (
                        <li key={entry.id}>
                          <span className="text-[var(--pt-ink)]">
                            {new Date(entry.at).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                          {" — "}
                          {entry.summary}
                          {entry.message ? (
                            <span className="mt-0.5 block text-[var(--pt-ink-soft)]">
                              “{entry.message.slice(0, 90)}
                              {entry.message.length > 90 ? "…" : ""}”
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="h-11 bg-white/70 text-base"
                onClick={() => void lockDesk()}
              >
                <Lock data-icon="inline-start" />
                {t(lang, "lockDesk")}
              </Button>
              <Button
                variant="outline"
                className="h-11 bg-white/70 text-base"
                onClick={() => void resetDemo()}
              >
                <RotateCcw data-icon="inline-start" />
                {t(lang, "resetSamples")}
              </Button>
              <Button
                className="h-11 bg-[var(--pt-teal)] text-base text-white hover:bg-[var(--pt-teal-deep)]"
                onClick={() => setDialogOpen(true)}
              >
                <Plus data-icon="inline-start" />
                {t(lang, "newCaller")}
              </Button>
            </div>
          </div>

          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(lang, "search")}
              className="h-12 rounded-xl bg-white/90 ps-11 text-base shadow-sm md:text-base"
              aria-label={t(lang, "search")}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-6 lg:px-8 lg:py-7">
        <section
          className={[
            "space-y-3",
            mobileShowDetail ? "hidden lg:block" : "block",
          ].join(" ")}
        >
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={stageFilter === "all"}
              onClick={() => setStageFilter("all")}
              label={t(lang, "all")}
              count={counts.total}
            />
            {STAGES.map((stage) => (
              <FilterChip
                key={stage}
                active={stageFilter === stage}
                onClick={() => setStageFilter(stage)}
                label={stageLabel(lang, stage)}
                count={counts.map[stage]}
              />
            ))}
          </div>

          <BookingList
            bookings={filtered}
            selectedId={selected?.id ?? null}
            onSelect={selectCaller}
            lang={lang}
          />
        </section>

        <section
          className={[
            mobileShowDetail ? "block" : "hidden lg:block",
          ].join(" ")}
        >
          {selected ? (
            <BookingDetail
              key={selected.id}
              booking={selected}
              onChange={upsert}
              onDelete={removeBooking}
              lang={lang}
              onBack={() => setMobileShowDetail(false)}
            />
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--pt-line)] bg-white/50 px-6 text-center">
              <p className="font-display text-2xl text-[var(--pt-ink)]">
                {t(lang, "noCaller")}
              </p>
              <Button
                className="mt-4 h-11 bg-[var(--pt-teal)] text-base text-white hover:bg-[var(--pt-teal-deep)]"
                onClick={() => setDialogOpen(true)}
              >
                <Plus data-icon="inline-start" />
                {t(lang, "newCaller")}
              </Button>
            </div>
          )}
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--pt-line)] bg-white/95 p-3 backdrop-blur-md lg:hidden">
        <Button
          className="h-12 w-full bg-[var(--pt-teal)] text-base text-white hover:bg-[var(--pt-teal-deep)]"
          onClick={() => setDialogOpen(true)}
        >
          <Plus data-icon="inline-start" />
          {t(lang, "newCaller")}
        </Button>
      </div>

      <NewBookingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreate={createBooking}
        lang={lang}
      />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3.5 py-2 text-base transition-all",
        active
          ? "border-[var(--pt-teal)] bg-[var(--pt-teal)] text-white shadow-sm"
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
