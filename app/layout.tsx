import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GarmentDefs } from "@/components/GarmentRender";
import BagDrawer from "@/components/BagDrawer";
import JsonLd from "@/components/JsonLd";
import { CartProvider } from "@/lib/cart";
import { site } from "@/content/site";
import "./globals.css";

/** body face: weight axis only, keeps the file small */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

/** display face: a static, latin-subset Archivo Expanded 800 instance (~20 KB) so the hero paints early */
const archivoDisplay = localFont({
  src: "../assets/fonts/Archivo-Expanded-ExtraBold-latin.woff2",
  weight: "800",
  style: "normal",
  variable: "--font-archivo-display",
  display: "swap",
  adjustFontFallback: "Arial",
});

/** serif is for asides, never the LCP: don't preload it ahead of the display face */
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: ["RABBLE", "printed t-shirts India", "screen printed tees India", "women's boutique wear India", "heavyweight hoodie India", "Bengaluru clothing brand", "UPI COD clothing"],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#F6F5F0",
  colorScheme: "light",
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  logo: `${site.url}/icon.svg`,
  email: site.email,
  foundingDate: String(site.founded),
  address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: "Karnataka", addressCountry: "IN" },
  sameAs: [site.instagram.url],
  contactPoint: { "@type": "ContactPoint", contactType: "customer service", telephone: site.whatsapp.display, availableLanguage: ["en", "hi"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${archivo.variable} ${archivoDisplay.variable} ${instrument.variable}`}>
      <body>
        <JsonLd data={orgLd} />
        <GarmentDefs />
        <CartProvider>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <BagDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
