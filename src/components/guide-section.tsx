import {
  COMMON_IGNEOUS,
  COMMON_METAMORPHIC,
  COMMON_SEDIMENTARY,
} from "@/lib/rocks-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function GuideSection() {
  return (
    <section id="guides" className="scroll-mt-24 print:hidden">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--lichen)]">
        Step 2
      </p>
      <h2 className="mt-2 font-display text-3xl text-[var(--stone-foam)]">
        Quick identification guides
      </h2>
      <p className="mt-2 max-w-2xl text-[var(--stone-mist)]">
        Use composition + texture first, then name the rock. These are the
        common lab specimens you are most likely to meet.
      </p>

      <Tabs defaultValue="igneous" className="mt-8">
        <TabsList className="h-auto flex-wrap bg-[var(--stone-panel)] p-1">
          <TabsTrigger value="igneous" className="px-3 py-2">
            Igneous
          </TabsTrigger>
          <TabsTrigger value="sedimentary" className="px-3 py-2">
            Sedimentary
          </TabsTrigger>
          <TabsTrigger value="metamorphic" className="px-3 py-2">
            Metamorphic
          </TabsTrigger>
        </TabsList>

        <TabsContent value="igneous" className="mt-6">
          <p className="mb-4 text-sm text-[var(--stone-mist)]">
            Cool color ≈ felsic; dark ≈ mafic. Visible crystals ≈ phaneritic
            (intrusive); too fine to see ≈ aphanitic (extrusive).
          </p>
          <GuideTable
            headers={["Rock", "Composition", "Texture", "Field tip"]}
            rows={COMMON_IGNEOUS.map((r) => [
              r.name,
              r.composition,
              r.texture,
              r.tip,
            ])}
          />
        </TabsContent>

        <TabsContent value="sedimentary" className="mt-6">
          <p className="mb-4 text-sm text-[var(--stone-mist)]">
            Clastic = broken pieces. Chemical = precipitated minerals.
            Biochemical = once-living material (shells, plants).
          </p>
          <GuideTable
            headers={["Rock", "Texture", "Composition", "Field tip"]}
            rows={COMMON_SEDIMENTARY.map((r) => [
              r.name,
              r.texture,
              r.composition,
              r.tip,
            ])}
          />
        </TabsContent>

        <TabsContent value="metamorphic" className="mt-6">
          <p className="mb-4 text-sm text-[var(--stone-mist)]">
            Foliated = layered / aligned minerals. Non-foliated = interlocking
            crystals without layering. Always note the parent rock.
          </p>
          <GuideTable
            headers={["Rock", "Texture", "Composition", "Parent", "Field tip"]}
            rows={COMMON_METAMORPHIC.map((r) => [
              r.name,
              r.texture,
              r.composition,
              r.parent,
              r.tip,
            ])}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}

function GuideTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--stone-line)]">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead className="bg-[var(--stone-panel)] text-[var(--stone-sand)]">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-3 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row[0]}
              className="border-t border-[var(--stone-line)] text-[var(--stone-mist)]"
            >
              {row.map((cell, i) => (
                <td
                  key={`${row[0]}-${i}`}
                  className={`px-3 py-3 align-top ${i === 0 ? "font-medium text-[var(--stone-foam)]" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
