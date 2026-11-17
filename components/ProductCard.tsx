"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatINR, type Product } from "@/lib/products";

const BADGE_LABEL: Record<string, string> = {
  new: "New drop",
  "low-stock": "Low stock",
  sale: "−20%",
};

const QUICK_SIZES = ["S", "M", "L", "XL"];

interface ProductCardProps {
  product: Product;
  /** marks the LCP candidates on collection pages */
  priority?: boolean;
  sizes?: string;
}

/**
 * Product card with a Front | Back flip (auto-flips on hover, pill toggle for
 * touch) and a slide-up quick-add size bar.
 */
export default function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
}: ProductCardProps) {
  const { add } = useCart();
  const [front, back] = product.images;
  const hasBack = Boolean(back);
  // null = follow hover; "front" / "back" = pinned by the pill
  const [pinned, setPinned] = useState<"front" | "back" | null>(null);
  const [added, setAdded] = useState<string | null>(null);

  const quickSizes = product.sizes.filter((s) => QUICK_SIZES.includes(s));
  const oneSize = product.sizes.length === 1;

  const quickAdd = (size: string) => {
    add(product.slug, size, 1);
    setAdded(size);
    setTimeout(() => setAdded(null), 1400);
  };

  const cardCls = `flip-card ${pinned === "back" ? "is-back" : ""} ${pinned === "front" || !hasBack ? "is-front" : ""}`;

  return (
    <div className="group">
      <div className="img-frame flip-scene relative aspect-[4/5]">
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0 block"
          aria-label={`${product.name} in ${product.color}`}
        >
          <div className={cardCls}>
            <div className="flip-face">
              <Image
                src={front}
                alt={`${product.name} in ${product.color}, front`}
                fill
                priority={priority}
                sizes={sizes}
                className="object-cover"
              />
            </div>
            {hasBack && (
              <div className="flip-face flip-face--back">
                <Image
                  src={back}
                  alt={`${product.name}, back`}
                  fill
                  sizes={sizes}
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {product.badge && (
            <span
              className={`hang-tag absolute left-3 top-3 z-10 ${
                product.badge === "new" ? "hang-tag--accent" : ""
              }`}
            >
              {product.stockNote ?? BADGE_LABEL[product.badge]}
            </span>
          )}
        </Link>

        {/* Front | Back pill */}
        {hasBack && (
          <div
            role="radiogroup"
            aria-label="View side"
            className="absolute right-3 top-3 z-10 inline-flex rounded-full border border-white/40 bg-ink/70 p-0.5 text-chalk backdrop-blur-sm"
          >
            {(["front", "back"] as const).map((side) => {
              const on = pinned === side;
              return (
                <button
                  key={side}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setPinned((p) => (p === side ? null : side))}
                  className={`rounded-full px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
                    on ? "bg-chalk text-ink" : "text-chalk/80 hover:text-chalk"
                  }`}
                >
                  {side}
                </button>
              );
            })}
          </div>
        )}

        {/* quick-add size bar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-2 z-10 px-2 opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <div className="flex items-center gap-1 rounded-full bg-studio/95 p-1 shadow-lg backdrop-blur-sm">
            <span className="label pl-3 pr-1 text-[0.55rem] text-ink-3">
              {added ? "Added" : "Quick add"}
            </span>
            {oneSize ? (
              <button
                type="button"
                onClick={() => quickAdd(product.sizes[0])}
                className="tabular ml-auto flex-1 rounded-full bg-ink px-3 py-1.5 text-[0.65rem] font-semibold text-chalk hover:bg-accent"
              >
                {added ? "✓" : "One size"}
              </button>
            ) : (
              <div className="ml-auto flex gap-1">
                {quickSizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-label={`Quick add size ${s}`}
                    onClick={() => quickAdd(s)}
                    className={`tabular size-7 rounded-full text-[0.65rem] font-semibold transition-colors ${
                      added === s
                        ? "bg-accent text-chalk"
                        : "hover:bg-ink hover:text-chalk"
                    }`}
                  >
                    {added === s ? "✓" : s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Link href={`/product/${product.slug}`} className="block" tabIndex={-1}>
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-semibold leading-snug group-hover:text-accent">
            {product.name}
          </h3>
          <p className="tabular shrink-0 text-sm">
            {product.compareAt && (
              <span className="mr-1.5 text-ink-3 line-through">
                {formatINR(product.compareAt)}
              </span>
            )}
            {formatINR(product.price)}
          </p>
        </div>
        <p className="mt-0.5 text-xs text-ink-3">{product.color}</p>
      </Link>
    </div>
  );
}
