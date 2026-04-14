import type { Metadata } from "next";
import DirectionsContent from "./content";

export const metadata: Metadata = {
  title: "Directions | Prestige Motors | Vancouver",
  description: "Find directions to Prestige Motors in Vancouver. Located at 123 Luxury Lane, easily accessible from YVR, downtown, and major landmarks.",
};

export default function DirectionsPage() {
  return <DirectionsContent />;
}
