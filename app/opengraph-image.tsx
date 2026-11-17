import { ogImage, OG_SIZE } from "@/lib/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return ogImage({
    kicker: "Drop 01 — live",
    title: "Noise you can",
    note: "wear.",
    meta: "Men & women · Designed in India · UPI · COD",
  });
}
