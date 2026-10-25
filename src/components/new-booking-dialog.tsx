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
import type { Booking } from "@/lib/types";

export function NewBookingDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (partial: Partial<Booking>) => void;
}) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
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
    setFrom("");
    setTo("");
    setDepartDate("");
    setReturnDate("");
    setPassengers("1");
    setNotes("");
    setError("");
  }

  function submit() {
    if (!customerName.trim() || !phone.trim()) {
      setError("Name and phone are required.");
      return;
    }
    onCreate({
      customerName: customerName.trim(),
      phone: phone.trim(),
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
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle className="font-display text-xl">New caller</DialogTitle>
          <DialogDescription>
            Just the basics — name, phone, and trip if you have it.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <Field label="Name" htmlFor="nb-name">
            <Input
              id="nb-name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Layla Mansour"
              autoFocus
            />
          </Field>
          <Field label="Phone" htmlFor="nb-phone">
            <Input
              id="nb-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="773…"
              inputMode="tel"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="From" htmlFor="nb-from">
              <Input
                id="nb-from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="ORD"
              />
            </Field>
            <Field label="To" htmlFor="nb-to">
              <Input
                id="nb-to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="CAI"
              />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Depart" htmlFor="nb-depart">
              <Input
                id="nb-depart"
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
              />
            </Field>
            <Field label="Return" htmlFor="nb-return">
              <Input
                id="nb-return"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </Field>
            <Field label="Pax" htmlFor="nb-pax">
              <Input
                id="nb-pax"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Notes" htmlFor="nb-notes">
            <Textarea
              id="nb-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional"
            />
          </Field>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            className="bg-[var(--pt-teal)] text-white hover:bg-[var(--pt-teal-deep)]"
          >
            Save
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
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
