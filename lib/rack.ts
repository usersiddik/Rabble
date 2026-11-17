import { badgeLabel, getGarment, type Garment } from "@/content/garments";
import type { TagTone } from "@/components/GarmentRender";

/**
 * The hero rack lineup: seven catalogue pieces — printed tees in the middle,
 * heavyweights at the ends. Colours, prints and prices all come from
 * `content/garments.ts`; this file only picks the order and the rail copy.
 */
export interface RackPiece {
  garment: Garment;
  /** neck-tag copy; defaults to the garment's badge */
  tag?: string;
  tagTone: TagTone;
  /** short fit + fabric line shown under the active garment */
  spec: string;
}

const LINEUP: { slug: string; spec: string; tag?: string }[] = [
  { slug: "static-hoodie", spec: "Relaxed Fit · 450 GSM Brushed Fleece" },
  { slug: "low-volume-tee", spec: "Boxy Fit · 240 GSM Combed Cotton", tag: "240 GSM" },
  { slug: "reprint-tee-01", spec: "Regular Fit · 220 GSM Combed Cotton" },
  { slug: "sunstrike-crop-hood", spec: "Cropped Fit · 380 GSM French Terry" },
  { slug: "loud-minority-crew", spec: "Regular Fit · 400 GSM Loopback Terry", tag: "Run of 200" },
  { slug: "low-volume-tee-alabaster", spec: "Boxy Fit · 240 GSM Combed Cotton", tag: "Women's cut" },
  { slug: "oat-crew", spec: "Relaxed Fit · 400 GSM Loopback Terry", tag: "Small batch" },
];

export const RACK: RackPiece[] = LINEUP.map(({ slug, spec, tag }) => {
  const garment = getGarment(slug);
  if (!garment) throw new Error(`Rack piece "${slug}" is not in the catalogue`);
  return {
    garment,
    spec,
    tag: tag ?? badgeLabel(garment),
    tagTone: garment.badge === "new" ? "terracotta" : garment.badge === "waitlist" ? "cobalt" : "carbon",
  };
});

/** the piece the rack opens on */
export const RACK_START = RACK.findIndex((p) => p.garment.slug === "reprint-tee-01");
