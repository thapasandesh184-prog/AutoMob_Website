import type { Metadata } from "next";
import FinanceContent from "./content";

export const metadata: Metadata = {
  title: "Finance Department | Prestige Motors",
  description: "Explore flexible financing options at Prestige Motors. Competitive rates, fast approvals, and personalized loan terms for your luxury vehicle purchase.",
};

export default function FinancePage() {
  return <FinanceContent />;
}
