import type { GarmentKind, PrintId } from "@/components/GarmentCutout";

/**
 * The hero rack lineup. Seven pieces — printed tees first, boutique pieces
 * in the middle, heavyweights at the ends — roughly colour-matched to the
 * product photography in `lib/products.ts`.
 */
export interface RackItem {
  slug: string;
  kind: GarmentKind;
  /** base fabric colour */
  body: string;
  /** darker tone used for ribs, seams and fold shading */
  shade: string;
  /** print / trim colour */
  ink?: string;
  frontPrint?: PrintId;
  backPrint?: PrintId;
  /** neck-tag copy, e.g. "ONLY 3 LEFT" */
  tag?: string;
  tagTone?: "ink" | "accent" | "cobalt";
  /** short fit + fabric line shown under the active garment */
  spec: string;
  /** optional real cutout photography (transparent PNG / WebP) */
  frontImage?: string;
  backImage?: string;
  sidePreview?: string;
}

export const RACK: RackItem[] = [
  {
    slug: "static-hoodie",
    kind: "hoodie",
    body: "#b4b2ab",
    shade: "#8f8d86",
    ink: "#1b1a16",
    backPrint: "arc-back",
    tag: "-20%",
    tagTone: "ink",
    spec: "Relaxed Fit · 450 GSM Brushed Fleece",
  },
  {
    slug: "low-volume-tee",
    kind: "tee",
    body: "#24231f",
    shade: "#121110",
    ink: "#f2efe8",
    frontPrint: "mark-chest",
    backPrint: "wave-back",
    tag: "240 GSM",
    tagTone: "ink",
    spec: "Boxy Fit · 240 GSM Combed Cotton",
  },
  {
    slug: "reprint-tee-01",
    kind: "tee",
    body: "#ebe4d2",
    shade: "#cfc5ac",
    ink: "#2438e8",
    frontPrint: "reprint-chest",
    backPrint: "reprint-back",
    tag: "NEW",
    tagTone: "cobalt",
    spec: "Oversized Fit · 240 GSM Combed Cotton",
  },
  {
    slug: "sunstrike-coord",
    kind: "cropped-hoodie",
    body: "#e9c05c",
    shade: "#c99f3f",
    ink: "#1b1a16",
    frontPrint: "mark-chest",
    tag: "NEW",
    tagTone: "accent",
    spec: "Cropped Co-ord · 380 GSM French Terry",
  },
  {
    slug: "open-invite-dress",
    kind: "dress",
    body: "#f4f1ea",
    shade: "#d9d3c4",
    ink: "#1b1a16",
    tag: "BOUTIQUE",
    tagTone: "accent",
    spec: "Relaxed A-line · 100% Cotton Poplin",
  },
  {
    slug: "low-volume-tee-chalk",
    kind: "tee",
    body: "#f1ede3",
    shade: "#d6d0c0",
    ink: "#6e2a35",
    frontPrint: "mark-chest",
    backPrint: "crowd-back",
    tag: "ONLY 3 LEFT",
    tagTone: "accent",
    spec: "Boxy Fit · 240 GSM Combed Cotton",
  },
  {
    slug: "oat-crew",
    kind: "crew",
    body: "#ddd3bd",
    shade: "#c0b59a",
    ink: "#1b1a16",
    backPrint: "arc-back",
    tag: "SMALL BATCH",
    tagTone: "ink",
    spec: "Relaxed Fit · 400 GSM Loopback Terry",
  },
];
