import { VIDEOS } from "@/lib/rocks-data";

export function VideoSection() {
  return (
    <section id="videos" className="scroll-mt-24 print:hidden">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--lichen)]">
        Step 1
      </p>
      <h2 className="mt-2 font-display text-3xl text-[var(--stone-foam)]">
        Watch the rock identification videos
      </h2>
      <p className="mt-2 max-w-2xl text-[var(--stone-mist)]">
        These match the links in your lab handout. Open each video, then come
        back and fill the charts.
      </p>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {VIDEOS.map((video, index) => (
          <li key={video.title}>
            <a
              href={video.href}
              target="_blank"
              rel="noreferrer"
              className="group block border-b border-[var(--stone-line)] pb-5 transition hover:border-[var(--lichen)]"
            >
              <span className="text-xs tabular-nums text-[var(--lichen)]">
                0{index + 1}
              </span>
              <h3 className="mt-3 font-display text-xl text-[var(--stone-foam)] group-hover:text-[var(--lichen)]">
                {video.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--stone-mist)]">
                {video.blurb}
              </p>
              <span className="mt-4 inline-block text-sm text-[var(--stone-sand)]">
                Open on YouTube →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
