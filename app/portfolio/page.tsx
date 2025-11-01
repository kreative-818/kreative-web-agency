export { dynamic, revalidate, fetchCache } from '@/lib/dynamic'

import { Metadata } from "next";
import PortfolioHero from "@/components/portfolio-hero";
import PortfolioGrid from "@/components/portfolio-grid";

export const metadata: Metadata = {
  title: "Portfolio | Kreative Intelligence",
  description: "Explore our portfolio of successful web development projects including custom websites, web applications, and e-commerce solutions.",
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <PortfolioHero />
      <PortfolioGrid />
    </div>
  );
}
