import type { Metadata } from "next";
import TeamContent from "./content";

export const metadata: Metadata = {
  title: "Our Team | SKay Auto group",
  description: "Meet the dedicated team behind SKay Auto group. Our experts are here to help you find your perfect luxury vehicle.",
};

export default function TeamPage() {
  return <TeamContent />;
}
