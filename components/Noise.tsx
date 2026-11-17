import { noiseBars } from "@/lib/noise";

/**
 * The signature device. A row of bars — the sound of a crowd, drawn.
 * Used on prints, hang tags, section dividers, the favicon and the wordmark lockup.
 */

type Tone = "carbon" | "alabaster" | "terracotta" | "cobalt" | "steel" | "current";

const FILL: Record<Tone, string> = {
  carbon: "#111111",
  alabaster: "#f6f5f0",
  terracotta: "#b0451f",
  cobalt: "#1f3fd9",
  steel: "#8e8e93",
  current: "currentColor",
};

interface NoiseBarsProps {
  seed?: number;
  count?: number;
  tone?: Tone;
  className?: string;
  /** bar height relative to width; defaults to a tight strip */
  aspect?: number;
  title?: string;
}

export function NoiseBars({ seed = 1, count = 24, tone = "current", className, aspect = 0.22, title }: NoiseBarsProps) {
  const w = 100;
  const h = w * aspect;
  const bars = noiseBars(seed, count);
  const gap = w / count;
  const bw = gap * 0.6;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      preserveAspectRatio="none"
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {title && <title>{title}</title>}
      <g fill={FILL[tone]}>
        {bars.map((v, i) => {
          const bh = Math.max(h * 0.08, v * h);
          return <rect key={i} x={i * gap} y={h - bh} width={bw} height={bh} rx={bw / 3} />;
        })}
      </g>
    </svg>
  );
}

/** Square mark for icons, tags and the lockup: five bars on a tile. */
export function NoiseMark({
  tone = "carbon",
  bg,
  className,
  title,
}: {
  tone?: Tone;
  bg?: Tone;
  className?: string;
  title?: string;
}) {
  const heights = [0.42, 0.78, 1, 0.62, 0.3];
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {bg && <rect width="64" height="64" rx="12" fill={FILL[bg]} />}
      <g fill={FILL[tone]}>
        {heights.map((v, i) => {
          const bh = v * 36;
          return <rect key={i} x={12 + i * 8.6} y={50 - bh} width="5.2" height={bh} rx="1.6" />;
        })}
      </g>
    </svg>
  );
}

/** Full-bleed section divider. */
export function NoiseDivider({
  seed = 3,
  tone = "steel",
  className = "",
  label,
}: {
  seed?: number;
  tone?: Tone;
  className?: string;
  label?: string;
}) {
  return (
    <div className={`flex items-end gap-4 ${className}`} aria-hidden="true">
      <NoiseBars seed={seed} count={48} tone={tone} aspect={0.06} className="h-4 w-full opacity-50" />
      {label && <span className="micro shrink-0 text-steel-deep">{label}</span>}
    </div>
  );
}
