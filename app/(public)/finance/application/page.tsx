import type { Metadata } from "next";
import FinanceApplicationContent from "./content";

export const metadata: Metadata = {
  title: "Finance Application | SKay Auto group",
  description: "Apply for luxury car financing at SKay Auto group. Secure, multi-step application with fast approval. Start your journey to driving your dream car today.",
};

export default function FinanceApplicationPage() {
  return <FinanceApplicationContent />;
}
