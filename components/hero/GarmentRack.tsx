"use client";

/**
 * THE INTERACTIVE STUDIO GARMENT RAIL
 * ───────────────────────────────────
 * • Brushed-steel rail + hook/wooden-hanger rig, 7 hung garment cutouts
 * • 1 Active (front-facing, 340px) / 6 Inactive (side-profile, 95px)
 * • Two-phase 3D side-to-front flip with 90° midpoint image swap,
 *   expo.out width interpolation + rail recentring, elastic pendulum settle
 * • Focused Studio Inspect state with Front | Back print switcher
 *
 * GSAP is the single animation engine (useGSAP auto-cleanup, gsap.matchMedia
 * for touch + prefers-reduced-motion). The rail width interpolation is the
 * one sanctioned layout-property tween (7 nodes, isolated subtree) — every
 * other tween is GPU-only (x, scale, rotationY/Z, autoAlpha).
 */

import Link from "next/link";
import { useRef, useState, useCallback } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import {
  products,
  byCategory,
  formatPrice,
  SIZES,
  type Product,
  type Category,
} from "@/data/products";
import { Hanger, HangTag } from "./Hanger";
import { useBag } from "../CartContext";

type Filter = "all" | Category;
type Mode = "rack" | "inspect";
type Face = "front" | "back";

const D = { HANG_H: 92, IMG_H: 400, IMG_TOP: 58, ACT_W: 340, INACT_W: 95, GAP: 18 };
const M = { HANG_H: 64, IMG_H: 260, IMG_TOP: 40, W: 170, GAP: 14 };

const pillCls =
  "border border-neutral-400 rounded-full px-7 py-2.5 text-xs uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-colors";

