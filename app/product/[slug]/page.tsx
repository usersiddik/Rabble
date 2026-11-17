import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import PurchasePanel from "@/components/PurchasePanel";
import Reveal from "@/components/Reveal";
import { formatINR, getProduct, products, related } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${product.color}`,
    description: product.description,
  };
}

const BADGE_LABEL: Record<string, string> = {
  new: "New",
  "low-stock": "Low stock",
  sale: "−20%",
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const collection = product.gender === "women" ? "women" : "men";
  const collectionLabel = product.gender === "women" ? "Women" : "Men";
  const others = related(product);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="label text-ink-3">
        <ol className="flex flex-wrap gap-1.5">
          <li>
            <Link href="/" className="hover:text-cobalt">
              Home
            </Link>
            <span aria-hidden> /</span>
          </li>
          <li>
            <Link href={`/${collection}`} className="hover:text-cobalt">
              {collectionLabel}
            </Link>
            <span aria-hidden> /</span>
          </li>
          <li aria-current="page" className="text-ink">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2 lg:gap-16">
        <ProductGallery
          images={product.images}
          name={`${product.name} in ${product.color}`}
          badge={product.badge ? (product.stockNote ?? BADGE_LABEL[product.badge]) : undefined}
          badgeTone={product.badge === "new" ? "cobalt" : "ink"}
        />

        <div className="md:sticky md:top-24 md:self-start">
          <p className="label text-ink-3">{product.category}</p>
          <h1 className="display mt-2 text-4xl md:text-5xl">{product.name}</h1>
          <p className="mt-2 text-sm text-ink-3">{product.color}</p>
          <p className="tabular mt-4 text-xl font-semibold">
            {product.compareAt && (
              <span className="mr-2 text-base font-normal text-ink-3 line-through">
                {formatINR(product.compareAt)}
              </span>
            )}
            {formatINR(product.price)}
            <span className="ml-2 text-xs font-normal text-ink-3">incl. of all taxes</span>
          </p>
          <p className="mt-5 max-w-md text-ink-2">{product.description}</p>

          <PurchasePanel product={product} />
        </div>
      </div>

      {/* related */}
      {others.length > 0 && (
        <section className="mt-24" aria-labelledby="related-heading">
          <Reveal className="mb-8 flex items-end justify-between">
            <h2 id="related-heading" className="display text-2xl md:text-3xl">
              Runs in the same crowd
            </h2>
            <Link href={`/${collection}`} className="label shrink-0 hover:text-cobalt">
              View all →
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {others.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
