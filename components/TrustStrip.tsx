import Reveal from "./Reveal";
import { garments } from "@/content/garments";
import { site } from "@/content/site";

const range = (values: number[]) => {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  return lo === hi ? `${lo}` : `${lo}–${hi}`;
};

const icon = (children: React.ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {children}
  </svg>
);

/** Craftsmanship & Indian D2C trust strip — a clean 4-column grid. Every number comes from the catalogue or site facts. */
export default function TrustStrip() {
  const teeGsm = range(garments.filter((g) => g.category === "Tees").map((g) => g.print.gsm));
  const runs = range(garments.map((g) => g.runSize));

  const points = [
    {
      title: `Heavyweight ${teeGsm} GSM cotton`,
      body: "Combed, pre-shrunk jersey for the tees; brushed fleece and loopback terry for everything warmer.",
      icon: icon(<path d="M4 7h16M4 12h16M4 17h16" />),
    },
    {
      title: "Screen printed in Bengaluru",
      body: "Printed in one Bengaluru studio — water-based and discharge inks on the tees, so the print softens with washing instead of cracking.",
      icon: icon(
        <>
          <rect x="5" y="4" width="14" height="16" rx="1.5" />
          <path d="M9 9h6M9 13h6" />
        </>,
      ),
    },
    {
      title: "Boutique runs, no restocks",
      body: `Every piece is printed in a single run of ${runs}. When it sells through, the screens are destroyed.`,
      icon: icon(
        <>
          <circle cx="7" cy="17" r="3" />
          <circle cx="17" cy="17" r="3" />
          <path d="M9 15 18 4M15 15 6 4" />
        </>,
      ),
    },
    {
      title: `UPI, COD & ${site.returnsWindowDays}-day exchanges`,
      body: `Pay how you like, free shipping over ₹${site.freeShippingOver.toLocaleString("en-IN")}, and swap sizes over WhatsApp — no ticket, no interrogation.`,
      icon: icon(
        <>
          <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" />
          <path d="M18 3v4h-4M6 21v-4h4" />
        </>,
      ),
    },
  ];

  return (
    <section className="border-y hairline bg-alabaster" aria-label="Why Rabble">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-px bg-[var(--hairline)] sm:grid-cols-2 md:grid-cols-4">
        {points.map((p, i) => (
          <Reveal key={p.title} delay={i * 70} className="bg-alabaster px-5 py-8 sm:px-6 md:py-10">
            <span className="flex size-9 items-center justify-center rounded-full border border-carbon/15 text-carbon [&>svg]:size-4">
              {p.icon}
            </span>
            <h3 className="mt-5 text-sm font-semibold leading-snug">{p.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-steel-deep">{p.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
