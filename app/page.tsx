import Link from "next/link";
import CategoryShowcase from "@/components/CategoryShowcase";
import DropCountdown from "@/components/DropCountdown";
import FlipCard from "@/components/FlipCard";
import GarmentRack, { HeroEditorialBanner } from "@/components/GarmentRack";
import JoinDrop from "@/components/JoinDrop";
import Marquee from "@/components/Marquee";
import { NoiseBars, NoiseDivider } from "@/components/Noise";
import Parallax from "@/components/Parallax";
import Reveal from "@/components/Reveal";
import ShopByCategory from "@/components/ShopByCategory";
import TrustStrip from "@/components/TrustStrip";
import { liveGarments } from "@/content/garments";
import { currentDrop, nextDrop } from "@/content/drops";
import { ticker } from "@/content/site";

export default function Home() {
  const live = currentDrop();
  const next = nextDrop();
  const fresh = [...liveGarments()].sort((a, b) => b.order - a.order).slice(0, 4);

  return (
    <>
      {/* ——— flagship hero: the garment rack ——— */}
      <section className="relative bg-alabaster" aria-labelledby="rack-heading">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-alabaster-2/80 to-transparent" />
        <h1 id="rack-heading" className="sr-only">
          Rabble — {live.code} {live.name}, live now. Printed tees and boutique wear for men and women, on the rack.
        </h1>
        <div className="relative pb-12 pt-5 md:pb-16 md:pt-4">
          <GarmentRack />
        </div>
        <HeroEditorialBanner />
      </section>

      <Marquee items={ticker} />

      {/* ——— join the drop ——— */}
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
        <Reveal className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="label text-cobalt">{next ? `${next.code} — ${next.name}` : "Next drop"}</p>
            <p className="serif-note mt-1 text-xl text-carbon-2">
              {next
                ? `${next.pieces} pieces land ${new Date(next.date).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}. The list hears an hour early.`
                : "The list hears first."}
            </p>
          </div>
          <JoinDrop source="hero" className="relative w-full md:w-96" />
        </Reveal>
      </div>

      {/* ——— dual-mood showcase ——— */}
      <CategoryShowcase />

      <NoiseDivider className="mx-auto max-w-7xl px-4 sm:px-6" seed={2} label="Drop 01" />

      {/* ——— shop by category ——— */}
      <ShopByCategory />

      {/* ——— new this week ——— */}
      <section className="mx-auto max-w-7xl px-4 pb-[var(--space-section)] sm:px-6" aria-labelledby="new-heading">
        <Reveal className="mb-8 flex items-end justify-between">
          <div>
            <p className="label text-steel-deep">Fresh off the press</p>
            <Reveal variant="mask" delay={80} className="mt-2">
              <h2 id="new-heading" className="display display-md">
                New this week
              </h2>
            </Reveal>
          </div>
          <Link href="/new-arrivals" className="label shrink-0 hover:text-terracotta">
            View all →
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {fresh.map((g, i) => (
            <Reveal key={g.slug} delay={i * 70}>
              <FlipCard garment={g} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— craftsmanship & trust ——— */}
      <TrustStrip />

      {/* ——— drop 02 ——— */}
      {next && (
        <section className="bg-carbon py-[var(--space-section)] text-alabaster" aria-labelledby="drop-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16">
              <Reveal>
                <p className="label text-cobalt-light">
                  {next.code} — {next.name}
                </p>
                <Reveal variant="mask" delay={80} className="mt-3">
                  <h2 id="drop-heading" className="display display-lg">
                    {next.tagline}
                  </h2>
                </Reveal>
                <p className="mt-5 max-w-md text-lg text-alabaster/70">{next.blurb}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/drop" className="btn btn-alabaster">
                    See the drop
                  </Link>
                  <Link
                    href="/new-arrivals#chapter-2"
                    className="btn btn-ghost !border-alabaster/30 !text-alabaster hover:!bg-alabaster hover:!text-carbon"
                  >
                    The pieces
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <DropCountdown target={next.date} tone="dark" />
                <JoinDrop source="home-drop" tone="dark" className="relative mt-5" />
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ——— campaign: manifesto band ——— */}
      <section className="relative overflow-hidden bg-alabaster-2 py-[var(--space-section)]" aria-labelledby="campaign-heading">
        {/* the noise drifts against the scroll, behind the manifesto line */}
        <Parallax speed={0.05} className="pointer-events-none absolute inset-x-0 -bottom-8 h-48">
          <NoiseBars seed={13} count={120} aspect={0.12} className="h-full w-full text-carbon/5" />
        </Parallax>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="label text-steel-deep">The point of all this</p>
            <Reveal variant="mask" delay={80} className="mt-4">
              <h2 id="campaign-heading" className="display display-lg max-w-3xl">
                A rabble is just a crowd <span className="serif-note lowercase text-terracotta">with a point of view.</span>
              </h2>
            </Reveal>
            <Link href="/about" className="btn btn-carbon mt-8">
              Read the manifesto
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
