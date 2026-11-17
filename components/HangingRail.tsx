"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import GarmentArt, { type GarmentColors, type GarmentKind } from "./GarmentArt";
import { formatINR, getProduct } from "@/lib/products";

interface RailItem {
  slug: string;
  kind: GarmentKind;
  colors: GarmentColors;
  tag?: string;
  tagTone?: "ink" | "cobalt";
}

/** Drop 01 lineup — colours roughly match each product's photography. */
const RAIL: RailItem[] = [
  { slug: "static-hoodie", kind: "hoodie", colors: { body: "#aeaca5", shade: "#8f8d86" }, tag: "−20%" },
  { slug: "low-volume-tee", kind: "tee", colors: { body: "#24231f", shade: "#121110" } },
  { slug: "oat-crew", kind: "crew", colors: { body: "#ddd3bd", shade: "#c2b79d" } },
  {
    slug: "second-shift-trucker",
    kind: "trucker",
    colors: { body: "#2e3f63", shade: "#1f2c48", detail: "#b78e5a" },
    tag: "NEW",
    tagTone: "cobalt",
  },
  {
    slug: "half-day-bomber",
    kind: "bomber",
    colors: { body: "#b06c43", shade: "#8e5431" },
    tag: "3 LEFT",
  },
  {
    slug: "sunstrike-coord",
    kind: "cropped-hoodie",
    colors: { body: "#e9c05c", shade: "#caa041" },
    tag: "NEW",
    tagTone: "cobalt",
  },
  {
    slug: "reprint-tee-01",
    kind: "graphic-tee",
    colors: { body: "#e8e0cd", shade: "#cfc5ac", detail: "#2438e8" },
  },
];

/** deterministic pseudo-random per item, for organic swing variation */
const vary = (i: number) => 0.85 + ((i * 97) % 30) / 100;

export default function HangingRail() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let pos = 0;
    let v = reduced ? 0 : -2.2; // small intro drift so the physics introduce themselves
    let lastV = 0;
    let dragging = false;
    let lastX = 0;
    const angles = RAIL.map(() => 0);
    const omegas = RAIL.map(() => 0);
    let raf = 0;

    const bounds = () => Math.min(0, viewport.clientWidth - track.scrollWidth);

    const frame = () => {
      const min = bounds();

      if (!dragging) {
        pos += v;
        v *= 0.94;
        // rubber-band back into range
        if (pos > 0) {
          pos += (0 - pos) * 0.12;
          v *= 0.6;
        } else if (pos < min) {
          pos += (min - pos) * 0.12;
          v *= 0.6;
        }
        if (Math.abs(v) < 0.02) v = 0;
      }

      const accel = v - lastV;
      lastV = v;

      track.style.transform = `translate3d(${pos}px,0,0)`;

      if (!reduced) {
        for (let i = 0; i < RAIL.length; i++) {
          // damped pendulum driven by track acceleration (inertia)
          omegas[i] += -0.035 * angles[i] - 0.075 * omegas[i] + accel * 0.9 * vary(i);
          angles[i] += omegas[i];
          if (angles[i] > 16) angles[i] = 16;
          if (angles[i] < -16) angles[i] = -16;
          const el = itemRefs.current[i];
          if (el) el.style.transform = `rotate(${angles[i]}deg)`;
        }
      }

      // nearest item to viewport centre
      const center = viewport.clientWidth / 2 - pos;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < RAIL.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const mid = el.offsetLeft + el.offsetWidth / 2;
        const d = Math.abs(mid - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      if (best !== activeRef.current) {
        activeRef.current = best;
        setActive(best);
      }

      raf = requestAnimationFrame(frame);
    };

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      v = 0;
      viewport.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      let dx = e.clientX - lastX;
      lastX = e.clientX;
      const min = bounds();
      if (pos > 0 || pos < min) dx *= 0.35; // resist beyond the ends
      pos += dx;
      v = dx;
    };
    const endDrag = () => {
      dragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      v -= e.deltaX * 0.12;
    };

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("wheel", onWheel, { passive: false });

    const nudgeHandler = (e: Event) => {
      const dir = (e as CustomEvent<number>).detail;
      v += dir * 14;
    };
    viewport.addEventListener("rail-nudge", nudgeHandler);

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", endDrag);
      viewport.removeEventListener("pointercancel", endDrag);
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("rail-nudge", nudgeHandler);
    };
  }, []);

  const nudge = (dir: number) => {
    viewportRef.current?.dispatchEvent(new CustomEvent("rail-nudge", { detail: dir }));
  };

  const activeProduct = getProduct(RAIL[active].slug);

  return (
    <div>
      {/* the rod */}
      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-x-0 top-[10px] h-[5px] rounded-full"
          style={{
            background: "linear-gradient(#b9b7b0, #8f8e88 55%, #6f6e68)",
            boxShadow: "0 1px 2px rgb(0 0 0 / 0.18)",
          }}
        />
        <div
          ref={viewportRef}
          className="cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
        >
          <div ref={trackRef} className="flex w-max items-start px-[8vw] will-change-transform">
            {RAIL.map((item, i) => {
              const product = getProduct(item.slug);
              return (
                <div
                  key={item.slug}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="w-[150px] shrink-0 origin-[50%_4%] sm:w-[185px] md:w-[210px]"
                >
                  <Link
                    href={`/product/${item.slug}`}
                    draggable={false}
                    aria-label={product ? `${product.name} — ${formatINR(product.price)}` : item.slug}
                    className="block transition-opacity hover:opacity-80"
                  >
                    <GarmentArt
                      kind={item.kind}
                      colors={item.colors}
                      tag={item.tag}
                      tagTone={item.tagTone}
                      className="pointer-events-none h-auto w-full"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* caption */}
      <div className="mt-6 flex flex-col items-center gap-4 text-center">
        <div className="relative h-12 w-full">
          {activeProduct && (
            <div key={activeProduct.slug} className="absolute inset-0" style={{ animation: "page-in 0.35s both" }}>
              <p className="font-semibold">{activeProduct.name}</p>
              <p className="tabular mt-0.5 text-sm text-ink-3">
                {activeProduct.color} · {formatINR(activeProduct.price)}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Previous piece"
            onClick={() => nudge(1)}
            className="btn btn-ghost size-11 !p-0"
          >
            ←
          </button>
          <Link href="/new-arrivals" className="btn btn-ink">
            Shop the drop
          </Link>
          <button
            type="button"
            aria-label="Next piece"
            onClick={() => nudge(-1)}
            className="btn btn-ghost size-11 !p-0"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
