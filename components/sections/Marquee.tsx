/**
 * Ultra-clean architectural marquee: single-pixel borders, slow continuous
 * GPU transform loop (CSS translate3d; disabled under reduced motion).
 */
const ITEMS = [
  "AW26 DROP 01",
  "HIGH-DENSITY FRONT & BACK PRINTS",
  "WOMEN'S BOUTIQUE ATELIER",
  "FREE SHIPPING OVER ₹1,999",
  "ONE-RUN PRINTS — NO RESTOCKS",
];

function Run() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((t) => (
        <span key={t} className="flex items-center">
          <span className="px-8 text-[11px] uppercase tracking-[0.3em] text-neutral-700 whitespace-nowrap">
            {t}
          </span>
          <span className="h-1 w-1 rounded-full bg-neutral-400" />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="border-y border-neutral-300/70 bg-studio overflow-hidden py-3.5">
      <div className="marquee-track flex w-max">
        <Run />
        <Run />
      </div>
    </div>
  );
}
