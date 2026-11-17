"use client";

import { useEffect, useRef } from "react";
import { SIZE_GUIDE } from "@/content/garments";

/** Size table — used inline on /size-help and as a dialog on product pages. */
export function SizeTable({ compact = false }: { compact?: boolean }) {
  return (
    <table className="tabular w-full text-sm">
      <caption className="sr-only">Body measurements in centimetres by size</caption>
      <thead>
        <tr className="label border-b hairline text-left text-steel-deep">
          <th scope="col" className="py-2 font-semibold">Size</th>
          <th scope="col" className="py-2 font-semibold">Chest</th>
          <th scope="col" className="py-2 font-semibold">Waist</th>
          {!compact && <th scope="col" className="py-2 font-semibold">Length</th>}
        </tr>
      </thead>
      <tbody>
        {SIZE_GUIDE.map((row) => (
          <tr key={row.size} className="border-b hairline last:border-0">
            <th scope="row" className="py-2 text-left font-semibold">{row.size}</th>
            <td className="py-2">{row.chest}</td>
            <td className="py-2">{row.waist}</td>
            {!compact && <td className="py-2">{row.length}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function SizeGuideDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel) {
        const focusables = panel.querySelectorAll<HTMLElement>("button, [href], input, [tabindex]:not([tabindex='-1'])");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      returnFocus.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close size guide"
        onClick={onClose}
        className="absolute inset-0 bg-carbon/40"
        style={{ animation: "page-in 0.2s both" }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
        tabIndex={-1}
        className="relative w-full max-w-sm rounded-md bg-alabaster p-6 shadow-[var(--shadow-float)] outline-none"
        style={{ animation: "page-in 0.3s both" }}
      >
        <div className="flex items-center justify-between">
          <h2 id="size-guide-title" className="display text-xl">
            Size guide
          </h2>
          <button type="button" onClick={onClose} className="label hover:text-terracotta">
            Close
          </button>
        </div>
        <p className="mt-2 text-xs text-steel-deep">
          Body measurements in cm. Between sizes? Our cuts run roomy — size down for neat, up for loud.
        </p>
        <div className="mt-4">
          <SizeTable compact />
        </div>
      </div>
    </div>
  );
}
