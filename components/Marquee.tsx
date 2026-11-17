interface MarqueeProps {
  items: readonly string[];
  className?: string;
}

/** Infinite ticker. Content duplicated once; the track animates -50%. */
export default function Marquee({ items, className = "" }: MarqueeProps) {
  const row = (ariaHidden: boolean) => (
    <span aria-hidden={ariaHidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span
          key={i}
          className="flex items-center whitespace-nowrap px-6 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-carbon-2"
        >
          {item}
          <span className="ml-12 inline-block size-1 rounded-full bg-terracotta" />
        </span>
      ))}
    </span>
  );

  return (
    <div className={`overflow-hidden border-y hairline bg-alabaster ${className}`}>
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
