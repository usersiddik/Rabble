"use client";

/**
 * Asymmetric Dual-World Showcase — resolves the two brand worlds:
 * left: The Print Lab (front/back graphic tees, technical, inky)
 * right: The Boutique Edit (women's contemporary, warm alabaster, serif accents)
 */

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { bySlug } from "@/data/products";
import Reveal from "../Reveal";

function HoverFlipGarment({
  front,
  back,
  alt,
  height = 360,
}: {
  front: string;
  back: string;
  alt: string;
  height?: number;
}) {
  const flip = useRef<HTMLDivElement>(null);
  const f = useRef<HTMLImageElement>(null);
  const b = useRef<HTMLImageElement>(null);
  const showingBack = useRef(false);
  const busy = useRef(false);

  const doFlip = (toBack: boolean) => {
    if (busy.current || showingBack.current === toBack) return;
    busy.current = true;
    showingBack.current = toBack;
    const k = prefersReducedMotion() ? 0 : 1;
    gsap
      .timeline({ onComplete: () => (busy.current = false) })
      .to(flip.current, { rotationY: 90, duration: 0.25 * k, ease: "power3.in" })
      .set(toBack ? f.current : b.current, { autoAlpha: 0 })
      .set(toBack ? b.current : f.current, { autoAlpha: 1 })
      .set(flip.current, { rotationY: -90 })
      .to(flip.current, { rotationY: 0, duration: 0.35 * k, ease: "power3.out" });
  };

  useGSAP(() => {
    gsap.set(b.current, { autoAlpha: 0 });
  });

  return (
    <div
      className="persp relative mx-auto"
      style={{ height, width: height * 0.84 }}
      onMouseEnter={() => doFlip(true)}
      onMouseLeave={() => doFlip(false)}
      onClick={() => doFlip(!showingBack.current)}
    >
      <div ref={flip} className="preserve-3d relative h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={f} src={front} alt={alt} className="garment-shadow absolute left-1/2 top-0 h-full w-auto max-w-none -translate-x-1/2 select-none" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={b} src={back} alt="" className="garment-shadow absolute left-1/2 top-0 h-full w-auto max-w-none -translate-x-1/2 select-none opacity-0" />
      </div>
      <p className="absolute -bottom-6 inset-x-0 text-center text-[9px] uppercase tracking-[0.2em] opacity-60">
        Hover / tap — Front ⇄ Back
      </p>
    </div>
  );
}

const chip =
  "border px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] whitespace-nowrap";

export default function DualWorld() {
  const tee = bySlug("motive-tee-03")!;
  const drape = bySlug("sandstone-slip")!;

  return (
    <section className="mx-auto max-w-[1500px] px-5 md:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* ——— The Print Lab ——— */}
      <div className="lg:col-span-7 relative overflow-hidden bg-[#232120] text-studio">
        <div className="absolute inset-0 opacity-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/editorial/print-lab.webp" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="relative z-10 p-8 md:p-12">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
              World 01 — Streetwear
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
              The Print Lab
            </h2>
          </Reveal>
          <p className="mt-3 max-w-md text-[13px] leading-relaxed text-neutral-300">
            Heavyweight oversized tees carrying high-density front &amp; back graphics.
            One print run. No restocks.
          </p>

          <div className="mt-8">
            <HoverFlipGarment
              front={tee.frontImage}
              back={tee.backImage}
              alt={tee.name}
              height={340}
            />
          </div>

          <div className="mt-12 flex flex-wrap gap-2">
            {["Puff Ink", "HD Screen Print", "240 GSM Combed Cotton"].map((c) => (
              <span key={c} className={`${chip} border-neutral-600 text-neutral-300`}>
                {c}
              </span>
            ))}
          </div>

          <Link
            href="/men"
            className="mt-8 inline-block border border-neutral-500 rounded-full px-7 py-2.5 text-xs uppercase tracking-widest hover:bg-studio hover:text-neutral-950 transition-colors"
          >
            Enter the Print Lab
          </Link>
        </div>
      </div>

      {/* ——— The Boutique Edit ——— */}
      <div className="lg:col-span-5 relative overflow-hidden bg-alabaster">
        <div className="absolute inset-0 opacity-60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/editorial/boutique-edit.webp" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="relative z-10 p-8 md:p-12">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
              World 02 — Atelier
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-2 font-serif italic text-3xl md:text-4xl tracking-tight text-neutral-900">
              The Boutique Edit
            </h2>
          </Reveal>
          <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-neutral-600">
            Elevated co-ords, draped silhouettes and boutique-grade tailoring in
            warm alabaster &amp; sandstone.
          </p>

          <div className="mt-8">
            <HoverFlipGarment
              front={drape.frontImage}
              back={drape.backImage}
              alt={drape.name}
              height={340}
            />
          </div>

          <div className="mt-12 flex flex-wrap gap-2">
            {["Cupro & Crepe", "Draped Silhouettes", "Atelier Tailoring"].map((c) => (
              <span key={c} className={`${chip} border-neutral-400 text-neutral-600`}>
                {c}
              </span>
            ))}
          </div>

          <Link
            href="/women"
            className="mt-8 inline-block border border-neutral-500 rounded-full px-7 py-2.5 text-xs uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-colors"
          >
            Browse the Edit
          </Link>
        </div>
      </div>
    </section>
  );
}
