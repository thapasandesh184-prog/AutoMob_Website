import type { Metadata } from "next";
import ContactContent from "./content";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Contact Us | Prestige Motors | Vancouver",
  description: "Get in touch with Prestige Motors. Visit our Vancouver showroom, call us, or send a message. We're here to help you find your dream car.",
};

export default function ContactPage() {
  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "Prestige Motors",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Luxury Lane",
      addressLocality: "Vancouver",
      addressRegion: "BC",
      postalCode: "V6B 1A1",
      addressCountry: "CA",
    },
    telephone: "+1-778-123-4567",
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
      <ContactContent />
    </>
  );
}
