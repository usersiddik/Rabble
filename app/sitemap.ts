import type { MetadataRoute } from "next";
import { garments } from "@/content/garments";
import { helpPages } from "@/content/legal";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-11-17");
  const statics: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/new-arrivals`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/men`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/women`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/drop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/lookbook`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
  const help: MetadataRoute.Sitemap = helpPages.map((p) => ({
    url: `${site.url}/${p.slug}`,
    lastModified: new Date(p.updated),
    changeFrequency: "yearly",
    priority: 0.3,
  }));
  const products: MetadataRoute.Sitemap = garments.map((g) => ({
    url: `${site.url}/product/${g.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: g.status === "live" ? 0.8 : 0.6,
  }));
  return [...statics, ...help, ...products];
}
