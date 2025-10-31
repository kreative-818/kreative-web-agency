
import { Metadata } from "next";
import MinimalServices from "@/components/minimal-services";
import MinimalCTA from "@/components/minimal-cta";

export const metadata: Metadata = {
  title: "Services | Kreative Intelligence",
  description: "Websites, web apps, and automation services that drive real results. Built fast, optimized for leads.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white pt-16">
      <MinimalServices />
      <MinimalCTA />
    </div>
  );
}
