"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UnlockForm() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(data?.error || "Wrong passcode.");
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setError("Could not unlock. Check your connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="passcode" className="text-base">
          Passcode
        </Label>
        <Input
          id="passcode"
          type="password"
          autoComplete="current-password"
          inputMode="text"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="h-12 rounded-xl border-[var(--pt-line)] bg-white text-base"
          placeholder="Desk passcode"
          autoFocus
          required
        />
      </div>
      {error ? (
        <p className="text-base text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        size="lg"
        disabled={busy || !passcode.trim()}
        className="h-12 bg-[var(--pt-teal)] text-base text-white hover:bg-[var(--pt-teal-deep)]"
      >
        {busy ? "Opening…" : "Open desk"}
      </Button>
    </form>
  );
}
