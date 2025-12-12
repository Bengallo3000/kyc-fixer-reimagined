import { Sparkles, Video, Type, Users, Film, QrCode, FileText, FileCheck, Shield, Layers } from "lucide-react";
import ToolCard from "./ToolCard";

const tools = [
  {
    icon: Sparkles,
    title: "Selfie Extractor",
    description: "Extract or generate a selfie based on a photo you upload. AI-powered with natural lighting and professional quality.",
    credits: "1 credit",
  },
  {
    icon: Video,
    title: "Video Generation",
    description: "Create animated clips from photos with natural head movements. Perfect for social media content and profile videos.",
    credits: "5 credits",
  },
  {
    icon: Type,
    title: "ID Editor",
    description: "Change the text on any driver license, passport or ID document without disturbing the style and theme of the original.",
    credits: "1 credit/row",
  },
  {
    icon: Users,
    title: "Face Swap",
    description: "Seamlessly swap faces between two images while preserving backgrounds and visual context. Studio-quality results.",
    credits: "2 credits",
  },
  {
    icon: Film,
    title: "Video Face Swap",
    description: "Advanced video processing to swap faces in short clips (3-5 seconds). Frame-by-frame AI processing for smooth results.",
    credits: "25 credits",
    isPremium: true,
  },
  {
    icon: QrCode,
    title: "Barcode Editor",
    description: "Generate and replace barcodes in images while preserving the original style, color scheme, and visual consistency.",
    credits: "2 credits",
  },
  {
    icon: FileText,
    title: "PDF Editor",
    description: "AI-powered PDF text editing. Find and replace text in documents while maintaining formatting and document integrity.",
    credits: "2 credits/doc",
  },
  {
    icon: FileCheck,
    title: "Proof of Residence",
    description: "Generate utility bills, bank statements, or payslips with your details. Choose document type and fill in required fields.",
    credits: "2 credits",
  },
  {
    icon: Shield,
    title: "Full KYC Setup",
    description: "Upload your ID, selfie and fill in details. Automated system verifies accounts using SumSub, Veriff and Onfido.",
    credits: "155 credits",
    isAutomated: true,
  },
  {
    icon: Layers,
    title: "Hologram Extractor",
    description: "Extract hologram patterns from ID documents. AI detects and isolates security hologram areas as transparent PNG files.",
    credits: "3 credits",
  },
];

const ToolsGrid = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="section-badge mb-6 mx-auto w-fit">
            <Sparkles className="w-4 h-4" />
            <span>Professional Tools</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for <span className="gradient-text">Perfect Photos</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful AI-driven tools designed for document verification, social media optimization, and professional photo editing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.title} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsGrid;
