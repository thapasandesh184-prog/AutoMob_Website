import type { Metadata } from "next";
import HomeContent from "./content";
import JsonLd from "@/components/JsonLd";
import { getAllSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAllSettings();
  return {
    title: settings.metaTitle || "Prestige Motors | Luxury & Exotic Car Dealership | Vancouver",
    description: settings.metaDescription || "Discover the finest collection of luxury and exotic vehicles at Prestige Motors. Premium pre-owned cars, SUVs, and supercars with world-class service in Vancouver.",
    openGraph: {
      images: settings.ogImage
        ? [settings.ogImage]
        : ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80"],
    },
  };
}

export default async function HomePage() {
  const settings = await getAllSettings();
  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: settings.siteName || "Prestige Motors",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address || "123 Luxury Lane",
      addressLocality: settings.city || "Vancouver",
      addressRegion: settings.state || "BC",
      postalCode: settings.zip || "V6B 1A1",
      addressCountry: settings.country || "CA",
    },
    telephone: settings.phone || "+1-778-123-4567",
    url: "https://prestigemotors.com",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "19:00",
      },
    ],
  };

  return (
    <>
      <JsonLd data={localBusinessLd} />
      <HomeContent />
    </>
  );
}
