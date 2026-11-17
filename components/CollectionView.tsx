"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import type { Category, Product } from "@/lib/products";

type SortKey = "newest" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortKey, string> = {
  newest: "Newest",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

interface CollectionViewProps {
  title: string;
  tagline: string;
  blurb: string;
  products: Product[];
  cover?: { src: string; alt: string; caption: string };
}

export default function CollectionView({
  title,
  tagline,
  blurb,
  products,
  cover,
}: CollectionViewProps) {
  const [category, setCategory] = useState<Category | "All">("All");
  const [sort, setSort] = useState<SortKey>("newest");

  const availableCategories = useMemo(() => {
    const set = new Set<Category>();
    for (const p of products) set.add(p.category);
    return [...set];
  }, [products]);

  const visible = useMemo(() => {
    const filtered =
      category === "All" ? products : products.filter((p) => p.category === category);
    const sorted = [...filtered];
    if (sort === "newest") sorted.sort((a, b) => b.drop - a.drop);
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [products, category, sort]);

  const showCover = cover && category === "All";

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 md:pt-14">
      {/* header */}
      <div className="max-w-2xl">
        <p className="serif-note text-lg text-cobalt">{tagline}</p>
        <h1 className="display mt-2 text-5xl md:text-7xl">{title}</h1>
        <p className="mt-4 text-ink-2">{blurb}</p>
      </div>

      {/* filter bar */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y hairline py-3">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {(["All", ...availableCategories] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat as Category | "All")}
              aria-pressed={category === cat}
              className={`label whitespace-nowrap rounded-full border px-4 py-2 transition-colors ${
                category === cat
                  ? "border-ink bg-ink text-chalk"
                  : "hairline hover:border-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <label className="label flex items-center gap-2 text-ink-3">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="label cursor-pointer rounded-full border hairline bg-transparent px-3 py-2 text-ink"
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABELS[key]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="tabular mt-4 text-xs text-ink-3">
        {visible.length} {visible.length === 1 ? "piece" : "pieces"}
      </p>

      {/* grid with an editorial tile woven in */}
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
        {showCover && (
          <div className="img-hover relative col-span-2 row-span-2">
            <div className="img-frame relative h-full min-h-[320px]">
              <Image
                src={cover.src}
                alt={cover.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              <p className="serif-note absolute bottom-5 left-5 max-w-[14rem] text-xl text-chalk drop-shadow">
                {cover.caption}
              </p>
            </div>
          </div>
        )}
        {visible.map((product, i) => (
          <Reveal key={product.slug} delay={(i % 4) * 60}>
            <ProductCard product={product} priority={i < 4} />
          </Reveal>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="py-24 text-center">
          <p className="display text-2xl">Nothing here yet.</p>
          <p className="mt-2 text-sm text-ink-2">Try another category — or come back after the next drop.</p>
        </div>
      )}
    </div>
  );
}
