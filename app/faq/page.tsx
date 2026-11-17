import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { NoiseDivider } from "@/components/Noise";
import Reveal from "@/components/Reveal";
import { faq } from "@/content/legal";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Drops, payment, the garments and your order — answered straight.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 md:pt-20">
      <JsonLd data={faqLd} />
      <div className="rise">
        <p className="label text-terracotta">Help</p>
        <h1 className="display display-xl mt-4">Asked a lot.</h1>
        <p className="serif-note mt-5 max-w-xl text-xl text-carbon-2">
          Answered straight. Anything else, WhatsApp {site.whatsapp.display} — the person replying has handled the piece you&rsquo;re asking about.
        </p>
      </div>

      <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-x-16">
        {faq.map((group, gi) => (
          <Reveal key={group.group} as="section" delay={gi * 60} aria-labelledby={`faq-${gi}`}>
            <h2 id={`faq-${gi}`} className="display display-sm">
              {group.group}
            </h2>
            <div className="mt-4 divide-y hairline border-y hairline">
              {group.items.map((item) => (
                <details key={item.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold">
                    {item.q}
                    <span className="shrink-0 transition-transform group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-carbon-2">{item.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      <NoiseDivider className="mt-[var(--space-section)]" seed={17} />
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <p className="text-sm text-carbon-2">Still stuck?</p>
        <a href={site.whatsapp.url} target="_blank" rel="noopener noreferrer" className="btn btn-carbon">
          WhatsApp us
        </a>
        <a href={`mailto:${site.email}`} className="btn btn-ghost">
          Email
        </a>
      </div>
    </div>
  );
}
