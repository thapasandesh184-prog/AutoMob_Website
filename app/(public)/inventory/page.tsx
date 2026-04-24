import type { Metadata } from "next";
import { Suspense } from "react";
import InventoryContent from "./content";

export const metadata: Metadata = {
  title: "Luxury & Exotic Cars For Sale | SKay Auto group",
  description: "Browse our curated inventory of luxury and exotic vehicles for sale at SKay Auto group in Richmond. Premium pre-owned cars, SUVs, and supercars.",
};

export default function InventoryPage() {
  return (
    <Suspense fallback={null}>
      <InventoryContent />
    </Suspense>
  );
}
