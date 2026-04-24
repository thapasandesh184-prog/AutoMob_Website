import type { Metadata } from "next";
import HomeContent from "./content";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "SKay Auto group | Luxury & Exotic Car Dealership | Richmond",
  description:
    "Discover the finest collection of luxury and exotic vehicles at SKay Auto group. Premium pre-owned cars, SUVs, and supercars with world-class service in Richmond.",
  openGraph: {
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    ],
  },
};

export default function HomePage() {
  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "SKay Auto group",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Parking lot, 21320 Westminster Hwy #2128",
      addressLocality: "Richmond",
      addressRegion: "BC",
      postalCode: "V5W 3A3",
      addressCountry: "CA",
    },
    telephone: "+1 7789907468",
    url: "https://skayautogroup.ca",
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
