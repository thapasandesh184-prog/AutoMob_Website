import type { Metadata } from "next";
import PrivacyContent from "./content";

export const metadata: Metadata = {
  title: "Privacy Policy | SKay Auto group",
  description: "Read the SKay Auto group Privacy Policy. Learn how we collect, use, and protect your personal information when you visit our website or use our services.",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
