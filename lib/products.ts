export type Gender = "men" | "women" | "all";

export type Category =
  | "Tees"
  | "Sweats & Hoods"
  | "Jackets"
  | "Bottoms"
  | "Knitwear"
  | "Dresses & Sets"
  | "Accessories";

export interface Product {
  slug: string;
  name: string;
  color: string;
  price: number;
  compareAt?: number;
  category: Category;
  gender: Gender;
  images: string[];
  description: string;
  fabric: string;
  fit: string;
  sizes: string[];
  badge?: "new" | "low-stock" | "sale";
  stockNote?: string;
  /** ordering: higher = newer */
  drop: number;
}

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format`;

const APPAREL = ["XS", "S", "M", "L", "XL", "XXL"];
const ONE_SIZE = ["One size"];

export const products: Product[] = [
  {
    slug: "static-hoodie",
    name: "Static Hoodie",
    color: "Heather Grey",
    price: 2699,
    compareAt: 3399,
    category: "Sweats & Hoods",
    gender: "men",
    images: [img("1556821840-3a63f95609a7"), img("1620799140188-3b2a02fd9a77")],
    description:
      "The hoodie you reach for without thinking. 450 GSM brushed fleece, dropped shoulders, and a hood that actually stays up.",
    fabric: "80% cotton, 20% recycled polyester fleece, 450 GSM. Pre-shrunk, garment washed.",
    fit: "Relaxed. Drops one size roomier than standard — size down for a closer fit.",
    sizes: APPAREL,
    badge: "sale",
    drop: 1,
  },
  {
    slug: "low-volume-tee",
    name: "Low Volume Tee",
    color: "Ink",
    price: 1299,
    category: "Tees",
    gender: "men",
    images: [
      img("1618354691373-d851c5c3a990"),
      img("1583743814966-8936f5b7be1a"),
      img("1521572163474-6864f9cf17ab"),
    ],
    description:
      "A boxy heavyweight tee with no graphics, no slogans, no noise. Sometimes the quietest thing in the room wins.",
    fabric: "100% combed cotton jersey, 240 GSM. Ribbed collar that holds its shape past wash fifty.",
    fit: "Boxy, cropped slightly at the hem. True to size.",
    sizes: APPAREL,
    drop: 2,
  },
  {
    slug: "low-volume-tee-chalk",
    name: "Low Volume Tee",
    color: "Chalk",
    price: 1299,
    category: "Tees",
    gender: "women",
    images: [img("1529626455594-4ff0802cfb7e"), img("1620799140408-edc6dcb6d633")],
    description:
      "Same heavyweight tee, cut for her. Boxy through the body, clean at the neck, good with everything you own.",
    fabric: "100% combed cotton jersey, 240 GSM. Ribbed collar that holds its shape past wash fifty.",
    fit: "Boxy, slightly cropped. True to size.",
    sizes: APPAREL,
    drop: 2,
  },
  {
    slug: "reprint-tee-01",
    name: "Reprint Tee 01",
    color: "Bone / Cobalt",
    price: 1599,
    category: "Tees",
    gender: "men",
    images: [img("1576566588028-4147f3842f27"), img("1562157873-818bc0726f68")],
    description:
      "First in a series of one-run prints. When these sell through, the artwork is retired. No restocks, no apologies.",
    fabric: "100% combed cotton jersey, 220 GSM. Water-based print, cracks gracefully with age.",
    fit: "Regular with room through the chest. True to size.",
    sizes: APPAREL,
    badge: "new",
    drop: 9,
  },
  {
    slug: "oat-crew",
    name: "Oat Crew",
    color: "Oat",
    price: 2299,
    category: "Sweats & Hoods",
    gender: "men",
    images: [img("1620799140408-edc6dcb6d633"), img("1620799140188-3b2a02fd9a77")],
    description:
      "A crewneck in the colour of a slow morning. Heavy loopback terry, raglan sleeves, zero branding on the outside.",
    fabric: "100% cotton loopback terry, 400 GSM. Garment dyed, so every piece ages its own way.",
    fit: "Relaxed with a cinched hem. True to size.",
    sizes: APPAREL,
    drop: 3,
  },
  {
    slug: "second-shift-trucker",
    name: "Second Shift Trucker",
    color: "Indigo",
    price: 3799,
    category: "Jackets",
    gender: "men",
    images: [img("1611312449408-fcece27cdbb7"), img("1516257984-b1b4d707412e")],
    description:
      "A 14 oz denim trucker with a corduroy collar, built for the hours after the workday ends. Breaks in like a rumour — slowly, then everywhere.",
    fabric: "100% cotton 14 oz denim, unwashed. Corduroy collar, branded shank buttons.",
    fit: "Classic trucker, squared through the shoulder. Size up to layer over knits.",
    sizes: APPAREL,
    badge: "new",
    drop: 10,
  },
  {
    slug: "half-day-bomber",
    name: "Half Day Bomber",
    color: "Clay",
    price: 3499,
    category: "Jackets",
    gender: "men",
    images: [img("1591047139829-d91aecb6caea")],
    description:
      "A matte nylon bomber in burnt clay. Light enough for October, loud enough for the group photo.",
    fabric: "Matte nylon shell, recycled fill. Two-way zip, ribbed collar and cuffs.",
    fit: "Cropped at the hip, full through the body. True to size.",
    sizes: APPAREL,
    badge: "low-stock",
    stockNote: "Only 3 left",
    drop: 8,
  },
  {
    slug: "night-shift-overshirt",
    name: "Night Shift Overshirt",
    color: "Ink",
    price: 2899,
    category: "Jackets",
    gender: "men",
    images: [img("1507680434567-5739c80be1ac")],
    description:
      "Half shirt, half jacket, fully committed. Brushed twill with two chest pockets sized for the things you actually carry.",
    fabric: "100% brushed cotton twill, 320 GSM. Corozo buttons.",
    fit: "Relaxed overshirt cut, hits below the belt. True to size.",
    sizes: APPAREL,
    drop: 4,
  },
  {
    slug: "fence-hopper-jacket",
    name: "Fence Hopper Jacket",
    color: "Black",
    price: 5999,
    category: "Jackets",
    gender: "men",
    images: [
      img("1551028719-00167b16eac5"),
      img("1520975954732-35dd22299614"),
      img("1520975661595-6453be3f7070"),
    ],
    description:
      "Our take on the moto jacket, minus the costume. Soft-handle leather, minimal hardware, cut to move before you think.",
    fabric: "Full-grain sheep leather, cotton drill lining. YKK hardware throughout.",
    fit: "Trim through the body, articulated sleeves. Size up if you're between.",
    sizes: APPAREL,
    drop: 5,
  },
  {
    slug: "blunt-cut-jeans",
    name: "Blunt Cut Jeans",
    color: "Raw Indigo",
    price: 2799,
    category: "Bottoms",
    gender: "men",
    images: [img("1542272604-787c3835535d"), img("1541099649105-f69ad21f3246")],
    description:
      "Straight, raw, and honest. 13.5 oz denim that starts stiff and ends up telling your whole year back to you.",
    fabric: "100% cotton 13.5 oz raw denim. Chain-stitched hems, copper rivets.",
    fit: "Straight leg, mid rise. True to size — raw denim gives about half a size with wear.",
    sizes: ["28", "30", "32", "34", "36"],
    drop: 6,
  },
  {
    slug: "off-grid-cargo",
    name: "Off Grid Cargo",
    color: "Graphite",
    price: 2499,
    category: "Bottoms",
    gender: "men",
    images: [img("1624378439575-d8705ad7ae80")],
    description:
      "Six pockets, zero excuses. A tapered cargo in bonded ripstop that looks sharp enough for places with a dress code.",
    fabric: "Cotton-nylon ripstop with two-way stretch. Bar-tacked at every stress point.",
    fit: "Tapered from the knee, adjustable hem. True to size.",
    sizes: ["28", "30", "32", "34", "36"],
    drop: 7,
  },
  {
    slug: "loud-minority-knit",
    name: "Loud Minority Knit",
    color: "Charcoal",
    price: 2999,
    category: "Knitwear",
    gender: "men",
    images: [img("1506794778202-cad84cf45f1d"), img("1556905055-8f358a7a47b2")],
    description:
      "A chunky shawl-collar knit for people with opinions. Lambswool blend, cable detail, warm enough to outlast the argument.",
    fabric: "60% lambswool, 40% recycled nylon. Hand-linked seams.",
    fit: "Regular with a tall collar. True to size.",
    sizes: APPAREL,
    drop: 3,
  },
  {
    slug: "sunstrike-coord",
    name: "Sunstrike Co-ord",
    color: "Turmeric",
    price: 3999,
    category: "Dresses & Sets",
    gender: "women",
    images: [img("1515886657613-9f3515b0c78f")],
    description:
      "A cropped hood and wide jogger in full-volume turmeric. Wear it together and own the courtyard, or split it and run two outfits a week.",
    fabric: "French terry, 380 GSM, garment dyed. Sold as a set.",
    fit: "Cropped top, relaxed jogger with a deep cuff. True to size.",
    sizes: APPAREL,
    badge: "new",
    drop: 10,
  },
  {
    slug: "blue-hour-trucker",
    name: "Blue Hour Trucker",
    color: "Washed Blue",
    price: 3299,
    category: "Jackets",
    gender: "women",
    images: [img("1517841905240-472988babdf9"), img("1551488831-00ddcb6c6bd3")],
    description:
      "A stonewashed trucker that already feels like it's been yours for years. Boxy, soft, and good over absolutely everything.",
    fabric: "100% cotton 12 oz denim, enzyme stonewashed.",
    fit: "Boxy and cropped. Size up for the borrowed-from-nobody look.",
    sizes: APPAREL,
    drop: 6,
  },
  {
    slug: "longest-day-coat",
    name: "Longest Day Coat",
    color: "Camel",
    price: 4999,
    category: "Jackets",
    gender: "women",
    images: [img("1539533113208-f6df8cc8b543"), img("1512436991641-6745cdb1723f")],
    description:
      "A belted wool coat that does the heavy lifting from first lecture to last train. Clean lines, deep pockets, no fuss.",
    fabric: "70% wool, 30% recycled polyester melton. Fully lined.",
    fit: "Relaxed, mid-calf length, self-belt. True to size.",
    sizes: APPAREL,
    drop: 5,
  },
  {
    slug: "open-invite-dress",
    name: "Open Invite Dress",
    color: "White",
    price: 2199,
    category: "Dresses & Sets",
    gender: "women",
    images: [img("1515372039744-b8f02a3ae446")],
    description:
      "Crisp cotton poplin, off-shoulder, zero structure where it counts. The dress that says yes before you do.",
    fabric: "100% cotton poplin. Elasticated neckline, side pockets. Yes, pockets.",
    fit: "Relaxed A-line, hits above the knee. True to size.",
    sizes: APPAREL,
    drop: 4,
  },
  {
    slug: "small-hours-dress",
    name: "Small Hours Dress",
    color: "Mist Blue",
    price: 2799,
    category: "Dresses & Sets",
    gender: "women",
    images: [img("1539008835657-9e8e9680c956")],
    description:
      "A floor-skimming wrap dress in washed mist blue. Cut on the bias so it moves half a second after you do.",
    fabric: "Viscose crepe, bias cut. Adjustable wrap tie.",
    fit: "Wrap silhouette, deep V, full-length. True to size.",
    sizes: APPAREL,
    drop: 7,
  },
  {
    slug: "fringe-benefits-knit",
    name: "Fringe Benefits Knit",
    color: "Cream",
    price: 2599,
    category: "Knitwear",
    gender: "women",
    images: [img("1434389677669-e08b4cac3105")],
    description:
      "A fringed knit poncho that splits the difference between blanket and outfit. Airport-proof, bonfire-approved.",
    fabric: "Cotton-acrylic blend, loose gauge knit. Hand-finished fringe.",
    fit: "One size, draped. Covers a multitude of decisions.",
    sizes: ONE_SIZE,
    drop: 2,
  },
  {
    slug: "stone-cap",
    name: "Stone Cap",
    color: "Stone",
    price: 899,
    category: "Accessories",
    gender: "all",
    images: [img("1575428652377-a2d80e2277fc"), img("1622445275576-721325763afe")],
    description:
      "A six-panel cap in washed stone canvas. Low profile, pre-curved peak, no logo shouting over your face.",
    fabric: "Washed cotton canvas, brass slider.",
    fit: "One size, adjustable strap.",
    sizes: ONE_SIZE,
    drop: 4,
  },
  {
    slug: "grey-area-cap",
    name: "Grey Area Cap",
    color: "Grey",
    price: 899,
    category: "Accessories",
    gender: "all",
    images: [img("1521369909029-2afed882baee")],
    description:
      "For days when you'd rather not commit. Washed grey twill, unstructured crown, goes with everything including your excuses.",
    fabric: "Washed cotton twill, brass slider.",
    fit: "One size, adjustable strap.",
    sizes: ONE_SIZE,
    drop: 3,
  },
  {
    slug: "night-shades",
    name: "Night Shades",
    color: "Black",
    price: 1499,
    category: "Accessories",
    gender: "all",
    images: [img("1511499767150-a48a237f0083")],
    description:
      "Round metal frames with UV400 lenses. For bright days, long nights, and pretending you didn't see someone.",
    fabric: "Stainless frame with acetate tips, UV400 CR-39 lenses. Hard case included.",
    fit: "Medium width, universal bridge.",
    sizes: ONE_SIZE,
    drop: 8,
  },
];

export const categories: Category[] = [
  "Tees",
  "Sweats & Hoods",
  "Jackets",
  "Bottoms",
  "Knitwear",
  "Dresses & Sets",
  "Accessories",
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function byGender(gender: "men" | "women"): Product[] {
  return products.filter((p) => p.gender === gender || p.gender === "all");
}

export function newArrivals(): Product[] {
  return [...products].sort((a, b) => b.drop - a.drop);
}

export function related(product: Product, count = 4): Product[] {
  const pool = products.filter((p) => p.slug !== product.slug);
  const sameCat = pool.filter((p) => p.category === product.category);
  const sameGender = pool.filter(
    (p) => p.category !== product.category && (p.gender === product.gender || p.gender === "all"),
  );
  return [...sameCat, ...sameGender].slice(0, count);
}

/** editorial / campaign imagery */
export const editorial = {
  heroMain: img("1515886657613-9f3515b0c78f", 1600),
  heroSide: img("1548126032-079a0fb0099d", 900),
  menCover: img("1520975954732-35dd22299614", 1200),
  menCoverAlt: img("1507081323647-4d250478b919", 1200),
  womenCover: img("1554412933-514a83d2f3c8", 1200),
  newCover: img("1489987707025-afc232f7ea0f", 1200),
  crowd: img("1529903384028-929ae5dccdf1", 1800),
  rackBrick: img("1559551409-dadc959f76b8", 1400),
  portraitPink: img("1531746020798-e6953c6e8e04", 900),
  circleMirror: img("1488161628813-04466f872be2", 1200),
  nightStreet: img("1507081323647-4d250478b919", 1000),
};

export function formatINR(value: number): string {
  return "₹" + value.toLocaleString("en-IN");
}
