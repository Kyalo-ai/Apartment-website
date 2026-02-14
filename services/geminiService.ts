
import { GoogleGenAI, Type } from "@google/genai";
import { Apartment, Tenant, Invoice } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeFinancials(invoices: Invoice[], tenants: Tenant[]) {
    const prompt = `
      As a property management analyst, analyze the following rental data:
      Invoices: ${JSON.stringify(invoices)}
      Tenants: ${JSON.stringify(tenants)}
      
      Provide a concise financial summary:
      1. Total revenue collected vs pending.
      2. Identification of high-risk tenants (frequent overdue).
      3. A prediction for next month's cash flow.
      4. Suggestions for improving occupancy or collections.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return "Unable to generate AI analysis at this time.";
    }
  }

  async generateLateNotice(tenantName: string, amount: number, dueDate: string) {
    const prompt = `
      Write a professional and polite late rent payment notice for:
      Tenant: ${tenantName}
      Amount Due: $${amount}
      Original Due Date: ${dueDate}
      
      Include a reminder about potential late fees and request them to contact the management if they're facing issues.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Notice Error:", error);
      return "Error generating notice.";
    }
  }

  async generateReminderMessage(tenantName: string, amount: number, dueDate: string, isOverdue: boolean) {
    const type = isOverdue ? "OVERDUE" : "UPCOMING";
    const prompt = `
      Generate a short, friendly ${type} rent payment reminder for ${tenantName}.
      Amount: $${amount}
      Due Date: ${dueDate}
      Format: A 160-character SMS and a 2-sentence Email body.
      Tone: Helpful and firm but polite.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      return "Rent reminder for " + tenantName + ": $" + amount + " due on " + dueDate;
    }
  }

  async generateBackgroundImage() {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: 'A high-angle architectural photograph of a luxury modern residential backyard garden. The design features clean white geometric paving stones, two perfectly circular white tile patio areas, square-cut boxwood hedges surrounding single manicured trees, and lush, vibrant green grass in symmetrical sections. A modern white minimalist house with large floor-to-ceiling glass windows is partially visible. High-end landscaping, bright daylight, peaceful and expensive atmosphere.',
            },
          ],
        },
      });
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Image Generation Error:", error);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
