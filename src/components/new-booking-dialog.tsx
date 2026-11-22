"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { t, type Lang } from "@/lib/i18n";
import type { Booking } from "@/lib/types";

const fieldClass =
  "h-11 rounded-xl border-[var(--pt-line)] bg-white text-base md:text-base";

export function NewBookingDialog({
  open,
  onOpenChange,
  onCreate,
  lang,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (partial: Partial<Booking>) => void;
  lang: Lang;
}) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [showTrip, setShowTrip] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  function reset() {
    setCustomerName("");
    setPhone("");
    setEmail("");
    setShowTrip(false);
    setFrom("");
    setTo("");
    setDepartDate("");
    setReturnDate("");
    setPassengers("1");
    setNotes("");
    setError("");
  }

  function submit() {
    if (!customerName.trim() || !phone.trim() || !email.trim()) {
      setError(
        lang === "ar"
          ? "الاسم والهاتف والبريد مطلوبون."
          : "Name, phone, and email are required."
      );
      return;
    }
    if (!email.trim().includes("@")) {
      setError(
        lang === "ar" ? "أدخلي بريداً صالحاً." : "Enter a valid email."
      );
      return;
    }
    onCreate({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      from: from.trim().toUpperCase(),
      to: to.trim().toUpperCase(),
      departDate,
      returnDate,
      passengers: passengers.trim() || "1",
      notes: notes.trim(),
      nextAction: "",
      stage: "open",
    });
    reset();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {t(lang, "newCallerTitle")}
          </DialogTitle>
          <DialogDescription className="text-base">
            {t(lang, "newCallerHint")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <Field label={t(lang, "name")} htmlFor="nb-name">
            <Input
              id="nb-name"
              className={fieldClass}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              autoFocus
            />
          </Field>
          <Field label={t(lang, "phone")} htmlFor="nb-phone">
            <Input
              id="nb-phone"
              className={fieldClass}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
            />
          </Field>
          <Field label={t(lang, "email")} htmlFor="nb-email">
            <Input
              id="nb-email"
              className={fieldClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
            />
          </Field>

          <button
            type="button"
            onClick={() => setShowTrip((v) => !v)}
            className="justify-self-start text-base text-[var(--pt-teal-deep)] underline-offset-2 hover:underline"
          >
            {showTrip
              ? t(lang, "hideMore")
              : `+ ${t(lang, "tripOptional")}`}
          </button>

          {showTrip ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t(lang, "from")} htmlFor="nb-from">
                  <Input
                    id="nb-from"
                    className={fieldClass}
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="ORD"
                  />
                </Field>
                <Field label={t(lang, "to")} htmlFor="nb-to">
                  <Input
                    id="nb-to"
                    className={fieldClass}
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="CAI"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Field label={t(lang, "depart")} htmlFor="nb-depart">
                  <Input
                    id="nb-depart"
                    className={fieldClass}
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                  />
                </Field>
                <Field label={t(lang, "return")} htmlFor="nb-return">
                  <Input
                    id="nb-return"
                    className={fieldClass}
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </Field>
                <Field label={t(lang, "passengers")} htmlFor="nb-pax">
                  <Input
                    id="nb-pax"
                    className={fieldClass}
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                  />
                </Field>
              </div>
              <Field label={t(lang, "notes")} htmlFor="nb-notes">
                <Textarea
                  id="nb-notes"
                  className="min-h-20 rounded-xl text-base"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Field>
            </>
          ) : null}

          {error ? (
            <p className="text-base text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            className="h-11 text-base"
            onClick={() => onOpenChange(false)}
          >
            {t(lang, "cancel")}
          </Button>
          <Button
            className="h-11 bg-[var(--pt-teal)] text-base text-white hover:bg-[var(--pt-teal-deep)]"
            onClick={submit}
          >
            {t(lang, "save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor} className="text-base">
        {label}
      </Label>
      {children}
    </div>
  );
}
