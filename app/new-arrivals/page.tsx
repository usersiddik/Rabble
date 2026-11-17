import type { Metadata } from "next";
import CategoryGrid from "@/components/CategoryGrid";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "New Drops — AW26 Drop 01 | Rabble.",
  description:
    "Everything new at Rabble: high-density printed tees and women's boutique wear. AW26 Drop 01 is live.",
};

export default function NewArrivalsPage() {
  return (
    <CategoryGrid
      kicker="AW26 — Drop 01"
      title="New Drops"
      intro="The full drop — printed tees out of The Print Lab and draped pieces from The Boutique Edit. One run per print. No restocks."
      items={products}
    />
  );
}
