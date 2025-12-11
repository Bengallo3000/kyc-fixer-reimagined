import { Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,_hsl(220,15%,15%)_0%,_transparent_70%)]" />
      
      <div className="container mx-auto text-center relative z-10">
        <div className="section-badge mb-6 mx-auto w-fit animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Photo Tools</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          KYC Fixer Realistic Selfie and ID editing
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Enhance photos, generate videos, and edit text in images with AI
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
