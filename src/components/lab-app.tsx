"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteHeader } from "@/components/site-header";
import { VideoSection } from "@/components/video-section";
import { GuideSection } from "@/components/guide-section";
import { IgneousChart } from "@/components/charts/igneous-chart";
import { SedimentaryChart } from "@/components/charts/sedimentary-chart";
import { MetamorphicChart } from "@/components/charts/metamorphic-chart";
import { SubmitView } from "@/components/submit-view";
import { HintsPanel } from "@/components/hints-panel";
import {
  chartProgress,
  createInitialLabState,
  loadLabState,
  saveLabState,
  type IgneousRow,
  type LabState,
  type MetamorphicRow,
  type SedimentaryRow,
} from "@/lib/rocks-data";

export function LabApp() {
  const [state, setState] = useState<LabState>(createInitialLabState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadLabState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveLabState(state);
  }, [state, hydrated]);

  const progress = chartProgress(state);

  function updateIgneous(rows: IgneousRow[]) {
    setState((s) => ({ ...s, igneous: rows }));
  }
  function updateSedimentary(rows: SedimentaryRow[]) {
    setState((s) => ({ ...s, sedimentary: rows }));
  }
  function updateMetamorphic(rows: MetamorphicRow[]) {
    setState((s) => ({ ...s, metamorphic: rows }));
  }

  return (
    <div id="top" className="min-h-screen">
      <SiteHeader progress={progress.percent} />

      <section className="hero-plane relative overflow-hidden print:hidden">
        <div className="hero-grain absolute inset-0" aria-hidden />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-24 sm:px-6 sm:pb-20">
          <p className="font-display text-5xl leading-none tracking-tight text-[var(--stone-foam)] sm:text-7xl md:text-8xl animate-rise">
            STRATA
          </p>
          <h1 className="mt-5 max-w-xl font-display text-2xl leading-snug text-[var(--stone-sand)] sm:text-3xl animate-rise-delay">
            Rock Identification Lab
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--stone-mist)] animate-rise-delay-2">
            Watch the videos, use the ID guides, and complete the igneous,
            sedimentary, and metamorphic charts for submission.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-rise-delay-2">
            <a
              href="#charts"
              className="inline-flex h-11 items-center rounded-md bg-[var(--lichen)] px-5 text-sm font-medium text-[var(--stone-ink)] transition hover:brightness-110"
            >
              Open charts
            </a>
            <a
              href="#videos"
              className="inline-flex h-11 items-center rounded-md border border-white/20 bg-transparent px-5 text-sm font-medium text-[var(--stone-foam)] transition hover:bg-white/10"
            >
              Watch videos
            </a>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl space-y-16 px-4 py-14 sm:px-6 print:max-w-none print:space-y-8 print:px-0 print:py-0">
        <section className="print:hidden rounded-2xl border border-[var(--stone-line)] bg-[var(--stone-panel)] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <label className="block flex-1">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--stone-mist)]">
                Your name (required on submission)
              </span>
              <input
                value={state.studentName}
                onChange={(e) =>
                  setState((s) => ({ ...s, studentName: e.target.value }))
                }
                placeholder="First and last name"
                className="mt-2 w-full rounded-md border border-[var(--stone-line)] bg-[var(--stone-ink)]/40 px-3 py-2.5 text-[var(--stone-foam)] outline-none ring-[var(--lichen)] placeholder:text-[var(--stone-mist)]/50 focus:ring-2"
              />
            </label>
            <div className="w-full sm:w-56">
              <div className="mb-2 flex justify-between text-xs text-[var(--stone-mist)]">
                <span>Chart progress</span>
                <span>
                  {progress.filled}/{progress.total}
                </span>
              </div>
              <Progress value={progress.percent} className="h-2" />
            </div>
          </div>
          <p className="mt-4 text-sm text-[var(--stone-mist)]">
            Submit only the completed charts and any required questions—not the
            whole lab packet. Progress autosaves in this browser.
          </p>
        </section>

        <VideoSection />
        <GuideSection />
        <HintsPanel />

        <section id="charts" className="scroll-mt-24 print:hidden">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--lichen)]">
              Assignment charts
            </p>
            <h2 className="mt-2 font-display text-3xl text-[var(--stone-foam)]">
              Complete each sample row
            </h2>
            <p className="mt-2 max-w-2xl text-[var(--stone-mist)]">
              Match what you see in each sample (and in the videos) to
              composition, texture, and rock name. Comments already printed on
              your worksheet are prefilled.
            </p>
          </div>

          <Tabs defaultValue="igneous">
            <TabsList className="mb-4 h-auto flex-wrap bg-[var(--stone-panel)] p-1">
              <TabsTrigger value="igneous" className="px-3 py-2">
                Igneous (17 pts)
              </TabsTrigger>
              <TabsTrigger value="sedimentary" className="px-3 py-2">
                Sedimentary (17 pts)
              </TabsTrigger>
              <TabsTrigger value="metamorphic" className="px-3 py-2">
                Metamorphic (16 pts)
              </TabsTrigger>
            </TabsList>
            <TabsContent value="igneous">
              <IgneousChart rows={state.igneous} onChange={updateIgneous} />
            </TabsContent>
            <TabsContent value="sedimentary">
              <SedimentaryChart
                rows={state.sedimentary}
                onChange={updateSedimentary}
              />
            </TabsContent>
            <TabsContent value="metamorphic">
              <MetamorphicChart
                rows={state.metamorphic}
                onChange={updateMetamorphic}
              />
            </TabsContent>
          </Tabs>
        </section>

        <SubmitView state={state} progress={progress} />
      </main>

      <footer className="print:hidden border-t border-[var(--stone-line)] py-8 text-center text-sm text-[var(--stone-mist)]">
        STRATA · Rock Identification Lab companion · Use with your course videos
        and hand specimens
      </footer>
    </div>
  );
}
