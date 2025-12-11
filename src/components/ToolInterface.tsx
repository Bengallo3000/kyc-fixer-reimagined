import { useState } from "react";
import { Upload, Sparkles, Video, Type, Users, QrCode, FileText, FileCheck, Shield } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const toolTabs = [
  { id: "selfie", label: "Selfie Extractor", icon: Sparkles },
  { id: "video", label: "Video", icon: Video },
  { id: "id", label: "ID Editor", icon: Type },
  { id: "faceswap", label: "Face Swap", icon: Users },
  { id: "barcode", label: "Barcode", icon: QrCode },
  { id: "pdf", label: "PDF", icon: FileText },
  { id: "residence", label: "Proof of Residence", icon: FileCheck },
  { id: "kyc", label: "Full KYC", icon: Shield },
];

const ToolInterface = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <Tabs defaultValue="selfie" className="w-full">
          <TabsList className="w-full h-auto flex-wrap gap-2 bg-secondary/30 p-2 rounded-xl mb-8">
            {toolTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-lg transition-all"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {toolTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <div className="glass-card p-8">
                <h3 className="text-xl font-semibold mb-2">Upload Your Photo</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {tab.id === "selfie" && "Upload a photo to extract or generate a professional selfie"}
                  {tab.id === "video" && "Upload a photo to create an animated video clip"}
                  {tab.id === "id" && "Upload an ID document to edit text fields"}
                  {tab.id === "faceswap" && "Upload two photos to swap faces between them"}
                  {tab.id === "barcode" && "Upload an image to edit or replace barcodes"}
                  {tab.id === "pdf" && "Upload a PDF document for AI-powered text editing"}
                  {tab.id === "residence" && "Generate proof of residence documents"}
                  {tab.id === "kyc" && "Complete KYC verification with ID and selfie"}
                </p>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">
                    Drag and drop your image here, or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    JPG, PNG • Max 10MB
                  </p>
                  
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>Select Photo</span>
                    </Button>
                  </label>
                </div>
                
                {selectedFile && (
                  <div className="mt-4 p-4 bg-secondary/50 rounded-lg flex items-center justify-between">
                    <span className="text-sm">{selectedFile.name}</span>
                    <Button variant="hero" size="sm">Process</Button>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Privacy note */}
        <div className="mt-8 text-center">
          <div className="glass-card inline-flex items-center gap-3 px-6 py-3">
            <Shield className="w-5 h-5 text-primary" />
            <div className="text-left">
              <div className="font-medium text-sm">Your Privacy Matters</div>
              <div className="text-xs text-muted-foreground">
                All processing happens securely. Your photos are never stored on our servers and are automatically deleted after enhancement.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolInterface;
