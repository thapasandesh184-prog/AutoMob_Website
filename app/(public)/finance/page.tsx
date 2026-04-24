import type { Metadata } from "next";
import FinanceContent from "./content";

export const metadata: Metadata = {
  title: "Finance Department | SKay Auto group",
  description: "Explore flexible financing options at SKay Auto group. Competitive rates, fast approvals, and personalized loan terms for your luxury vehicle purchase.",
};

export default function FinancePage() {
  return <FinanceContent />;
}
