"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import GarmentCutout from "./GarmentCutout";
import { formatINR, garments } from "@/content/garments";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const QUICK = ["Tees", "Hoodies", "Crew", "Jackets", "Drop 02"];

/** "hoodies" finds "hoodie", "tees" finds "tee" */
const stem = (word: string) => (word.length > 3 && word.endsWith("s") ? word.slice(0, -1) : word);

const INDEX = garments.map((g) => ({
  garment: g,
  text: [g.name, g.color, g.category, g.gender, g.art.kind.replace("-", " "), `drop 0${g.drop}`, g.description]
    .join(" ")
    .toLowerCase(),
}));

/** ⌘K typeahead over the catalogue. */
export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const returnFocus = document.activeElement as HTMLElement | null;
    // fresh search every time it opens
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQ("");
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      const panel = panelRef.current;
      if (e.key === "Tab" && panel) {
        const focusables = panel.querySelectorAll<HTMLElement>("button, [href], input");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      returnFocus?.focus();
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean).map(stem);
    if (words.length === 0) return [];
    return INDEX.filter(({ text }) => words.every((w) => text.includes(w)))
      .map(({ garment }) => garment)
      .slice(0, 6);
  }, [q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close search"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-carbon/40"
        style={{ animation: "page-in 0.2s both" }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search the store"
        className="relative mx-auto mt-[8vh] w-[min(92vw,40rem)] overflow-hidden rounded-[var(--radius-md)] bg-alabaster shadow-[var(--shadow-float)]"
        style={{ animation: "page-in 0.3s both" }}
      >
        <div className="flex items-center gap-3 border-b-2 border-transparent px-5 shadow-[0_1px_0_var(--hairline)] focus-within:border-cobalt">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden className="text-steel-deep">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tees, hoodies, jackets…"
            aria-label="Search the store"
            aria-controls="search-results"
            className="h-14 flex-1 bg-transparent text-base !outline-none placeholder:text-steel-deep [&::-webkit-search-cancel-button]:appearance-none"
          />
          <button type="button" onClick={onClose} className="label text-steel-deep hover:text-terracotta">
            Esc
          </button>
        </div>

        <div id="search-results" aria-live="polite">
          {q.trim() === "" ? (
            <div className="px-5 py-5">
              <p className="label text-steel-deep">Popular</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK.map((t) => (
                  <button key={t} type="button" onClick={() => setQ(t)} className="pill px-3.5 py-1.5 text-xs">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="serif-note px-5 py-8 text-center text-lg text-steel-deep">
              Nothing by that name — yet. Try &ldquo;tee&rdquo; or &ldquo;hoodie&rdquo;.
            </p>
          ) : (
            <ul className="max-h-[60vh] overflow-y-auto py-2">
              {results.map((g) => (
                <li key={g.slug}>
                  <Link href={`/product/${g.slug}`} onClick={onClose} className="flex items-center gap-4 px-5 py-2.5 hover:bg-alabaster-2">
                    <span className="studio relative size-12 shrink-0 p-1">
                      <GarmentCutout garment={g} hanger={false} alt="" sizes="48px" className="h-full w-full" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">{g.name}</span>
                      <span className="block text-xs text-steel-deep">
                        {g.color} · {g.status === "waitlist" ? "Drop 02 waitlist" : g.category}
                      </span>
                    </span>
                    <span className="tabular text-sm">{formatINR(g.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
