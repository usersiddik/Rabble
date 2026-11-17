/**
 * Bottom-of-viewport editorial lifestyle strip — anchors the split
 * studio-to-street composition of the initial viewport.
 */
export default function LifestyleStrip() {
  return (
    <div className="relative min-h-[26vh] overflow-hidden border-t border-neutral-300/70">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/editorial/lifestyle-strip.webp"
        alt="Editorial studio-to-street lifestyle"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 md:px-10 pb-5">
        <p className="text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-white/90">
          Studio to Street — AW26 Drop 01
        </p>
        <p className="hidden md:block text-[10px] uppercase tracking-[0.28em] text-white/70">
          Scroll ↓
        </p>
      </div>
    </div>
  );
}
