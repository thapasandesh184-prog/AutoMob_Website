import type { Metadata } from "next";
import DirectionsContent from "./content";

export const metadata: Metadata = {
  title: "Directions | SKay Auto group | Richmond",
  description: "Find directions to SKay Auto group in Richmond. Located at Parking lot, 21320 Westminster Hwy #2128, easily accessible from YVR, downtown, and major landmarks.",
};

export default function DirectionsPage() {
  return <DirectionsContent />;
}
