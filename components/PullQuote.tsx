import Reveal from "./Reveal";
import { NoiseBars } from "./Noise";

/** Editorial pull-quote with the noise strip as its rule. */
export default function PullQuote({
  children,
  tone = "light",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <Reveal as="div" className={`my-[var(--space-block)] ${className}`}>
      <figure className="mx-auto max-w-3xl text-center">
        <NoiseBars seed={9} count={14} aspect={0.5} className={`mx-auto mb-6 h-5 w-10 ${tone === "dark" ? "text-terracotta" : "text-terracotta"}`} />
        <blockquote className={`serif-note text-[var(--text-note-lg)] ${tone === "dark" ? "text-alabaster" : "text-carbon"}`}>
          {children}
        </blockquote>
      </figure>
    </Reveal>
  );
}
