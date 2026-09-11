"use client";

import {
  IGNEOUS_COMPOSITIONS,
  IGNEOUS_TEXTURES,
  type IgneousRow,
} from "@/lib/rocks-data";
import { ChartField, ChartSelect } from "@/components/charts/chart-fields";

export function IgneousChart({
  rows,
  onChange,
}: {
  rows: IgneousRow[];
  onChange: (rows: IgneousRow[]) => void;
}) {
  function patch(index: number, partial: Partial<IgneousRow>) {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...partial } : row)));
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-[var(--stone-line)]">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-[var(--stone-panel)] text-[var(--stone-sand)]">
            <tr>
              <th className="px-3 py-3">Sample #</th>
              <th className="px-3 py-3">Composition</th>
              <th className="px-3 py-3">Texture</th>
              <th className="px-3 py-3">Comments</th>
              <th className="px-3 py-3">Rock Name</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[var(--stone-line)] bg-[var(--stone-ink)]/30 text-[var(--stone-mist)]">
              <td className="px-3 py-3">Example</td>
              <td className="px-3 py-3">Quartz/Feldspar</td>
              <td className="px-3 py-3">Aphanitic</td>
              <td className="px-3 py-3">Mostly pink</td>
              <td className="px-3 py-3 text-[var(--stone-foam)]">Rhyolite</td>
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
                    value={row.composition}
                    onChange={(composition) => patch(index, { composition })}
                    options={[...IGNEOUS_COMPOSITIONS]}
                    placeholder="Select composition"
                    allowCustom
                  />
                </td>
                <td className="px-2 py-2">
                  <ChartSelect
                    value={row.texture}
                    onChange={(texture) => patch(index, { texture })}
                    options={[...IGNEOUS_TEXTURES]}
                    placeholder="Select texture"
                    allowCustom
                  />
                </td>
                <td className="px-2 py-2">
                  <ChartField
                    value={row.comments}
                    onChange={(comments) => patch(index, { comments })}
                    placeholder="Color, vesicles…"
                  />
                </td>
                <td className="px-2 py-2">
                  <ChartField
                    value={row.rockName}
                    onChange={(rockName) => patch(index, { rockName })}
                    placeholder="e.g. Basalt"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[var(--stone-mist)]">
        17 points · Fill composition, texture, comments, and rock name for
        samples 1–5.
      </p>
    </div>
  );
}
