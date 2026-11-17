import Link from "next/link";
import DropCountdown from "@/components/DropCountdown";
import FlipCard from "@/components/FlipCard";
import GarmentCutout from "@/components/GarmentCutout";
import HangingRail from "@/components/HangingRail";
import JoinDrop from "@/components/JoinDrop";
import Marquee from "@/components/Marquee";
import { NoiseBars, NoiseDivider } from "@/components/Noise";
import Reveal from "@/components/Reveal";
import { byGender, getGarment, liveGarments } from "@/content/garments";
import { currentDrop, nextDrop } from "@/content/drops";
import { ticker } from "@/content/site";

export default function Home() {
  const live = currentDrop();
  const next = nextDrop();
  const fresh = [...liveGarments()].sort((a, b) => b.order - a.order).slice(0, 4);
  const hero = getGarment("reprint-tee-01")!;
  const menCover = getGarment("second-shift-trucker")!;
  const womenCover = getGarment("sunstrike-crop-hood")!;

  return (
    <>
      {/* ——— hero: the rack ——— */}
      <section className="pt-10 md:pt-14" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-end gap-8 md:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="rise label text-terracotta">
                {live.code} — {live.name} · live now
              </p>
              <h1 id="hero-heading" className="rise display display-xl mt-4" style={{ "--rise-delay": "80ms" } as React.CSSProperties}>
                Noise
                <br />
                you can
                <br />
                <span className="serif-note lowercase text-terracotta">wear.</span>
              </h1>
            </div>
            <div className="rise md:pb-3" style={{ "--rise-delay": "160ms" } as React.CSSProperties}>
              <p className="prose-editorial max-w-sm">
                Front-and-back prints from a studio in Bengaluru. Heavyweight cotton, one run per artwork, UPI or cash
                at the door. Give the rail a drag.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/new-arrivals" className="btn btn-carbon">
                  Shop Drop 01
                </Link>
                <Link href="/about" className="btn btn-ghost">
                  Why front &amp; back
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="rise mt-10 md:mt-14" style={{ "--rise-delay": "240ms" } as React.CSSProperties}>
          <HangingRail />
        </div>

        {/* hero footer: join the drop */}
        <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6">
          <Reveal className="grid items-center gap-6 border-t hairline pt-8 md:grid-cols-[1fr_auto]">
            <div>
              <p className="label text-cobalt">{next ? `${next.code} — ${next.name}` : "Next drop"}</p>
              <p className="serif-note mt-1 text-xl text-carbon-2">
                {next ? `${next.pieces} pieces land ${new Date(next.date).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}. The list hears an hour early.` : "The list hears first."}
              </p>
            </div>
            <JoinDrop source="hero" className="relative w-full md:w-96" />
          </Reveal>
        </div>
      </section>

      <Marquee items={ticker} className="mt-12" />

      {/* ——— front & back ——— */}
      <section className="mx-auto max-w-7xl px-4 py-[var(--space-section)] sm:px-6" aria-labelledby="fb-heading">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <Reveal className="order-2 md:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="studio grain grain-light aspect-[4/5] p-[10%]">
                <GarmentCutout garment={hero} side="front" className="h-full w-full" />
                <p className="micro mt-2 text-center text-steel-deep">Front — the question</p>
              </div>
              <div className="studio-dark grain aspect-[4/5] p-[10%] md:mt-10">
                <GarmentCutout garment={hero} side="back" className="h-full w-full" />
                <p className="micro mt-2 text-center text-alabaster/50">Back — the answer</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100} className="order-1 md:order-2">
            <p className="label text-steel-deep">Why two prints</p>
            <h2 id="fb-heading" className="display display-lg mt-3">
              Front says hello.
              <br />
              <span className="serif-note lowercase text-terracotta">Back says goodbye.</span>
            </h2>
            <p className="prose-editorial mt-6 max-w-md">
              A garment is seen from behind for most of its life. So every Rabble piece carries a small signal on the
              chest and a broadcast across the back. Never the same artwork at two sizes.
            </p>
            <Link href="/about#front-and-back" className="label mt-8 inline-block hover:text-terracotta">
              Read why →
            </Link>
          </Reveal>
        </div>
      </section>

      <NoiseDivider className="mx-auto max-w-7xl px-4 sm:px-6" seed={2} label="Drop 01" />

      {/* ——— men / women ——— */}
      <section className="mx-auto max-w-7xl px-4 py-[var(--space-section)] sm:px-6" aria-label="Collections">
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { href: "/men", title: "Men", line: "Make a scene →", garment: menCover, side: "back" as const, dark: true, count: byGender("men").length },
            { href: "/women", title: "Women", line: "Start something →", garment: womenCover, side: "front" as const, dark: false, count: byGender("women").length },
          ].map((tile, i) => (
            <Reveal key={tile.href} delay={i * 100} className={i === 1 ? "md:mt-14" : ""}>
              <Link href={tile.href} className={`group relative block aspect-[4/5] overflow-hidden md:aspect-[3/4] ${tile.dark ? "studio-dark grain" : "studio grain grain-light"}`}>
                <div className="absolute inset-0 flex items-center justify-center p-[12%] transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] group-hover:scale-[1.04]">
                  <GarmentCutout garment={tile.garment} side={tile.side} className="h-full w-auto max-w-full" alt="" />
                </div>
                <div className="absolute inset-x-0 bottom-0 z-[2] p-6">
                  <h3 className={`display text-4xl md:text-5xl ${tile.dark ? "text-alabaster" : "text-carbon"}`}>{tile.title}</h3>
                  <p className={`label mt-2 transition-colors group-hover:text-terracotta ${tile.dark ? "text-alabaster/70" : "text-carbon-2"}`}>
                    {tile.line}
                  </p>
                </div>
                <p className={`micro absolute right-5 top-5 z-[2] ${tile.dark ? "text-alabaster/50" : "text-steel-deep"}`}>{tile.count} pieces</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— new this week ——— */}
      <section className="mx-auto max-w-7xl px-4 pb-[var(--space-section)] sm:px-6" aria-labelledby="new-heading">
        <Reveal className="mb-8 flex items-end justify-between">
          <h2 id="new-heading" className="display display-md">
            New this week
          </h2>
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

      {/* ——— drop 02 ——— */}
      {next && (
        <section className="bg-carbon py-[var(--space-section)] text-alabaster" aria-labelledby="drop-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-16">
              <Reveal>
                <p className="label text-cobalt-light">
                  {next.code} — {next.name}
                </p>
                <h2 id="drop-heading" className="display display-lg mt-3">
                  {next.tagline}
                </h2>
                <p className="mt-5 max-w-md text-lg text-alabaster/70">{next.blurb}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/drop" className="btn btn-alabaster">
                    See the drop
                  </Link>
                  <Link href="/new-arrivals?drop=2" className="btn btn-ghost border-alabaster/30 text-alabaster hover:bg-alabaster hover:text-carbon">
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

      {/* ——— manifesto band ——— */}
      <section className="relative overflow-hidden bg-alabaster-2 py-[var(--space-section)]" aria-labelledby="campaign-heading">
        <NoiseBars seed={13} count={120} aspect={0.12} className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full text-carbon/5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="label text-steel-deep">The point of all this</p>
            <h2 id="campaign-heading" className="display display-lg mt-4 max-w-3xl">
              A rabble is just a crowd <span className="serif-note lowercase text-terracotta">with a point of view.</span>
            </h2>
            <Link href="/about" className="btn btn-carbon mt-8">
              Read the manifesto
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
