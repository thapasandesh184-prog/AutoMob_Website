import type { Metadata } from "next";
import AboutContent from "./content";

export const metadata: Metadata = {
  title: "About Us | Prestige Motors | Vancouver Luxury Dealership",
  description: "Learn about Prestige Motors, Vancouver's premier luxury and exotic car dealership. Over 15 years of excellence in curating exceptional automobiles.",
};

export default function AboutPage() {
  return <AboutContent />;
}
