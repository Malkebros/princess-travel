"use client";

import {
  SEDIMENTARY_TEXTURES,
  type SedimentaryRow,
} from "@/lib/rocks-data";
import { ChartField, ChartSelect } from "@/components/charts/chart-fields";

export function SedimentaryChart({
  rows,
  onChange,
}: {
  rows: SedimentaryRow[];
  onChange: (rows: SedimentaryRow[]) => void;
}) {
  function patch(index: number, partial: Partial<SedimentaryRow>) {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...partial } : row)));
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-[var(--stone-line)]">
        <table className="w-full min-w-[800px] border-collapse text-left text-sm">
          <thead className="bg-[var(--stone-panel)] text-[var(--stone-sand)]">
            <tr>
              <th className="px-3 py-3">Sample #</th>
              <th className="px-3 py-3">Texture</th>
              <th className="px-3 py-3">Composition</th>
              <th className="px-3 py-3">Rock Name</th>
              <th className="px-3 py-3">Comments</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[var(--stone-line)] bg-[var(--stone-ink)]/30 text-[var(--stone-mist)]">
              <td className="px-3 py-3">Example</td>
              <td className="px-3 py-3">Chemical</td>
              <td className="px-3 py-3">Dolomite</td>
              <td className="px-3 py-3 text-[var(--stone-foam)]">Dolomite</td>
              <td className="px-3 py-3">—</td>
            </tr>
            {rows.map((row, index) => (
              <tr
                key={row.sample}
                className="border-t border-[var(--stone-line)] align-top"
              >
                <td className="px-3 py-3 font-medium text-[var(--stone-foam)]">
                  {row.sample}
                </td>
                <td className="px-2 py-2">
                  <ChartSelect
                    value={row.texture}
                    onChange={(texture) => patch(index, { texture })}
                    options={[...SEDIMENTARY_TEXTURES]}
                    placeholder="Clastic / Chemical / Biochemical"
                  />
                </td>
                <td className="px-2 py-2">
                  <ChartField
                    value={row.composition}
                    onChange={(composition) => patch(index, { composition })}
                    placeholder="Minerals / grains you see"
                  />
                </td>
                <td className="px-2 py-2">
                  <ChartField
                    value={row.rockName}
                    onChange={(rockName) => patch(index, { rockName })}
                    placeholder="e.g. Sandstone"
                  />
                </td>
                <td className="px-2 py-2">
                  <ChartField
                    value={row.comments}
                    onChange={(comments) => patch(index, { comments })}
                    placeholder="Lab comments"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[var(--stone-mist)]">
        17 points · Samples 1, 4, and 5 already have worksheet comments
        prefilled.
      </p>
    </div>
  );
}
