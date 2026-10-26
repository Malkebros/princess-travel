"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  buildVCard,
  smsUrl,
  t,
  telUrl,
  whatsappUrl,
  type Lang,
} from "@/lib/i18n";
import { formatPhone } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { ContactRound, MessageCircle, MessageSquareText, Phone } from "lucide-react";

export function ContactActions({
  phone,
  name = "",
  email = "",
  lang,
  size = "lg",
}: {
  phone: string;
  name?: string;
  email?: string;
  lang: Lang;
  size?: "sm" | "lg";
}) {
  const callHref = telUrl(phone);
  const textHref = smsUrl(phone);
  const waHref = whatsappUrl(phone);
  const canAddContact = Boolean(buildVCard({ name, phone, email }));
  const tall = size === "lg";

  if (!callHref && !textHref && !waHref && !canAddContact) return null;

  function addToPhoneContacts() {
    const vcard = buildVCard({ name, phone, email });
    if (!vcard) return;
    const safeName = (name || "caller").trim().replace(/[^\w\- ]+/g, "") || "caller";
    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeName}.vcf`;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {callHref ? (
        <a
          href={callHref}
          className={cn(
            buttonVariants({ size: tall ? "lg" : "default" }),
            tall ? "h-11 text-base" : "h-9 text-sm",
            "bg-[var(--pt-teal)] text-white hover:bg-[var(--pt-teal-deep)]"
          )}
        >
          <Phone data-icon="inline-start" />
          {t(lang, "call")}
        </a>
      ) : null}
      {textHref ? (
        <a
          href={textHref}
          className={cn(
            buttonVariants({ size: tall ? "lg" : "default" }),
            tall ? "h-11 text-base" : "h-9 text-sm",
            "bg-[var(--pt-ink)] text-white hover:bg-[var(--pt-ink)]/90"
          )}
        >
          <MessageSquareText data-icon="inline-start" />
          {t(lang, "text")}
        </a>
      ) : null}
      {waHref ? (
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          className={cn(
            buttonVariants({ size: tall ? "lg" : "default" }),
            tall ? "h-11 text-base" : "h-9 text-sm",
            "bg-[#25D366] text-white hover:bg-[#1ebe57]"
          )}
        >
          <MessageCircle data-icon="inline-start" />
          {t(lang, "whatsapp")}
        </a>
      ) : null}
      {canAddContact ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            addToPhoneContacts();
          }}
          className={cn(
            buttonVariants({ variant: "outline", size: tall ? "lg" : "default" }),
            tall ? "h-11 text-base" : "h-9 text-sm",
            "border-[var(--pt-line)] bg-white"
          )}
        >
          <ContactRound data-icon="inline-start" />
          {t(lang, "addContact")}
        </button>
      ) : null}
    </div>
  );
}

/** Tappable phone number that starts a call on iPhone. */
export function PhoneLink({
  phone,
  className,
}: {
  phone: string;
  className?: string;
}) {
  const href = telUrl(phone);
  const label = formatPhone(phone);
  if (!href) {
    return <span className={className}>{label}</span>;
  }
  return (
    <a
      href={href}
      className={cn(
        "font-medium text-[var(--pt-teal-deep)] underline decoration-[var(--pt-teal)]/40 underline-offset-2 hover:decoration-[var(--pt-teal)]",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {label}
    </a>
  );
}
