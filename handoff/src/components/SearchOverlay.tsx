"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatINR, products } from "@/lib/products";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const QUICK = ["Printed tees", "Co-ords", "Hoodies", "Dresses", "Caps"];

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQ("");
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter((p) =>
        [p.name, p.color, p.category, p.gender, p.description]
          .join(" ")
          .toLowerCase()
          .includes(term),
      )
      .slice(0, 6);
  }, [q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40"
        style={{ animation: "page-in 0.2s both" }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="relative mx-auto mt-[8vh] w-[min(92vw,40rem)] overflow-hidden rounded-md bg-studio shadow-2xl"
        style={{ animation: "page-in 0.3s both" }}
      >
        <div className="flex items-center gap-3 border-b hairline px-5">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden
            className="text-ink-3"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tees, co-ords, dresses…"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-ink-3"
          />
          <button
            type="button"
            onClick={onClose}
            className="label text-ink-3 hover:text-accent"
          >
            Esc
          </button>
        </div>

        {q.trim() === "" ? (
          <div className="px-5 py-5">
            <p className="label text-ink-3">Popular</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setQ(t)}
                  className="rounded-full border hairline px-3.5 py-1.5 text-xs hover:border-ink"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <p className="serif-note px-5 py-8 text-center text-ink-3">
            Nothing by that name — yet. Try &ldquo;tee&rdquo; or
            &ldquo;dress&rdquo;.
          </p>
        ) : (
          <ul className="max-h-[60vh] overflow-y-auto py-2">
            {results.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/product/${p.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 px-5 py-2.5 hover:bg-studio-2"
                >
                  <span className="img-frame relative size-12 shrink-0">
                    <Image
                      src={p.images[0]}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">
                      {p.name}
                    </span>
                    <span className="block text-xs text-ink-3">
                      {p.color} · {p.category}
                    </span>
                  </span>
                  <span className="tabular text-sm">{formatINR(p.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
