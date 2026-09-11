export type RockClass = "igneous" | "sedimentary" | "metamorphic";

export type IgneousRow = {
  sample: number;
  composition: string;
  texture: string;
  comments: string;
  rockName: string;
};

export type SedimentaryRow = {
  sample: number;
  texture: string;
  composition: string;
  rockName: string;
  comments: string;
};

export type MetamorphicRow = {
  sample: number;
  texture: string;
  composition: string;
  rockName: string;
  parentRock: string;
  comments: string;
};

export const VIDEOS = [
  {
    title: "Identifying Igneous Rocks",
    href: "https://www.youtube.com/results?search_query=Identifying+Igneous+Rocks",
    blurb: "Learn felsic–mafic composition and phaneritic vs. aphanitic texture.",
  },
  {
    title: "Sedimentary Rock Identification",
    href: "https://www.youtube.com/results?search_query=Sedimentary+Rock+Identification",
    blurb: "Sort clastic, chemical, and biochemical rocks by grains and minerals.",
  },
  {
    title: "Identification of Metamorphic Rocks",
    href: "https://www.youtube.com/results?search_query=Identification+of+Metamorphic+Rocks",
    blurb: "Spot foliation, grain size, and parent-rock relationships.",
  },
] as const;

export const IGNEOUS_COMPOSITIONS = [
  "Quartz/Feldspar (Felsic)",
  "Intermediate",
  "Pyroxene/Amphibole (Mafic)",
  "Olivine-rich (Ultramafic)",
] as const;

export const IGNEOUS_TEXTURES = [
  "Phaneritic (coarse, intrusive)",
  "Aphanitic (fine, extrusive)",
  "Porphyritic",
  "Glassy",
  "Vesicular / Frothy",
] as const;

export const SEDIMENTARY_TEXTURES = [
  "Clastic",
  "Chemical",
  "Biochemical",
] as const;

export const METAMORPHIC_TEXTURES = ["Foliated", "Non-foliated"] as const;

export const COMMON_IGNEOUS = [
  {
    name: "Granite",
    composition: "Quartz + K-feldspar ± plagioclase ± mica",
    texture: "Phaneritic",
    tip: "Light/pink/gray; crystals visible without a lens.",
  },
  {
    name: "Rhyolite",
    composition: "Quartz + feldspar",
    texture: "Aphanitic",
    tip: "Same chemistry as granite, but fine-grained; often pink/light.",
  },
  {
    name: "Diorite",
    composition: "Plagioclase + amphibole/biotite",
    texture: "Phaneritic",
    tip: "Salt-and-pepper look; intermediate color.",
  },
  {
    name: "Andesite",
    composition: "Intermediate",
    texture: "Aphanitic (± porphyritic)",
    tip: "Medium gray; may show phenocrysts.",
  },
  {
    name: "Gabbro",
    composition: "Pyroxene + plagioclase",
    texture: "Phaneritic",
    tip: "Dark intrusive equivalent of basalt.",
  },
  {
    name: "Basalt",
    composition: "Mafic",
    texture: "Aphanitic (± vesicular)",
    tip: "Dark, dense lava rock; may have vesicles.",
  },
  {
    name: "Obsidian",
    composition: "Usually felsic glass",
    texture: "Glassy",
    tip: "Conchoidal fracture; volcanic glass.",
  },
  {
    name: "Pumice",
    composition: "Felsic/intermediate",
    texture: "Vesicular / frothy",
    tip: "Very light; may float on water.",
  },
  {
    name: "Scoria",
    composition: "Mafic",
    texture: "Vesicular",
    tip: "Dark, cindery, full of gas holes.",
  },
] as const;

export const COMMON_SEDIMENTARY = [
  {
    name: "Conglomerate",
    texture: "Clastic",
    composition: "Rounded gravel / pebbles in matrix",
    tip: "Large fragments — gravel-size clasts cemented together.",
  },
  {
    name: "Breccia",
    texture: "Clastic",
    composition: "Angular gravel / fragments",
    tip: "Like conglomerate, but clasts are sharp/angular.",
  },
  {
    name: "Sandstone",
    texture: "Clastic",
    composition: "Sand-size quartz (± feldspar, rock fragments)",
    tip: "Feels gritty like sandpaper.",
  },
  {
    name: "Shale / Mudstone",
    texture: "Clastic",
    composition: "Clay / silt",
    tip: "Very fine; may split into thin layers (shale).",
  },
  {
    name: "Limestone",
    texture: "Chemical or Biochemical",
    composition: "Calcite (CaCO₃)",
    tip: "Fizzes in dilute HCl; may contain fossils.",
  },
  {
    name: "Dolomite / Dolostone",
    texture: "Chemical",
    composition: "Dolomite",
    tip: "Powdered surface may fizz slowly in acid.",
  },
  {
    name: "Rock Salt (Halite)",
    texture: "Chemical",
    composition: "Halite (NaCl)",
    tip: "Tastes salty; cubic cleavage if crystals show.",
  },
  {
    name: "Rock Gypsum",
    texture: "Chemical",
    composition: "Gypsum",
    tip: "Soft (can scratch with fingernail); often pale.",
  },
  {
    name: "Chert",
    texture: "Chemical",
    composition: "Microcrystalline quartz (SiO₂)",
    tip: "Hard, dense, conchoidal fracture.",
  },
  {
    name: "Coal",
    texture: "Biochemical",
    composition: "Compressed plant matter",
    tip: "Black, lightweight, may leave a sooty mark.",
  },
] as const;

