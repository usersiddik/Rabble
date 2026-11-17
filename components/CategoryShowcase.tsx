"use client";

import Image from "next/image";
import Link from "next/link";
import { LazyMotion, m, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import GarmentRender, { type GarmentKind } from "./GarmentRender";
import { renderProps } from "./GarmentCutout";
import Reveal from "./Reveal";
import { byGender, getGarment } from "@/content/garments";

const loadMotionFeatures = () => import("./motion-features").then((mod) => mod.default);

const KIND_LABEL: Record<GarmentKind, string> = {
  "cropped-hoodie": "Crop hoods",
  tee: "Boxy tees",
  crew: "Crewnecks",
  hoodie: "Hoodies",
  trucker: "Jackets",
  bomber: "Jackets",
  dress: "Dresses",
};

/**
 * Dual-mood editorial split: The Print Lab (printed tees — flips front → back
 * on hover) and The Atelier Edit (the women's pieces, parallax on hover).
 * Photo-free until shoots exist; `atelierImage` swaps the drawn pieces for a photograph.
 */
export default function CategoryShowcase({ atelierImage }: { atelierImage?: string }) {
  const reduced = useReducedMotion() ?? false;
  const tee = getGarment("reprint-tee-01")!;
  const [labHover, setLabHover] = useState(false);

  const printSpecs = [tee.print.method, `${tee.print.gsm} GSM`, `Run of ${tee.runSize}`];
  const men = byGender("men").filter((g) => g.status === "live");
  const women = byGender("women").filter((g) => g.status === "live");
  const atelierTags = [...new Set(women.map((g) => KIND_LABEL[g.art.kind]))];
  const hood = getGarment("sunstrike-crop-hood")!;
  const crew = getGarment("loud-minority-crew")!;

  // pointer parallax for the atelier card, on springs so it never re-renders
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const tx = useTransform(sx, (v) => v * -10);
  const ty = useTransform(sy, (v) => v * -8);
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <LazyMotion features={loadMotionFeatures}>
      <section className="mx-auto max-w-7xl px-4 py-[var(--space-section)] sm:px-6" aria-labelledby="mood-heading">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label text-steel-deep">Men &amp; women — two moods, one crowd</p>
            <Reveal variant="mask" delay={80} className="mt-2">
              <h2 id="mood-heading" className="display display-md">
                Pick your noise
              </h2>
            </Reveal>
          </div>
          <p className="serif-note max-w-xs text-lg text-carbon-2 md:text-right">
            Loud prints for the front row. Quieter cuts for the after-party.
          </p>
        </Reveal>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-[1.15fr_1fr]">
          {/* ——— Card 1: The Print Lab ——— */}
          <Reveal>
            <Link
              href="/men"
              className="group relative block overflow-hidden rounded-[var(--radius-md)] bg-carbon text-alabaster"
              onMouseEnter={() => setLabHover(true)}
              onMouseLeave={() => setLabHover(false)}
              onFocus={() => setLabHover(true)}
              onBlur={() => setLabHover(false)}
            >
              <div className="relative grid min-h-[30rem] grid-cols-[minmax(0,1fr)_auto] md:min-h-[36rem]">
                <div className="relative z-10 flex flex-col justify-between p-6 md:p-8">
                  <div>
                    <p className="label text-alabaster/60">
                      Men <span aria-hidden className="mx-1 text-alabaster/30">/</span> Front &amp; back printed
                    </p>
                    <h3 className="display mt-3 text-4xl md:text-6xl">
                      The
                      <br />
                      Print
                      <br />
                      Lab
                    </h3>
                  </div>
                  <div>
                    <p className="micro mb-3 text-alabaster/55">{men.length} pieces on the rail</p>
                    <ul className="flex flex-wrap gap-2">
                      {printSpecs.map((t) => (
                        <li key={t} className="micro rounded-full border border-alabaster/25 px-3 py-1.5 text-alabaster/90">
                          {t}
                        </li>
                      ))}
                    </ul>
                    <p className="label mt-6 text-alabaster transition-colors group-hover:text-cobalt-light">Shop men →</p>
                  </div>
                </div>

                {/* the tee: flips to the back print on hover */}
                <div className="relative w-[40vw] max-w-[12rem] sm:w-[12rem] md:w-[20rem] md:max-w-none" style={{ perspective: 1200 }}>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgb(255_255_255/0.14),transparent_60%)]" />
                  <m.div
                    initial={false}
                    animate={{ rotateY: labHover ? 180 : 0 }}
                    transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 110, damping: 18, mass: 0.9 }}
                    className="absolute inset-x-0 bottom-0 top-6"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                      <GarmentRender {...renderProps(tee, "front")} className="garment-shadow h-full w-full" />
                    </div>
                    <div
                      className="absolute inset-0"
                      style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    >
                      <GarmentRender {...renderProps(tee, "back")} className="garment-shadow h-full w-full" />
                    </div>
                  </m.div>
                </div>
              </div>
              <span aria-hidden className="micro absolute bottom-6 right-6 z-10 rounded-full border border-alabaster/30 px-3 py-1.5 text-alabaster/80">
                {labHover ? "Back" : "Front"}
              </span>
            </Link>
          </Reveal>

          {/* ——— Card 2: The Atelier Edit ——— */}
          <Reveal delay={100}>
            <Link
              href="/women"
              className="group relative block overflow-hidden rounded-[var(--radius-md)] bg-sand text-carbon"
              onPointerMove={onMove}
              onPointerLeave={onLeave}
            >
              <div className="relative min-h-[30rem] md:min-h-[36rem]">
                <m.div style={{ x: tx, y: ty, scale: 1.08 }} className="absolute inset-0">
                  {atelierImage ? (
                    <Image src={atelierImage} alt="" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
                  ) : (
                    <div aria-hidden className="absolute inset-x-0 top-[6%] flex h-[62%] items-start justify-center">
                      <GarmentRender {...renderProps(hood, "front")} className="garment-shadow -mr-[14%] h-full w-auto -rotate-3" />
                      <GarmentRender {...renderProps(crew, "back")} className="garment-shadow mt-[6%] h-[92%] w-auto rotate-2" />
                    </div>
                  )}
                </m.div>
                <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/50 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="label text-steel-deep">
                    Women <span aria-hidden className="mx-1 text-carbon/25">/</span> Boutique collection
                  </p>
                  <h3 className="display mt-3 text-4xl md:text-6xl">
                    The Atelier <span className="serif-note lowercase text-terracotta">edit</span>
                  </h3>
                  <p className="serif-note mt-3 max-w-xs text-lg text-carbon-2">
                    Cut for her, printed front and back, made in runs of a few hundred.
                  </p>
                  <p className="micro mt-5 text-steel-deep">{women.length} pieces on the rail</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {atelierTags.map((t) => (
                      <li key={t} className="micro rounded-full border border-carbon/20 bg-ivory/70 px-3 py-1.5 text-carbon-2 backdrop-blur-sm">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="label mt-6 text-carbon transition-colors group-hover:text-terracotta">Shop women →</p>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>
    </LazyMotion>
  );
}
