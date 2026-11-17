interface MarqueeProps {
  items: string[];
  className?: string;
}

/** Infinite ticker. Content duplicated once; the track animates -50%. */
export default function Marquee({ items, className = "" }: MarqueeProps) {
  const row = (ariaHidden: boolean) => (
    <span aria-hidden={ariaHidden || undefined} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={i} className="label flex items-center whitespace-nowrap px-6 py-3">
          {item}
          <span className="ml-12 inline-block size-1.5 rounded-full bg-current opacity-40" />
        </span>
      ))}
    </span>
  );

  return (
    <div className={`overflow-hidden border-y hairline ${className}`}>
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
