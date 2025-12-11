import { Check, Crown, Users, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
  {
    badge: "BESTSELLER",
    icon: Crown,
    title: "KYC 2025 GUIDE",
    description: "The ONLY guide in 2025/2026 that works! Learn how to setup a system and how to use tools to verify ANY account world wide. This guide will help you get approved more than 90% in verifications.",
    features: ["Step-by-step system", "90%+ success rate", "Worldwide methods", "One-time purchase"],
    price: "$175",
    buttonText: "Purchase",
    highlight: true,
  },
  {
    badge: "DONE FOR YOU",
    icon: Users,
    title: "KYC Service",
    description: "Hire experts to do your verification/s for you. Simply contact us to discuss your specific needs and requirements. We can do verifications world wide against any system out there.",
    features: ["Expert team", "Worldwide coverage", "Any system", "Custom pricing"],
    price: "Negotiable",
    buttonText: "Contact Us",
    highlight: false,
  },
  {
    badge: "NEW GUIDE",
    icon: Building,
    title: "Top 5 USA Banks",
    description: "We will give you the 5 easiest banks in USA to open online without intense security and verification. Perfect for quick account setup.",
    features: ["Easy online opening", "Low verification", "USA banks", "One-time purchase"],
    price: "$15",
    buttonText: "Purchase",
    highlight: false,
  },
];

const PremiumProducts = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Premium Products & Services</h2>
          <p className="text-muted-foreground">
            Master KYC verification or let our experts handle it for you
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.title}
              className={`glass-card p-6 flex flex-col ${
                product.highlight ? "ring-2 ring-primary/50" : ""
              }`}
            >
              <div className="premium-badge w-fit mb-4">{product.badge}</div>
              
              <div className="icon-box mb-4">
                <product.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              
              <h3 className="text-xl font-semibold mb-3">{product.title}</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-grow">
                {product.description}
              </p>
              
              <div className="space-y-2 mb-6">
                {product.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-auto">
                <div className="text-2xl font-bold mb-4">{product.price}</div>
                <Button variant={product.highlight ? "hero" : "outline"} className="w-full">
                  {product.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Full KYC Setup Card */}
        <div className="mt-6 glass-card p-6 ring-2 ring-primary/30">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-grow">
              <div className="premium-badge w-fit mb-3">AUTOMATED</div>
              <h3 className="text-xl font-semibold mb-2">Full KYC Setup</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Upload your ID, picture of selfie and fill in the details. Automated system will verify accounts which use SumSub, Veriff and Onfido.
              </p>
              <div className="flex flex-wrap gap-4">
                {["SumSub support", "Veriff support", "Onfido support", "One-time purchase"].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center lg:text-right">
              <div className="text-3xl font-bold mb-3">$155</div>
              <Button variant="hero" size="lg">Get Started</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumProducts;
