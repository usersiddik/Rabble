"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatINR, type Garment } from "@/content/garments";
import { site } from "@/content/site";
import NotifyMe from "./NotifyMe";
import { SizeGuideDialog } from "./SizeGuide";

/**
 * Size, quantity, add-to-bag — plus the sticky bar that follows mobile users down the page.
 * Waitlist pieces swap the bag for "notify me".
 */
export default function PurchasePanel({ garment }: { garment: Garment }) {
  const { add } = useCart();
  const oneSize = garment.sizes.length === 1;
  const [size, setSize] = useState<string | null>(oneSize ? garment.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);

  const waitlist = garment.status === "waitlist";

  // show the sticky bar once the main button scrolls out of view
  useEffect(() => {
    const el = anchorRef.current;
    if (!el || waitlist) return;
    const io = new IntersectionObserver(([entry]) => setStickyVisible(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [waitlist]);

  const handleAdd = () => {
    if (!size) {
      setError(true);
      sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      sizeRef.current?.querySelector<HTMLElement>("[role=radio]")?.focus();
      return;
    }
    add(garment.slug, size, qty);
    setQty(1);
  };

  if (waitlist) {
    return (
      <div>
        <NotifyMe garment={garment} />
        <Details garment={garment} />
      </div>
    );
  }

  return (
    <div>
      {/* size */}
      {!oneSize && (
        <div className="mt-8" ref={sizeRef}>
          <div className="flex items-baseline justify-between">
            <span className="label" id="size-label">
              Size{size ? ` — ${size}` : ""}
            </span>
            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              className="text-xs text-steel-deep underline underline-offset-2 hover:text-terracotta"
            >
              Size guide
            </button>
          </div>
          <div role="radiogroup" aria-labelledby="size-label" aria-describedby={error ? "size-error" : undefined} className="mt-3 flex flex-wrap gap-2">
            {garment.sizes.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                onClick={() => {
                  setSize(s);
                  setError(false);
                }}
                className="pill tabular min-w-[3rem] px-4 py-2.5 text-sm font-medium"
              >
                {s}
              </button>
            ))}
          </div>
          {error && (
            <p id="size-error" role="alert" className="mt-2 text-xs font-medium text-terracotta">
              Pick a size first — the bag insists.
            </p>
          )}
        </div>
      )}

      {/* qty + add */}
      <div className="mt-8 flex gap-3" ref={anchorRef}>
        <div className="flex items-center rounded-full border hairline">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-3 hover:text-terracotta">
            −
          </button>
          <span className="tabular w-6 text-center text-sm font-medium" aria-live="polite">
            {qty}
          </span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(9, q + 1))} className="px-4 py-3 hover:text-terracotta">
            +
          </button>
        </div>
        <button type="button" onClick={handleAdd} className="btn btn-carbon flex-1">
          Add to bag
        </button>
      </div>

      {garment.stockNote && (
        <p className="mt-3 text-xs font-semibold text-terracotta">
          {garment.stockNote} of {garment.runSize} in this run.
        </p>
      )}

      <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-carbon-2">
        <li>UPI · Cards · COD</li>
        <li>Free shipping over {formatINR(site.freeShippingOver)}</li>
        <li>{site.returnsWindowDays}-day returns</li>
      </ul>

      <Details garment={garment} />

      <SizeGuideDialog open={guideOpen} onClose={() => setGuideOpen(false)} />

      {/* sticky mobile bar */}
      <div
        aria-hidden={!stickyVisible}
        className={`fixed inset-x-0 bottom-0 z-30 border-t hairline bg-alabaster/95 px-4 py-3 backdrop-blur-sm transition-transform duration-[var(--duration-base)] md:hidden ${
          stickyVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{garment.name}</p>
            <p className="tabular text-xs text-steel-deep">
              {formatINR(garment.price)}
              {size ? ` · ${size}` : " · pick a size"}
            </p>
          </div>
          <button type="button" onClick={handleAdd} tabIndex={stickyVisible ? 0 : -1} className="btn btn-carbon">
            Add to bag
          </button>
        </div>
      </div>
    </div>
  );
}

function Details({ garment }: { garment: Garment }) {
  return (
    <div className="mt-10 divide-y hairline border-y hairline">
      <details className="group py-4">
        <summary className="label flex cursor-pointer list-none items-center justify-between">
          Fabric &amp; care
          <span className="transition-transform group-open:rotate-45" aria-hidden>
            +
          </span>
        </summary>
        <p className="mt-3 text-sm text-carbon-2">{garment.print.fabric}.</p>
        <p className="mt-2 text-sm text-carbon-2">Cold wash, inside out, line dry. No iron on the ink. Treat it mean, keep it keen.</p>
      </details>
      <details className="group py-4">
        <summary className="label flex cursor-pointer list-none items-center justify-between">
          Fit
          <span className="transition-transform group-open:rotate-45" aria-hidden>
            +
          </span>
        </summary>
        <p className="mt-3 text-sm text-carbon-2">{garment.fit}</p>
        <Link href="/size-help" className="mt-2 inline-block text-xs underline underline-offset-2 hover:text-terracotta">
          Full size help
        </Link>
      </details>
      <details className="group py-4">
        <summary className="label flex cursor-pointer list-none items-center justify-between">
          Delivery &amp; returns
          <span className="transition-transform group-open:rotate-45" aria-hidden>
            +
          </span>
        </summary>
        <ul className="mt-3 space-y-1.5 text-sm text-carbon-2">
          <li>Free shipping on orders over {formatINR(site.freeShippingOver)}. Flat ₹99 below.</li>
          <li>
            Metros in {site.deliveryMetroDays} days, everywhere else in {site.deliveryRestDays}.
          </li>
          <li>{site.returnsWindowDays}-day returns, no interrogation. Tags on, please.</li>
        </ul>
        <Link href="/shipping-returns" className="mt-2 inline-block text-xs underline underline-offset-2 hover:text-terracotta">
          Shipping &amp; returns in full
        </Link>
      </details>
    </div>
  );
}