export default function GarmentRack() {
  const scope = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);

  const [filter, setFilter] = useState<Filter>("all");
  const [mode, setMode] = useState<Mode>("rack");
  const [face, setFace] = useState<Face>("front");
  const [size, setSize] = useState<string>("M");
  const [isMobile, setIsMobile] = useState(false);
  const [added, setAdded] = useState(false);

  const visible = filter === "all" ? products : byCategory(filter);
  const [activeSlug, setActiveSlug] = useState<string>(
    products[Math.floor(products.length / 2)].slug
  );
  const activeIdx = Math.max(0, visible.findIndex((p) => p.slug === activeSlug));
  const active: Product = visible[activeIdx] ?? visible[0];
  const { add } = useBag();

  /* ---------------- ref registries (keyed by slug) ---------------- */
  const itemR = useRef(new Map<string, HTMLDivElement>());
  const swingR = useRef(new Map<string, HTMLDivElement>());
  const flipR = useRef(new Map<string, HTMLDivElement>());
  const imgR = useRef(new Map<string, Record<string, HTMLElement | null>>());
  const reg =
    (m: React.MutableRefObject<Map<string, HTMLDivElement>>, slug: string) =>
    (el: HTMLDivElement | null) => {
      if (el) m.current.set(slug, el);
      else m.current.delete(slug);
    };
  const regImg = (slug: string, key: string) => (el: HTMLElement | null) => {
    const rec = imgR.current.get(slug) ?? {};
    rec[key] = el;
    imgR.current.set(slug, rec);
  };

  const dims = isMobile ? { ...M, ACT_W: M.W, INACT_W: M.W } : D;
  const flipH = dims.IMG_TOP + dims.IMG_H;

  /** Show front/back face group or side-profile group of one garment. */
  const showGroup = useCallback((slug: string, group: "front" | "back" | "side") => {
    const rec = imgR.current.get(slug);
    if (!rec) return;
    const faceOn = group === "front" || group === "back";
    const all = [rec.front, rec.back, rec.side, rec.hangFull, rec.hangProf].filter(Boolean);
    if (all.length) gsap.set(all, { autoAlpha: 0 });
    if (rec[group]) gsap.set(rec[group], { autoAlpha: 1 });
    const hang = faceOn ? rec.hangFull : rec.hangProf;
    if (hang) gsap.set(hang, { autoAlpha: 1 });
  }, []);

  /** Deterministic recentring: translate the row so the active garment centres. */
  const rowShift = useCallback(
    (list: Product[], activeSlugNow: string) => {
      const widths = list.map((p) =>
        p.slug === activeSlugNow ? dims.ACT_W : dims.INACT_W
      );
      const total =
        widths.reduce((a, b) => a + b, 0) + dims.GAP * (widths.length - 1);
      const idx = list.findIndex((p) => p.slug === activeSlugNow);
      let before = 0;
      for (let i = 0; i < idx; i++) before += widths[i] + dims.GAP;
      const activeCenter = before + widths[idx] / 2;
      return total / 2 - activeCenter;
    },
    [dims]
  );

  /* ---------------- mount / filter re-init ---------------- */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(max-width: 767px)", () => setIsMobile(true));
      mm.add("(min-width: 768px)", () => setIsMobile(false));

      visible.forEach((p) => {
        const item = itemR.current.get(p.slug);
        const swing = swingR.current.get(p.slug);
        const flip = flipR.current.get(p.slug);
        if (!item || !swing || !flip) return;
        gsap.set(swing, { transformOrigin: "50% 0%", scale: 1, rotationZ: 0 });
        gsap.set(flip, { transformOrigin: "50% 40%", rotationY: 0 });
        gsap.set(item, {
          width: isMobile || p.slug === activeSlug ? dims.ACT_W : dims.INACT_W,
          autoAlpha: 1,
          x: 0,
        });
        showGroup(p.slug, isMobile || p.slug === activeSlug ? "front" : "side");
      });
      if (rowRef.current && !isMobile) {
        gsap.set(rowRef.current, { x: rowShift(visible, activeSlug) });
      }
      if (panelRef.current) gsap.set(panelRef.current, { autoAlpha: 0 });
      if (captionRef.current) gsap.set(captionRef.current, { autoAlpha: 1 });
      // gentle entrance
      if (!prefersReducedMotion()) {
        gsap.from(
          visible.map((p) => swingR.current.get(p.slug)).filter(Boolean),
          { autoAlpha: 0, duration: 0.6, ease: "power2.out", stagger: 0.05 }
        );
      }
    },
    { scope, dependencies: [filter, isMobile], revertOnUpdate: true }
  );

  /* ---------------- two-phase rack selection flip ---------------- */
  const selectGarment = (slug: string) => {
    if (animating.current || mode !== "rack") return;
    if (slug === activeSlug) {
      openInspect();
      return;
    }
    const prev = activeSlug;
    setActiveSlug(slug);
    setFace("front");
    if (isMobile) {
      return; // mobile: native swipe rail, all garments front-facing
    }
    const reduced = prefersReducedMotion();
    const k = reduced ? 0 : 1;
    animating.current = true;

    const nextItem = itemR.current.get(slug)!;
    const prevItem = itemR.current.get(prev);
    const nextFlip = flipR.current.get(slug)!;
    const prevFlip = flipR.current.get(prev);
    const nextSwing = swingR.current.get(slug)!;

    const tl = gsap.timeline({ onComplete: () => (animating.current = false) });

    // Phase A — width interpolation + rail recentring
    tl.to(nextItem, { width: D.ACT_W, duration: 0.75 * k, ease: "expo.out" }, 0);
    if (prevItem)
      tl.to(prevItem, { width: D.INACT_W, duration: 0.75 * k, ease: "expo.out" }, 0);
    tl.to(
      rowRef.current,
      { x: rowShift(visible, slug), duration: 0.75 * k, ease: "expo.out" },
      0
    );

    // Phase B — 90° midpoint flips
    if (prevFlip) {
      tl.to(prevFlip, { rotationY: 90, duration: 0.22 * k, ease: "power2.in" }, 0)
        .add(() => showGroup(prev, "side"))
        .set(prevFlip, { rotationY: -90 })
        .to(prevFlip, { rotationY: 0, duration: 0.3 * k, ease: "power2.out" });
    }
    tl.fromTo(
      nextFlip,
      { rotationY: 0 },
      { rotationY: 90, duration: 0.26 * k, ease: "power2.in" },
      0.05 * k
    )
      .add(() => showGroup(slug, "front"))
      .set(nextFlip, { rotationY: -90 })
      .to(nextFlip, { rotationY: 0, duration: 0.55 * k, ease: "power3.out" })
      // pendulum hanger settle
      .fromTo(
        nextSwing,
        { rotationZ: 2.5 },
        { rotationZ: 0, ease: "elastic.out(1, 0.75)", duration: 1.2 * k },
        "-=0.4"
      );

    // caption swap
    if (captionRef.current) {
      tl.fromTo(
        captionRef.current,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.45 * k, ease: "power2.out" },
        0.3 * k
      );
    }
  };

  /* ---------------- focused studio inspect ---------------- */
  const openInspect = () => {
    if (animating.current || mode === "inspect") return;
    animating.current = true;
    setMode("inspect");
    setFace("front");
    setAdded(false);
    const reduced = prefersReducedMotion();
    const k = reduced ? 0 : 1;
    const swing = swingR.current.get(activeSlug)!;
    const tl = gsap.timeline({ onComplete: () => (animating.current = false) });

    visible.forEach((p, i) => {
      if (p.slug === activeSlug) return;
      const item = itemR.current.get(p.slug);
      if (!item) return;
      tl.to(
        item,
        { autoAlpha: 0, x: i < activeIdx ? -60 : 60, duration: 0.5 * k, ease: "power3.inOut" },
        0
      );
    });
    tl.to(swing, { scale: 1.08, duration: 0.6 * k, ease: "power3.inOut" }, 0);
    if (captionRef.current)
      tl.to(captionRef.current, { autoAlpha: 0, duration: 0.25 * k }, 0);
    if (panelRef.current)
      tl.fromTo(
        panelRef.current,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.5 * k, ease: "power3.out" },
        0.25 * k
      );
  };

  const closeInspect = () => {
    if (animating.current || mode === "rack") return;
    animating.current = true;
    const reduced = prefersReducedMotion();
    const k = reduced ? 0 : 1;
    const swing = swingR.current.get(activeSlug)!;
    const flip = flipR.current.get(activeSlug)!;
    const tl = gsap.timeline({
      onComplete: () => {
        animating.current = false;
        setMode("rack");
        setFace("front");
      },
    });
    if (panelRef.current)
      tl.to(panelRef.current, { autoAlpha: 0, y: 16, duration: 0.3 * k }, 0);
    tl.add(() => showGroup(activeSlug, "front"), 0);
    tl.set(flip, { rotationY: 0 }, 0);
    tl.to(swing, { scale: 1, duration: 0.5 * k, ease: "power3.inOut" }, 0.05 * k);
    visible.forEach((p) => {
      if (p.slug === activeSlug) return;
      const item = itemR.current.get(p.slug);
      if (!item) return;
      tl.to(item, { autoAlpha: 1, x: 0, duration: 0.5 * k, ease: "power3.out" }, 0.15 * k);
    });
    if (captionRef.current)
      tl.to(captionRef.current, { autoAlpha: 1, duration: 0.4 * k }, 0.3 * k);
  };

  /* ---------------- Front | Back print switcher ---------------- */
  const flipFace = (target: Face) => {
    if (animating.current || target === face || mode !== "inspect") return;
    animating.current = true;
    setFace(target);
    const reduced = prefersReducedMotion();
    const k = reduced ? 0 : 1;
    const flip = flipR.current.get(activeSlug)!;
    const tl = gsap.timeline({ onComplete: () => (animating.current = false) });
    tl.to(flip, { rotationY: 90, duration: 0.3 * k, ease: "power3.in" }, 0)
      .to(flip, { scale: 1.03, duration: 0.3 * k, ease: "power3.in" }, 0)
      .add(() => showGroup(activeSlug, target))
      .set(flip, { rotationY: -90 })
      .to(flip, { rotationY: 0, duration: 0.3 * k, ease: "power3.out" })
      .to(flip, { scale: 1, duration: 0.3 * k, ease: "power3.out" }, "<");
  };

  const onFilter = (f: Filter) => {
    if (f === filter) return;
    setMode("rack");
    setFace("front");
    const list = f === "all" ? products : byCategory(f);
    setActiveSlug(list[Math.floor(list.length / 2)].slug);
    setFilter(f);
  };

  const onAdd = () => {
    add(active.slug, size);
    setAdded(true);
  };

  /* ================================================================ render */
  return (
    <section ref={scope} className="relative bg-studio overflow-hidden">
      {/* ——— framed sub-header, exact to reference ——— */}
      <div className="mx-auto max-w-[1500px] px-5 md:px-8 pt-5">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hairline flex-1" />
          <p className="text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-neutral-800 whitespace-nowrap">
            New Collection&ensp;|&ensp;Printed Tees &amp; Boutique Atelier
          </p>
          <div className="hairline flex-1" />
        </div>
        <div className="mt-3 flex justify-center gap-2">
          {(
            [
              ["all", "All"],
              ["printed-tee", "Front & Back Tees"],
              ["womens-boutique", "Women's Boutique"],
            ] as [Filter, string][]
          ).map(([f, label]) => (
            <button
              key={f}
              onClick={() => onFilter(f)}
              className={`rounded-full border px-4 py-1.5 text-[10px] uppercase tracking-[0.16em] transition-colors ${
                filter === f
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "border-neutral-400 text-neutral-700 hover:border-neutral-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ——— the rail ——— */}
      <div className="relative mt-6 md:mt-8">
        {/* brushed-steel garment bar + end posts */}
        <div className="absolute left-0 right-0 top-[30px] h-[5px] steel-rail z-0" />
        <div className="steel-post absolute left-2 md:left-6 top-[14px] h-16 w-[6px] rounded-sm z-0" />
        <div className="steel-post absolute right-2 md:right-6 top-[14px] h-16 w-[6px] rounded-sm z-0" />

        {/* garments */}
        <div
          className={`relative z-10 mt-[22px] ${
            isMobile
              ? "flex overflow-x-auto snap-x snap-mandatory px-6 pb-2 [-webkit-overflow-scrolling:touch]"
              : "flex justify-center items-start px-6 persp"
          }`}
          ref={rowRef}
          style={{ gap: dims.GAP }}
        >
          {visible.map((p) => {
            const isActive = p.slug === activeSlug;
            return (
              <div
                key={p.slug}
                ref={reg(itemR, p.slug)}
                className={`relative shrink-0 ${isMobile ? "snap-center" : ""}`}
                style={{
                  width: isMobile || isActive ? dims.ACT_W : dims.INACT_W,
                  height: flipH,
                }}
              >
                <button
                  aria-label={isActive ? `Inspect ${p.name}` : `View ${p.name}`}
                  onClick={() => (isActive ? openInspect() : selectGarment(p.slug))}
                  className="block w-full h-full cursor-pointer"
                >
                  <div ref={reg(swingR, p.slug)} className="relative w-full h-full">
                    <div
                      ref={reg(flipR, p.slug)}
                      className="preserve-3d relative w-full h-full"
                    >
                      {/* full hanger (front/back states) */}
                      <div
                        ref={regImg(p.slug, "hangFull") as React.Ref<HTMLDivElement>}
                        className="absolute top-0 left-1/2 -translate-x-1/2 z-10 opacity-0 pointer-events-none"
                        style={{ height: dims.HANG_H }}
                      >
                        <Hanger />
                      </div>
                      {/* edge-on hanger (side-profile state) */}
                      <div
                        ref={regImg(p.slug, "hangProf") as React.Ref<HTMLDivElement>}
                        className="absolute top-0 left-1/2 -translate-x-1/2 z-10 opacity-0 pointer-events-none"
                        style={{ height: dims.HANG_H }}
                      >
                        <Hanger profile />
                      </div>

                      {/* garment cutouts — studio-isolated, layered drop shadows */}
                      {(["front", "back", "side"] as const).map((v) => (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          key={v}
                          ref={regImg(p.slug, v) as React.Ref<HTMLImageElement>}
                          src={p[`${v}Image` as const]}
                          alt={v === "side" ? "" : `${p.name} — ${v}`}
                          draggable={false}
                          className="garment-shadow absolute left-1/2 z-20 opacity-0 select-none pointer-events-none"
                          style={{
                            top: dims.IMG_TOP,
                            height: dims.IMG_H,
                            width: "auto",
                            maxWidth: "none",
                            transform: "translateX(-50%)",
                          }}
                        />
                      ))}
                    </div>
                    {p.badge && <HangTag label={p.badge} compact={isMobile} />}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ——— below-rack caption / inspect panel (both mounted; GSAP toggles) ——— */}
      <div className="relative mx-auto max-w-3xl px-6 pb-8 min-h-[300px] md:min-h-[280px]">
        <div ref={captionRef} className="text-center pt-5">
            <p className="text-[11px] text-neutral-500 tracking-wide">
              {active.category === "printed-tee"
                ? "Crafted in 240 GSM heavyweight combed cotton. Cut oversized. Made to last."
                : "Draped in fluid cupro & crepe. Boutique-grade tailoring. Made to move."}
            </p>
            <h1 className="mt-2 text-xl md:text-2xl font-semibold tracking-tight">
              {active.name} — {formatPrice(active.price)}
            </h1>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button onClick={openInspect} className={pillCls}>
                Inspect Front &amp; Back
              </button>
              <Link href="/new-arrivals" className={pillCls}>
                Shop the Collection
              </Link>
            </div>
          </div>

          <div
            ref={panelRef}
            className="absolute inset-x-6 top-0 text-center pt-12 opacity-0 invisible"
          >
            <p className="text-[10px] tracking-[0.3em] text-neutral-500">
              {String(activeIdx + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">{active.name}</h2>
            <p className="mt-1 text-[12px] text-neutral-500">{active.subtitle}</p>

            {/* Front | Back underlined tabs */}
            <div className="mt-3 flex justify-center gap-6">
              {(["front", "back"] as Face[]).map((f) => (
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

            {/* sizes */}
            <div className="mt-4 flex justify-center gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-9 w-9 rounded-full border text-[11px] transition-colors ${
                    size === s
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "border-neutral-400 text-neutral-700 hover:border-neutral-900"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap justify-center items-center gap-3">
              <button
                onClick={onAdd}
                className={`${pillCls} ${added ? "bg-neutral-900 text-white" : ""}`}
              >
                {added ? "Added ✓" : `Add to Bag — ${formatPrice(active.price)}`}
              </button>
              <Link
                href={`/product/${active.slug}`}
                className="text-[11px] uppercase tracking-[0.18em] underline underline-offset-4 text-neutral-600 hover:text-neutral-900"
              >
                Full details
              </Link>
              <button
                onClick={closeInspect}
                className="text-[11px] uppercase tracking-[0.18em] text-neutral-600 hover:text-neutral-900"
              >
                ← Back to Rack
              </button>
            </div>

            <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-neutral-400">
              UPI &amp; COD Available&ensp;·&ensp;Free Shipping Over ₹1,999&ensp;·&ensp;7-Day Easy
              Exchange
            </p>
          </div>
      </div>
    </section>
  );
}
