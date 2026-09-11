"use client";

import { Button } from "@/components/ui/button";
import type { LabState } from "@/lib/rocks-data";

export function SubmitView({
  state,
  progress,
}: {
  state: LabState;
  progress: {
    filled: number;
    total: number;
    percent: number;
    igneousFilled: number;
    sedimentaryFilled: number;
    metamorphicFilled: number;
  };
}) {
  return (
    <section id="submit" className="scroll-mt-24">
      <div className="print:hidden mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--lichen)]">
            Step 3
          </p>
          <h2 className="mt-2 font-display text-3xl text-[var(--stone-foam)]">
            Charts ready to submit
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--stone-mist)]">
            Print or save as PDF from your browser. Only turn in these charts
            (with your name). Incomplete rows: {progress.total - progress.filled}{" "}
            remaining.
          </p>
        </div>
        <Button
          onClick={() => window.print()}
          className="h-11 rounded-md bg-[var(--lichen)] px-5 text-[var(--stone-ink)] hover:bg-[var(--lichen)]/90"
        >
          Print / Save PDF
        </Button>
      </div>

      <div className="submit-sheet space-y-8 rounded-2xl border border-[var(--stone-line)] bg-[var(--stone-foam)] p-5 text-[var(--stone-ink)] sm:p-8 print:rounded-none print:border-0 print:p-0">
        <header className="border-b border-[var(--stone-ink)]/15 pb-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--stone-ink)]/55">
            Rock Identification Lab
          </p>
          <h3 className="mt-1 font-display text-2xl">Completed Charts</h3>
          <p className="mt-3 text-sm">
            <span className="text-[var(--stone-ink)]/55">Name: </span>
            <span className="font-medium">
              {state.studentName.trim() || "____________________________"}
            </span>
          </p>
        </header>

        <PrintTable
          title="Igneous Rock Identification Chart (17 points)"
          headers={["Sample #", "Composition", "Texture", "Comments", "Rock Name"]}
          rows={[
            ["Example", "Quartz/Feldspar", "Aphanitic", "Mostly pink", "Rhyolite"],
            ...state.igneous.map((r) => [
              String(r.sample),
              r.composition,
              r.texture,
              r.comments,
              r.rockName,
            ]),
          ]}
        />

        <PrintTable
          title="Sedimentary Rock Identification Chart (17 points)"
          headers={[
            "Sample #",
            "Texture (Clastic, Chemical or Biochemical)",
            "Composition",
            "Rock Name",
            "Comments",
          ]}
          rows={[
            ["Example", "Chemical", "Dolomite", "Dolomite", ""],
            ...state.sedimentary.map((r) => [
              String(r.sample),
              r.texture,
              r.composition,
              r.rockName,
              r.comments,
            ]),
          ]}
        />

        <PrintTable
          title="Metamorphic Rock Identification Chart (16 points)"
          headers={[
            "Sample #",
            "Texture (Foliated or Non-foliated)",
            "Composition",
            "Rock Name",
            "Parent Rock",
            "Comments",
          ]}
          rows={[
            [
              "Example",
              "F",
              "Tiny crystals, Shiny surface",
              "Phyllite",
              "Slate",
              "",
            ],
            ...state.metamorphic.map((r) => [
              String(r.sample),
              r.texture,
              r.composition,
              r.rockName,
              r.parentRock,
              r.comments,
            ]),
          ]}
        />
      </div>
    </section>
  );
}

function PrintTable({
  title,
  headers,
  rows,
}: {
  title: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="break-inside-avoid">
      <h4 className="mb-3 font-display text-lg">{title}</h4>
      <table className="w-full border-collapse text-left text-xs sm:text-sm">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="border border-[var(--stone-ink)]/25 bg-[var(--stone-ink)]/5 px-2 py-2 font-medium"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={`${title}-${idx}`}>
              {row.map((cell, cellIdx) => (
                <td
                  key={`${title}-${idx}-${cellIdx}`}
                  className="border border-[var(--stone-ink)]/25 px-2 py-2 align-top"
                >
                  {cell || "\u00A0"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
