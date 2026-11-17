import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your bag",
  description: "Review your RABBLE bag and head for checkout.",
};

export default function BagLayout({ children }: { children: React.ReactNode }) {
  return children;
}
