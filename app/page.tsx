
import MinimalHero from "@/components/minimal-hero";
import MinimalServices from "@/components/minimal-services";
import MinimalCTA from "@/components/minimal-cta";
import TrustIndicators from "@/components/trust-indicators";
import AiSalesChatbot from "@/components/ai-sales-chatbot";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <MinimalHero />
      <MinimalServices />
      <TrustIndicators />
      <MinimalCTA />
      <AiSalesChatbot />
    </div>
  );
}
