import { UnlockForm } from "@/components/unlock-form";

export default function UnlockPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-[var(--pt-line)] bg-white/95 p-6 shadow-[0_18px_40px_-28px_rgb(11_79_108_/_0.45)] sm:p-8">
        <p className="font-display text-3xl text-[var(--pt-ink)]">
          Princess Travel
        </p>
        <p className="mt-1 text-base text-muted-foreground">
          Enter the desk passcode. You’ll need it again next time you open the
          site.
        </p>
        <div className="mt-6">
          <UnlockForm />
        </div>
      </div>
    </main>
  );
}
