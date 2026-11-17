"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import GarmentCutout from "./GarmentCutout";
import { formatINR, getGarment, type Garment } from "@/content/garments";

interface RailItem {
  slug: string;
  tag?: string;
  tagTone?: "carbon" | "terracotta" | "cobalt";
}

/** Drop 01 lineup, in rail order. */
const RAIL: RailItem[] = [
  { slug: "static-hoodie", tag: "−20%" },
  { slug: "low-volume-tee" },
  { slug: "oat-crew" },
  { slug: "second-shift-trucker", tag: "NEW", tagTone: "terracotta" },
  { slug: "half-day-bomber", tag: "3 LEFT" },
  { slug: "sunstrike-crop-hood", tag: "NEW", tagTone: "terracotta" },
  { slug: "reprint-tee-01" },
  { slug: "loud-minority-crew" },
  { slug: "open-invite-tee" },
];

const ITEMS = RAIL.map((item) => ({ ...item, garment: getGarment(item.slug) })).filter(
  (i): i is RailItem & { garment: Garment } => Boolean(i.garment),
);

/** deterministic pseudo-random per item, for organic swing variation */
const vary = (i: number) => 0.85 + ((i * 97) % 30) / 100;

export default function HangingRail() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
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
    let target: number | null = null; // keyboard focus / nudge destination
    const angles = ITEMS.map(() => 0);
    const omegas = ITEMS.map(() => 0);
    let raf = 0;

    const bounds = () => Math.min(0, viewport.clientWidth - track.scrollWidth);

    const frame = () => {
      const min = bounds();

      if (!dragging) {
        if (target !== null) {
          const clamped = Math.max(min, Math.min(0, target));
          const d = clamped - pos;
          v = d * 0.14;
          if (Math.abs(d) < 0.5) {
            pos = clamped;
            v = 0;
            target = null;
          }
        }
        pos += v;
        if (target === null) v *= 0.94;
        if (pos > 0) {
          pos += (0 - pos) * 0.12;
          v *= 0.6;
        } else if (pos < min) {
          pos += (min - pos) * 0.12;
          v *= 0.6;
        }
        if (Math.abs(v) < 0.02 && target === null) v = 0;
      }

      const accel = v - lastV;
      lastV = v;

      track.style.transform = `translate3d(${pos}px,0,0)`;

      if (!reduced) {
        for (let i = 0; i < ITEMS.length; i++) {
          omegas[i] += -0.035 * angles[i] - 0.075 * omegas[i] + accel * 0.9 * vary(i);
          angles[i] += omegas[i];
          if (angles[i] > 16) angles[i] = 16;
          if (angles[i] < -16) angles[i] = -16;
          const el = itemRefs.current[i];
          if (el) el.style.transform = `rotate(${angles[i]}deg)`;
        }
      }

      const center = viewport.clientWidth / 2 - pos;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < ITEMS.length; i++) {
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
      target = null;
      lastX = e.clientX;
      v = 0;
      viewport.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      let dx = e.clientX - lastX;
      lastX = e.clientX;
      const min = bounds();
      if (pos > 0 || pos < min) dx *= 0.35;
      pos += dx;
      v = dx;
    };
    const endDrag = () => {
      dragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      target = null;
      v -= e.deltaX * 0.12;
    };
    const nudgeHandler = (e: Event) => {
      const dir = (e as CustomEvent<number>).detail;
      target = null;
      v += dir * 14;
    };
    /** keyboard: bring the focused garment to the centre instead of letting the browser scroll the clipped track */
    const focusHandler = (e: Event) => {
      const index = Number((e as CustomEvent<number>).detail);
      const el = itemRefs.current[index];
      if (!el) return;
      viewport.scrollLeft = 0;
      target = viewport.clientWidth / 2 - (el.offsetLeft + el.offsetWidth / 2);
    };

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("rail-nudge", nudgeHandler);
    viewport.addEventListener("rail-focus", focusHandler);

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", endDrag);
      viewport.removeEventListener("pointercancel", endDrag);
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("rail-nudge", nudgeHandler);
      viewport.removeEventListener("rail-focus", focusHandler);
    };
  }, []);

  const nudge = (dir: number) => {
    viewportRef.current?.dispatchEvent(new CustomEvent("rail-nudge", { detail: dir }));
  };

  const activeItem = ITEMS[active];

  return (
    <div>
      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-x-0 top-[10px] h-[5px] rounded-full"
          style={{
            background: "linear-gradient(#c4c4c8, #8e8e93 55%, #6f6f74)",
            boxShadow: "0 1px 2px rgb(0 0 0 / 0.18)",
          }}
        />
        <div ref={viewportRef} className="cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing">
          <ul ref={trackRef} className="flex w-max list-none items-start px-[8vw] will-change-transform" aria-label="Drop 01 on the rail">
            {ITEMS.map((item, i) => (
              <li
                key={item.slug}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="w-[150px] shrink-0 origin-[50%_4%] sm:w-[185px] md:w-[210px]"
              >
                <Link
                  href={`/product/${item.slug}`}
                  draggable={false}
                  onFocus={() => viewportRef.current?.dispatchEvent(new CustomEvent("rail-focus", { detail: i }))}
                  className="block rounded-md outline-offset-[-6px] transition-opacity hover:opacity-80"
                >
                  <span className="sr-only">
                    {item.garment.name} — {formatINR(item.garment.price)}
                  </span>
                  <GarmentCutout
                    garment={item.garment}
                    side="front"
                    tag={item.tag}
                    tagTone={item.tagTone}
                    alt=""
                    className="pointer-events-none h-auto w-full"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4 text-center">
        <div className="relative h-12 w-full" aria-live="polite">
          {activeItem && (
            <div key={activeItem.slug} className="absolute inset-0" style={{ animation: "page-in 0.35s both" }}>
              <p className="font-semibold">{activeItem.garment.name}</p>
              <p className="tabular mt-0.5 text-sm text-steel-deep">
                {activeItem.garment.color} · {formatINR(activeItem.garment.price)}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Previous piece" onClick={() => nudge(1)} className="btn btn-ghost size-11 !p-0">
            ←
          </button>
          <Link href="/new-arrivals" className="btn btn-carbon">
            Shop Drop 01
          </Link>
          <button type="button" aria-label="Next piece" onClick={() => nudge(-1)} className="btn btn-ghost size-11 !p-0">
            →
          </button>
        </div>
      </div>
    </div>
  );
}
