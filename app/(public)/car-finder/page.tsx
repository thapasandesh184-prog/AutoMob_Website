import type { Metadata } from "next";
import CarFinderContent from "./content";

export const metadata: Metadata = {
  title: "Car Finder | Find Your Dream Car | Prestige Motors",
  description: "Can't find what you're looking for? Tell us your preferences and our team will help you find the perfect luxury or exotic vehicle.",
};

export default function CarFinderPage() {
  return <CarFinderContent />;
}
