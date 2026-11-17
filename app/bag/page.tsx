"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/products";

export default function BagPage() {
  const { lines, subtotal, remove, setQty } = useCart();
  const [checkoutNote, setCheckoutNote] = useState(false);
  const shippingFree = subtotal >= 1999;

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-28 text-center sm:px-6">
        <h1 className="display text-5xl md:text-6xl">Suspiciously quiet.</h1>
        <p className="mt-4 max-w-sm text-ink-2">
          Your bag is empty, which is very unlike you. Drop 01 is live and the one-run prints
          don&rsquo;t wait around.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/new-arrivals" className="btn btn-ink">
            Shop new arrivals
          </Link>
          <Link href="/" className="btn btn-ghost">
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 md:pt-14">
      <h1 className="display text-5xl md:text-6xl">Your bag</h1>
      <p className="tabular mt-2 text-sm text-ink-3">
        {lines.reduce((n, l) => n + l.qty, 0) === 1
          ? "1 item"
          : `${lines.reduce((n, l) => n + l.qty, 0)} items`}
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        {/* lines */}
        <ul className="divide-y hairline border-t hairline">
          {lines.map((line) => (
            <li key={`${line.slug}-${line.size}`} className="flex gap-5 py-6">
              <Link
                href={`/product/${line.slug}`}
                className="img-frame relative h-36 w-28 shrink-0 sm:h-44 sm:w-32"
              >
                <Image
                  src={line.product.images[0]}
                  alt={line.product.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-baseline justify-between gap-3">
                  <Link
                    href={`/product/${line.slug}`}
                    className="font-semibold hover:text-cobalt sm:text-lg"
                  >
                    {line.product.name}
                  </Link>
                  <span className="tabular font-semibold">
                    {formatINR(line.product.price * line.qty)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-3">
                  {line.product.color} · Size {line.size}
                </p>
                <p className="tabular mt-0.5 text-xs text-ink-3">
                  {formatINR(line.product.price)} each
                </p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center rounded-full border hairline">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty(line.slug, line.size, line.qty - 1)}
                      className="px-4 py-2 hover:text-cobalt"
                    >
                      −
                    </button>
                    <span className="tabular w-6 text-center text-sm">{line.qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty(line.slug, line.size, line.qty + 1)}
                      className="px-4 py-2 hover:text-cobalt"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.slug, line.size)}
                    className="text-sm text-ink-3 underline underline-offset-2 hover:text-cobalt"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* summary */}
        <aside className="h-fit rounded-md bg-chalk-2/70 p-6 lg:sticky lg:top-24">
          <h2 className="display text-2xl">Summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-2">Subtotal</dt>
              <dd className="tabular font-medium">{formatINR(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-2">Shipping</dt>
              <dd className="tabular font-medium">{shippingFree ? "Free" : formatINR(99)}</dd>
            </div>
            <div className="flex justify-between border-t hairline pt-3 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="tabular font-semibold">
                {formatINR(subtotal + (shippingFree ? 0 : 99))}
              </dd>
            </div>
          </dl>
          {!shippingFree && (
            <p className="mt-3 text-xs text-ink-3">
              Add {formatINR(1999 - subtotal)} more and shipping&rsquo;s on us.
            </p>
          )}
          <button type="button" onClick={() => setCheckoutNote(true)} className="btn btn-ink mt-6 w-full">
            Checkout
          </button>
          {checkoutNote && (
            <p role="status" className="mt-3 text-center text-xs text-ink-2">
              This is a concept store — checkout opens when RABBLE does. Your bag is saved on this
              device.
            </p>
          )}
          <p className="mt-4 text-center text-xs text-ink-3">
            14-day returns · UPI, cards &amp; COD at launch
          </p>
        </aside>
      </div>
    </div>
  );
}
