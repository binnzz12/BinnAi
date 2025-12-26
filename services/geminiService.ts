
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const TEXT_MODEL = 'gemini-3-flash-preview';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

export class GeminiService {
  private ai: GoogleGenAI;
  private chatHistory: any[] = [];

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  private isImageRequest(text: string): boolean {
    const keywords = ['gambar', 'foto', 'image', 'generate image', 'buatkan gambar', 'lukisan'];
    return keywords.some(k => text.toLowerCase().includes(k));
  }

  async sendMessage(text: string, onChunk: (chunk: string) => void, onImage?: (url: string) => void) {
    try {
      if (this.isImageRequest(text)) {
        const response = await this.ai.models.generateContent({
          model: IMAGE_MODEL,
          contents: { parts: [{ text }] },
        });

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64 = part.inlineData.data;
            const url = `data:image/png;base64,${base64}`;
            onImage?.(url);
            return "Gambar berhasil dibuat!";
          } else if (part.text) {
            onChunk(part.text);
          }
        }
        return "";
      } else {
        const chat = this.ai.chats.create({
          model: TEXT_MODEL,
          config: {
            systemInstruction: "Anda adalah BinnAI, asisten AI cerdas. Fitur utama Anda: 1) Percakapan cerdas. 2) Bantuan Coding (berikan kode yang bersih dan penjelasan detail). 3) Deskripsi untuk generate gambar. Gunakan Bahasa Indonesia. Jawab dalam format Markdown.",
            temperature: 0.7,
          },
        });
        
        const result = await chat.sendMessageStream({ message: text });
        let fullText = "";
        for await (const chunk of result) {
          const chunkText = (chunk as GenerateContentResponse).text || "";
          fullText += chunkText;
          onChunk(chunkText);
        }
        return fullText;
      }
    } catch (error: any) {
      console.error("BinnAI API Error:", error);
      throw new Error(error?.message || "Oops! Gangguan sistem. Coba lagi nanti.");
    }
  }

  resetChat() {
    this.chatHistory = [];
  }
}

export const geminiService = new GeminiService();
