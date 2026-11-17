/**
 * The catalogue. Typed so real products drop in later without touching components.
 *
 * Every garment carries:
 *  - `art`         an illustrated front/back fallback (drawn by <GarmentArt />)
 *  - `frontImage`, `backImage`, `sidePreview`
 *                  optional photography slots. When present, <GarmentCutout /> renders
 *                  the photo instead of the illustration — nothing else changes.
 *  - `print`       the print spec block shown on the product page (ink, GSM, placement in cm)
 */

import type { GarmentColors, GarmentKind } from "@/components/GarmentArt";

export type Gender = "men" | "women" | "all";
export type Category = "Tees" | "Sweats & Hoods" | "Jackets";
export type GarmentStatus = "live" | "waitlist" | "sold-out";
export type Side = "front" | "back";

/** The artwork that goes on the garment. Rendered by <GarmentArt /> in the illustrated fallback. */
export type PrintMark =
  | { type: "wordmark"; text: string }
  | { type: "lines"; lines: string[] }
  | { type: "bars"; seed: number }
  | { type: "stamp"; text: string };

export interface Placement {
  mark: PrintMark;
  position: "chest-left" | "chest-center" | "upper-back" | "full-back" | "nape";
  widthCm: number;
  heightCm: number;
  /** distance from the collar seam to the top of the print */
  fromCollarCm: number;
}

export interface PrintSpec {
  method: "Water-based screen print" | "Discharge screen print" | "Plastisol screen print";
  inkName: string;
  /** hex used by the illustration */
  inkHex: string;
  gsm: number;
  fabric: string;
  front?: Placement;
  back?: Placement;
}

export interface Garment {
  slug: string;
  name: string;
  color: string;
  price: number;
  compareAt?: number;
  category: Category;
  gender: Gender;
  /** drop chapter */
  drop: 1 | 2;
  status: GarmentStatus;
  /** pieces printed in this run */
  runSize: number;
  /** ordering within the catalogue: higher = newer */
  order: number;
  art: { kind: GarmentKind; colors: GarmentColors };
  frontImage?: string;
  backImage?: string;
  sidePreview?: string;
  print: PrintSpec;
  description: string;
  fit: string;
  sizes: string[];
  badge?: "new" | "low-stock" | "sale" | "waitlist";
  stockNote?: string;
}

const APPAREL = ["XS", "S", "M", "L", "XL", "XXL"];

const INK = {
  alabaster: { inkName: "Alabaster", inkHex: "#f6f5f0" },
  carbon: { inkName: "Carbon", inkHex: "#111111" },
  terracotta: { inkName: "Terracotta", inkHex: "#b0451f" },
  cobalt: { inkName: "Cobalt", inkHex: "#1f3fd9" },
} as const;

const JERSEY_240 = "100% combed cotton jersey, 240 GSM, pre-shrunk";
const JERSEY_220 = "100% combed cotton jersey, 220 GSM, enzyme washed";
const FLEECE_450 = "80% cotton / 20% recycled polyester brushed fleece, 450 GSM";
const TERRY_400 = "100% cotton loopback terry, 400 GSM, garment dyed";
const TERRY_380 = "100% cotton French terry, 380 GSM, garment dyed";
const DENIM_14 = "100% cotton 14 oz denim, unwashed";
const NYLON = "Matte nylon shell, recycled fill, 2-way zip";

