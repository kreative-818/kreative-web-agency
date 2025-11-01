export { dynamic, revalidate, fetchCache } from '@/lib/dynamic'

import { Metadata } from "next";
import MinimalAbout from "@/components/minimal-about";
import MinimalCTA from "@/components/minimal-cta";

export const metadata: Metadata = {
  title: "About | Kreative Intelligence",
  description: "Building digital solutions that help businesses be seen, heard, and remembered.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <MinimalAbout />
      <MinimalCTA />
    </div>
  );
}
