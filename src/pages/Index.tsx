import TopBanner from "@/components/TopBanner";
import HeroSection from "@/components/HeroSection";
import ToolsGrid from "@/components/ToolsGrid";
import CreditPackages from "@/components/CreditPackages";
import PremiumProducts from "@/components/PremiumProducts";
import ToolInterface from "@/components/ToolInterface";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>KYC Fixer - AI-Powered Photo & ID Editing Tools</title>
        <meta name="description" content="Enhance photos, generate videos, and edit text in images with AI. Professional tools for document verification and photo editing." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <TopBanner />
        <HeroSection />
        <ToolsGrid />
        <CreditPackages />
        <PremiumProducts />
        <ToolInterface />
      </div>
    </>
  );
};

export default Index;
