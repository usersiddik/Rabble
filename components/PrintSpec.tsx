import { NoiseBars } from "./Noise";
import type { Garment, Placement } from "@/content/garments";

const POSITION_LABEL: Record<Placement["position"], string> = {
  "chest-left": "Left chest",
  "chest-center": "Centre chest",
  "upper-back": "Upper back",
  "full-back": "Full back",
  nape: "Nape",
};

function describeMark(p: Placement): string {
  switch (p.mark.type) {
    case "wordmark":
      return `“${p.mark.text}” wordmark`;
    case "lines":
      return `“${p.mark.lines.join(" / ")}”`;
    case "bars":
      return "Static bars";
    case "stamp":
      return "Circular stamp";
  }
}

function PlacementRow({ side, p }: { side: "Front" | "Back"; p: Placement }) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr] gap-4 py-4">
      <p className="label pt-0.5 text-steel-deep">{side}</p>
      <div>
        <p className="text-sm font-semibold">{POSITION_LABEL[p.position]}</p>
        <p className="mt-0.5 text-sm text-carbon-2">{describeMark(p)}</p>
        <dl className="tabular mt-2 grid grid-cols-3 gap-3 text-xs">
          <div>
            <dt className="micro text-steel-deep">Width</dt>
            <dd className="mt-0.5">{p.widthCm} cm</dd>
          </div>
          <div>
            <dt className="micro text-steel-deep">Height</dt>
            <dd className="mt-0.5">{p.heightCm} cm</dd>
          </div>
          <div>
            <dt className="micro text-steel-deep">From collar</dt>
            <dd className="mt-0.5">{p.fromCollarCm} cm</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

/**
 * The print spec block: how it's printed, on what, and exactly where.
 */
export default function PrintSpec({ garment }: { garment: Garment }) {
  const { print } = garment;
  return (
    <section aria-labelledby="print-spec-heading" className="mt-10">
      <div className="flex items-end justify-between gap-4">
        <h2 id="print-spec-heading" className="display text-xl">
          Print spec
        </h2>
        <NoiseBars seed={garment.order} count={18} aspect={0.3} className="h-4 w-16 text-steel-deep" />
      </div>
      <dl className="tabular mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-carbon/10 sm:grid-cols-4">
        {[
          ["Method", print.method],
          ["Ink", print.inkName],
          ["Fabric", `${print.gsm} GSM`],
          ["Run", `${garment.runSize} pieces`],
        ].map(([k, v]) => (
          <div key={k} className="bg-alabaster p-4">
            <dt className="micro text-steel-deep">{k}</dt>
            <dd className="mt-1 flex items-center gap-2 text-sm font-semibold">
              {k === "Ink" && (
                <span
                  aria-hidden
                  className="inline-block size-3 rounded-full border border-carbon/15"
                  style={{ background: print.inkHex }}
                />
              )}
              {v}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-carbon-2">{print.fabric}.</p>
      <div className="mt-4 divide-y hairline border-y hairline">
        {print.front && <PlacementRow side="Front" p={print.front} />}
        {print.back && <PlacementRow side="Back" p={print.back} />}
      </div>
      <p className="mt-3 text-xs text-steel-deep">Measurements are for size M and scale ±1 cm per size.</p>
    </section>
  );
}
