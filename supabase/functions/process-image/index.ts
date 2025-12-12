import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const toolPrompts: Record<string, string> = {
  selfie: `You are an AI image analysis expert. Analyze this photo and provide:
1. A professional assessment of the selfie quality
2. Face detection status (detected/not detected)
3. Lighting analysis
4. Composition suggestions for a better selfie
5. Confidence score (0-100) for KYC verification purposes

Respond in JSON format with keys: quality, faceDetected, lighting, suggestions, confidenceScore`,

  video: `Analyze this image for video generation potential. Provide:
1. Subject detection and positioning
2. Motion prediction areas
3. Recommended video effects (zoom, pan, parallax)
4. Duration suggestion (3s, 5s, 10s)
5. Quality assessment for video generation

Respond in JSON format with keys: subjects, motionAreas, effects, duration, qualityScore`,

  id: `Analyze this ID document image and provide:
1. Document type detection (passport, driver's license, national ID, etc.)
2. Text fields detected (name, date, ID number, etc.)
3. Document orientation
4. Image quality for OCR
5. Authenticity markers detected

Respond in JSON format with keys: documentType, textFields, orientation, ocrQuality, authenticityMarkers`,

  faceswap: `Analyze this face image for face swap compatibility:
1. Face detection and positioning
2. Face landmarks (eyes, nose, mouth positions)
3. Lighting direction
4. Face angle estimation
5. Swap quality prediction score

Respond in JSON format with keys: faceDetected, landmarks, lighting, angle, swapScore`,

  barcode: `Analyze this image for barcode/QR code content:
1. Barcode type detection (QR, Code128, EAN, etc.)
2. Barcode location in image
3. Decoded content (if visible)
4. Image quality for scanning
5. Suggestions for editing

Respond in JSON format with keys: barcodeType, location, content, scanQuality, editSuggestions`,

  pdf: `Analyze this PDF/document image:
1. Document layout analysis
2. Text regions detected
3. Tables or structured data
4. Image quality assessment
5. OCR readiness score

Respond in JSON format with keys: layout, textRegions, tables, quality, ocrReadiness`,

  residence: `Analyze this proof of residence document:
1. Document type (utility bill, bank statement, etc.)
2. Address fields detected
3. Date fields detected
4. Document validity assessment
5. Verification confidence score

Respond in JSON format with keys: documentType, addressFields, dateFields, validity, confidenceScore`,

  kyc: `Perform comprehensive KYC analysis on this document:
1. Document type and authenticity
2. Personal information fields detected
3. Photo/biometric data present
4. Security features detected
5. Overall KYC verification score

Respond in JSON format with keys: documentType, personalInfo, biometrics, securityFeatures, kycScore`,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, toolType } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ success: false, error: 'No image provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = toolPrompts[toolType] || toolPrompts.selfie;
    
    console.log(`Processing image with tool: ${toolType}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image and provide the requested analysis.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'Usage limit reached. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: false, error: 'AI processing failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log('AI analysis complete');

    // Try to parse JSON from the response
    let analysisResult;
    try {
      // Extract JSON from the response if it's wrapped in markdown code blocks
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      analysisResult = JSON.parse(jsonStr);
    } catch {
      // If parsing fails, return the raw content
      analysisResult = { rawAnalysis: content };
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisResult,
        toolType 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Processing failed';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
