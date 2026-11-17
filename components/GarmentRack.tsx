"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  LazyMotion,
  animate,
  m,
  useAnimate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type Transition,
} from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GarmentRender from "./GarmentRender";
import { photoFor, renderProps } from "./GarmentCutout";
import { NoiseBars } from "./Noise";
import { RACK, RACK_START, type RackPiece } from "@/lib/rack";
import { formatINR, getGarment } from "@/content/garments";

/* ———————————————————————————— tuning ———————————————————————————— */

const loadMotionFeatures = () => import("./motion-features").then((mod) => mod.default);

const SPRING: Transition = { type: "spring", stiffness: 140, damping: 20, mass: 0.8 };
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** side-hang compression: rotateY + scaleX of an inactive garment */
const TILT = 55;
const SQUEEZE = 0.55;

interface Sizes {
  active: number;
  side: number;
  gap: number;
}
// keep in step with `.rack` in globals.css
const DESKTOP: Sizes = { active: 380, side: 108, gap: 10 };
const LAPTOP: Sizes = { active: 300, side: 88, gap: 8 };
const TABLET: Sizes = { active: 340, side: 96, gap: 8 };
const MOBILE: Sizes = { active: 228, side: 66, gap: 4 };

/** null until mounted — the server render sizes itself from the `.rack` CSS variables */
function useSizes(): Sizes | null {
  const [sizes, setSizes] = useState<Sizes | null>(null);
  useEffect(() => {
    const mqLaptop = window.matchMedia("(min-width: 1024px) and (max-height: 900px)");
    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const mqTablet = window.matchMedia("(min-width: 640px)");
    const queries = [mqLaptop, mqDesktop, mqTablet];
    const apply = () =>
      setSizes(mqLaptop.matches ? LAPTOP : mqDesktop.matches ? DESKTOP : mqTablet.matches ? TABLET : MOBILE);
    apply();
    queries.forEach((mq) => mq.addEventListener("change", apply));
    return () => queries.forEach((mq) => mq.removeEventListener("change", apply));
  }, []);
  return sizes;
}

/* ———————————————————————————— one hanger on the rail ———————————————————————————— */

interface SlotProps {
  piece: RackPiece;
  index: number;
  active: boolean;
  flipped: boolean;
  sizes: Sizes | null;
  reduced: boolean;
  /** which way this item should swing when the rack re-flows (−1, 0, 1) */
  swayDir: number;
  swayTick: number;
  onActivate: (i: number) => void;
  onFlip: () => void;
}

