"use client";

/**
 * Focused Studio Inspect — the exact hero inspect component, replicated
 * for /product/[slug]. Front | Back print switcher runs the same crisp
 * GSAP 3D flip (power3.inOut family, 90° midpoint swap, 1.03 scale lift).
 */

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { products, formatPrice, SIZES, type Product } from "@/data/products";
import { Hanger, HangTag } from "./hero/Hanger";
import { useBag } from "./CartContext";

const pillCls =
  "border border-neutral-400 rounded-full px-7 py-2.5 text-xs uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-colors";

export default function ProductInspect({ product }: { product: Product }) {
  const scope = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLImageElement>(null);
  const backRef = useRef<HTMLImageElement>(null);
  const animating = useRef(false);

  const [face, setFace] = useState<"front" | "back">("front");
  const [size, setSize] = useState("M");
  const [added, setAdded] = useState(false);
  const { add } = useBag();

  const idx = products.findIndex((p) => p.slug === product.slug);

  useGSAP(
    () => {
      gsap.set(backRef.current, { autoAlpha: 0 });
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(flipRef.current, {
          autoAlpha: 0,
          scale: 0.94,
          duration: 0.7,
          ease: "power3.out",
        });
      });
    },
    { scope }
  );

  const flipFace = (target: "front" | "back") => {
    if (animating.current || target === face) return;
    animating.current = true;
    setFace(target);
    const k = prefersReducedMotion() ? 0 : 1;
    const show = target === "front" ? frontRef.current : backRef.current;
    const hide = target === "front" ? backRef.current : frontRef.current;
    gsap
      .timeline({ onComplete: () => (animating.current = false) })
      .to(flipRef.current, { rotationY: 90, duration: 0.3 * k, ease: "power3.in" }, 0)
      .to(flipRef.current, { scale: 1.03, duration: 0.3 * k, ease: "power3.in" }, 0)
      .set(hide, { autoAlpha: 0 })
      .set(show, { autoAlpha: 1 })
      .set(flipRef.current, { rotationY: -90 })
      .to(flipRef.current, { rotationY: 0, duration: 0.3 * k, ease: "power3.out" })
      .to(flipRef.current, { scale: 1, duration: 0.3 * k, ease: "power3.out" }, "<");
  };

  return (
    <section ref={scope} className="bg-studio min-h-[calc(100svh-56px)] pb-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* garment on its hanger, studio-centred */}
        <div className="persp relative mx-auto mt-10 w-[340px] max-w-full">
          <div ref={flipRef} className="preserve-3d relative h-[500px]">
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
              style={{ height: 96 }}
            >
              <Hanger />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={frontRef}
              src={product.frontImage}
              alt={`${product.name} — front print`}
              draggable={false}
              className="garment-shadow absolute left-1/2 z-20 select-none"
              style={{ top: 62, height: 430, width: "auto", maxWidth: "none", transform: "translateX(-50%)" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={backRef}
              src={product.backImage}
              alt={`${product.name} — back print`}
              draggable={false}
              className="garment-shadow absolute left-1/2 z-20 select-none opacity-0"
              style={{ top: 62, height: 430, width: "auto", maxWidth: "none", transform: "translateX(-50%)" }}
            />
            {product.badge && <HangTag label={product.badge} />}
          </div>
        </div>

        <p className="mt-6 text-[10px] tracking-[0.3em] text-neutral-500">
          {String(idx + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
        </p>
        <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
          {product.name}
        </h1>
        <p className="mt-1 text-[12px] text-neutral-500">{product.subtitle}</p>

        <div className="mt-4 flex justify-center gap-6">
          {(["front", "back"] as const).map((f) => (
            <button
              key={f}
              onClick={() => flipFace(f)}
              className={`pb-0.5 text-[12px] uppercase tracking-[0.2em] border-b transition-colors ${
                face === f
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-400 hover:text-neutral-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`h-10 w-10 rounded-full border text-[11px] transition-colors ${
                size === s
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "border-neutral-400 text-neutral-700 hover:border-neutral-900"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap justify-center items-center gap-4">
          <button
            onClick={() => {
              add(product.slug, size);
              setAdded(true);
            }}
            className={`${pillCls} ${added ? "bg-neutral-900 text-white" : ""}`}
          >
            {added ? "Added ✓" : `Add to Bag — ${formatPrice(product.price)}`}
          </button>
          <Link
            href="/"
            className="text-[11px] uppercase tracking-[0.18em] text-neutral-600 hover:text-neutral-900"
          >
            ← Back to Rack
          </Link>
        </div>

        {product.compareAt && (
          <p className="mt-2 text-[11px] text-neutral-400 line-through">
            {formatPrice(product.compareAt)}
          </p>
        )}

        <p className="mt-5 text-[10px] uppercase tracking-[0.16em] text-neutral-400">
          UPI &amp; COD Available&ensp;·&ensp;Free Shipping Over ₹1,999&ensp;·&ensp;7-Day Easy
          Exchange
        </p>

        {/* spec sheets */}
        <div className="mx-auto mt-10 grid max-w-xl grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {product.printSpecs && (
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 border-b border-neutral-300 pb-2">
                Print Specs
              </h3>
              <ul className="mt-3 space-y-1.5 text-[13px] text-neutral-700">
                {product.printSpecs.map((s) => (
                  <li key={s}>— {s}</li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 border-b border-neutral-300 pb-2">
              Fabric &amp; Fit
            </h3>
            <ul className="mt-3 space-y-1.5 text-[13px] text-neutral-700">
              {product.fabricSpecs.map((s) => (
                <li key={s}>— {s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