export const garments: Garment[] = [
  /* ————————————————————— Drop 01 · live ————————————————————— */
  {
    slug: "static-hoodie",
    name: "Static Hoodie",
    color: "Heather Grey",
    price: 2699,
    compareAt: 3399,
    category: "Sweats & Hoods",
    gender: "men",
    drop: 1,
    status: "live",
    runSize: 300,
    order: 1,
    art: { kind: "hoodie", colors: { body: "#aeaca5", shade: "#8f8d86" } },
    print: {
      method: "Water-based screen print",
      ...INK.carbon,
      gsm: 450,
      fabric: FLEECE_450,
      front: { mark: { type: "bars", seed: 7 }, position: "chest-left", widthCm: 8, heightCm: 3, fromCollarCm: 9 },
      back: { mark: { type: "bars", seed: 7 }, position: "full-back", widthCm: 30, heightCm: 12, fromCollarCm: 14 },
    },
    description:
      "The hoodie you reach for without thinking. A small signal on the chest, the whole broadcast across the back. 450 GSM brushed fleece, dropped shoulders, a hood that actually stays up.",
    fit: "Relaxed. Drops one size roomier than standard — size down for a closer fit.",
    sizes: APPAREL,
    badge: "sale",
  },
  {
    slug: "low-volume-tee",
    name: "Low Volume Tee",
    color: "Carbon",
    price: 1299,
    category: "Tees",
    gender: "men",
    drop: 1,
    status: "live",
    runSize: 400,
    order: 2,
    art: { kind: "tee", colors: { body: "#1c1c1c", shade: "#0d0d0d" } },
    print: {
      method: "Discharge screen print",
      ...INK.alabaster,
      gsm: 240,
      fabric: JERSEY_240,
      front: { mark: { type: "lines", lines: ["RBL"] }, position: "chest-left", widthCm: 4, heightCm: 1.5, fromCollarCm: 8 },
      back: { mark: { type: "lines", lines: ["LOW", "VOLUME"] }, position: "upper-back", widthCm: 12, heightCm: 5, fromCollarCm: 6 },
    },
    description:
      "The quietest thing we make. A three-letter whisper on the chest, a two-word statement between the shoulder blades. Boxy, heavyweight, and the tee everything else gets layered over.",
    fit: "Boxy, cropped slightly at the hem. True to size.",
    sizes: APPAREL,
  },
  {
    slug: "low-volume-tee-alabaster",
    name: "Low Volume Tee",
    color: "Alabaster",
    price: 1299,
    category: "Tees",
    gender: "women",
    drop: 1,
    status: "live",
    runSize: 400,
    order: 3,
    art: { kind: "tee", colors: { body: "#f1efe8", shade: "#d9d6cc" } },
    print: {
      method: "Water-based screen print",
      ...INK.carbon,
      gsm: 240,
      fabric: JERSEY_240,
      front: { mark: { type: "lines", lines: ["RBL"] }, position: "chest-left", widthCm: 4, heightCm: 1.5, fromCollarCm: 8 },
      back: { mark: { type: "lines", lines: ["LOW", "VOLUME"] }, position: "upper-back", widthCm: 12, heightCm: 5, fromCollarCm: 6 },
    },
    description:
      "Same heavyweight tee, cut for her. Boxy through the body, clean at the neck, and the back print sits exactly where a ponytail ends.",
    fit: "Boxy, slightly cropped. True to size.",
    sizes: APPAREL,
  },
  {
    slug: "reprint-tee-01",
    name: "Reprint Tee 01",
    color: "Bone / Cobalt",
    price: 1599,
    category: "Tees",
    gender: "men",
    drop: 1,
    status: "live",
    runSize: 250,
    order: 9,
    art: { kind: "tee", colors: { body: "#e8e0cd", shade: "#cfc5ac" } },
    print: {
      method: "Water-based screen print",
      ...INK.cobalt,
      gsm: 220,
      fabric: JERSEY_220,
      front: { mark: { type: "stamp", text: "RABBLE · ONE RUN · 01" }, position: "chest-left", widthCm: 7, heightCm: 7, fromCollarCm: 7 },
      back: { mark: { type: "wordmark", text: "RBL" }, position: "full-back", widthCm: 32, heightCm: 16, fromCollarCm: 12 },
    },
    description:
      "First in a series of one-run prints. A stamp on the chest, three letters the size of a billboard across the back. When these sell through, the screens are destroyed. No restocks, no apologies.",
    fit: "Regular with room through the chest. True to size.",
    sizes: APPAREL,
    badge: "new",
  },
  {
    slug: "oat-crew",
    name: "Oat Crew",
    color: "Oat",
    price: 2299,
    category: "Sweats & Hoods",
    gender: "men",
    drop: 1,
    status: "live",
    runSize: 300,
    order: 4,
    art: { kind: "crew", colors: { body: "#ddd3bd", shade: "#c2b79d" } },
    print: {
      method: "Water-based screen print",
      ...INK.terracotta,
      gsm: 400,
      fabric: TERRY_400,
      front: { mark: { type: "lines", lines: ["RABBLE", "BLR · 2026"] }, position: "chest-center", widthCm: 14, heightCm: 5, fromCollarCm: 10 },
      back: { mark: { type: "bars", seed: 3 }, position: "upper-back", widthCm: 18, heightCm: 6, fromCollarCm: 7 },
    },
    description:
      "A crewneck in the colour of a slow morning, with terracotta ink that gets softer every wash. Heavy loopback terry, raglan sleeves, and the city on the chest.",
    fit: "Relaxed with a cinched hem. True to size.",
    sizes: APPAREL,
  },
  {
    slug: "second-shift-trucker",
    name: "Second Shift Trucker",
    color: "Indigo",
    price: 3799,
    category: "Jackets",
    gender: "men",
    drop: 1,
    status: "live",
    runSize: 150,
    order: 10,
    art: { kind: "trucker", colors: { body: "#2e3f63", shade: "#1f2c48", detail: "#b78e5a" } },
    print: {
      method: "Plastisol screen print",
      ...INK.alabaster,
      gsm: 475,
      fabric: DENIM_14,
      back: { mark: { type: "lines", lines: ["SECOND", "SHIFT"] }, position: "full-back", widthCm: 30, heightCm: 14, fromCollarCm: 13 },
    },
    description:
      "A 14 oz denim trucker with a corduroy collar and two words across the back for the hours after the workday ends. Breaks in like a rumour — slowly, then everywhere.",
    fit: "Classic trucker, squared through the shoulder. Size up to layer over knits.",
    sizes: APPAREL,
    badge: "new",
  },
  {
    slug: "half-day-bomber",
    name: "Half Day Bomber",
    color: "Clay",
    price: 3499,
    category: "Jackets",
    gender: "men",
    drop: 1,
    status: "live",
    runSize: 120,
    order: 8,
    art: { kind: "bomber", colors: { body: "#b06c43", shade: "#8e5431" } },
    print: {
      method: "Plastisol screen print",
      ...INK.alabaster,
      gsm: 180,
      fabric: NYLON,
      front: { mark: { type: "lines", lines: ["½"] }, position: "chest-left", widthCm: 3, heightCm: 3, fromCollarCm: 9 },
      back: { mark: { type: "stamp", text: "HALF DAY · RABBLE · BLR" }, position: "upper-back", widthCm: 16, heightCm: 16, fromCollarCm: 8 },
    },
    description:
      "A matte nylon bomber in burnt clay with a stamp between the shoulders. Light enough for October, loud enough for the group photo.",
    fit: "Cropped at the hip, full through the body. True to size.",
    sizes: APPAREL,
    badge: "low-stock",
    stockNote: "Only 3 left",
  },
  {
    slug: "sunstrike-crop-hood",
    name: "Sunstrike Crop Hood",
    color: "Turmeric",
    price: 2899,
    category: "Sweats & Hoods",
    gender: "women",
    drop: 1,
    status: "live",
    runSize: 200,
    order: 10,
    art: { kind: "cropped-hoodie", colors: { body: "#e9c05c", shade: "#caa041" } },
    print: {
      method: "Water-based screen print",
      ...INK.carbon,
      gsm: 380,
      fabric: TERRY_380,
      front: { mark: { type: "lines", lines: ["SUN", "STRIKE"] }, position: "chest-center", widthCm: 10, heightCm: 5, fromCollarCm: 9 },
      back: { mark: { type: "wordmark", text: "SUNSTRIKE" }, position: "full-back", widthCm: 28, heightCm: 6, fromCollarCm: 12 },
    },
    description:
      "A cropped hood in full-volume turmeric. Two words on the chest, one long one across the back. Own the courtyard.",
    fit: "Cropped, relaxed through the shoulder. True to size.",
    sizes: APPAREL,
    badge: "new",
  },
  {
    slug: "loud-minority-crew",
    name: "Loud Minority Crew",
    color: "Terracotta",
    price: 2299,
    category: "Sweats & Hoods",
    gender: "women",
    drop: 1,
    status: "live",
    runSize: 200,
    order: 6,
    art: { kind: "crew", colors: { body: "#b0451f", shade: "#8f3717" } },
    print: {
      method: "Water-based screen print",
      ...INK.alabaster,
      gsm: 400,
      fabric: TERRY_400,
      front: { mark: { type: "lines", lines: ["LOUD"] }, position: "chest-left", widthCm: 6, heightCm: 2, fromCollarCm: 8 },
      back: { mark: { type: "lines", lines: ["LOUD", "MINORITY"] }, position: "full-back", widthCm: 28, heightCm: 12, fromCollarCm: 14 },
    },
    description:
      "A crewneck in our terracotta for people with opinions. One word on the chest, two across the back. Warm enough to outlast the argument.",
    fit: "Regular with a cinched hem. True to size.",
    sizes: APPAREL,
  },
  {
    slug: "open-invite-tee",
    name: "Open Invite Tee",
    color: "Cobalt",
    price: 1499,
    category: "Tees",
    gender: "women",
    drop: 1,
    status: "live",
    runSize: 300,
    order: 5,
    art: { kind: "tee", colors: { body: "#1f3fd9", shade: "#162fa8" } },
    print: {
      method: "Water-based screen print",
      ...INK.alabaster,
      gsm: 240,
      fabric: JERSEY_240,
      front: { mark: { type: "stamp", text: "OPEN INVITE · RABBLE" }, position: "chest-left", widthCm: 6, heightCm: 6, fromCollarCm: 7 },
      back: { mark: { type: "bars", seed: 11 }, position: "upper-back", widthCm: 20, heightCm: 7, fromCollarCm: 7 },
    },
    description:
      "Cobalt jersey with an alabaster stamp. The tee that says yes before you do. Boxy, heavyweight, pockets of noise across the shoulders.",
    fit: "Boxy, slightly cropped. True to size.",
    sizes: APPAREL,
  },

  /* ————————————————————— Drop 02 · waitlist ————————————————————— */
  {
    slug: "static-hoodie-cobalt",
    name: "Static Hoodie",
    color: "Cobalt",
    price: 2899,
    category: "Sweats & Hoods",
    gender: "men",
    drop: 2,
    status: "waitlist",
    runSize: 240,
    order: 20,
    art: { kind: "hoodie", colors: { body: "#1f3fd9", shade: "#162fa8" } },
    print: {
      method: "Water-based screen print",
      ...INK.alabaster,
      gsm: 450,
      fabric: FLEECE_450,
      front: { mark: { type: "bars", seed: 19 }, position: "chest-left", widthCm: 8, heightCm: 3, fromCollarCm: 9 },
      back: { mark: { type: "bars", seed: 19 }, position: "full-back", widthCm: 30, heightCm: 12, fromCollarCm: 14 },
    },
    description:
      "The Static, re-cut in cobalt with alabaster ink. Same fleece, same hood, louder signal.",
    fit: "Relaxed. Size down for a closer fit.",
    sizes: APPAREL,
    badge: "waitlist",
  },
  {
    slug: "reprint-tee-02",
    name: "Reprint Tee 02",
    color: "Alabaster / Terracotta",
    price: 1599,
    category: "Tees",
    gender: "men",
    drop: 2,
    status: "waitlist",
    runSize: 250,
    order: 21,
    art: { kind: "tee", colors: { body: "#f1efe8", shade: "#d9d6cc" } },
    print: {
      method: "Water-based screen print",
      ...INK.terracotta,
      gsm: 220,
      fabric: JERSEY_220,
      front: { mark: { type: "stamp", text: "RABBLE · ONE RUN · 02" }, position: "chest-left", widthCm: 7, heightCm: 7, fromCollarCm: 7 },
      back: { mark: { type: "wordmark", text: "02" }, position: "full-back", widthCm: 30, heightCm: 18, fromCollarCm: 11 },
    },
    description:
      "Second in the one-run series. Terracotta on alabaster, a number on the back large enough to be read from the next platform over.",
    fit: "Regular with room through the chest. True to size.",
    sizes: APPAREL,
    badge: "waitlist",
  },
  {
    slug: "night-shift-trucker",
    name: "Night Shift Trucker",
    color: "Carbon",
    price: 3999,
    category: "Jackets",
    gender: "men",
    drop: 2,
    status: "waitlist",
    runSize: 120,
    order: 22,
    art: { kind: "trucker", colors: { body: "#1c1c1c", shade: "#0d0d0d", detail: "#3d3d3d" } },
    print: {
      method: "Plastisol screen print",
      ...INK.alabaster,
      gsm: 475,
      fabric: DENIM_14,
      back: { mark: { type: "lines", lines: ["NIGHT", "SHIFT"] }, position: "full-back", widthCm: 30, heightCm: 14, fromCollarCm: 13 },
    },
    description:
      "The Second Shift's sibling, overdyed to carbon with a tonal collar. Alabaster across the back for the hours nobody is supposed to be awake.",
    fit: "Classic trucker, squared through the shoulder. Size up to layer.",
    sizes: APPAREL,
    badge: "waitlist",
  },
  {
    slug: "echo-crew",
    name: "Echo Crew",
    color: "Steel",
    price: 2399,
    category: "Sweats & Hoods",
    gender: "men",
    drop: 2,
    status: "waitlist",
    runSize: 200,
    order: 23,
    art: { kind: "crew", colors: { body: "#8e8e93", shade: "#6f6f74" } },
    print: {
      method: "Discharge screen print",
      ...INK.alabaster,
      gsm: 400,
      fabric: TERRY_400,
      front: { mark: { type: "lines", lines: ["ECHO"] }, position: "chest-center", widthCm: 8, heightCm: 2.5, fromCollarCm: 10 },
      back: { mark: { type: "lines", lines: ["ECHO", "ECHO", "ECHO"] }, position: "full-back", widthCm: 24, heightCm: 16, fromCollarCm: 12 },
    },
    description:
      "One word on the chest. The same word three times down the back, fading as it goes. Loopback terry in steel grey.",
    fit: "Relaxed with a cinched hem. True to size.",
    sizes: APPAREL,
    badge: "waitlist",
  },
  {
    slug: "feedback-tee",
    name: "Feedback Tee",
    color: "Carbon / Terracotta",
    price: 1499,
    category: "Tees",
    gender: "women",
    drop: 2,
    status: "waitlist",
    runSize: 300,
    order: 24,
    art: { kind: "tee", colors: { body: "#1c1c1c", shade: "#0d0d0d" } },
    print: {
      method: "Water-based screen print",
      ...INK.terracotta,
      gsm: 240,
      fabric: JERSEY_240,
      front: { mark: { type: "bars", seed: 23 }, position: "chest-left", widthCm: 7, heightCm: 2.5, fromCollarCm: 8 },
      back: { mark: { type: "wordmark", text: "FEEDBACK" }, position: "full-back", widthCm: 28, heightCm: 7, fromCollarCm: 13 },
    },
    description:
      "Carbon jersey, terracotta ink. A sliver of signal on the chest, the full word across the shoulders.",
    fit: "Boxy, slightly cropped. True to size.",
    sizes: APPAREL,
    badge: "waitlist",
  },
  {
    slug: "crowd-control-crop-hood",
    name: "Crowd Control Crop Hood",
    color: "Alabaster",
    price: 2899,
    category: "Sweats & Hoods",
    gender: "women",
    drop: 2,
    status: "waitlist",
    runSize: 180,
    order: 25,
    art: { kind: "cropped-hoodie", colors: { body: "#f1efe8", shade: "#d9d6cc" } },
    print: {
      method: "Water-based screen print",
      ...INK.cobalt,
      gsm: 380,
      fabric: TERRY_380,
      front: { mark: { type: "lines", lines: ["CROWD", "CONTROL"] }, position: "chest-center", widthCm: 10, heightCm: 5, fromCollarCm: 9 },
      back: { mark: { type: "stamp", text: "CROWD CONTROL · RABBLE" }, position: "upper-back", widthCm: 18, heightCm: 18, fromCollarCm: 7 },
    },
    description:
      "An alabaster crop hood with cobalt ink. Two words on the chest, a stamp between the shoulder blades. Takes charge of the queue.",
    fit: "Cropped, relaxed through the shoulder. True to size.",
    sizes: APPAREL,
    badge: "waitlist",
  },
];

