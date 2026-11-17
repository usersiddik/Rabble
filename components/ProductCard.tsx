import Image from "next/image";
import Link from "next/link";
import { formatINR, type Product } from "@/lib/products";

const BADGE_LABEL: Record<string, string> = {
  new: "New",
  "low-stock": "Low stock",
  sale: "−20%",
};

interface ProductCardProps {
  product: Product;
  /** marks the LCP candidates on collection pages */
  priority?: boolean;
  sizes?: string;
}

export default function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
}: ProductCardProps) {
  const [front, back] = product.images;
  return (
    <Link href={`/product/${product.slug}`} className="img-hover group block">
      <div className="img-frame relative aspect-[4/5]">
        <Image
          src={front}
          alt={`${product.name} in ${product.color}`}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
        {back && (
          <Image
            src={back}
            alt=""
            fill
            sizes={sizes}
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {product.badge && (
          <span
            className={`hang-tag absolute left-3 top-3 ${
              product.badge === "new" ? "hang-tag--accent" : ""
            }`}
          >
            {product.stockNote ?? BADGE_LABEL[product.badge]}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold leading-snug group-hover:text-accent">
          {product.name}
        </h3>
        <p className="tabular shrink-0 text-sm">
          {product.compareAt && (
            <span className="mr-1.5 text-ink-3 line-through">{formatINR(product.compareAt)}</span>
          )}
          {formatINR(product.price)}
        </p>
      </div>
      <p className="mt-0.5 text-xs text-ink-3">{product.color}</p>
    </Link>
  );
}
