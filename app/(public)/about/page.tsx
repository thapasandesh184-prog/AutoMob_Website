import type { Metadata } from "next";
import AboutContent from "./content";

export const metadata: Metadata = {
  title: "About Us | SKay Auto group | Richmond Luxury Dealership",
  description: "Learn about SKay Auto group, Richmond's premier luxury and exotic car dealership. Over 15 years of excellence in curating exceptional automobiles.",
};

export default function AboutPage() {
  return <AboutContent />;
}
