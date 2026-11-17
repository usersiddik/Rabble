import IntentLink from "./IntentLink";
import { NoiseMark } from "./Noise";

/**
 * The wordmark lockup. Type is live Archivo (expanded, 800) so it stays crisp at any size;
 * the mark is the noise tile. Three arrangements: horizontal, stacked, and mark-only.
 */

interface WordmarkProps {
  variant?: "horizontal" | "stacked" | "mark" | "text";
  tone?: "carbon" | "alabaster";
  className?: string;
  /** render as a link to home */
  href?: string;
  size?: "sm" | "md" | "lg";
}

const TEXT_SIZE = { sm: "text-[1.35rem]", md: "text-3xl", lg: "text-[clamp(3rem,10vw,7rem)]" };
const MARK_SIZE = { sm: "size-6", md: "size-9", lg: "size-20" };

export default function Wordmark({ variant = "horizontal", tone = "carbon", className = "", href, size = "sm" }: WordmarkProps) {
  const color = tone === "carbon" ? "text-carbon" : "text-alabaster";
  const inner =
    variant === "mark" ? (
      <NoiseMark tone={tone === "carbon" ? "alabaster" : "carbon"} bg={tone} className={MARK_SIZE[size]} title="RABBLE" />
    ) : variant === "text" ? (
      <span className={`display ${TEXT_SIZE[size]} leading-none ${color}`}>
        Rabble<span className="text-terracotta">.</span>
      </span>
    ) : variant === "stacked" ? (
      <span className={`inline-flex flex-col items-start gap-3 ${color}`}>
        <NoiseMark tone={tone === "carbon" ? "alabaster" : "carbon"} bg={tone} className={MARK_SIZE[size]} />
        <span className={`display ${TEXT_SIZE[size]} leading-none`}>
          Rabble<span className="text-terracotta">.</span>
        </span>
      </span>
    ) : (
      <span className={`inline-flex items-center gap-2.5 ${color}`}>
        <NoiseMark tone={tone === "carbon" ? "alabaster" : "carbon"} bg={tone} className={MARK_SIZE[size]} />
        <span className={`display ${TEXT_SIZE[size]} leading-none`}>
          Rabble<span className="text-terracotta">.</span>
        </span>
      </span>
    );

  if (href) {
    return (
      <IntentLink href={href} aria-label="RABBLE home" className={`inline-flex ${className}`}>
        {inner}
      </IntentLink>
    );
  }
  return <span className={`inline-flex ${className}`}>{inner}</span>;
}
