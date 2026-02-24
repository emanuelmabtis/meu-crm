import { GoogleGenAI } from "@google/genai";

export const getGeminiResponse = async (prompt: string, systemInstruction: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
    },
  });
  return response.text;
};

export const simulateBulkSend = async (contacts: any[], template: string) => {
  const results = [];
  for (const contact of contacts) {
    // Replace variables like {{name}}
    let message = template.replace(/{{name}}/g, contact.name || "Cliente");
    message = message.replace(/{{phone}}/g, contact.phone || "");
    
    // Simulate delay to avoid "spam" detection
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    results.push({
      contactId: contact.id,
      message,
      status: 'sent',
      timestamp: new Date().toISOString()
    });
  }
  return results;
};
