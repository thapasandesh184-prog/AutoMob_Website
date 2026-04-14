import type { Metadata } from "next";
import SitemapContent from "./content";

export const metadata: Metadata = {
  title: "Sitemap | Prestige Motors",
  description: "Navigate the Prestige Motors website with ease. Find links to all our pages including inventory, financing, contact, and more.",
};

export default function SitemapPage() {
  return <SitemapContent />;
}
