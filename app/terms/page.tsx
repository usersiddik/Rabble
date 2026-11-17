import type { Metadata } from "next";
import HelpPage from "@/components/HelpPage";
import { getHelpPage } from "@/content/legal";

const page = getHelpPage("terms")!;

export const metadata: Metadata = {
  title: page.title,
  description: page.lede,
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <HelpPage page={page} />;
}
