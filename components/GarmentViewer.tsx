"use client";

import { useState } from "react";
import GarmentCutout from "./GarmentCutout";
import { hasSide, type Garment, type Side } from "@/content/garments";

const BADGE_LABEL: Record<string, string> = {
  new: "New",
  "low-stock": "Low stock",
  sale: "−20%",
  waitlist: "Drop 02",
};

/**
 * Product page viewer. Front | Back on a studio backdrop, with thumbnails for each side
 * (and the side preview when photography provides one). Reuses <GarmentCutout />.
 */
export default function GarmentViewer({ garment }: { garment: Garment }) {
  const [side, setSide] = useState<Side | "side">("front");
  const views: Array<Side | "side"> = ["front"];
  if (hasSide(garment, "back")) views.push("back");
  if (garment.sidePreview) views.push("side");

  const dark = garment.art.colors.body.toLowerCase() === "#f1efe8" || garment.art.colors.body.toLowerCase() === "#e8e0cd";

  return (
    <div className="flex flex-col gap-3 md:flex-row">
      {views.length > 1 && (
        <div className="order-2 flex gap-3 md:order-1 md:flex-col" role="tablist" aria-label="Garment views">
          {views.map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={v === side}
              aria-controls="garment-stage"
              onClick={() => setSide(v)}
              className={`studio relative h-24 w-20 shrink-0 overflow-hidden p-2 transition-opacity ${
                v === side ? "ring-1 ring-carbon" : "opacity-60 hover:opacity-100"
              }`}
            >
              <GarmentCutout garment={garment} side={v} hanger={false} className="h-full w-full" alt="" />
              <span className="micro absolute bottom-1 left-0 right-0 text-center text-steel-deep">{v}</span>
            </button>
          ))}
        </div>
      )}

      <div
        id="garment-stage"
        role="tabpanel"
        className={`grain grain-light relative order-1 aspect-[4/5] flex-1 overflow-hidden ${dark ? "studio-dark" : "studio"}`}
      >
        <div key={side} className="flex h-full w-full items-center justify-center p-[8%]" style={{ animation: "page-in 0.4s both" }}>
          <GarmentCutout garment={garment} side={side} priority className="h-full w-auto max-w-full" />
        </div>
        {garment.badge && (
          <span
            className={`hang-tag absolute left-4 top-4 ${
              garment.badge === "new" ? "hang-tag--terracotta" : garment.badge === "waitlist" ? "hang-tag--cobalt" : ""
            }`}
          >
            {garment.stockNote ?? BADGE_LABEL[garment.badge]}
          </span>
        )}
        {views.includes("back") && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 rounded-full border hairline bg-alabaster/90 p-0.5 backdrop-blur-sm">
            {(["front", "back"] as const).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={side === s}
                onClick={() => setSide(s)}
                className={`label rounded-full px-4 py-2 transition-colors ${
                  side === s ? "bg-carbon text-alabaster" : "text-carbon-2 hover:text-carbon"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {!garment.frontImage && (
          <p className={`micro absolute right-4 top-4 ${dark ? "text-alabaster/60" : "text-steel-deep"}`}>{garment.status === "waitlist" ? "Illustrated proof" : "Illustrated — photography soon"}</p>
        )}
      </div>
    </div>
  );
}
