import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectionView from "@/components/CollectionView";
import JsonLd from "@/components/JsonLd";
import { byGender, newArrivals, type Garment } from "@/content/garments";
import { site } from "@/content/site";

interface CollectionConfig {
  title: string;
  tagline: string;
  blurb: string;
  garments: () => Garment[];
}

const COLLECTIONS: Record<string, CollectionConfig> = {
  men: {
    title: "Men",
    tagline: "Make a scene.",
    blurb: "Heavyweight basics and louder outerwear, printed front and back. Everything here goes with everything else — that's the whole trick.",
    garments: () => byGender("men"),
  },
  women: {
    title: "Women",
    tagline: "Start something.",
    blurb: "Pieces with volume, colour and somewhere to be. Cropped hoods, boxy tees, back prints that sit where a ponytail ends.",
    garments: () => byGender("women"),
  },
  "new-arrivals": {
    title: "New arrivals",
    tagline: "Fresh off the rack.",
    blurb: "Everything from Drop 01, newest first, with Drop 02 on the way. One-run prints retire when they sell through — hesitation is expensive.",
    garments: () => newArrivals(),
  },
};

export function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((collection) => ({ collection }));
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const { collection } = await params;
  const config = COLLECTIONS[collection];
  if (!config) return {};
  return {
    title: config.title,
    description: config.blurb,
    alternates: { canonical: `/${collection}` },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const config = COLLECTIONS[collection];
  if (!config) notFound();

  const items = config.garments();
  const listLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${config.title} — ${site.name}`,
    url: `${site.url}/${collection}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${site.url}/product/${g.slug}`,
        name: g.name,
      })),
    },
  };

  return (
    <>
      <JsonLd data={listLd} />
      <CollectionView title={config.title} tagline={config.tagline} blurb={config.blurb} garments={items} />
    </>
  );
}