function Slot({ piece, index, active, flipped, sizes, reduced, swayDir, swayTick, onActivate, onFlip }: SlotProps) {
  const [swayScope, animateSway] = useAnimate();
  // whether this hanger was already open when the press began: a tap on a closed
  // hanger opens it (focus lands first), only a tap on an open one flips it
  const wasActive = useRef(false);
  const g = piece.garment;
  // the back face is only drawn once a hanger has been opened — six fewer SVGs in the first HTML
  const [showBack, setShowBack] = useState(active);
  if (active && !showBack) setShowBack(true);

  // Slot width starts as the `.rack` CSS variable (what the server rendered), snaps to the
  // same number once the breakpoint is known, and springs from there on.
  const width = useMotionValue<number | string>(active ? "var(--rack-active)" : "var(--rack-side)");
  useEffect(() => {
    if (!sizes) return;
    const target = active ? sizes.active : sizes.side;
    if (reduced || typeof width.get() === "string") {
      width.jump(target);
      return;
    }
    const controls = animate(width, target, SPRING);
    return () => controls.stop();
  }, [active, sizes, reduced, width]);

  // pendulum micro-sway, pivoting on the hook, settling to 0deg
  useEffect(() => {
    if (reduced || swayTick === 0 || !swayScope.current) return;
    const a = (swayDir === 0 ? 1.6 : 3.2) * (swayDir || 1) * (1 + (index % 3) * 0.15);
    animateSway(swayScope.current, { rotate: [0, a, -a * 0.55, a * 0.25, -a * 0.1, 0] }, { duration: 1.6, ease: EASE_OUT });
  }, [swayTick, swayDir, reduced, animateSway, swayScope, index]);

  // the three faces never change for a piece; don't re-render their SVG on every hover
  const faces = useMemo(
    () => ({
      front: (
        <GarmentRender
          {...renderProps(g, "front")}
          image={photoFor(g, "front")}
          tag={piece.tag}
          tagTone={piece.tagTone}
          sideShade
          className="garment-shadow h-full w-full"
        />
      ),
      back: <GarmentRender {...renderProps(g, "back")} image={photoFor(g, "back")} className="garment-shadow h-full w-full" />,
    }),
    [g, piece.tag, piece.tagTone],
  );

  const transition = reduced ? { duration: 0 } : SPRING;
  const label = `${g.name}, ${g.color} — ${formatINR(g.price)}`;
  const press = () => (wasActive.current ? onFlip() : onActivate(index));

  return (
    <m.div
      role="button"
      tabIndex={0}
      aria-label={active ? `${label}. Press to flip to the ${flipped ? "front" : "back"} print` : `${label}. Press to bring to the front`}
      aria-pressed={active}
      onHoverStart={() => {
        if (window.matchMedia("(hover: hover)").matches) onActivate(index);
      }}
      onPointerDown={() => {
        wasActive.current = active;
      }}
      onFocus={() => onActivate(index)}
      onClick={press}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (active) onFlip();
          else onActivate(index);
        }
      }}
      className={`rack-slot relative flex shrink-0 cursor-pointer justify-center outline-offset-[-2px] ${active ? "z-10" : "z-0"}`}
      style={{
        width,
        height: "var(--rack-h)",
        marginInline: "calc(var(--rack-gap) / 2)",
        perspective: 1400,
      }}
    >
      {/* sway pivot — origin at the hanger hook */}
      <div
        ref={swayScope}
        className="pointer-events-none shrink-0"
        style={{ width: sizes ? sizes.active : "var(--rack-active)", height: "100%", transformOrigin: "50% 3.2%" }}
      >
        {/* side-profile tilt */}
        <m.div
          initial={false}
          animate={{ rotateY: active ? 0 : TILT, scaleX: active ? 1 : SQUEEZE }}
          transition={transition}
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* front / back flipper */}
          <m.div
            initial={false}
            animate={{ rotateY: active && flipped ? 180 : 0 }}
            transition={reduced ? { duration: 0 } : { ...SPRING, stiffness: 120 }}
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
              {/* its side-fold shading fades in (CSS, keyed off aria-pressed) as the garment turns away */}
              {faces.front}
            </div>
            <div
              className="absolute inset-0"
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              {showBack && faces.back}
            </div>
          </m.div>
        </m.div>
      </div>
    </m.div>
  );
}

/* ———————————————————————————— the rack ———————————————————————————— */

