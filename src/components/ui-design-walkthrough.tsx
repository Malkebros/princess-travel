"use client";

import { useEffect, useState } from "react";
import { BookingDetailScreen } from "@/components/screens/booking-detail-screen";
import { DeskHomeScreen } from "@/components/screens/desk-home-screen";
import { FeedbackScreen } from "@/components/screens/feedback-screen";
import { IntroScreen } from "@/components/screens/intro-screen";
import { NewCallerScreen } from "@/components/screens/new-caller-screen";
import { SignoffScreen } from "@/components/screens/signoff-screen";
import { Button } from "@/components/ui/button";
import { WALK_STEPS, type WalkStepId } from "@/lib/design-data";
import { ChevronLeft, ChevronRight, ListChecks } from "lucide-react";

const STEP_STORAGE = "princess-travel-ui-step-v1";

export function UiDesignWalkthrough() {
  const [stepIndex, setStepIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STEP_STORAGE);
      const n = raw ? Number(raw) : 0;
      if (!Number.isNaN(n) && n >= 0 && n < WALK_STEPS.length) {
        setStepIndex(n);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STEP_STORAGE, String(stepIndex));
  }, [stepIndex, ready]);

  const step = WALK_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === WALK_STEPS.length - 1;

  function go(delta: number) {
    setStepIndex((i) =>
      Math.min(WALK_STEPS.length - 1, Math.max(0, i + delta))
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Opening UI design walkthrough…
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28">
      <header className="border-b border-[var(--pt-line)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs tracking-wide text-[var(--pt-ink-soft)] uppercase">
                Samuel Malke · UI Design Assignment · Oct 25, 2026
              </p>
              <h1 className="font-display text-2xl text-[var(--pt-ink)] sm:text-3xl">
                Princess Travel UI design
              </h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--pt-line)] bg-[var(--pt-sky)]/70 px-3 py-1.5 text-sm text-[var(--pt-ink)]">
              <ListChecks className="size-4 text-[var(--pt-teal)]" />
              Step {step.number} of {WALK_STEPS.length}
            </div>
          </div>

          <nav className="flex gap-1.5 overflow-x-auto pb-1">
            {WALK_STEPS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStepIndex(i)}
                className={[
                  "shrink-0 rounded-full px-3 py-1.5 text-xs transition-colors sm:text-sm",
                  i === stepIndex
                    ? "bg-[var(--pt-teal)] text-white"
                    : i < stepIndex
                      ? "bg-[var(--pt-teal-soft)] text-[var(--pt-teal-deep)]"
                      : "bg-white text-[var(--pt-ink-soft)] ring-1 ring-[var(--pt-line)] hover:text-[var(--pt-ink)]",
                ].join(" ")}
              >
                {s.number}. {s.title}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(260px,0.9fr)_minmax(0,1.4fr)] lg:gap-8 lg:px-8 lg:py-8">
        <aside className="h-fit rounded-2xl border border-[var(--pt-line)] bg-white/90 p-5 shadow-sm animate-rise lg:sticky lg:top-4">
          <p className="text-xs tracking-wide text-[var(--pt-gold-deep)] uppercase">
            Say this to Amira
          </p>
          <h2 className="mt-1 font-display text-2xl text-[var(--pt-ink)]">
            {step.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--pt-ink-soft)]">
            {step.ownerScript}
          </p>
          <div className="mt-4 border-t border-[var(--pt-line)] pt-4">
            <p className="text-xs tracking-wide text-[var(--pt-ink-soft)] uppercase">
              Point out
            </p>
            <ul className="mt-2 space-y-2">
              {step.whatToNotice.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm text-[var(--pt-ink)]"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--pt-teal)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="animate-rise-delay">{renderScreen(step.id)}</section>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--pt-line)] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            disabled={isFirst}
            onClick={() => go(-1)}
          >
            <ChevronLeft data-icon="inline-start" />
            Back
          </Button>
          <p className="hidden text-center text-sm text-muted-foreground sm:block">
            Walk Amira through each screen, then capture feedback and sign-off.
          </p>
          <Button
            disabled={isLast}
            onClick={() => go(1)}
            className="bg-[var(--pt-teal)] text-white hover:bg-[var(--pt-teal-deep)] disabled:opacity-50"
          >
            {isLast ? "Done" : "Next screen"}
            {!isLast ? <ChevronRight data-icon="inline-end" /> : null}
          </Button>
        </div>
      </footer>
    </div>
  );
}

function renderScreen(id: WalkStepId) {
  switch (id) {
    case "intro":
      return <IntroScreen />;
    case "desk":
      return <DeskHomeScreen />;
    case "new-caller":
      return <NewCallerScreen />;
    case "booking":
      return <BookingDetailScreen />;
    case "search":
      return <DeskHomeScreen highlightSearch query="7735550142" />;
    case "feedback":
      return <FeedbackScreen />;
    case "signoff":
      return <SignoffScreen />;
    default:
      return null;
  }
}
