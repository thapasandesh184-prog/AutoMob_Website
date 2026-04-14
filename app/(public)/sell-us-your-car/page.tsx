import type { Metadata } from "next";
import SellUsYourCarContent from "./content";

export const metadata: Metadata = {
  title: "Sell Us Your Car | Get an Offer | Prestige Motors",
  description: "Receive a competitive offer for your luxury vehicle. Fast, fair, and hassle-free trade-in process at Prestige Motors in Vancouver.",
};

export default function SellUsYourCarPage() {
  return <SellUsYourCarContent />;
}
