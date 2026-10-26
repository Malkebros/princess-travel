"use client";

import { buttonVariants } from "@/components/ui/button";
import { t, telUrl, whatsappUrl, type Lang } from "@/lib/i18n";
import { formatPhone } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { MessageCircle, Phone } from "lucide-react";

export function ContactActions({
  phone,
  lang,
  size = "lg",
}: {
  phone: string;
  lang: Lang;
  size?: "sm" | "lg";
}) {
  const callHref = telUrl(phone);
  const waHref = whatsappUrl(phone);
  const tall = size === "lg";

  if (!callHref && !waHref) return null;

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
