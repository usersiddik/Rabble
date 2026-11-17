"use client";

/**
 * Category listing grid shared by /men, /women and /new-arrivals.
 * Same once-only ScrollTrigger.batch entrance as the home grid.
 */

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import type { Product } from "@/data/products";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

export default function CategoryGrid({
  title,
  kicker,
  intro,
  items,
  serifTitle = false,
}: {
  title: string;
  kicker: string;
  intro: string;
  items: Product[];
  serifTitle?: boolean;
}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".nw-card", { autoAlpha: 0, y: 28 });
        ScrollTrigger.batch(".nw-card", {
          once: true,
          start: "top 95%",
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.07,
            }),
        });
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="bg-studio min-h-[70svh]">
      <div className="mx-auto max-w-[1500px] px-5 md:px-8 pt-12 pb-24">
        <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">{kicker}</p>
        <Reveal className="mt-2">
          <h1
            className={`text-3xl md:text-5xl tracking-tight ${
              serifTitle ? "font-serif italic" : "font-semibold"
            }`}
          >
            {title}
          </h1>
        </Reveal>
        <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-neutral-600">{intro}</p>

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
