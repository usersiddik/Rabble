"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Masked line reveal: yPercent 100 → 0, power4.out, once-only ScrollTrigger.
 * Reduced-motion users get static content (animation never registered).
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const inner = ref.current?.firstElementChild;
        if (!inner) return;
        gsap.fromTo(
          inner,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.85,
            delay,
            ease: "power4.out",
            scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
          }
        );
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div>{children}</div>
    </div>
  );
}
