import Link from "next/link";
import JsonLd from "./JsonLd";
import { NoiseDivider } from "./Noise";
import Reveal from "./Reveal";
import { SizeTable } from "./SizeGuide";
import type { HelpPage as HelpPageContent } from "@/content/legal";
import { site } from "@/content/site";

const RELATED = [
  { href: "/shipping-returns", label: "Shipping & returns" },
  { href: "/exchanges", label: "Exchanges" },
  { href: "/size-help", label: "Size help" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

/** Shared renderer for the trust and legal pages. Copy lives in content/legal.ts. */
export default function HelpPage({ page }: { page: HelpPageContent }) {
  const updated = new Date(page.updated).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 md:pt-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `${page.title} — ${site.name}`,
          url: `${site.url}/${page.slug}`,
          dateModified: page.updated,
          isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
        }}
      />
      <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-20">
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="rise">
            <p className="label text-terracotta">{page.kicker}</p>
            <h1 className="display display-lg mt-3">{page.title}</h1>
            <p className="serif-note mt-5 text-xl text-carbon-2">{page.lede}</p>
            <p className="mt-6 text-xs text-steel-deep">Updated {updated}</p>
          </div>
          <nav aria-label="Help pages" className="mt-10 hidden md:block">
            <ul className="space-y-2 border-t hairline pt-5">
              {RELATED.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} aria-current={r.href === `/${page.slug}` ? "page" : undefined} className={`text-sm hover:text-terracotta ${r.href === `/${page.slug}` ? "font-semibold text-carbon" : "text-carbon-2"}`}>
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div>
          {page.sections.map((s, i) => (
            <Reveal key={s.title} as="section" delay={i * 40} className="border-t hairline py-8 first:border-t-0 first:pt-0">
              <h2 className="display text-xl">{s.title}</h2>
              <div className="prose-editorial mt-4 text-base">
                {s.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {s.list && (
                  <ul className="list-disc space-y-2 pl-5">
                    {s.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}

          {page.slug === "size-help" && (
            <Reveal as="section" className="border-t hairline py-8">
              <h2 className="display text-xl">The table</h2>
              <p className="mt-2 text-sm text-steel-deep">Body measurements in centimetres. Garment length is for tees; crews add 2 cm, hoods add 4 cm.</p>
              <div className="mt-5 max-w-md">
                <SizeTable />
              </div>
            </Reveal>
          )}

          <NoiseDivider className="mt-6" seed={page.slug.length} />
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <p className="text-sm text-carbon-2">Didn&rsquo;t cover it?</p>
            <a href={site.whatsapp.url} target="_blank" rel="noopener noreferrer" className="btn btn-carbon">
              WhatsApp us
            </a>
            <a href={`mailto:${site.email}`} className="btn btn-ghost">
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
