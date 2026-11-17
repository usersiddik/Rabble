/**
 * ────────────────────────────────────────────────────────────────────────────
 * RABBLE PRODUCT CATALOG — single source of truth.
 *
 * To swap in final production photography:
 *   1. Drop studio-isolated, transparent-background cutouts into
 *      /public/garments  (e.g. reprint-tee-01-front.webp)
 *   2. Update ONLY the frontImage / backImage / sideImage paths below.
 * Nothing else in the codebase references image files directly.
 * ────────────────────────────────────────────────────────────────────────────
 */

export type Category = "printed-tee" | "womens-boutique";
export type Badge = "ONLY 3 LEFT" | "NEW" | "-20%" | "240 GSM";

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  compareAt?: number;
  badge?: Badge;
  category: Category;
  frontImage: string;
  backImage: string;
  sideImage: string;
  printSpecs?: string[];
  fabricSpecs: string[];
  newThisWeek?: boolean;
}

const g = (file: string) => `/garments/${file}`;

export const products: Product[] = [
  {
    id: "p1",
    slug: "static-tee-02",
    name: "Static Tee 02",
    subtitle: "Oversized fit · Washed Black / Bone · 240 GSM",
    price: 1499,
    badge: "ONLY 3 LEFT",
    category: "printed-tee",
    frontImage: g("static-tee-02-front.webp"),
    backImage: g("static-tee-02-back.webp"),
    sideImage: g("static-tee-02-side.webp"),
    printSpecs: ["HD Screen Print", "Front chest + full back", "Soft-hand white ink"],
    fabricSpecs: ["240 GSM combed cotton", "Oversized drop shoulder", "Pre-shrunk, bio-washed"],
    newThisWeek: true,
  },
  {
    id: "p2",
    slug: "motive-tee-03",
    name: "Motive Tee 03",
    subtitle: "Oversized fit · Ecru / Rust · 240 GSM",
    price: 1699,
    compareAt: 2124,
    badge: "-20%",
    category: "printed-tee",
    frontImage: g("motive-tee-03-front.webp"),
    backImage: g("motive-tee-03-back.webp"),
    sideImage: g("motive-tee-03-side.webp"),
    printSpecs: ["Puff Ink", "Dimensional front + back hit", "2-colour registration"],
    fabricSpecs: ["240 GSM combed cotton", "Oversized boxy cut", "Ribbed collar"],
  },
  {
    id: "p3",
    slug: "drape-coord-01",
    name: "Drape Co-ord 01",
    subtitle: "Relaxed drape · Alabaster · Boutique tailoring",
    price: 3299,
    badge: "NEW",
    category: "womens-boutique",
    frontImage: g("drape-coord-01-front.webp"),
    backImage: g("drape-coord-01-back.webp"),
    sideImage: g("drape-coord-01-side.webp"),
    fabricSpecs: ["Viscose-linen blend", "Kimono sleeve, longline", "Matching wide-leg set"],
    newThisWeek: true,
  },
  {
    id: "p4",
    slug: "reprint-tee-01",
    name: "Reprint Tee 01",
    subtitle: "Oversized fit · Bone / Cobalt · 240 GSM",
    price: 1599,
    badge: "240 GSM",
    category: "printed-tee",
    frontImage: g("reprint-tee-01-front.webp"),
    backImage: g("reprint-tee-01-back.webp"),
    sideImage: g("reprint-tee-01-side.webp"),
    printSpecs: ["HD Screen Print", "Cobalt one-run print", "Front stamp + full back"],
    fabricSpecs: ["240 GSM combed cotton", "Oversized drop shoulder", "Double-stitched hems"],
    newThisWeek: true,
  },
  {
    id: "p5",
    slug: "chorus-tee-04",
    name: "Chorus Tee 04",
    subtitle: "Oversized fit · Olive / Cream · 240 GSM",
    price: 1599,
    badge: "NEW",
    category: "printed-tee",
    frontImage: g("chorus-tee-04-front.webp"),
    backImage: g("chorus-tee-04-back.webp"),
    sideImage: g("chorus-tee-04-side.webp"),
    printSpecs: ["HD Screen Print", "Typographic stack, full back", "Cream single-hit"],
    fabricSpecs: ["240 GSM combed cotton", "Oversized boxy cut", "Garment-dyed olive"],
    newThisWeek: true,
  },
  {
    id: "p6",
    slug: "sandstone-slip",
    name: "Sandstone Slip Dress",
    subtitle: "Bias cut · Sandstone · Boutique tailoring",
    price: 2899,
    badge: "ONLY 3 LEFT",
    category: "womens-boutique",
    frontImage: g("sandstone-slip-front.webp"),
    backImage: g("sandstone-slip-back.webp"),
    sideImage: g("sandstone-slip-side.webp"),
    fabricSpecs: ["Cupro-satin drape", "Bias cut, midi length", "Adjustable straps"],
  },
  {
    id: "p7",
    slug: "clay-column",
    name: "Clay Column Dress",
    subtitle: "Column drape · Clay · Boutique tailoring",
    price: 3499,
    compareAt: 4374,
    badge: "-20%",
    category: "womens-boutique",
    frontImage: g("clay-column-front.webp"),
    backImage: g("clay-column-back.webp"),
    sideImage: g("clay-column-side.webp"),
    fabricSpecs: ["Heavy crepe, fluid fall", "Boat neck column", "Side seam pockets"],
  },
];

/** Default active garment on the rack (visual centre of the 7). */
export const DEFAULT_ACTIVE_SLUG = "reprint-tee-01";

export const SIZES = ["XS", "S", "M", "L", "XL"] as const;

export const byCategory = (c: Category) => products.filter((p) => p.category === c);
export const bySlug = (slug: string) => products.find((p) => p.slug === slug);
export const newThisWeek = () => products.filter((p) => p.newThisWeek);

export const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;
