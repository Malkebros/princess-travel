"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SIGNOFF_KEY } from "@/lib/design-data";
import { CheckCircle2 } from "lucide-react";

type Signoff = {
  ownerName: string;
  date: string;
  confirmed: boolean;
  signedAt: string;
};

export function SignoffScreen() {
  const [ownerName, setOwnerName] = useState("Amira Aboudeeb");
  const [date, setDate] = useState("2026-10-25");
  const [confirmed, setConfirmed] = useState(false);
  const [signedAt, setSignedAt] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SIGNOFF_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Signoff;
      setOwnerName(parsed.ownerName || "Amira Aboudeeb");
      setDate(parsed.date || "2026-10-25");
      setConfirmed(Boolean(parsed.confirmed));
      setSignedAt(parsed.signedAt || "");
    } catch {
      /* ignore */
    }
  }, []);

  function sign() {
    if (!ownerName.trim() || !date) return;
    const payload: Signoff = {
      ownerName: ownerName.trim(),
      date,
      confirmed: true,
      signedAt: new Date().toISOString(),
    };
    localStorage.setItem(SIGNOFF_KEY, JSON.stringify(payload));
    setConfirmed(true);
    setSignedAt(payload.signedAt);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--pt-line)] bg-white shadow-[0_24px_60px_-36px_rgb(11_79_108_/_0.55)]">
      <div className="border-b border-[var(--pt-line)] bg-[linear-gradient(120deg,#eef6fa_0%,#fffdf6_100%)] px-5 py-4">
        <p className="text-sm text-[var(--pt-ink-soft)]">
          UI Design Worksheet · Owner approval
        </p>
        <h2 className="font-display text-3xl text-[var(--pt-ink)]">
          Design sign-off
        </h2>
      </div>

      <div className="grid gap-4 px-5 py-5">
        <p className="rounded-xl border border-[var(--pt-line)] bg-[var(--pt-sky)]/50 px-4 py-3 text-sm leading-relaxed text-[var(--pt-ink)]">
          I have reviewed this design and confirm it meets my business&apos;s
          requirements for organizing callers, booking stages, and next actions
          alongside Sabre Red.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="owner-name">Owner name</Label>
            <Input
              id="owner-name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sign-date">Date</Label>
            <Input
              id="sign-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-[var(--pt-line)] px-4 py-6 text-center">
          <p className="font-display text-2xl text-[var(--pt-ink)]">
            {ownerName || "Owner signature"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Typed name counts as signature for this class worksheet preview
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={sign}
            className="bg-[var(--pt-teal)] text-white hover:bg-[var(--pt-teal-deep)]"
          >
            Approve this design
          </Button>
          {confirmed ? (
            <p className="inline-flex items-center gap-1.5 text-sm text-[var(--pt-teal-deep)]">
              <CheckCircle2 className="size-4" />
              Approved
              {signedAt
                ? ` · ${new Date(signedAt).toLocaleString("en-US", {
                    timeZone: "America/Chicago",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })} CT`
                : ""}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
