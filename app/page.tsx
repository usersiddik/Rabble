import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/Marquee";
import HangingRail from "@/components/HangingRail";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { editorial, newArrivals } from "@/lib/products";

const TICKER = [
  "AW26 — Drop 01 is live",
  "No wallflowers",
  "Free shipping over ₹1,999",
  "Designed in India",
  "One-run prints — no restocks",
];

export default function Home() {
  const fresh = newArrivals().slice(0, 4);

  return (
    <>
      {/* ——— hero ——— */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 md:pt-16">
        <div className="grid items-end gap-10 md:grid-cols-[1.1fr_1fr]">
          <div>
            <Reveal>
              <p className="label text-accent">Rabble — AW26, Drop 01</p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="display mt-4 text-[clamp(3rem,9vw,7rem)]">
                Noise
                <br />
                you can
                <br />
                <span className="serif-note lowercase text-accent">wear.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-sm text-ink-2">
                Contemporary staples for men and women. Designed in India, cut for
                the loud majority, built to be lived in — not saved for later.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/new-arrivals" className="btn btn-ink">
                  Shop Drop 01
                </Link>
                <Link href="/about" className="btn btn-ghost">
                  Why Rabble
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="relative">
            <Reveal className="img-hover">
              <div className="img-frame relative aspect-[4/5]">
                <Image
                  src={editorial.heroMain}
                  alt="Sunstrike Co-ord in turmeric, shot on a basketball court"
                  fill
                  priority
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                />
                <span className="hang-tag hang-tag--accent absolute left-4 top-4">
                  Sunstrike Co-ord
                </span>
              </div>
            </Reveal>
            <Reveal
              delay={150}
              className="img-hover absolute -bottom-10 -left-6 hidden w-44 rotate-[-3deg] md:block lg:w-56"
            >
              <div className="img-frame relative aspect-[3/4] shadow-xl">
                <Image
                  src={editorial.heroSide}
                  alt="Layered streetwear look with a red hoodie"
                  fill
                  sizes="224px"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Marquee items={TICKER} />

      {/* ——— the rack ——— */}
      <section className="bg-chalk-2/60 py-16 md:py-20" aria-labelledby="rack-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label text-ink-3">New collection</p>
              <h2 id="rack-heading" className="display mt-2 text-4xl md:text-5xl">
                On the rack
              </h2>
            </div>
            <p className="serif-note max-w-[16rem] text-right text-lg text-ink-2">
              Seven pieces, no filler. Give the rail a drag.
            </p>
          </Reveal>
        </div>
        <Reveal>
          <HangingRail />
        </Reveal>
      </section>

      {/* ——— men / women discovery ——— */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24" aria-label="Collections">
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="img-hover">
            <Link href="/men" className="group block">
              <div className="img-frame relative aspect-[4/5] md:aspect-[3/4]">
                <Image
                  src={editorial.menCover}
                  alt="Fence Hopper Jacket on a rooftop"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-6 pt-20">
                  <h3 className="display text-4xl text-chalk md:text-5xl">Men</h3>
                  <p className="label mt-2 text-chalk/80 transition-colors group-hover:text-accent">
                    Make a scene →
                  </p>
                </div>
              </div>
            </Link>
          </Reveal>
          <Reveal delay={100} className="img-hover md:mt-14">
            <Link href="/women" className="group block">
              <div className="img-frame relative aspect-[4/5] md:aspect-[3/4]">
                <Image
                  src={editorial.womenCover}
                  alt="Editorial look with a wide-brim hat"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-6 pt-20">
                  <h3 className="display text-4xl text-chalk md:text-5xl">Women</h3>
                  <p className="label mt-2 text-chalk/80 transition-colors group-hover:text-accent">
                    Start something →
                  </p>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ——— new this week ——— */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24" aria-labelledby="new-heading">
        <Reveal className="mb-8 flex items-end justify-between">
          <h2 id="new-heading" className="display text-3xl md:text-4xl">
            New this week
          </h2>
          <Link href="/new-arrivals" className="label shrink-0 hover:text-accent">
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

      {/* ——— campaign ——— */}
      <section className="relative overflow-hidden" aria-labelledby="campaign-heading">
        <div className="relative h-[70vh] min-h-[420px]">
          <Image
            src={editorial.crowd}
            alt="A crowd of friends on a city bench"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/45" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
              <Reveal>
                <p className="label text-chalk/70">The point of all this</p>
                <h2 id="campaign-heading" className="display mt-4 max-w-3xl text-4xl text-chalk md:text-6xl">
                  A rabble is just a crowd{" "}
                  <span className="serif-note lowercase text-butter">with a point of view.</span>
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
