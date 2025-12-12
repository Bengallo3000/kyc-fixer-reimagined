import { useState } from "react";
import { Upload, Sparkles, Video, Type, Users, QrCode, FileText, FileCheck, Shield, Loader2, CheckCircle, AlertCircle, Download, Layers } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const toolTabs = [
  { id: "selfie", label: "Selfie Extractor", icon: Sparkles },
  { id: "video", label: "Video", icon: Video },
  { id: "id", label: "ID Editor", icon: Type },
  { id: "faceswap", label: "Face Swap", icon: Users },
  { id: "barcode", label: "Barcode", icon: QrCode },
  { id: "pdf", label: "PDF", icon: FileText },
  { id: "residence", label: "Proof of Residence", icon: FileCheck },
  { id: "kyc", label: "Full KYC", icon: Shield },
  { id: "hologram", label: "Hologram Extractor", icon: Layers },
];

interface AnalysisResult {
  [key: string]: unknown;
}

const ToolInterface = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [secondFile, setSecondFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [secondResultImage, setSecondResultImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("selfie");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [secondPreviewUrl, setSecondPreviewUrl] = useState<string | null>(null);
  const [hologramOpacity, setHologramOpacity] = useState<number>(100);
  const [secondHologramOpacity, setSecondHologramOpacity] = useState<number>(100);
  const { toast } = useToast();

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
    if (file) handleFileSelection(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelection(file);
  };

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    setAnalysisResult(null);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSecondFileSelection = (file: File) => {
    setSecondFile(file);
    setAnalysisResult(null);
    
    const url = URL.createObjectURL(file);
    setSecondPreviewUrl(url);
  };

  const handleSecondFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleSecondFileSelection(file);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleProcess = async () => {
    if (!selectedFile) return;
    
    // For faceswap, require both images
    if (activeTab === "faceswap" && !secondFile) {
      toast({
        title: "Second Image Required",
        description: "Please upload a second image for face swap.",
        variant: "destructive",
      });
      return;
    }

    // For hologram, second image is optional - handled in the edge function

    setIsProcessing(true);
    setAnalysisResult(null);
    setResultImage(null);
    setSecondResultImage(null);

    try {
      const imageBase64 = await fileToBase64(selectedFile);
      const secondImageBase64 = secondFile ? await fileToBase64(secondFile) : undefined;

      const { data, error } = await supabase.functions.invoke('process-image', {
        body: { 
          imageBase64, 
          secondImageBase64,
          toolType: activeTab 
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        setAnalysisResult(data.analysis);
        if (data.resultImage) {
          setResultImage(data.resultImage);
        }
        if (data.secondResultImage) {
          setSecondResultImage(data.secondResultImage);
        }
        toast({
          title: activeTab === "faceswap" ? "Face Swap Complete" : activeTab === "hologram" ? "Hologram Extraction Complete" : "Analysis Complete",
          description: activeTab === "faceswap" 
            ? "Faces have been detected and swapped!" 
            : activeTab === "hologram"
            ? "Holograms have been extracted as transparent PNG!"
            : `Your ${activeTab} analysis is ready.`,
        });
      } else {
        throw new Error(data.error || 'Processing failed');
      }
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Processing Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setSecondFile(null);
    setAnalysisResult(null);
    setResultImage(null);
    setSecondResultImage(null);
    setHologramOpacity(100);
    setSecondHologramOpacity(100);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (secondPreviewUrl) {
      URL.revokeObjectURL(secondPreviewUrl);
      setSecondPreviewUrl(null);
    }
  };

  const downloadResultImage = (imageUrl: string, filename: string) => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isHologram = activeTab === "hologram";

  const isFaceSwap = activeTab === "faceswap";
  const needsTwoImages = isFaceSwap;
  const optionalSecondImage = isHologram;
  const canProcess = needsTwoImages ? (selectedFile && secondFile) : selectedFile;

  const renderAnalysisResult = () => {
    if (!analysisResult && !resultImage && !secondResultImage) return null;

    return (
      <div className="mt-6 space-y-6">
        {/* Hologram Extraction Results */}
        {isHologram && (resultImage || secondResultImage) && (
          <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/30 rounded-xl border border-primary/30">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-primary" />
              <h4 className="font-semibold">Extracted Holograms</h4>
            </div>
            <div className={`grid gap-6 ${resultImage && secondResultImage ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {resultImage && (
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden bg-[repeating-conic-gradient(#808080_0%_25%,#fff_0%_50%)] bg-[length:20px_20px] p-4">
                    <p className="text-xs font-medium text-center mb-2 bg-background/80 rounded px-2 py-1 inline-block">Front Side Hologram</p>
                    <img 
                      src={resultImage} 
                      alt="Front hologram extraction" 
                      className="max-h-64 mx-auto rounded-lg object-contain"
                      style={{ opacity: hologramOpacity / 100 }}
                    />
                  </div>
                  <div className="space-y-2 px-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Transparency</span>
                      <span className="text-primary font-medium">{100 - hologramOpacity}%</span>
                    </div>
                    <Slider
                      value={[hologramOpacity]}
                      onValueChange={(value) => setHologramOpacity(value[0])}
                      min={10}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-center">
                    <Button variant="outline" size="sm" onClick={() => downloadResultImage(resultImage, 'hologram-front.png')}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Front
                    </Button>
                  </div>
                </div>
              )}
              {secondResultImage && (
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden bg-[repeating-conic-gradient(#808080_0%_25%,#fff_0%_50%)] bg-[length:20px_20px] p-4">
                    <p className="text-xs font-medium text-center mb-2 bg-background/80 rounded px-2 py-1 inline-block">Back Side Hologram</p>
                    <img 
                      src={secondResultImage} 
                      alt="Back hologram extraction" 
                      className="max-h-64 mx-auto rounded-lg object-contain"
                      style={{ opacity: secondHologramOpacity / 100 }}
                    />
                  </div>
                  <div className="space-y-2 px-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Transparency</span>
                      <span className="text-primary font-medium">{100 - secondHologramOpacity}%</span>
                    </div>
                    <Slider
                      value={[secondHologramOpacity]}
                      onValueChange={(value) => setSecondHologramOpacity(value[0])}
                      min={10}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-center">
                    <Button variant="outline" size="sm" onClick={() => downloadResultImage(secondResultImage, 'hologram-back.png')}>
                      <Download className="w-4 h-4 mr-2" />
                      Download Back
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Face Swap Result Image */}
        {resultImage && isFaceSwap && (
          <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/30 rounded-xl border border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">Face Swap Result</h4>
              </div>
              <Button variant="outline" size="sm" onClick={() => downloadResultImage(resultImage, 'face-swap-result.png')}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="rounded-lg overflow-hidden bg-background/50 p-4">
              <img 
                src={resultImage} 
                alt="Face swap result" 
                className="max-h-96 mx-auto rounded-lg object-contain shadow-lg"
              />
            </div>
          </div>
        )}

        {/* Analysis Details */}
        {analysisResult && (
          <div className="p-6 bg-secondary/30 rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-primary" />
              <h4 className="font-semibold">{isFaceSwap ? "Swap Details" : isHologram ? "ID & Hologram Analysis" : "AI Analysis Results"}</h4>
            </div>
            <div className="space-y-3">
              {Object.entries(analysisResult).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-primary capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {typeof value === 'object' 
                      ? JSON.stringify(value, null, 2) 
                      : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <Tabs 
          defaultValue="selfie" 
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            clearSelection();
          }}
          className="w-full"
        >
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
                <h3 className="text-xl font-semibold mb-2">
                  {tab.id === "selfie" && "AI Selfie Analysis"}
                  {tab.id === "video" && "Video Generation Preview"}
                  {tab.id === "id" && "ID Document Analysis"}
                  {tab.id === "faceswap" && "AI Face Swap"}
                  {tab.id === "barcode" && "Barcode Detection"}
                  {tab.id === "pdf" && "PDF Document Analysis"}
                  {tab.id === "residence" && "Residence Verification"}
                  {tab.id === "kyc" && "KYC Verification"}
                  {tab.id === "hologram" && "AI Hologram Extraction"}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {tab.id === "selfie" && "Upload a photo to analyze selfie quality and extract facial features"}
                  {tab.id === "video" && "Upload a photo to analyze for AI video generation potential"}
                  {tab.id === "id" && "Upload an ID document to detect and analyze text fields"}
                  {tab.id === "faceswap" && "Upload two photos with faces to swap them automatically"}
                  {tab.id === "barcode" && "Upload an image to detect and decode barcodes/QR codes"}
                  {tab.id === "pdf" && "Upload a PDF or document image for AI-powered analysis"}
                  {tab.id === "residence" && "Upload proof of residence for address verification"}
                  {tab.id === "kyc" && "Upload ID documents for comprehensive KYC verification"}
                  {tab.id === "hologram" && "Upload an ID document to extract hologram patterns as transparent PNG"}
                </p>
                
                {!selectedFile ? (
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
                      id={`file-upload-${tab.id}`}
                    />
                    <label htmlFor={`file-upload-${tab.id}`}>
                      <Button variant="outline" className="cursor-pointer" asChild>
                        <span>Select Photo</span>
                      </Button>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Image Previews - Side by side for Face Swap */}
                    {isFaceSwap ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* First Image */}
                        <div className="relative rounded-xl overflow-hidden bg-secondary/30 p-4">
                          <p className="text-xs text-primary font-medium mb-2 text-center">Source Face</p>
                          {previewUrl && (
                            <img 
                              src={previewUrl} 
                              alt="First face" 
                              className="max-h-48 mx-auto rounded-lg object-contain"
                            />
                          )}
                          <p className="text-xs text-muted-foreground mt-2 text-center truncate">{selectedFile.name}</p>
                        </div>
                        
                        {/* Second Image or Upload Button */}
                        {secondFile && secondPreviewUrl ? (
                          <div className="relative rounded-xl overflow-hidden bg-secondary/30 p-4">
                            <p className="text-xs text-primary font-medium mb-2 text-center">Target Face</p>
                            <img 
                              src={secondPreviewUrl} 
                              alt="Second face" 
                              className="max-h-48 mx-auto rounded-lg object-contain"
                            />
                            <p className="text-xs text-muted-foreground mt-2 text-center truncate">{secondFile.name}</p>
                          </div>
                        ) : (
                          <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-border hover:border-primary/50 p-4 flex flex-col items-center justify-center min-h-[200px] transition-colors">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-3 text-center">Upload second face</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleSecondFileSelect}
                              className="hidden"
                              id="second-file-upload"
                            />
                            <label htmlFor="second-file-upload">
                              <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                                <span>Select Photo</span>
                              </Button>
                            </label>
                          </div>
                        )}
                      </div>
                    ) : isHologram ? (
                      /* Hologram: show first image with optional second */
                      <div className="space-y-4">
                        <div className="relative rounded-xl overflow-hidden bg-secondary/30 p-4">
                          <p className="text-xs text-primary font-medium mb-2 text-center">ID Front Side</p>
                          {previewUrl && (
                            <img 
                              src={previewUrl} 
                              alt="ID Front" 
                              className="max-h-48 mx-auto rounded-lg object-contain"
                            />
                          )}
                          <p className="text-xs text-muted-foreground mt-2 text-center truncate">{selectedFile.name}</p>
                        </div>
                        
                        {/* Optional second image for back side */}
                        {secondFile && secondPreviewUrl ? (
                          <div className="relative rounded-xl overflow-hidden bg-secondary/30 p-4">
                            <p className="text-xs text-primary font-medium mb-2 text-center">ID Back Side (Optional)</p>
                            <img 
                              src={secondPreviewUrl} 
                              alt="ID Back" 
                              className="max-h-48 mx-auto rounded-lg object-contain"
                            />
                            <p className="text-xs text-muted-foreground mt-2 text-center truncate">{secondFile.name}</p>
                          </div>
                        ) : (
                          <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-border hover:border-primary/50 p-4 flex flex-col items-center justify-center transition-colors">
                            <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-2 text-center">Upload back side (optional)</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleSecondFileSelect}
                              className="hidden"
                              id="hologram-second-file-upload"
                            />
                            <label htmlFor="hologram-second-file-upload">
                              <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                                <span>Add Back Side</span>
                              </Button>
                            </label>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Regular single image preview */
                      previewUrl && (
                        <div className="relative rounded-xl overflow-hidden bg-secondary/30 p-4">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="max-h-64 mx-auto rounded-lg object-contain"
                          />
                        </div>
                      )
                    )}
                    
                    {/* File Info & Actions */}
                    <div className="p-4 bg-secondary/50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <tab.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <span className="text-sm font-medium block">
                            {(isFaceSwap || isHologram)
                              ? `${selectedFile.name}${secondFile ? ` + ${secondFile.name}` : ''}`
                              : selectedFile.name
                            }
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {isFaceSwap 
                              ? (secondFile ? "Both images ready" : "Waiting for second image...")
                              : isHologram
                              ? (secondFile ? "Front & back ready" : "Front side ready (back optional)")
                              : `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                            }
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={clearSelection}
                          disabled={isProcessing}
                        >
                          Clear
                        </Button>
                        <Button 
                          variant="hero" 
                          size="sm"
                          onClick={handleProcess}
                          disabled={isProcessing || !canProcess}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              {isFaceSwap ? "Swapping..." : isHologram ? "Extracting..." : "Processing..."}
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              {isFaceSwap ? "Swap Faces" : isHologram ? "Extract Holograms" : "Analyze with AI"}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Analysis Results */}
                    {renderAnalysisResult()}
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
