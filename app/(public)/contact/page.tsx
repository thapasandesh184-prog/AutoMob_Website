import type { Metadata } from "next";
import ContactContent from "./content";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Contact Us | SKay Auto group | Richmond",
  description: "Get in touch with SKay Auto group. Visit our Richmond showroom, call us, or send a message. We're here to help you find your dream car.",
};

export default function ContactPage() {
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
      <ContactContent />
    </>
  );
}
