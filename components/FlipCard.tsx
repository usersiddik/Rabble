"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import GarmentCutout from "./GarmentCutout";
import { useCart } from "@/lib/cart";
import { badgeLabel, formatINR, hasSide, type Garment, type Side } from "@/content/garments";

const QUICK_SIZES = ["S", "M", "L", "XL"];

interface FlipCardProps {
  garment: Garment;
  priority?: boolean;
  /** show the drop chapter under the name */
  showDrop?: boolean;
}

/**
 * Collection card. Front by default, back on hover (pointer devices) or via the
 * Front | Back switch, which also serves keyboard and touch users. Live pieces get
 * a slide-up quick-add size bar on hover / keyboard focus.
 */
export default function FlipCard({ garment, priority = false, showDrop = false }: FlipCardProps) {
  const { add } = useCart();
  const [side, setSide] = useState<Side | null>(null);
  const [added, setAdded] = useState<string | null>(null);
  const addedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const canFlip = hasSide(garment, "back");
  const stateClass = side === "back" ? "is-back" : side === "front" ? "is-front" : "";
  const waitlist = garment.status === "waitlist";
  const badge = badgeLabel(garment);
  const quickSizes = garment.sizes.filter((s) => QUICK_SIZES.includes(s));

  useEffect(() => () => clearTimeout(addedTimer.current), []);

  const quickAdd = (size: string) => {
    add(garment.slug, size, 1);
    setAdded(size);
    clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(null), 1400);
  };

  return (
    <article className="group">
      <div className={`studio grain-light grain relative aspect-[4/5] overflow-hidden ${canFlip ? "flip" : ""} ${stateClass}`}>
        <Link
          href={`/product/${garment.slug}`}
          className="absolute inset-0 z-[2] block p-[8%] outline-offset-[-4px]"
        >
          <span className="sr-only">
            {garment.name}, {garment.color}, {formatINR(garment.price)}
          </span>
          <div className="flip-inner h-full w-full">
            <div className="flip-face flex h-full w-full items-center justify-center">
              <GarmentCutout garment={garment} side="front" priority={priority} alt="" className="h-full w-auto max-w-full" />
            </div>
            {canFlip && (
              <div className="flip-face flip-face--back flex h-full w-full items-center justify-center">
                <GarmentCutout garment={garment} side="back" alt="" className="h-full w-auto max-w-full" />
              </div>
            )}
          </div>
        </Link>

        {badge && (
          <span
            className={`hang-tag absolute left-3 top-3 z-[3] ${
              garment.badge === "new" ? "hang-tag--terracotta" : garment.badge === "waitlist" ? "hang-tag--cobalt" : ""
            }`}
          >
            {badge}
          </span>
        )}

        {canFlip && (
          <div
            role="group"
            aria-label={`View ${garment.name} from the front or back`}
            className="absolute bottom-3 left-1/2 z-[3] flex -translate-x-1/2 rounded-full border hairline bg-alabaster/90 p-0.5 backdrop-blur-sm"
          >
            {(["front", "back"] as const).map((s) => {
              const on = side === s || (side === null && s === "front");
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSide(s)}
                  className={`micro rounded-full px-3 py-1.5 transition-colors ${
                    on ? "bg-carbon text-alabaster" : "text-carbon-2 hover:text-carbon"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        )}

        {/* quick-add size bar */}
        {garment.status === "live" && quickSizes.length > 0 && (
          <div className={`pointer-events-none absolute inset-x-0 ${canFlip ? "bottom-12" : "bottom-2"} z-[3] translate-y-2 px-2 opacity-0 transition-[opacity,translate] duration-300 ease-[var(--ease-out)] group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100`}>
            <div role="group" aria-label={`Quick add ${garment.name}`} className="flex items-center justify-center gap-1 rounded-full bg-alabaster/95 p-1 shadow-[var(--shadow-lift)] backdrop-blur-sm lg:justify-start">
              <span className="micro hidden pl-3 pr-1 text-steel-deep lg:inline" aria-live="polite">
                {added ? "Added" : "Quick add"}
              </span>
              <div className="flex gap-1 lg:ml-auto">
                {quickSizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-label={`Add size ${s} to bag`}
                    onClick={() => quickAdd(s)}
                    className={`tabular size-7 rounded-full text-[0.65rem] font-semibold transition-colors ${
                      added === s ? "bg-terracotta text-alabaster" : "hover:bg-carbon hover:text-alabaster"
                    }`}
                  >
                    {added === s ? "✓" : s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold leading-snug">
          <Link href={`/product/${garment.slug}`} className="group-hover:text-terracotta">
            {garment.name}
          </Link>
        </h3>
        <p className="tabular shrink-0 text-sm">
          {garment.compareAt && (
            <span className="mr-1.5 text-steel-deep line-through">{formatINR(garment.compareAt)}</span>
          )}
          {formatINR(garment.price)}
        </p>
      </div>
      <p className="mt-0.5 flex items-center gap-2 text-xs text-steel-deep">
        {garment.color}
        {showDrop && (
          <>
            <span aria-hidden>·</span>
            <span className={waitlist ? "text-cobalt" : ""}>{waitlist ? "Waitlist" : `Drop 0${garment.drop}`}</span>
          </>
        )}
      </p>
    </article>
  );
}
