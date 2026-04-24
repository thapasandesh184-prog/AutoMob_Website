import type { Metadata } from "next";
import SitemapContent from "./content";

export const metadata: Metadata = {
  title: "Sitemap | SKay Auto group",
  description: "Navigate the SKay Auto group website with ease. Find links to all our pages including inventory, financing, contact, and more.",
};

export default function SitemapPage() {
  return <SitemapContent />;
}
