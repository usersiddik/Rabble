import type { Metadata } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BagDrawer from "@/components/BagDrawer";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RABBLE — Noise you can wear",
    template: "%s — RABBLE",
  },
  description:
    "RABBLE is contemporary clothing for the loud majority. Designed in India for men and women, 18 to 30-ish, built to be lived in.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${instrument.variable}`}>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <BagDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
