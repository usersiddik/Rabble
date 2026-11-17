"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import GarmentCutout from "./GarmentCutout";
import Reveal from "./Reveal";
import { RACK } from "@/lib/rack";
import { editorial } from "@/lib/products";

const PRINT_SPECS = ["Puff Ink", "High-Density Screen Print", "240 GSM"];
const ATELIER_TAGS = ["Co-ords", "Draped Fits", "Limited Boutique Pieces"];

/**
 * Dual-mood editorial split: The Print Lab (graphic tees, flips front → back
 * on hover) and The Atelier Edit (women's boutique, parallax on hover).
 */
export default function CategoryShowcase() {
  const reduced = useReducedMotion() ?? false;
  const tee = RACK.find((r) => r.slug === "reprint-tee-01")!;
  const [labHover, setLabHover] = useState(false);

  // pointer parallax for the atelier card
  const atelierRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const onMove = (e: React.PointerEvent) => {
    if (reduced) return;
    const r = atelierRef.current?.getBoundingClientRect();
    if (!r) return;
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    });
  };

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24"
      aria-label="Shop by mood"
    >
      <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label text-ink-3">Two moods, one crowd</p>
          <h2 className="display mt-2 text-4xl md:text-5xl">Pick your noise</h2>
        </div>
        <p className="serif-note max-w-xs text-right text-lg text-ink-2">
          Loud prints for the front row. Quiet tailoring for the after-party.
        </p>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-[1.15fr_1fr]">
        {/* ——— Card 1: The Print Lab ——— */}
        <Reveal>
          <Link
            href="/men"
            className="group relative block overflow-hidden rounded-md bg-carbon text-chalk"
            onMouseEnter={() => setLabHover(true)}
            onMouseLeave={() => setLabHover(false)}
            onFocus={() => setLabHover(true)}
            onBlur={() => setLabHover(false)}
          >
            <div className="relative grid min-h-[30rem] grid-cols-[1fr_auto] md:min-h-[36rem]">
              {/* copy */}
              <div className="relative z-10 flex flex-col justify-between p-6 md:p-8">
                <div>
                  <p className="label text-chalk/60">
                    Graphic &amp; oversized tees
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
                  <ul className="flex flex-wrap gap-2">
                    {PRINT_SPECS.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-chalk/25 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-chalk/90"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="label mt-6 text-chalk/70 transition-colors group-hover:text-butter">
                    {labHover ? "Back print →" : "Front print →"}
                  </p>
                </div>
              </div>

              {/* the tee: flips to the back print on hover */}
              <div
                className="relative w-[46%] min-w-[12rem] md:w-[20rem]"
                style={{ perspective: 1200 }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgb(255_255_255/0.14),transparent_60%)]" />
                <motion.div
                  initial={false}
                  animate={{ rotateY: labHover ? 180 : 0 }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 110,
                          damping: 18,
                          mass: 0.9,
                        }
                  }
                  className="absolute inset-x-0 top-6 bottom-0"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div
                    className="absolute inset-0"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <GarmentCutout
                      kind="tee"
                      view="front"
                      body={tee.body}
                      shade={tee.shade}
                      ink={tee.ink}
                      print={tee.frontPrint}
                      className="garment-shadow h-full w-full"
                    />
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <GarmentCutout
                      kind="tee"
                      view="back"
                      body={tee.body}
                      shade={tee.shade}
                      ink={tee.ink}
                      print={tee.backPrint}
                      className="garment-shadow h-full w-full"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
            <span className="absolute bottom-6 right-6 z-10 rounded-full border border-chalk/30 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-chalk/80">
              {labHover ? "Back" : "Front"}
            </span>
          </Link>
        </Reveal>

        {/* ——— Card 2: The Atelier Edit ——— */}
        <Reveal delay={100}>
          <Link
            href="/women"
            className="group relative block overflow-hidden rounded-md bg-sand text-ink"
            onPointerMove={onMove}
            onPointerLeave={() => setTilt({ x: 0, y: 0 })}
          >
            <div
              ref={atelierRef}
              className="relative min-h-[30rem] md:min-h-[36rem]"
            >
              <motion.div
                animate={{ x: tilt.x * -10, y: tilt.y * -8, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 60, damping: 18 }}
                className="absolute inset-0"
              >
                <Image
                  src={editorial.womenCover}
                  alt="Boutique editorial look with a wide-brim hat"
                  fill
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="label text-ink-3">
                  Women&rsquo;s boutique collection
                </p>
                <h3 className="display mt-3 text-4xl md:text-6xl">
                  The Atelier{" "}
                  <span className="serif-note lowercase text-accent">edit</span>
                </h3>
                <p className="serif-note mt-3 max-w-xs text-lg text-ink-2">
                  Sandstone, ivory and the kind of drape that makes a doorway
                  feel like a runway.
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {ATELIER_TAGS.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-ink/20 bg-ivory/70 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ink-2 backdrop-blur-sm"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="label mt-6 text-ink transition-colors group-hover:text-accent">
                  Enter the atelier →
                </p>
              </div>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
