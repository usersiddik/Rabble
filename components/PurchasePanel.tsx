"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

const SIZE_GUIDE = [
  { size: "XS", chest: "86–91", waist: "71–76" },
  { size: "S", chest: "91–96", waist: "76–81" },
  { size: "M", chest: "96–101", waist: "81–86" },
  { size: "L", chest: "101–109", waist: "86–94" },
  { size: "XL", chest: "109–117", waist: "94–102" },
  { size: "XXL", chest: "117–125", waist: "102–110" },
];

export default function PurchasePanel({ product }: { product: Product }) {
  const { add } = useCart();
  const oneSize = product.sizes.length === 1;
  const [size, setSize] = useState<string | null>(oneSize ? product.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  const handleAdd = () => {
    if (!size) {
      setError(true);
      return;
    }
    add(product.slug, size, qty);
    setQty(1);
  };

  return (
    <div>
      {/* size */}
      {!oneSize && (
        <div className="mt-8">
          <div className="flex items-baseline justify-between">
            <span className="label" id="size-label">
              Size{size ? ` — ${size}` : ""}
            </span>
            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              className="text-xs text-ink-3 underline underline-offset-2 hover:text-accent"
            >
              Size guide
            </button>
          </div>
          <div role="radiogroup" aria-labelledby="size-label" className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                onClick={() => {
                  setSize(s);
                  setError(false);
                }}
                className={`tabular min-w-[3rem] rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
                  size === s ? "border-ink bg-ink text-chalk" : "hairline hover:border-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {error && (
            <p role="alert" className="mt-2 text-xs font-medium text-accent">
              Pick a size first — the bag insists.
            </p>
          )}
        </div>
      )}

      {/* qty + add */}
      <div className="mt-8 flex gap-3">
        <div className="flex items-center rounded-full border hairline">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-4 py-3 hover:text-accent"
          >
            −
          </button>
          <span className="tabular w-6 text-center text-sm font-medium">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(9, q + 1))}
            className="px-4 py-3 hover:text-accent"
          >
            +
          </button>
        </div>
        <button type="button" onClick={handleAdd} className="btn btn-ink flex-1">
          Add to bag
        </button>
      </div>

      {product.stockNote && (
        <p className="mt-3 text-xs font-semibold text-clay">{product.stockNote} in this run.</p>
      )}

      {/* details accordions */}
      <div className="mt-10 divide-y hairline border-y hairline">
        <details className="group py-4">
          <summary className="label flex cursor-pointer list-none items-center justify-between">
            Fabric &amp; care
            <span className="transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-sm text-ink-2">{product.fabric}</p>
          <p className="mt-2 text-sm text-ink-2">
            Cold wash, inside out, line dry. Treat it mean, keep it keen.
          </p>
        </details>
        <details className="group py-4">
          <summary className="label flex cursor-pointer list-none items-center justify-between">
            Fit
            <span className="transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-sm text-ink-2">{product.fit}</p>
        </details>
        <details className="group py-4">
          <summary className="label flex cursor-pointer list-none items-center justify-between">
            Delivery &amp; returns
            <span className="transition-transform group-open:rotate-45">+</span>
          </summary>
          <ul className="mt-3 space-y-1.5 text-sm text-ink-2">
            <li>Free shipping on orders over ₹1,999.</li>
            <li>Metros in 2–4 days, everywhere else in 4–7.</li>
            <li>14-day returns, no interrogation. Tags on, please.</li>
          </ul>
        </details>
      </div>

      {/* size guide dialog */}
      {guideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close size guide"
            onClick={() => setGuideOpen(false)}
            className="absolute inset-0 bg-ink/40"
            style={{ animation: "page-in 0.2s both" }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Size guide"
            className="relative w-full max-w-sm rounded-md bg-chalk p-6 shadow-2xl"
            style={{ animation: "page-in 0.3s both" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="display text-xl">Size guide</h2>
              <button
                type="button"
                onClick={() => setGuideOpen(false)}
                className="label hover:text-accent"
              >
                Close
              </button>
            </div>
            <p className="mt-2 text-xs text-ink-3">
              Body measurements in cm. Between sizes? Our cuts run roomy — size down for neat, up
              for loud.
            </p>
            <table className="tabular mt-4 w-full text-sm">
              <thead>
                <tr className="label border-b hairline text-left text-ink-3">
                  <th className="py-2 font-semibold">Size</th>
                  <th className="py-2 font-semibold">Chest</th>
                  <th className="py-2 font-semibold">Waist</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_GUIDE.map((row) => (
                  <tr key={row.size} className="border-b hairline last:border-0">
                    <td className="py-2 font-semibold">{row.size}</td>
                    <td className="py-2">{row.chest}</td>
                    <td className="py-2">{row.waist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