export default function GarmentRack() {
  const sizes = useSizes();
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState(RACK_START);
  const [flipped, setFlipped] = useState(false);
  const [swayTick, setSwayTick] = useState(0);
  const activeRef = useRef(RACK_START);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const drag = useRef({ down: false, moved: false, x: 0, left: 0 });
  const centred = useRef(false);

  const activate = useCallback((i: number) => {
    if (drag.current.moved || drag.current.down) return;
    if (activeRef.current === i) return;
    activeRef.current = i;
    setActive(i);
    setFlipped(false);
    setSwayTick((t) => t + 1);
  }, []);

  const flip = useCallback(() => {
    if (drag.current.moved) return;
    setFlipped((f) => !f);
  }, []);

  // keep the active hanger centred whenever the rail overflows (mobile, tablet, narrow desktop).
  // Computed from the known slot sizes rather than the DOM, since the slots are mid-animation.
  useEffect(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track || !sizes) return;
    const full = sizes.active + (RACK.length - 1) * sizes.side + RACK.length * sizes.gap;
    const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    if (full + 2 * pad <= vp.clientWidth + 1) return;
    const centre = pad + active * (sizes.side + sizes.gap) + sizes.gap / 2 + sizes.active / 2;
    vp.scrollTo({ left: centre - vp.clientWidth / 2, behavior: reduced || !centred.current ? "auto" : "smooth" });
    centred.current = true;
  }, [active, sizes, reduced]);

  // drag-to-scroll on pointer devices; native touch swipe already works
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const d = drag.current;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      d.down = true;
      d.moved = false;
      d.x = e.clientX;
      d.left = vp.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!d.down) return;
      const dx = e.clientX - d.x;
      if (Math.abs(dx) > 6) d.moved = true;
      if (d.moved) vp.scrollLeft = d.left - dx;
    };
    const onUp = () => {
      d.down = false;
      // let the click that follows a drag through as a no-op
      setTimeout(() => {
        d.moved = false;
      }, 0);
    };
    vp.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      vp.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const piece = RACK[active];
  const g = piece.garment;
  const collection = g.gender === "women" ? "/women" : "/men";
  const audience = g.gender === "women" ? "Women" : g.gender === "men" ? "Men" : "Unisex";
  const hasBackPrint = Boolean(g.print.back);

  // the Front | Back indicator slides between the measured buttons
  // (the Back button's width changes with its "Print" suffix)
  useEffect(() => {
    const el = pillRefs.current[flipped ? 1 : 0];
    if (el) setPill({ x: el.offsetLeft, w: el.offsetWidth });
  }, [flipped, hasBackPrint]);

  // Front | Back is a radiogroup: one tab stop, arrows move the selection
  const onPillKey = (e: React.KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const next = !flipped;
    setFlipped(next);
    pillRefs.current[next ? 1 : 0]?.focus();
  };

  return (
    <LazyMotion features={loadMotionFeatures}>
      <div className="rack">
        {/* ——— the rail ——— */}
        <div className="relative mx-auto max-w-7xl">
          {/* brushed-steel bar + wall brackets */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-2 z-10 sm:inset-x-4"
            style={{ top: "calc(var(--rack-active) * 14 / 300 - 4px)" }}
          >
            <div className="rail-bar h-[6px] w-full rounded-full" />
            <span className="rail-bracket -left-1" />
            <span className="rail-bracket -right-1" />
          </div>

          <div
            ref={viewportRef}
            className="no-scrollbar relative cursor-grab touch-pan-x select-none overflow-x-auto overflow-y-visible pb-10 pt-1 active:cursor-grabbing"
          >
            <div ref={trackRef} className="rack-track mx-auto flex w-max items-start">
              {RACK.map((p, i) => (
                <Slot
                  key={p.garment.slug}
                  piece={p}
                  index={i}
                  active={i === active}
                  flipped={flipped}
                  sizes={sizes}
                  reduced={reduced}
                  swayDir={i === active ? 0 : i < active ? -1 : 1}
                  swayTick={swayTick}
                  onActivate={activate}
                  onFlip={flip}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ——— active garment: title, spec, Front | Back, CTAs ——— */}
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6">
          <div className="relative h-[5.75rem] w-full max-w-xl" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={g.slug}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="absolute inset-0"
              >
                <p className="label text-steel-deep">
                  {audience} <span aria-hidden className="mx-1 text-carbon/25">/</span> {g.category}
                </p>
                <h2 className="display mt-1.5 text-2xl md:text-3xl">{g.name}</h2>
                <p className="tabular mt-1.5 text-sm text-steel-deep">
                  {piece.spec} ·{" "}
                  {g.compareAt && <span className="mr-1 line-through">{formatINR(g.compareAt)}</span>}
                  <span className="font-semibold text-carbon">{formatINR(g.price)}</span>
                </p>
              </m.div>
            </AnimatePresence>
          </div>

          {/* segmented Front | Back pill */}
          <div
            role="radiogroup"
            aria-label="Print side"
            onKeyDown={onPillKey}
            className="relative mt-2 inline-flex rounded-full border border-carbon/15 bg-white/60 p-1 backdrop-blur-sm"
          >
            {pill && (
              <m.span
                aria-hidden
                initial={false}
                animate={{ x: pill.x, width: pill.w }}
                transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 32 }}
                className="absolute inset-y-1 left-0 rounded-full bg-carbon"
              />
            )}
            {(["Front", "Back"] as const).map((side, i) => {
              const on = (side === "Back") === flipped;
              return (
                <button
                  key={side}
                  ref={(el) => {
                    pillRefs.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setFlipped(side === "Back")}
                  className={`label relative z-10 rounded-full px-5 py-2 transition-colors ${
                    on ? `text-alabaster ${pill ? "" : "bg-carbon"}` : "text-carbon-2 hover:text-carbon"
                  }`}
                >
                  {side}
                  {side === "Back" && hasBackPrint && (
                    <span className={`ml-1.5 text-[0.55rem] ${on ? "text-alabaster/75" : "text-steel-deep"}`}>Print</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Previous piece"
              onClick={() => activate((active + RACK.length - 1) % RACK.length)}
              className="btn btn-ghost size-11 !p-0"
            >
              ←
            </button>
            <Link href={collection} className="btn btn-carbon">
              {audience === "Unisex" ? "Shop the collection" : `Shop ${audience.toLowerCase()}`}
            </Link>
            <button
              type="button"
              aria-label="Next piece"
              onClick={() => activate((active + 1) % RACK.length)}
              className="btn btn-ghost size-11 !p-0"
            >
              →
            </button>
          </div>
          <Link
            href={`/product/${g.slug}`}
            className="label mt-4 underline decoration-carbon/30 underline-offset-4 hover:text-terracotta"
          >
            Quick view<span className="sr-only">: {g.name}</span>
          </Link>
          <p className="serif-note mt-5 text-sm text-steel-deep">Tap or hover a hanger · tap again to flip it · drag to browse</p>
        </div>
      </div>
    </LazyMotion>
  );
}

/* ———————————————————————————— editorial banner ———————————————————————————— */

const BANNER_PIECES = ["second-shift-trucker", "static-hoodie", "loud-minority-crew"];

/**
 * Full-bleed banner under the rack, with scroll parallax. Photo-free until the
 * campaign is shot: the backs of three pieces on carbon, over the noise motif.
 * Pass `image` and the photograph replaces the collage.
 */
export function HeroEditorialBanner({ image, alt = "" }: { image?: string; alt?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-12%", "12%"]);

  return (
    <LazyMotion features={loadMotionFeatures}>
      <div ref={ref} className="studio-dark grain relative min-h-[28vh] overflow-hidden !rounded-none md:min-h-[34vh]">
        <m.div style={{ y }} className="absolute -inset-y-[14%] inset-x-0">
          {image ? (
            <Image src={image} alt={alt} fill sizes="100vw" className="object-cover" />
          ) : (
            <div aria-hidden className="absolute inset-0">
              <NoiseBars seed={21} count={140} aspect={0.1} className="absolute inset-x-0 bottom-[16%] h-1/3 w-full text-alabaster/[0.06]" />
              <div className="absolute inset-y-[18%] right-[4%] hidden items-center gap-[2%] sm:flex md:right-[8%]">
                {BANNER_PIECES.map((slug, i) => {
                  const piece = getGarment(slug)!;
                  return (
                    <GarmentRender
                      key={slug}
                      {...renderProps(piece, "back")}
                      hanger={false}
                      className={`garment-shadow h-full w-auto ${i === 1 ? "-translate-y-[6%]" : ""}`}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </m.div>
        <div className="absolute inset-0 bg-gradient-to-r from-carbon/80 via-carbon/40 to-transparent" />
        <div className="relative z-[2] mx-auto flex min-h-[28vh] max-w-7xl items-end px-4 py-8 sm:px-6 md:min-h-[34vh] md:py-10">
          <div>
            <p className="label text-alabaster/70">Studio to street</p>
            <p className="display mt-2 max-w-xl text-2xl text-alabaster md:text-4xl">
              Front &amp; back screen prints. <span className="serif-note lowercase text-sand">Boutique runs.</span> No restocks.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/men" className="btn btn-alabaster">
                Shop men
              </Link>
              <Link href="/women" className="btn btn-ghost !border-alabaster/50 !text-alabaster hover:!bg-alabaster hover:!text-carbon">
                Shop women
              </Link>
            </div>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
