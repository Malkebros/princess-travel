"use client";

import { useState } from "react";
import { ContactActions, PhoneLink } from "@/components/contact-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { stageLabel, t, type Lang } from "@/lib/i18n";
import { STAGES, type Booking, type Stage } from "@/lib/types";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

const fieldClass =
  "h-11 rounded-xl border-[var(--pt-line)] bg-white text-base md:text-base";

export function BookingDetail({
  booking,
  onChange,
  onDelete,
  lang,
  onBack,
}: {
  booking: Booking;
  onChange: (booking: Booking) => void;
  onDelete: (id: string) => void;
  lang: Lang;
  onBack?: () => void;
}) {
  const [showMore, setShowMore] = useState(
    Boolean(booking.email || booking.price)
  );

  function patch(partial: Partial<Booking>) {
    onChange({ ...booking, ...partial });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--pt-line)] bg-white/95 shadow-[0_18px_40px_-28px_rgb(11_79_108_/_0.45)]">
      <div className="border-b border-[var(--pt-line)] bg-[linear-gradient(120deg,#eef6fa_0%,#fffdf6_55%,#ffffff_100%)] px-4 py-4 sm:px-5">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="mb-3 text-base text-[var(--pt-teal-deep)] underline-offset-2 hover:underline lg:hidden"
          >
            ← {t(lang, "backToList")}
          </button>
        ) : null}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <PhoneLink phone={booking.phone} className="text-base" />
            <h2 className="font-display text-3xl text-[var(--pt-ink)]">
              {booking.customerName || "—"}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <ContactActions
              phone={booking.phone}
              name={booking.customerName}
              email={booking.email}
              lang={lang}
            />
            <Button
              variant="destructive"
              size="lg"
              className="h-11 text-base"
              onClick={() => {
                if (window.confirm(t(lang, "removeConfirm"))) {
                  onDelete(booking.id);
                }
              }}
            >
              <Trash2 data-icon="inline-start" />
              {t(lang, "remove")}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 px-4 py-5 sm:px-5">
        <div>
          <p className="mb-2 text-base font-medium text-[var(--pt-ink)]">
            {t(lang, "status")}
          </p>
          <div className="flex flex-wrap gap-2">
            {STAGES.map((stage) => {
              const current = stage === booking.stage;
              return (
                <button
                  key={stage}
                  type="button"
                  onClick={() => patch({ stage: stage as Stage })}
                  className={[
                    "min-h-11 rounded-full px-4 py-2 text-base transition-colors",
                    current
                      ? "bg-[var(--pt-teal)] text-white"
                      : "bg-white text-muted-foreground ring-1 ring-[var(--pt-line)] hover:text-[var(--pt-ink)]",
                  ].join(" ")}
                >
                  {stageLabel(lang, stage)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={t(lang, "name")}>
            <Input
              className={fieldClass}
              value={booking.customerName}
              onChange={(e) => patch({ customerName: e.target.value })}
            />
          </Field>
          <Field label={t(lang, "phone")}>
            <Input
              className={fieldClass}
              value={booking.phone}
              onChange={(e) => patch({ phone: e.target.value })}
              inputMode="tel"
            />
          </Field>
          <Field label={t(lang, "from")}>
            <Input
              className={fieldClass}
              value={booking.from}
              onChange={(e) => patch({ from: e.target.value.toUpperCase() })}
              placeholder="ORD"
            />
          </Field>
          <Field label={t(lang, "to")}>
            <Input
              className={fieldClass}
              value={booking.to}
              onChange={(e) => patch({ to: e.target.value.toUpperCase() })}
              placeholder="CAI"
            />
          </Field>
          <Field label={t(lang, "depart")}>
            <Input
              className={fieldClass}
              type="date"
              value={booking.departDate}
              onChange={(e) => patch({ departDate: e.target.value })}
            />
          </Field>
          <Field label={t(lang, "return")}>
            <Input
              className={fieldClass}
              type="date"
              value={booking.returnDate}
              onChange={(e) => patch({ returnDate: e.target.value })}
            />
          </Field>
          <Field label={t(lang, "passengers")}>
            <Input
              className={fieldClass}
              value={booking.passengers}
              onChange={(e) => patch({ passengers: e.target.value })}
              inputMode="numeric"
            />
          </Field>
        </div>

        <Field label={t(lang, "nextAction")}>
          <Input
            className={fieldClass}
            value={booking.nextAction}
            onChange={(e) => patch({ nextAction: e.target.value })}
          />
        </Field>

        <Field label={t(lang, "notes")}>
          <Textarea
            className="min-h-28 rounded-xl border-[var(--pt-line)] text-base"
            value={booking.notes}
            onChange={(e) => patch({ notes: e.target.value })}
          />
        </Field>

        <div>
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            className="inline-flex min-h-11 items-center gap-1.5 text-base text-[var(--pt-teal-deep)]"
          >
            {showMore ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
            {showMore ? t(lang, "hideMore") : t(lang, "more")}
          </button>
          {showMore ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label={t(lang, "email")}>
                <Input
                  className={fieldClass}
                  value={booking.email}
                  onChange={(e) => patch({ email: e.target.value })}
                  type="email"
                  required
                />
              </Field>
              <Field label={`${t(lang, "price")} (${t(lang, "optional")})`}>
                <Input
                  className={fieldClass}
                  value={booking.price}
                  onChange={(e) => patch({ price: e.target.value })}
                  inputMode="decimal"
                />
              </Field>
            </div>
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
      <Label className="text-base">{label}</Label>
      {children}
    </div>
  );
}
