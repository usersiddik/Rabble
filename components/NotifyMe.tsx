"use client";

import { useState } from "react";
import JoinDrop from "./JoinDrop";
import type { Garment } from "@/content/garments";

/**
 * Per-piece "notify me" — optional size, then the same waitlist form.
 */
export default function NotifyMe({ garment, compact = false }: { garment: Garment; compact?: boolean }) {
  const oneSize = garment.sizes.length === 1;
  const [size, setSize] = useState<string | undefined>(oneSize ? garment.sizes[0] : undefined);

  return (
    <div className={compact ? "" : "mt-8 rounded-md border hairline p-5"}>
      {!compact && (
        <>
          <p className="label text-cobalt">Drop 02 · waitlist</p>
          <p className="mt-2 text-sm text-carbon-2">
            {garment.runSize} pieces in this run. Tell us your size and we&rsquo;ll email you the minute it goes live.
          </p>
        </>
      )}
      {!oneSize && (
        <div className="mt-4">
          <span className="label" id={`notify-size-${garment.slug}`}>
            Size{size ? ` — ${size}` : " (optional)"}
          </span>
          <div role="radiogroup" aria-labelledby={`notify-size-${garment.slug}`} className="mt-3 flex flex-wrap gap-2">
            {garment.sizes.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                onClick={() => setSize(size === s ? undefined : s)}
                className="pill tabular min-w-[3rem] px-4 py-2.5 text-sm font-medium"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
      <JoinDrop
        source={`product:${garment.slug}`}
        piece={garment.slug}
        size={size}
        cta="Notify me"
        className="mt-5"
        successTitle="We'll shout."
        successBody={`You'll hear the second the ${garment.name} ${size ? `in ${size} ` : ""}goes live.`}
      />
    </div>
  );
}
