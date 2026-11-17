"use client";

/**
 * "New This Week" interactive product grid.
 * 4-col desktop / 2-col mobile. Card entrances via ScrollTrigger.batch
 * (once: true, stagger 0.07) — scrolling back up never re-triggers.
 */

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { newThisWeek } from "@/data/products";
import ProductCard from "../ProductCard";
import Reveal from "../Reveal";

export default function NewThisWeek() {
  const scope = useRef<HTMLElement>(null);
  const items = newThisWeek();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".nw-card", { autoAlpha: 0, y: 28 });
        ScrollTrigger.batch(".nw-card", {
          once: true,
          start: "top 92%",
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
    <section ref={scope} className="mx-auto max-w-[1500px] px-5 md:px-8 pb-20 md:pb-28">
      <div className="flex items-end justify-between border-b border-neutral-300/70 pb-4">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">New This Week</h2>
        </Reveal>
        <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">
          AW26 — Drop 01
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
