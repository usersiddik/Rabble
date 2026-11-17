"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useReducedMotion,
  useScroll,
  useTransform,
  type Transition,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import GarmentCutout from "./GarmentCutout";
import { RACK, type RackItem } from "@/lib/rack";
import { editorial, formatINR, getProduct } from "@/lib/products";

/* ———————————————————————————— tuning ———————————————————————————— */

const SPRING: Transition = {
  type: "spring",
  stiffness: 140,
  damping: 20,
  mass: 0.8,
};
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** side-hang compression: rotateY + scaleX of an inactive garment */
const TILT = 55;
const SQUEEZE = 0.55;

interface Sizes {
  active: number;
  side: number;
  gap: number;
}
const DESKTOP: Sizes = { active: 380, side: 108, gap: 10 };
const TABLET: Sizes = { active: 340, side: 96, gap: 8 };
const MOBILE: Sizes = { active: 228, side: 66, gap: 4 };

function useSizes(): Sizes {
  const [sizes, setSizes] = useState<Sizes>(DESKTOP);
  useEffect(() => {
    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const mqTablet = window.matchMedia("(min-width: 640px)");
    const apply = () =>
      setSizes(
        mqDesktop.matches ? DESKTOP : mqTablet.matches ? TABLET : MOBILE,
      );
    apply();
    mqDesktop.addEventListener("change", apply);
    mqTablet.addEventListener("change", apply);
    return () => {
      mqDesktop.removeEventListener("change", apply);
      mqTablet.removeEventListener("change", apply);
    };
  }, []);
  return sizes;
}

/* ———————————————————————————— one hanger on the rail ———————————————————————————— */

interface SlotProps {
  item: RackItem;
  index: number;
  active: boolean;
  flipped: boolean;
  sizes: Sizes;
  reduced: boolean;
  /** which way this item should swing when the rack re-flows (−1, 0, 1) */
  swayDir: number;
  swayTick: number;
  onActivate: (i: number) => void;
  onFlip: () => void;
  slotRef: (el: HTMLDivElement | null) => void;
}