export const categories: Category[] = ["Tees", "Sweats & Hoods", "Jackets"];

export function getGarment(slug: string): Garment | undefined {
  return garments.find((g) => g.slug === slug);
}

export function byGender(gender: "men" | "women"): Garment[] {
  return garments.filter((g) => g.gender === gender || g.gender === "all");
}

export function byDrop(drop: 1 | 2): Garment[] {
  return garments.filter((g) => g.drop === drop);
}

export function liveGarments(): Garment[] {
  return garments.filter((g) => g.status === "live");
}

export function waitlistGarments(): Garment[] {
  return garments.filter((g) => g.status === "waitlist");
}

export function newArrivals(): Garment[] {
  return [...garments].sort((a, b) => b.order - a.order);
}

/** "Runs in the same crowd": same category first, then same gender. */
export function related(garment: Garment, count = 4): Garment[] {
  const pool = garments.filter((g) => g.slug !== garment.slug);
  const sameCat = pool.filter((g) => g.category === garment.category);
  const sameGender = pool.filter(
    (g) => g.category !== garment.category && (g.gender === garment.gender || g.gender === "all"),
  );
  return [...sameCat, ...sameGender].slice(0, count);
}

export function hasSide(garment: Garment, side: Side): boolean {
  return side === "front" ? true : Boolean(garment.print.back || garment.backImage);
}

export function formatINR(value: number): string {
  return "₹" + value.toLocaleString("en-IN");
}

export const SIZE_GUIDE = [
  { size: "XS", chest: "86–91", waist: "71–76", length: "66" },
  { size: "S", chest: "91–96", waist: "76–81", length: "68" },
  { size: "M", chest: "96–101", waist: "81–86", length: "70" },
  { size: "L", chest: "101–109", waist: "86–94", length: "72" },
  { size: "XL", chest: "109–117", waist: "94–102", length: "74" },
  { size: "XXL", chest: "117–125", waist: "102–110", length: "76" },
];
