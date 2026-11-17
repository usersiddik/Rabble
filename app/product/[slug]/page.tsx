import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductInspect from "@/components/ProductInspect";
import { products, bySlug, formatPrice } from "@/data/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = bySlug(slug);
  if (!product) return { title: "Not found | Rabble." };
  return {
    title: `${product.name} — ${formatPrice(product.price)} | Rabble.`,
    description: `${product.name}. ${product.subtitle}. ${product.fabricSpecs.join(". ")}.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = bySlug(slug);
  if (!product) notFound();
  return <ProductInspect product={product} />;
}
