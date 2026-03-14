import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getAiResponse = async (prompt: string, language: 'bn' | 'en' = 'bn') => {
  try {
    const model = "gemini-3-flash-preview";
    const systemInstruction = language === 'bn' 
      ? "আপনি একজন ইসলামিক সহকারী। আপনার নাম 'নূর এআই'। আপনি ব্যবহারকারীদের ইসলামিক প্রশ্ন, কুরআন, হাদিস এবং দৈনন্দিন আমল সম্পর্কে সাহায্য করেন। আপনার উত্তরগুলো সবসময় মার্জিত এবং সঠিক হতে হবে।"
      : "You are an Islamic assistant named 'Noor AI'. You help users with Islamic questions, Quran, Hadith, and daily practices. Your answers should always be polite and accurate.";

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    return response.text || (language === 'bn' ? "দুঃখিত, আমি উত্তর দিতে পারছি না।" : "Sorry, I cannot answer that.");
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return language === 'bn' ? "দুঃখিত, একটি ত্রুটি ঘটেছে।" : "Sorry, an error occurred.";
  }
};
