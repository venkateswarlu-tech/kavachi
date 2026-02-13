
import { GoogleGenAI } from "@google/genai";
import { SecurityReport } from "../types";

export const generateAIAnalysis = async (report: SecurityReport): Promise<string> => {
  // Use gemini-3-pro-preview for complex reasoning and technical cybersecurity analysis
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Analyze the following steganography performance metrics for Project Kavach (a defense system):
    - Peak Signal-to-Noise Ratio (PSNR): ${report.psnr.toFixed(2)} dB
    - Mean Squared Error (MSE): ${report.mse.toFixed(4)}
    - Extraction Accuracy: ${report.accuracy}%
    - Security Robustness Index: ${report.securityIndex}/100

    Provide a professional, technical summary (max 150 words) evaluating the stealth quality, 
    detectability by statistical steganalysis tools, and recommendations for improvement. 
    Use a tone suitable for a cybersecurity briefing.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    // Property access .text as per guidelines
    return response.text || "Unable to generate analysis at this time.";
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "Analysis failed due to API connectivity issues.";
  }
};