export const COMMON_METAMORPHIC = [
  {
    name: "Slate",
    texture: "Foliated",
    composition: "Clay minerals / mica (microscopic)",
    parent: "Shale / mudstone",
    tip: "Very fine grained; breaks into flat sheets.",
  },
  {
    name: "Phyllite",
    texture: "Foliated",
    composition: "Fine mica",
    parent: "Slate",
    tip: "Silky/shiny surface; tiny crystals; between slate and schist.",
  },
  {
    name: "Schist",
    texture: "Foliated",
    composition: "Visible mica ± garnet, quartz",
    parent: "Phyllite / shale / mudstone",
    tip: "Very flaky, layered; sparkly mica plates.",
  },
  {
    name: "Gneiss",
    texture: "Foliated",
    composition: "Quartz + feldspar ± mafic bands",
    parent: "Granite / schist / various",
    tip: "Banded light/dark layers; coarse.",
  },
  {
    name: "Marble",
    texture: "Non-foliated",
    composition: "Calcite or dolomite",
    parent: "Limestone / dolostone",
    tip: "Fizzes in acid (if calcite); sugary interlocking crystals.",
  },
  {
    name: "Quartzite",
    texture: "Non-foliated",
    composition: "Quartz",
    parent: "Sandstone",
    tip: "Hard; breaks through grains; does not fizz.",
  },
  {
    name: "Anthracite Coal",
    texture: "Non-foliated",
    composition: "Carbon",
    parent: "Bituminous coal",
    tip: "Hard, shiny black metamorphic coal.",
  },
] as const;

/** Comments already printed on the assignment worksheet. */
export const PREFILLED_SEDIMENTARY_COMMENTS: Record<number, string> = {
  1: "Large fragments",
  4: "Tastes salty",
  5: "Feels like sand",
};

export const PREFILLED_METAMORPHIC_COMMENTS: Record<number, string> = {
  2: "Fizzes in acid",
  3: "Very flaky, layered",
  4: "Very fine grained",
};

export const HINTS: Record<
  string,
  { title: string; suggestion: string; reason: string }
> = {
  "sedimentary-1": {
    title: "Sedimentary Sample 1",
    suggestion: "Likely conglomerate (or breccia if angular)",
    reason:
      "“Large fragments” points to a clastic rock with gravel-size clasts.",
  },
  "sedimentary-4": {
    title: "Sedimentary Sample 4",
    suggestion: "Likely rock salt (halite)",
    reason: "“Tastes salty” is the classic field test for chemical rock salt.",
  },
  "sedimentary-5": {
    title: "Sedimentary Sample 5",
    suggestion: "Likely sandstone",
    reason: "“Feels like sand” matches sand-size clastic grains.",
  },
  "metamorphic-2": {
    title: "Metamorphic Sample 2",
    suggestion: "Likely marble (parent: limestone)",
    reason:
      "“Fizzes in acid” means calcite — marble is the non-foliated metamorphic form of limestone.",
  },
  "metamorphic-3": {
    title: "Metamorphic Sample 3",
    suggestion: "Likely schist (parent: phyllite/shale)",
    reason: "“Very flaky, layered” describes visible mica foliation in schist.",
  },
  "metamorphic-4": {
    title: "Metamorphic Sample 4",
    suggestion: "Likely slate (parent: shale)",
    reason: "“Very fine grained” plus typical lab sets → slate.",
  },
};

export function emptyIgneous(): IgneousRow[] {
  return [1, 2, 3, 4, 5].map((sample) => ({
    sample,
    composition: "",
    texture: "",
    comments: "",
    rockName: "",
  }));
}

export function emptySedimentary(): SedimentaryRow[] {
  return [1, 2, 3, 4, 5].map((sample) => ({
    sample,
    texture: "",
    composition: "",
    rockName: "",
    comments: PREFILLED_SEDIMENTARY_COMMENTS[sample] ?? "",
  }));
}

export function emptyMetamorphic(): MetamorphicRow[] {
  return [1, 2, 3, 4, 5].map((sample) => ({
    sample,
    texture: "",
    composition: "",
    rockName: "",
    parentRock: "",
    comments: PREFILLED_METAMORPHIC_COMMENTS[sample] ?? "",
  }));
}

export type LabState = {
  studentName: string;
  igneous: IgneousRow[];
  sedimentary: SedimentaryRow[];
  metamorphic: MetamorphicRow[];
};

export function createInitialLabState(): LabState {
  return {
    studentName: "",
    igneous: emptyIgneous(),
    sedimentary: emptySedimentary(),
    metamorphic: emptyMetamorphic(),
  };
}

const STORAGE_KEY = "rock-id-lab-v1";

export function loadLabState(): LabState {
  if (typeof window === "undefined") return createInitialLabState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialLabState();
    const parsed = JSON.parse(raw) as LabState;
    return {
      ...createInitialLabState(),
      ...parsed,
      igneous: parsed.igneous?.length === 5 ? parsed.igneous : emptyIgneous(),
      sedimentary:
        parsed.sedimentary?.length === 5
          ? parsed.sedimentary
          : emptySedimentary(),
      metamorphic:
        parsed.metamorphic?.length === 5
          ? parsed.metamorphic
          : emptyMetamorphic(),
    };
  } catch {
    return createInitialLabState();
  }
}

export function saveLabState(state: LabState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function chartProgress(state: LabState) {
  const igneousFilled = state.igneous.filter(
    (r) => r.composition && r.texture && r.rockName,
  ).length;
  const sedimentaryFilled = state.sedimentary.filter(
    (r) => r.texture && r.composition && r.rockName,
  ).length;
  const metamorphicFilled = state.metamorphic.filter(
    (r) => r.texture && r.composition && r.rockName && r.parentRock,
  ).length;
  const total = 15;
  const filled = igneousFilled + sedimentaryFilled + metamorphicFilled;
  return {
    igneousFilled,
    sedimentaryFilled,
    metamorphicFilled,
    filled,
    total,
    percent: Math.round((filled / total) * 100),
  };
}
