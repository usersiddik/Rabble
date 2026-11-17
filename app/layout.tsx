import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BagProvider } from "@/components/CartContext";

export const metadata: Metadata = {
  title: "Rabble. — High-Density Printed Tees & Women's Boutique Atelier",
  description:
    "India's premier D2C fashion platform for high-density front & back printed T-shirts and curated women's boutique wear. 240 GSM. One-run prints — no restocks.",
};

export const viewport: Viewport = {
  themeColor: "#f4f3ef",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BagProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </BagProvider>
      </body>
    </html>
  );
}
