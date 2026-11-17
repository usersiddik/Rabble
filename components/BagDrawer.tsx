"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/products";

export default function BagDrawer() {
  const { lines, subtotal, drawerOpen, closeDrawer, remove, setQty } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close bag"
        onClick={closeDrawer}
        className="absolute inset-0 bg-ink/40"
        style={{ animation: "page-in 0.25s both" }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-chalk shadow-2xl outline-none"
        style={{ animation: "drawer-in 0.35s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        <style>{`@keyframes drawer-in{from{transform:translateX(100%)}to{transform:none}}`}</style>
        <div className="flex items-center justify-between border-b hairline px-6 py-5">
          <h2 className="display text-xl">Your bag</h2>
          <button type="button" onClick={closeDrawer} className="label hover:text-cobalt">
            Close
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="display text-2xl">Suspiciously quiet.</p>
            <p className="text-sm text-ink-2">Nothing in your bag yet. Go make some noise.</p>
            <Link href="/new-arrivals" onClick={closeDrawer} className="btn btn-ink mt-2">
              Shop new arrivals
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y hairline overflow-y-auto px-6">
              {lines.map((line) => (
                <li key={`${line.slug}-${line.size}`} className="flex gap-4 py-5">
                  <Link
                    href={`/product/${line.slug}`}
                    onClick={closeDrawer}
                    className="img-frame relative h-28 w-20 shrink-0"
                  >
                    <Image
                      src={line.product.images[0]}
                      alt={line.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-baseline justify-between gap-2">
                      <Link
                        href={`/product/${line.slug}`}
                        onClick={closeDrawer}
                        className="font-semibold hover:text-cobalt"
                      >
                        {line.product.name}
                      </Link>
                      <span className="tabular text-sm">
                        {formatINR(line.product.price * line.qty)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-3">
                      {line.product.color} · {line.size}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border hairline">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          className="px-3 py-1 text-sm hover:text-cobalt"
                          onClick={() => setQty(line.slug, line.size, line.qty - 1)}
                        >
                          −
                        </button>
                        <span className="tabular w-6 text-center text-sm">{line.qty}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          className="px-3 py-1 text-sm hover:text-cobalt"
                          onClick={() => setQty(line.slug, line.size, line.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.slug, line.size)}
                        className="text-xs text-ink-3 underline underline-offset-2 hover:text-cobalt"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t hairline px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="label">Subtotal</span>
                <span className="tabular text-lg font-semibold">{formatINR(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-ink-3">
                {subtotal >= 1999
                  ? "Free shipping unlocked."
                  : `Add ${formatINR(1999 - subtotal)} more for free shipping.`}
              </p>
              <Link href="/bag" onClick={closeDrawer} className="btn btn-ink mt-4 w-full">
                Review bag &amp; checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
