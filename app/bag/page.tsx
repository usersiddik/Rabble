"use client";

import Link from "next/link";
import IntentLink from "@/components/IntentLink";
import { useState } from "react";
import GarmentCutout from "@/components/GarmentCutout";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/content/garments";
import { site } from "@/content/site";

export default function BagPage() {
  const { lines, subtotal, remove, setQty } = useCart();
  const [checkoutNote, setCheckoutNote] = useState(false);
  const shippingFree = subtotal >= site.freeShippingOver;
  const count = lines.reduce((n, l) => n + l.qty, 0);

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-28 text-center sm:px-6">
        <h1 className="display text-5xl md:text-6xl">Suspiciously quiet.</h1>
        <p className="prose-editorial mt-4 max-w-sm">
          Your bag is empty, which is very unlike you. Drop 01 is live and the one-run prints don&rsquo;t wait around.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/new-arrivals" className="btn btn-carbon">
            Shop Drop 01
          </Link>
          <IntentLink href="/" className="btn btn-ghost">
            Back home
          </IntentLink>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 md:pt-14">
      <h1 className="display text-5xl md:text-6xl">Your bag</h1>
      <p className="tabular mt-2 text-sm text-steel-deep">{count === 1 ? "1 item" : `${count} items`}</p>

      <div className="mt-10 grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-16">
        <ul className="divide-y hairline border-y hairline">
          {lines.map((line) => (
            <li key={`${line.slug}-${line.size}`} className="flex gap-5 py-6">
              <Link href={`/product/${line.slug}`} className="studio relative h-36 w-28 shrink-0 p-2">
                <GarmentCutout garment={line.product} side="front" hanger={false} alt="" className="h-full w-full" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/product/${line.slug}`} className="font-semibold hover:text-terracotta">
                      {line.product.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-steel-deep">
                      {line.product.color} · Size {line.size}
                    </p>
                  </div>
                  <p className="tabular shrink-0">{formatINR(line.product.price * line.qty)}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center rounded-full border hairline">
                    <button type="button" aria-label={`Decrease quantity of ${line.product.name}`} onClick={() => (line.qty > 1 ? setQty(line.slug, line.size, line.qty - 1) : remove(line.slug, line.size))} className="px-4 py-2 hover:text-terracotta">
                      −
                    </button>
                    <span className="tabular w-6 text-center text-sm font-medium">{line.qty}</span>
                    <button type="button" aria-label={`Increase quantity of ${line.product.name}`} onClick={() => setQty(line.slug, line.size, line.qty + 1)} className="px-4 py-2 hover:text-terracotta">
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

        <aside className="md:sticky md:top-24 md:self-start">
          <div className="rounded-md bg-alabaster-2 p-6">
            <h2 className="display text-xl">Summary</h2>
            <dl className="tabular mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-carbon-2">Subtotal</dt>
                <dd>{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-carbon-2">Shipping</dt>
                <dd>{shippingFree ? "Free" : "₹99"}</dd>
              </div>
              <div className="flex justify-between border-t hairline pt-3 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatINR(subtotal + (shippingFree ? 0 : 99))}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-steel-deep">Inclusive of GST. COD adds ₹49 at the door.</p>
            {!shippingFree && (
              <p className="mt-3 text-xs text-terracotta">{formatINR(site.freeShippingOver - subtotal)} more for free shipping.</p>
            )}
            <button type="button" onClick={() => setCheckoutNote(true)} className="btn btn-carbon mt-6 w-full">
              Checkout
            </button>
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Payment methods">
              {site.payments.map((p) => (
                <span key={p} className="micro rounded-[var(--radius-xs)] border hairline px-2 py-1 text-carbon-2">
                  {p}
                </span>
              ))}
            </div>
            {checkoutNote && (
              <p role="status" className="serif-note mt-4 text-lg">
                Checkout opens with Drop 02. Until then, this is a concept store — nothing ships yet.
              </p>
            )}
          </div>
          <Link href="/new-arrivals" className="label mt-6 inline-block hover:text-terracotta">
            ← Keep shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
