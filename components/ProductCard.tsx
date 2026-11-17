"use client";

/**
 * Editorial grid card: Front | Back mini-pill toggle (top-right),
 * hover cross-fade to the back print, slide-up quick-add size bar.
 * Cross-fades/slides are hardware-accelerated CSS transitions;
 * scroll entrances are handled by the parent via ScrollTrigger.batch.
 */

import Link from "next/link";
import { useState } from "react";
import { formatPrice, type Product } from "@/data/products";
import { useBag } from "./CartContext";

const QUICK_SIZES = ["S", "M", "L", "XL"];

export default function ProductCard({ product }: { product: Product }) {
  const [face, setFace] = useState<"front" | "back">("front");
  const [addedSize, setAddedSize] = useState<string | null>(null);
  const { add } = useBag();

  const backOn = face === "back";

  return (
    <div className="nw-card group relative">
      <div className="relative overflow-hidden bg-studio-warm border border-neutral-300/50">
        {/* badge */}
        {product.badge && (
          <span className="absolute left-3 top-3 z-20 bg-neutral-950 text-studio px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em]">
            {product.badge}
          </span>
        )}

        {/* Front | Back mini-pill toggle */}
        <div className="absolute right-3 top-3 z-20 flex rounded-full border border-neutral-400/70 bg-studio/80 backdrop-blur-sm overflow-hidden">
          {(["front", "back"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFace(f)}
              className={`px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] transition-colors ${
                face === f ? "bg-neutral-900 text-white" : "text-neutral-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <Link href={`/product/${product.slug}`} className="block relative aspect-[4/5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.frontImage}
            alt={`${product.name} — front`}
            className={`garment-shadow absolute inset-0 m-auto h-[82%] w-auto transition-opacity duration-500 ${
              backOn ? "opacity-0" : "opacity-100 group-hover:opacity-0"
            }`}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.backImage}
            alt={`${product.name} — back`}
            className={`garment-shadow absolute inset-0 m-auto h-[82%] w-auto transition-opacity duration-500 ${
              backOn ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          />
        </Link>

        {/* slide-up quick-add bar */}
        <div className="absolute inset-x-0 bottom-0 z-20 translate-y-full group-hover:translate-y-0 focus-within:translate-y-0 transition-transform duration-300 will-change-transform bg-neutral-950/90 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 py-2.5">
            <span className="text-[9px] uppercase tracking-[0.16em] text-neutral-400 mr-1">
              {addedSize ? `Added ${addedSize} ✓` : "Quick add"}
            </span>
            {QUICK_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  add(product.slug, s);
                  setAddedSize(s);
                }}
                className="h-7 w-7 rounded-full border border-neutral-600 text-[10px] text-studio hover:bg-studio hover:text-neutral-950 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div>
          <Link
            href={`/product/${product.slug}`}
            className="text-[13px] font-medium tracking-tight hover:underline underline-offset-4"
          >
            {product.name}
          </Link>
          <p className="text-[11px] text-neutral-500">{product.subtitle.split("·")[1]?.trim()}</p>
        </div>
        <p className="text-[13px]">
          {product.compareAt && (
            <span className="text-neutral-400 line-through mr-2 text-[11px]">
              {formatPrice(product.compareAt)}
            </span>
          )}
          {formatPrice(product.price)}
        </p>
      </div>
    </div>
  );
}