function Slot({
  item,
  index,
  active,
  flipped,
  sizes,
  reduced,
  swayDir,
  swayTick,
  onActivate,
  onFlip,
  slotRef,
}: SlotProps) {
  const [swayScope, animateSway] = useAnimate();
  const product = getProduct(item.slug);
  const height = (sizes.active * 440) / 300;

  // pendulum micro-sway, pivoting on the hook, settling to 0deg
  useEffect(() => {
    if (reduced || swayTick === 0 || !swayScope.current) return;
    const a =
      (swayDir === 0 ? 1.6 : 3.2) * (swayDir || 1) * (1 + (index % 3) * 0.15);
    animateSway(
      swayScope.current,
      { rotate: [0, a, -a * 0.55, a * 0.25, -a * 0.1, 0] },
      { duration: 1.6, ease: EASE_OUT },
    );
  }, [swayTick, swayDir, reduced, animateSway, swayScope, index]);

  const transition = reduced ? { duration: 0 } : SPRING;
  const label = product
    ? `${product.name} — ${formatINR(product.price)}`
    : item.slug;

  return (
    <motion.div
      ref={slotRef}
      role="button"
      tabIndex={0}
      aria-label={
        active
          ? `${label}. Press to flip to the ${flipped ? "front" : "back"} print`
          : `${label}. Press to bring to the front`
      }
      aria-pressed={active}
      initial={false}
      animate={{ width: active ? sizes.active : sizes.side }}
      transition={transition}
      onHoverStart={() => {
        if (window.matchMedia("(hover: hover)").matches) onActivate(index);
      }}
      onFocus={() => onActivate(index)}
      onClick={() => (active ? onFlip() : onActivate(index))}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (active) onFlip();
          else onActivate(index);
        }
      }}
      className={`relative flex shrink-0 cursor-pointer justify-center outline-none ${active ? "z-10" : "z-0"}`}
      style={{ perspective: 1400, height, marginInline: sizes.gap / 2 }}
    >
      {/* sway pivot — origin at the hanger hook */}
      <div
        ref={swayScope}
        className="pointer-events-none shrink-0"
        style={{ width: sizes.active, height, transformOrigin: "50% 3.2%" }}
      >
        {/* side-profile tilt */}
        <motion.div
          initial={false}
          animate={{ rotateY: active ? 0 : TILT, scaleX: active ? 1 : SQUEEZE }}
          transition={transition}
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* front / back flipper */}
          <motion.div
            initial={false}
            animate={{ rotateY: active && flipped ? 180 : 0 }}
            transition={
              reduced ? { duration: 0 } : { ...SPRING, stiffness: 120 }
            }
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* front face */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <GarmentCutout
                kind={item.kind}
                view="front"
                body={item.body}
                shade={item.shade}
                ink={item.ink}
                print={item.frontPrint}
                image={item.frontImage}
                tag={item.tag}
                tagTone={item.tagTone}
                className="garment-shadow h-full w-full"
              />
              {/* side-fold shading, fades in as the garment turns away */}
              <motion.div
                initial={false}
                animate={{ opacity: active ? 0 : 1 }}
                transition={transition}
                className="pointer-events-none absolute inset-0"
              >
                <GarmentCutout
                  kind={item.kind}
                  view="side"
                  body={item.body}
                  shade={item.shade}
                  image={item.sidePreview ?? item.frontImage}
                  hanger={false}
                  className="h-full w-full"
                />
              </motion.div>
            </div>
            {/* back face */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <GarmentCutout
                kind={item.kind}
                view="back"
                body={item.body}
                shade={item.shade}
                ink={item.ink}
                print={item.backPrint}
                image={item.backImage}
                className="garment-shadow h-full w-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ———————————————————————————— the rack ———————————————————————————— */

export default function GarmentRack() {
  const sizes = useSizes();
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState(2); // open on the printed tee
  const [flipped, setFlipped] = useState(false);
  const [swayTick, setSwayTick] = useState(0);
  const activeRef = useRef(2);
  const viewportRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const drag = useRef({ down: false, moved: false, x: 0, left: 0 });

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

  // keep the active hanger centred when the rail overflows (mobile / tablet).
  // Computed from the known slot sizes rather than the DOM, since the slots are
  // mid-animation when the active item changes.
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp || sizes === DESKTOP) return;
    const pad = Math.max(24, vp.clientWidth / 2 - sizes.active / 2);
    const left =
      pad +
      active * (sizes.side + sizes.gap) +
      sizes.gap / 2 +
      sizes.active / 2;
    vp.scrollTo({
      left: left - vp.clientWidth / 2,
      behavior: reduced ? "auto" : "smooth",
    });
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

  const item = RACK[active];
  const product = getProduct(item.slug);
  const hookY = (sizes.active * 14) / 300;
  const collection = product?.gender === "women" ? "/women" : "/men";

  return (
    <div>
      {/* ——— the rail ——— */}
      <div className="relative mx-auto max-w-7xl">
        {/* brushed-steel bar + wall brackets */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-2 z-10 sm:inset-x-4"
          style={{ top: hookY - 4 }}
        >
          <div className="rail-bar h-[6px] w-full rounded-full" />
          <span className="rail-bracket -left-1" />
          <span className="rail-bracket -right-1" />
        </div>

        <div
          ref={viewportRef}
          className="no-scrollbar relative cursor-grab touch-pan-x overflow-x-auto overflow-y-visible select-none pb-10 pt-1 active:cursor-grabbing"
        >
          <div
            className="mx-auto flex w-max items-start"
            style={{
              paddingInline:
                sizes === DESKTOP
                  ? "2.5rem"
                  : `max(1.5rem, calc(50% - ${sizes.active / 2}px))`,
            }}
          >
            {RACK.map((it, i) => (
              <Slot
                key={it.slug}
                item={it}
                index={i}
                active={i === active}
                flipped={flipped}
                sizes={sizes}
                reduced={reduced}
                swayDir={i === active ? 0 : i < active ? -1 : 1}
                swayTick={swayTick}
                onActivate={activate}
                onFlip={flip}
                slotRef={(el) => {
                  slotRefs.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ——— active garment: title, spec, Front | Back, CTAs ——— */}
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6">
        <div className="relative h-[4.5rem] w-full max-w-xl">
          <AnimatePresence mode="wait" initial={false}>
            {product && (
              <motion.div
                key={product.slug}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="absolute inset-0"
              >
                <h2 className="display text-2xl md:text-3xl">{product.name}</h2>
                <p className="tabular mt-1.5 text-sm text-ink-3">
                  {item.spec} ·{" "}
                  <span className="font-semibold text-ink">
                    {formatINR(product.price)}
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* segmented Front | Back pill */}
        <div
          role="radiogroup"
          aria-label="Print side"
          className="relative mt-2 inline-flex rounded-full border border-ink/15 bg-white/60 p-1 backdrop-blur-sm"
        >
          {(["Front", "Back"] as const).map((side) => {
            const on = (side === "Back") === flipped;
            return (
              <button
                key={side}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setFlipped(side === "Back")}
                className={`label relative z-10 rounded-full px-5 py-2 transition-colors ${
                  on ? "text-chalk" : "text-ink-2 hover:text-ink"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="rack-pill"
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 400, damping: 32 }
                    }
                    className="absolute inset-0 -z-10 rounded-full bg-ink"
                  />
                )}
                {side}
                {side === "Back" && item.backPrint && (
                  <span className="ml-1.5 text-[0.55rem] opacity-70">
                    PRINT
                  </span>
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
          <Link href={collection} className="btn btn-ink">
            Shop the collection
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
          href={`/product/${item.slug}`}
          className="label mt-4 underline decoration-ink/30 underline-offset-4 hover:text-accent"
        >
          Quick view
        </Link>
        <p className="serif-note mt-5 text-sm text-ink-3">
          Tap or hover a hanger · tap again to flip it · drag to browse
        </p>
      </div>
    </div>
  );
}

/* ———————————————————————————— editorial banner ———————————————————————————— */

export function HeroEditorialBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? ["0%", "0%"] : ["-12%", "12%"],
  );

  return (
    <div
      ref={ref}
      className="relative min-h-[28vh] overflow-hidden bg-ink md:min-h-[34vh]"
    >
      <motion.div style={{ y }} className="absolute -inset-y-[14%] inset-x-0">
        <Image
          src={editorial.crowd}
          alt="The Rabble crowd on a city bench, printed tees and boutique layers"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/30 to-transparent" />
      <div className="relative mx-auto flex min-h-[28vh] max-w-7xl items-end px-4 py-8 sm:px-6 md:min-h-[34vh] md:py-10">
        <div>
          <p className="label text-chalk/70">Studio to street</p>
          <p className="display mt-2 max-w-xl text-2xl text-chalk md:text-4xl">
            Front &amp; back puff prints.{" "}
            <span className="serif-note lowercase text-butter">
              Boutique cuts.
            </span>{" "}
            Small-batch runs.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/men" className="btn btn-chalk">
              Printed tees
            </Link>
            <Link
              href="/women"
              className="btn btn-ghost !border-chalk/50 !text-chalk hover:!bg-chalk hover:!text-ink"
            >
              Women&rsquo;s boutique
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
