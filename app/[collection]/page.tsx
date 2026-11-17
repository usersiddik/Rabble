import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectionView from "@/components/CollectionView";
import { byGender, editorial, newArrivals, type Product } from "@/lib/products";

interface CollectionConfig {
  title: string;
  tagline: string;
  blurb: string;
  products: () => Product[];
  cover?: { src: string; alt: string; caption: string };
}

const COLLECTIONS: Record<string, CollectionConfig> = {
  men: {
    title: "Men",
    tagline: "Make a scene.",
    blurb:
      "Heavyweight basics and louder outerwear. Everything here goes with everything else — that's the whole trick.",
    products: () => byGender("men"),
    cover: {
      src: editorial.menCover,
      alt: "Fence Hopper Jacket worn on a rooftop",
      caption: "The Fence Hopper, doing what it does.",
    },
  },
  women: {
    title: "Women",
    tagline: "Start something.",
    blurb:
      "Pieces with volume, colour and somewhere to be. Borrowed-from-nobody fits, cut for actual days.",
    products: () => byGender("women"),
    cover: {
      src: editorial.womenCover,
      alt: "Editorial look with a wide-brim hat against a red diagonal",
      caption: "Quiet is also a choice. Just not ours.",
    },
  },
  "new-arrivals": {
    title: "New arrivals",
    tagline: "Fresh off the rack.",
    blurb:
      "The latest from Drop 01, newest first. One-run prints retire when they sell through — hesitation is expensive.",
    products: () => newArrivals(),
    cover: {
      src: editorial.newCover,
      alt: "Colourful shirts lined up on wooden hangers",
      caption: "Drop 01 — all of it, newest first.",
    },
  },
};

export function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((collection) => ({ collection }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection } = await params;
  const config = COLLECTIONS[collection];
  if (!config) return {};
  return { title: config.title, description: config.blurb };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const config = COLLECTIONS[collection];
  if (!config) notFound();

  return (
    <CollectionView
      title={config.title}
      tagline={config.tagline}
      blurb={config.blurb}
      products={config.products()}
      cover={config.cover}
    />
  );
}
