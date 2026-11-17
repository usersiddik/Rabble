import type { Metadata } from "next";
import CategoryGrid from "@/components/CategoryGrid";
import { byCategory } from "@/data/products";

export const metadata: Metadata = {
  title: "The Print Lab — Front & Back Printed Tees | Rabble.",
  description:
    "High-density front & back printed T-shirts in 240 GSM heavyweight combed cotton. One-run prints — no restocks.",
};

export default function MenPage() {
  return (
    <CategoryGrid
      kicker="World 01 — Streetwear"
      title="The Print Lab"
      intro="Heavyweight oversized tees carrying high-density front & back graphics. 240 GSM combed cotton, puff ink and HD screen prints. One print run per design — when it's gone, it's gone."
      items={byCategory("printed-tee")}
    />
  );
}
