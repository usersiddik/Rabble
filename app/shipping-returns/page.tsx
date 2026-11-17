import type { Metadata } from "next";
import HelpPage from "@/components/HelpPage";
import { getHelpPage } from "@/content/legal";

const page = getHelpPage("shipping-returns")!;

export const metadata: Metadata = {
  title: page.title,
  description: page.lede,
  alternates: { canonical: "/shipping-returns" },
};

export default function Page() {
  return <HelpPage page={page} />;
}
