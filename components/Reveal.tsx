"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** stagger delay in ms */
  delay?: number;
  as?: "div" | "section" | "span" | "li";
  /**
   * `fade` (default) fades the block up; `mask` slides it up from behind its own
   * bottom edge — for display headings.
   */
  variant?: "fade" | "mask";
}

/** Fades (or mask-slides) content up once it enters the viewport. Pure CSS transition, respects reduced motion. */
export default function Reveal({ children, className = "", delay = 0, as = "div", variant = "fade" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-in");
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as "div";
  const style = delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined;
  if (variant === "mask") {
    return (
      <div ref={ref} className={`reveal-mask ${className}`} style={style}>
        <div className="reveal-mask-inner">{children}</div>
      </div>
    );
  }
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </Tag>
  );
}
