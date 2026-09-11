import { HINTS } from "@/lib/rocks-data";

export function HintsPanel() {
  const items = Object.values(HINTS);
  return (
    <section className="print:hidden rounded-2xl border border-[var(--stone-line)] bg-[var(--stone-panel)]/70 p-5 sm:p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--lichen)]">
        Worksheet clues
      </p>
      <h2 className="mt-2 font-display text-2xl text-[var(--stone-foam)]">
        Hints from comments already on your charts
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--stone-mist)]">
        Your handout already includes comments for some samples. Use them as
        starting points—still confirm with the videos and what you observe.
      </p>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((hint) => (
          <li
            key={hint.title}
            className="border-l-2 border-[var(--lichen)] pl-4"
          >
            <h3 className="font-medium text-[var(--stone-foam)]">
              {hint.title}
            </h3>
            <p className="mt-1 text-sm text-[var(--stone-sand)]">
              {hint.suggestion}
            </p>
            <p className="mt-1 text-sm text-[var(--stone-mist)]">
              {hint.reason}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm text-[var(--stone-mist)]">
        Igneous samples 1–5 and remaining sedimentary/metamorphic rows need your
        observations from the videos/specimens—there are no printed comments for
        those.
      </p>
    </section>
  );
}
