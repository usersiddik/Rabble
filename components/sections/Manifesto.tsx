"use client";

/**
 * Editorial manifesto — brand voice over a subtle GPU-only parallax
 * background (yPercent scrub; disabled under reduced motion).
 */

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Reveal from "../Reveal";

export default function Manifesto() {
  const scope = useRef<HTMLElement>(null);
  const bg = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          bg.current,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: scope.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    },
    { scope }
  );

  return (
    <section
      id="manifesto"
      ref={scope}
      className="relative overflow-hidden bg-neutral-950 text-studio"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={bg}
        src="/editorial/manifesto-bg.webp"
        alt=""
        aria-hidden
        className="absolute inset-0 h-[120%] w-full object-cover opacity-70 will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-28 md:py-40 text-center">
        <p className="text-[10px] uppercase tracking-[0.32em] text-neutral-400">Manifesto</p>
        <Reveal className="mt-5">
          <h2 className="font-serif italic text-3xl md:text-5xl leading-tight tracking-tight">
            &ldquo;A rabble is just a crowd
            <br />
            with a point of view.&rdquo;
          </h2>
        </Reveal>
        <p className="mt-6 text-[13px] md:text-[14px] leading-relaxed text-neutral-300 max-w-xl mx-auto">
          We print loud on heavyweight cotton and tailor quiet for the ones who
          don&apos;t need to shout. Designed in India. One run per print. When a
          drop is gone, it&apos;s gone.
        </p>
      </div>
    </section>
  );
}
