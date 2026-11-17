import type { Metadata } from "next";
import Link from "next/link";
import IntentLink from "@/components/IntentLink";
import { notFound } from "next/navigation";
import FlipCard from "@/components/FlipCard";
import GarmentViewer from "@/components/GarmentViewer";
import JsonLd from "@/components/JsonLd";
import PrintSpec from "@/components/PrintSpec";
import PurchasePanel from "@/components/PurchasePanel";
import Reveal from "@/components/Reveal";
import { formatINR, garments, getGarment, related } from "@/content/garments";
import { getDrop } from "@/content/drops";
import { site } from "@/content/site";

export function generateStaticParams() {
  return garments.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGarment(slug);
  if (!g) return {};
  return {
    title: `${g.name} — ${g.color}`,
    description: g.description,
    alternates: { canonical: `/product/${g.slug}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGarment(slug);
  if (!g) notFound();

  const collection = g.gender === "women" ? "women" : "men";
  const collectionLabel = g.gender === "women" ? "Women" : "Men";
  const others = related(g);
  const drop = getDrop(g.drop);
  const waitlist = g.status === "waitlist";

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${g.name} — ${g.color}`,
    description: g.description,
    sku: g.slug,
    brand: { "@type": "Brand", name: site.name },
    category: g.category,
    material: g.print.fabric,
    image: [g.frontImage, g.backImage].filter(Boolean),
    url: `${site.url}/product/${g.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: g.price,
      url: `${site.url}/product/${g.slug}`,
      availability: waitlist ? "https://schema.org/PreOrder" : g.badge === "low-stock" ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
      },
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 md:pb-20">
      <JsonLd data={productLd} />
      <nav aria-label="Breadcrumb" className="label text-steel-deep">
        <ol className="flex flex-wrap gap-1.5">
          <li>
            <IntentLink href="/" className="hover:text-terracotta">
              Home
            </IntentLink>
            <span aria-hidden> /</span>
          </li>
          <li>
            <Link href={`/${collection}`} className="hover:text-terracotta">
              {collectionLabel}
            </Link>
            <span aria-hidden> /</span>
          </li>
          <li aria-current="page" className="text-carbon">
            {g.name}
          </li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2 lg:gap-16">
        <GarmentViewer garment={g} />

        <div className="md:sticky md:top-24 md:self-start">
          <p className="label flex items-center gap-2 text-steel-deep">
            {g.category}
            <span aria-hidden>·</span>
            <span className={waitlist ? "text-cobalt" : "text-terracotta"}>
              {drop?.code} — {drop?.name}
            </span>
          </p>
          <h1 className="display mt-2 text-4xl md:text-5xl">{g.name}</h1>
          <p className="mt-2 text-sm text-steel-deep">{g.color}</p>
          <p className="tabular mt-4 text-xl font-semibold">
            {g.compareAt && <span className="mr-2 text-base font-normal text-steel-deep line-through">{formatINR(g.compareAt)}</span>}
            {formatINR(g.price)}
            <span className="ml-2 text-xs font-normal text-steel-deep">incl. GST</span>
          </p>
          <p className="prose-editorial mt-5 max-w-md text-base">{g.description}</p>

          <PurchasePanel garment={g} />
          <PrintSpec garment={g} />
        </div>
      </div>

      {others.length > 0 && (
        <section className="mt-24" aria-labelledby="related-heading">
          <Reveal className="mb-8 flex items-end justify-between">
            <h2 id="related-heading" className="display display-md">
              Runs in the same crowd
            </h2>
            <Link href={`/${collection}`} className="label shrink-0 hover:text-terracotta">
              View all →
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {others.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <FlipCard garment={p} showDrop />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
