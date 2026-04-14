import type { Metadata } from "next";
import TeamContent from "./content";

export const metadata: Metadata = {
  title: "Our Team | Prestige Motors",
  description: "Meet the dedicated team behind Prestige Motors. Our experts are here to help you find your perfect luxury vehicle.",
};

export default function TeamPage() {
  return <TeamContent />;
}
