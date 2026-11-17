import Image from "next/image";
import Link from "next/link";
import CategoryShowcase from "@/components/CategoryShowcase";
import GarmentRack, { HeroEditorialBanner } from "@/components/GarmentRack";
import Marquee from "@/components/Marquee";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import TrustStrip from "@/components/TrustStrip";
import { editorial, newArrivals } from "@/lib/products";

const TICKER = [
  "AW26 Drop 01 Live",
  "Front & Back Puff Prints",
  "Curated Women's Boutique Edit",
  "Free Pan-India Shipping Over ₹1,999",
  "Small-Batch Runs",
];

export default function Home() {
  const fresh = newArrivals().slice(0, 4);

  return (
    <>
      {/* ——— flagship hero: the garment rack ——— */}
      <section className="relative bg-studio" aria-labelledby="rack-heading">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-studio-2/80 to-transparent" />
        <h1 id="rack-heading" className="sr-only">
          Rabble — AW26 Drop 01. Premium printed tees and boutique wear, on the
          rack.
        </h1>
        <div className="relative pb-12 pt-8 md:pb-16 md:pt-10">
          <GarmentRack />
        </div>
        <HeroEditorialBanner />
      </section>

      <Marquee items={TICKER} />

      {/* ——— dual-mood showcase ——— */}
      <CategoryShowcase />

      {/* ——— new this week ——— */}
      <section
        className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24"
        aria-labelledby="new-heading"
      >
        <Reveal className="mb-8 flex items-end justify-between">
          <div>
            <p className="label text-ink-3">Fresh off the press</p>
            <h2 id="new-heading" className="display mt-2 text-3xl md:text-4xl">
              New this week
            </h2>
          </div>
          <Link
            href="/new-arrivals"
            className="label shrink-0 hover:text-accent"
          >
            View all →
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {fresh.map((product, i) => (
            <Reveal key={product.slug} delay={i * 70}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— craftsmanship & trust ——— */}
      <TrustStrip />

      {/* ——— campaign ——— */}
      <section
        className="relative overflow-hidden"
        aria-labelledby="campaign-heading"
      >
        <div className="relative h-[70vh] min-h-[420px]">
          <Image
            src={editorial.heroMain}
            alt="Sunstrike Co-ord in turmeric, shot on a basketball court"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/45" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
              <Reveal>
                <p className="label text-chalk/70">The point of all this</p>
                <h2
                  id="campaign-heading"
                  className="display mt-4 max-w-3xl text-4xl text-chalk md:text-6xl"
                >
                  A rabble is just a crowd{" "}
                  <span className="serif-note lowercase text-butter">
                    with a point of view.
                  </span>
                </h2>
                <Link href="/about" className="btn btn-chalk mt-8">
                  Read the manifesto
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
