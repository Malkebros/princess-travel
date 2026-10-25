"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FEEDBACK_KEY } from "@/lib/design-data";

type Feedback = {
  likes: string;
  changes: string;
  missing: string;
  savedAt: string;
};

export function FeedbackScreen() {
  const [likes, setLikes] = useState("");
  const [changes, setChanges] = useState("");
  const [missing, setMissing] = useState("");
  const [savedAt, setSavedAt] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FEEDBACK_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Feedback;
      setLikes(parsed.likes ?? "");
      setChanges(parsed.changes ?? "");
      setMissing(parsed.missing ?? "");
      setSavedAt(parsed.savedAt ?? "");
    } catch {
      /* ignore */
    }
  }, []);

  function save() {
    const payload: Feedback = {
      likes,
      changes,
      missing,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(payload));
    setSavedAt(payload.savedAt);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--pt-line)] bg-white shadow-[0_24px_60px_-36px_rgb(11_79_108_/_0.55)]">
      <div className="border-b border-[var(--pt-line)] bg-[linear-gradient(120deg,#eef6fa_0%,#fffdf6_100%)] px-5 py-4">
        <p className="text-sm text-[var(--pt-ink-soft)]">
          UI Design Worksheet · Owner feedback
        </p>
        <h2 className="font-display text-3xl text-[var(--pt-ink)]">
          What should we change?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Meeting date: Oct 25, 2026 · Owner: Amira Aboudeeb
        </p>
      </div>

      <div className="grid gap-4 px-5 py-5">
        <Field label="What do you like?">
          <Textarea
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            placeholder="e.g. Searching by phone will help a lot…"
            className="min-h-24"
          />
        </Field>
        <Field label="What should we change?">
          <Textarea
            value={changes}
            onChange={(e) => setChanges(e.target.value)}
            placeholder="e.g. Make buttons bigger, add Arabic labels…"
            className="min-h-24"
          />
        </Field>
        <Field label="Anything missing for day-to-day work?">
          <Textarea
            value={missing}
            onChange={(e) => setMissing(e.target.value)}
            placeholder="e.g. Place to store Sabre PNR / record locator…"
            className="min-h-24"
          />
        </Field>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={save}
            className="bg-[var(--pt-teal)] text-white hover:bg-[var(--pt-teal-deep)]"
          >
            Save feedback
          </Button>
          {savedAt ? (
            <p className="text-sm text-[var(--pt-teal-deep)]">
              Saved locally ·{" "}
              {new Date(savedAt).toLocaleString("en-US", {
                timeZone: "America/Chicago",
                dateStyle: "medium",
                timeStyle: "short",
              })}{" "}
              CT
            </p>
          ) : null}
        </div>
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
