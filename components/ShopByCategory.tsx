import Link from "next/link";
import GarmentCutout from "./GarmentCutout";
import Reveal from "./Reveal";
import { categorySlug, garments, getGarment, liveGarments, type Category, type Garment } from "@/content/garments";
import { nextDrop } from "@/content/drops";

/** each tile opens its collection with the category already picked; `hero` is the piece drawn on it */
const TILES: { gender: "men" | "women"; category: Category; hero: string }[] = [
  { gender: "men", category: "Tees", hero: "reprint-tee-01" },
  { gender: "men", category: "Sweats & Hoods", hero: "static-hoodie" },
  { gender: "men", category: "Jackets", hero: "second-shift-trucker" },
  { gender: "women", category: "Tees", hero: "open-invite-tee" },
  { gender: "women", category: "Sweats & Hoods", hero: "sunstrike-crop-hood" },
];

interface TileProps {
  href: string;
  garment: Garment;
  kicker: string;
  title: string;
  meta: string;
  dark?: boolean;
}

function Tile({ href, garment, kicker, title, meta, dark = false }: TileProps) {
  return (
    <Link href={href} className="group block">
      <div className={`${dark ? "studio-dark" : "studio"} grain grain-light relative aspect-[4/5] overflow-hidden sm:aspect-[5/4]`}>
        <div className="absolute inset-x-0 bottom-[7%] top-[7%] flex justify-center transition-transform duration-700 ease-[var(--ease-out)] group-hover:-translate-y-1 group-hover:scale-[1.04]">
          <GarmentCutout garment={garment} side="front" alt="" className="h-full w-auto max-w-full" />
        </div>
      </div>
      {/* phones stack the count under the title; wider screens set it to the right */}
      <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <p className="label text-steel-deep">{kicker}</p>
          <h3 className="display mt-1 text-lg sm:text-xl md:text-2xl">{title}</h3>
        </div>
        <p className="label text-steel-deep transition-colors group-hover:text-terracotta sm:shrink-0 sm:pb-1">{meta} →</p>
      </div>
    </Link>
  );
}

/** Men's and women's categories in one grid, closed by the next drop (or new arrivals once it lands). */
export default function ShopByCategory() {
  const next = nextDrop();
  const newest = [...liveGarments()].sort((a, b) => b.order - a.order)[0];

  return (
    <section className="mx-auto max-w-7xl px-4 py-[var(--space-section)] sm:px-6" aria-labelledby="category-heading">
      <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label text-steel-deep">Men &amp; women</p>
          <Reveal variant="mask" delay={80} className="mt-2">
            <h2 id="category-heading" className="display display-md">
              Shop by category
            </h2>
          </Reveal>
        </div>
        <p className="serif-note max-w-xs text-lg text-carbon-2 md:text-right">
          Tees, sweats and outerwear, printed in Bengaluru in runs of a few hundred.
        </p>
      </Reveal>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">
        {TILES.map(({ gender, category, hero }, i) => {
          const count = garments.filter((g) => g.gender === gender && g.category === category).length;
          return (
            <Reveal key={`${gender}-${category}`} delay={(i % 3) * 70}>
              <Tile
                href={`/${gender}?category=${categorySlug(category)}`}
                garment={getGarment(hero)!}
                kicker={gender === "men" ? "Men" : "Women"}
                title={category}
                meta={`${count} ${count === 1 ? "piece" : "pieces"}`}
              />
            </Reveal>
          );
        })}
        <Reveal delay={140}>
          {next ? (
            <Tile
              href="/drop"
              garment={getGarment("static-hoodie-cobalt")!}
              kicker={`${next.code} — ${next.name}`}
              title="On the way"
              meta={`Lands ${new Date(next.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
              dark
            />
          ) : (
            <Tile href="/new-arrivals" garment={newest} kicker="Just landed" title="New arrivals" meta="See all" />
          )}
        </Reveal>
      </div>
    </section>
  );
}
