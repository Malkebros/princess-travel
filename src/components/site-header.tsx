"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const links = [
  { href: "#videos", label: "Videos" },
  { href: "#guides", label: "ID Guides" },
  { href: "#charts", label: "Charts" },
  { href: "#submit", label: "Submit View" },
];

export function SiteHeader({ progress }: { progress: number }) {
  return (
    <header className="print:hidden sticky top-0 z-40 border-b border-white/10 bg-[color-mix(in_oklab,var(--stone-ink)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="font-display text-lg tracking-wide text-[var(--stone-foam)]">
          STRATA
        </a>
        <nav className="hidden items-center gap-5 text-sm text-[var(--stone-mist)] md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[var(--stone-foam)]"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div
            className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-white/10 sm:block"
            aria-hidden
          >
            <div
              className="h-full rounded-full bg-[var(--lichen)] transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-[var(--stone-mist)]">
            {progress}%
          </span>
          <Link
            href="#submit"
            className={cn(
              "rounded-md bg-[var(--lichen)] px-3 py-1.5 text-xs font-medium text-[var(--stone-ink)]",
              "transition hover:brightness-110",
            )}
          >
            Print charts
          </Link>
        </div>
      </div>
    </header>
  );
}
