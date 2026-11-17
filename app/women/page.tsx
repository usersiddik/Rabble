import type { Metadata } from "next";
import CategoryGrid from "@/components/CategoryGrid";
import { byCategory } from "@/data/products";

export const metadata: Metadata = {
  title: "The Boutique Edit — Women's Contemporary & Draped Wear | Rabble.",
  description:
    "Curated women's boutique wear: elevated co-ords, draped silhouettes and boutique-grade tailoring in warm alabaster and sandstone.",
};

export default function WomenPage() {
  return (
    <CategoryGrid
      kicker="World 02 — Atelier"
      title="The Boutique Edit"
      intro="Elevated co-ords, draped silhouettes and boutique-grade tailoring. Cupro, crepe and fluid viscose blends in a warm alabaster & sandstone palette."
      items={byCategory("womens-boutique")}
      serifTitle
    />
  );
}
