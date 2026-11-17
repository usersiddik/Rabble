import Reveal from "./Reveal";

const POINTS = [
  {
    title: "Heavyweight 240 GSM Cotton",
    body: "Combed, pre-shrunk jersey with a collar that holds its shape past wash fifty.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden
      >
        <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Zero-Crack Front & Back Prints",
    body: "Puff ink and high-density screen prints that age gracefully, never flake.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden
      >
        <rect x="5" y="4" width="14" height="16" rx="1.5" />
        <path d="M9 9h6M9 13h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Boutique-Grade Tailoring",
    body: "Hand-finished seams and small-batch cuts for the women's atelier edit.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden
      >
        <circle cx="7" cy="17" r="3" />
        <circle cx="17" cy="17" r="3" />
        <path d="M9 15 18 4M15 15 6 4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "UPI, COD & 7-Day Easy Exchanges",
    body: "Pay how you like, ship pan-India, swap sizes without an interrogation.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden
      >
        <path
          d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"
          strokeLinecap="round"
        />
        <path
          d="M18 3v4h-4M6 21v-4h4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

/** Craftsmanship & Indian D2C trust strip — a clean 4-column architectural grid. */
export default function TrustStrip() {
  return (
    <section
      className="border-y border-neutral-200/80 bg-studio"
      aria-label="Why Rabble"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-neutral-200/80 sm:grid-cols-2 md:grid-cols-4">
        {POINTS.map((p, i) => (
          <Reveal
            key={p.title}
            delay={i * 70}
            className="bg-studio px-5 py-8 sm:px-6 md:py-10"
          >
            <span className="flex size-9 items-center justify-center rounded-full border border-ink/15 text-ink [&>svg]:size-4">
              {p.icon}
            </span>
            <h3 className="mt-5 text-sm font-semibold leading-snug">
              {p.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-ink-3">{p.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
