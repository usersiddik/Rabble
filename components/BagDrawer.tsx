"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/content/garments";
import { site } from "@/content/site";
import GarmentCutout from "./GarmentCutout";

export default function BagDrawer() {
  const { lines, subtotal, drawerOpen, closeDrawer, remove, setQty } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
      if (e.key === "Tab" && panel) {
        const focusables = panel.querySelectorAll<HTMLElement>("button, [href], input, [tabindex]:not([tabindex='-1'])");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      returnFocus.current?.focus();
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;

  const remaining = site.freeShippingOver - subtotal;

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close bag" onClick={closeDrawer} className="absolute inset-0 bg-carbon/40" style={{ animation: "page-in 0.25s both" }} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bag-title"
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-alabaster shadow-[var(--shadow-float)] outline-none"
        style={{ animation: "drawer-in 0.35s var(--ease-out) both" }}
      >
        <div className="flex items-center justify-between border-b hairline px-6 py-5">
          <h2 id="bag-title" className="display text-xl">
            Your bag
          </h2>
          <button type="button" onClick={closeDrawer} className="label hover:text-terracotta">
            Close
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="display text-2xl">Suspiciously quiet.</p>
            <p className="max-w-xs text-sm text-carbon-2">Drop 01 is live and the one-run prints don&rsquo;t wait around.</p>
            <Link href="/new-arrivals" onClick={closeDrawer} className="btn btn-carbon">
              Shop Drop 01
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y hairline overflow-y-auto px-6">
              {lines.map((line) => (
                <li key={`${line.slug}-${line.size}`} className="flex gap-4 py-5">
                  <Link href={`/product/${line.slug}`} onClick={closeDrawer} className="studio relative h-24 w-20 shrink-0 p-1">
                    <GarmentCutout garment={line.product} side="front" hanger={false} alt="" className="h-full w-full" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{line.product.name}</p>
                        <p className="mt-0.5 text-xs text-steel-deep">
                          {line.product.color} · {line.size}
                        </p>
                      </div>
                      <p className="tabular shrink-0 text-sm">{formatINR(line.product.price * line.qty)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border hairline">
                        <button type="button" aria-label={`Decrease quantity of ${line.product.name}`} onClick={() => (line.qty > 1 ? setQty(line.slug, line.size, line.qty - 1) : remove(line.slug, line.size))} className="px-3 py-1.5 text-sm hover:text-terracotta">
                          −
                        </button>
                        <span className="tabular w-5 text-center text-xs font-medium">{line.qty}</span>
                        <button type="button" aria-label={`Increase quantity of ${line.product.name}`} onClick={() => setQty(line.slug, line.size, line.qty + 1)} className="px-3 py-1.5 text-sm hover:text-terracotta">
                          +
                        </button>
                      </div>
                      <button type="button" onClick={() => remove(line.slug, line.size)} className="text-xs text-steel-deep underline underline-offset-2 hover:text-terracotta">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t hairline px-6 py-5">
              <p className="text-xs text-carbon-2">
                {remaining > 0 ? `${formatINR(remaining)} away from free shipping.` : "Free shipping unlocked."}
              </p>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="label">Subtotal</span>
                <span className="tabular text-lg font-semibold">{formatINR(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-steel-deep">Inclusive of GST. UPI, cards or COD at checkout.</p>
              <Link href="/bag" onClick={closeDrawer} className="btn btn-carbon mt-4 w-full">
                Review &amp; checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
