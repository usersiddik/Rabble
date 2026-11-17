import { badgeLabel, getGarment, type Garment } from "@/content/garments";
import type { TagTone } from "@/components/GarmentRender";

/**
 * The hero rack lineups: catalogue pieces in rail order, one lineup per filter
 * (All · Men · Women). Colours, prints and prices all come from
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

export type RackFilter = "all" | "men" | "women";

export interface RackLineup {
  pieces: RackPiece[];
  /** index of the piece the rack opens on */
  start: number;
}

/** rail copy per piece: fit + fabric line, and an optional neck tag */
const COPY: Record<string, { spec: string; tag?: string }> = {
  "static-hoodie": { spec: "Relaxed Fit · 450 GSM Brushed Fleece" },
  "low-volume-tee": { spec: "Boxy Fit · 240 GSM Combed Cotton", tag: "240 GSM" },
  "reprint-tee-01": { spec: "Regular Fit · 220 GSM Combed Cotton" },
  "sunstrike-crop-hood": { spec: "Cropped Fit · 380 GSM French Terry" },
  "loud-minority-crew": { spec: "Regular Fit · 400 GSM Loopback Terry", tag: "Run of 200" },
  "low-volume-tee-alabaster": { spec: "Boxy Fit · 240 GSM Combed Cotton", tag: "Women's cut" },
  "oat-crew": { spec: "Relaxed Fit · 400 GSM Loopback Terry", tag: "Small batch" },
  "second-shift-trucker": { spec: "Classic Fit · 14 oz Unwashed Denim" },
  "half-day-bomber": { spec: "Cropped Fit · Matte Nylon Shell" },
  "open-invite-tee": { spec: "Boxy Fit · 240 GSM Combed Cotton" },
};

/** printed tees in the middle, heavyweights at the ends; `start` is the piece the rail opens on */
const LINEUPS: Record<RackFilter, { slugs: string[]; start: string }> = {
  all: {
    slugs: ["static-hoodie", "low-volume-tee", "reprint-tee-01", "sunstrike-crop-hood", "loud-minority-crew", "low-volume-tee-alabaster", "oat-crew"],
    start: "reprint-tee-01",
  },
  men: {
    slugs: ["second-shift-trucker", "static-hoodie", "low-volume-tee", "reprint-tee-01", "oat-crew", "half-day-bomber"],
    start: "reprint-tee-01",
  },
  women: {
    slugs: ["loud-minority-crew", "sunstrike-crop-hood", "open-invite-tee", "low-volume-tee-alabaster"],
    start: "sunstrike-crop-hood",
  },
};

function lineup({ slugs, start }: { slugs: string[]; start: string }): RackLineup {
  const pieces = slugs.map((slug) => {
    const garment = getGarment(slug);
    if (!garment) throw new Error(`Rack piece "${slug}" is not in the catalogue`);
    if (garment.status !== "live") throw new Error(`Rack piece "${slug}" is not live`);
    const copy = COPY[slug];
    if (!copy) throw new Error(`Rack piece "${slug}" has no rail copy`);
    return {
      garment,
      spec: copy.spec,
      tag: copy.tag ?? badgeLabel(garment),
      tagTone: (garment.badge === "new" ? "terracotta" : garment.badge === "waitlist" ? "cobalt" : "carbon") as TagTone,
    };
  });
  return { pieces, start: Math.max(0, slugs.indexOf(start)) };
}

export const RACKS: Record<RackFilter, RackLineup> = {
  all: lineup(LINEUPS.all),
  men: lineup(LINEUPS.men),
  women: lineup(LINEUPS.women),
};
