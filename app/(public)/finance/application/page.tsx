import type { Metadata } from "next";
import FinanceApplicationContent from "./content";

export const metadata: Metadata = {
  title: "Finance Application | Prestige Motors",
  description: "Apply for luxury car financing at Prestige Motors. Secure, multi-step application with fast approval. Start your journey to driving your dream car today.",
};

export default function FinanceApplicationPage() {
  return <FinanceApplicationContent />;
}
