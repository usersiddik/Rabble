"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import FlipCard from "./FlipCard";
import JoinDrop from "./JoinDrop";
import { NoiseDivider } from "./Noise";
import Reveal from "./Reveal";
import { categorySlug, type Category, type Garment } from "@/content/garments";
import { drops } from "@/content/drops";

type SortKey = "newest" | "price-asc" | "price-desc";
type DropFilter = "all" | 1 | 2;

const SORT_LABELS: Record<SortKey, string> = {
  newest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

interface CollectionViewProps {
  title: string;
  tagline: string;
  blurb: string;
  garments: Garment[];
}

export default function CollectionView({ title, tagline, blurb, garments }: CollectionViewProps) {
  const [category, setCategory] = useState<Category | "All">("All");
  const [drop, setDrop] = useState<DropFilter>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [stuck, setStuck] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), { threshold: 1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const availableCategories = useMemo(() => {
    const set = new Set<Category>();
    for (const g of garments) set.add(g.category);
    return [...set];
  }, [garments]);

  // a category link (/men?category=tees) sets the filter once the page is live
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("category");
    const match = availableCategories.find((c) => categorySlug(c) === wanted);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (match) setCategory(match);
  }, [availableCategories]);

  const visible = useMemo(() => {
    let list = category === "All" ? garments : garments.filter((g) => g.category === category);
    if (drop !== "all") list = list.filter((g) => g.drop === drop);
    const sorted = [...list];
    if (sort === "newest") sorted.sort((a, b) => b.order - a.order);
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [garments, category, drop, sort]);

  const chapters = useMemo(() => {
    const byDrop = new Map<number, Garment[]>();
    for (const g of visible) byDrop.set(g.drop, [...(byDrop.get(g.drop) ?? []), g]);
    return [...byDrop.entries()]
      .sort(([a], [b]) => a - b)
      .map(([n, items]) => ({ drop: drops.find((d) => d.number === n)!, items }));
  }, [visible]);

  const liveDrop1 = garments.some((g) => g.drop === 1);
  const liveDrop2 = garments.some((g) => g.drop === 2);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
      <div className="max-w-2xl pt-10 md:pt-14">
        <p className="serif-note text-xl text-terracotta">{tagline}</p>
        <h1 className="display mt-2 text-5xl md:text-7xl">
          <span className="mask-line">
            <span className="mask-up">{title}</span>
          </span>
        </h1>
        <p className="prose-editorial mt-4 max-w-lg">{blurb}</p>
      </div>

      <div ref={sentinel} className="h-px" />

      {/* sticky filter bar */}
      <div
        className={`sticky top-16 z-30 -mx-4 mt-8 bg-alabaster/95 px-4 backdrop-blur-sm transition-shadow sm:-mx-6 sm:px-6 ${
          stuck ? "border-b hairline" : "border-y hairline"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1" role="group" aria-label="Filter by category">
            {(["All", ...availableCategories] as const).map((cat) => (
              <button key={cat} type="button" onClick={() => setCategory(cat as Category | "All")} aria-pressed={category === cat} className="pill label whitespace-nowrap px-4 py-2">
                {cat}
              </button>
            ))}
            {liveDrop1 && liveDrop2 && (
              <>
                <span aria-hidden className="mx-1 w-px self-stretch bg-carbon/10" />
                {([
                  ["all", "Both drops"],
                  [1, "Drop 01"],
                  [2, "Drop 02"],
                ] as const).map(([value, label]) => (
                  <button key={String(value)} type="button" onClick={() => setDrop(value)} aria-pressed={drop === value} className="pill label whitespace-nowrap px-4 py-2">
                    {label}
                  </button>
                ))}
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <p className="tabular text-xs text-steel-deep" aria-live="polite">
              {visible.length} {visible.length === 1 ? "piece" : "pieces"}
            </p>
            <label className="label flex items-center gap-2 text-steel-deep">
              Sort
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="pill label cursor-pointer bg-transparent px-3 py-2 text-carbon">
                {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                  <option key={key} value={key}>
                    {SORT_LABELS[key]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* chapters */}
      {chapters.map(({ drop: d, items }, ci) => (
        <section key={d.number} aria-labelledby={`chapter-${d.number}`} className="mt-10 md:mt-14">
          <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={`label ${d.status === "live" ? "text-terracotta" : "text-cobalt"}`}>
                {d.code} — {d.name}
              </p>
              <Reveal variant="mask" delay={60} className="mt-1">
                <h2 id={`chapter-${d.number}`} className="display scroll-mt-48 text-3xl md:text-4xl">
                  {d.status === "live" ? "On the rail now" : "On the way"}
                </h2>
              </Reveal>
            </div>
            <p className="serif-note max-w-xs text-lg text-carbon-2 md:text-right">{d.tagline}</p>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {items.map((g, i) => (
              <Reveal key={g.slug} delay={(i % 4) * 60}>
                <FlipCard garment={g} priority={ci === 0 && i < 4} />
              </Reveal>
            ))}
          </div>
          {d.status === "upcoming" && (
            <div className="mt-10 rounded-md bg-carbon p-6 text-alabaster md:p-8">
              <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="label text-alabaster/50">
                    {d.pieces} pieces · {d.runSize} in the run · lands {new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}
                  </p>
                  <p className="serif-note mt-2 text-2xl">The waitlist gets the link an hour early.</p>
                </div>
                <JoinDrop source={`collection:${title.toLowerCase()}`} tone="dark" className="relative w-full md:w-80" />
              </div>
            </div>
          )}
          {ci < chapters.length - 1 && <NoiseDivider className="mt-14" seed={d.number + 4} />}
        </section>
      ))}

      {visible.length === 0 && (
        <div className="mx-auto max-w-lg py-24 text-center">
          <p className="label text-cobalt">Nothing here — yet</p>
          <p className="display mt-3 text-3xl md:text-4xl">The next one lands 12 December.</p>
          <p className="prose-editorial mt-3">
            This cut of the catalogue is empty for now. Drop 02 brings six new pieces; the list hears first.
          </p>
          <JoinDrop source={`empty:${title.toLowerCase()}`} className="relative mx-auto mt-6 max-w-sm" />
          <button
            type="button"
            onClick={() => {
              setCategory("All");
              setDrop("all");
            }}
            className="mt-6 text-xs underline underline-offset-2 hover:text-terracotta"
          >
            Clear filters
          </button>
        </div>
      )}

      <p className="mt-16 text-center text-xs text-steel-deep">
        Looking for something louder?{" "}
        <Link href="/lookbook" className="underline underline-offset-2 hover:text-terracotta">
          See the lookbook
        </Link>
      </p>
    </div>
  );
}
