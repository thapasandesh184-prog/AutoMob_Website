import type { Metadata } from "next";
import CompareContent from "./content";

export const metadata: Metadata = {
  title: "Compare Vehicles | Prestige Motors",
  description: "Side-by-side comparison of luxury and exotic vehicles at Prestige Motors. Compare specs, features, and prices to find your perfect car.",
};

export default function ComparePage() {
  return <CompareContent />;
}
