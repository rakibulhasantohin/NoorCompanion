import { GoogleGenAI } from "@google/genai";

// Get API key from either process.env (AI Studio) or import.meta.env (Vercel/Vite)
const getApiKey = () => {
  try {
    // @ts-ignore
    if (import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_GEMINI_API_KEY;
    }
  } catch (e) {}

  try {
    if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  } catch (e) {}
  
  return "";
};

export const getAiResponse = async (prompt: string, language: 'bn' | 'en' = 'bn') => {
  try {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      console.error("Gemini API Key is missing!");
      return language === 'bn' 
        ? "দুঃখিত, এপিআই কী (API Key) পাওয়া যায়নি। দয়া করে Vercel-এ Environment Variables-এর মধ্যে VITE_GEMINI_API_KEY যুক্ত করুন।" 
        : "Sorry, API Key is missing. Please add VITE_GEMINI_API_KEY to Vercel Environment Variables.";
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-3-flash-preview";
    const systemInstruction = language === 'bn' 
      ? "আপনি একজন ইসলামিক সহকারী। আপনার নাম 'নূর এআই'। আপনি ব্যবহারকারীদের ইসলামিক প্রশ্ন, কুরআন, হাদিস এবং দৈনন্দিন আমল সম্পর্কে সাহায্য করেন। আপনি গুগলের জিমিনি (Gemini) মডেল ব্যবহার করে কাজ করেন, কিন্তু ব্যবহারকারীর কাছে আপনার পরিচয় 'নূর এআই'। আপনার উত্তরগুলো সবসময় মার্জিত এবং সঠিক হতে হবে। সবচেয়ে গুরুত্বপূর্ণ নিয়ম: আপনি শুধুমাত্র এবং শুধুমাত্র ইসলাম, কুরআন, হাদিস, এবং ইসলামিক বিষয়বস্তু সম্পর্কিত প্রশ্নের উত্তর দেবেন। যদি ব্যবহারকারী ইসলাম ছাড়া অন্য কোনো বিষয়ে (যেমন: রাজনীতি, বিজ্ঞান, বিনোদন, সাধারণ জ্ঞান, কোডিং ইত্যাদি) প্রশ্ন করে, তবে আপনি অত্যন্ত বিনয়ের সাথে জানাবেন যে আপনি শুধুমাত্র ইসলামিক প্রশ্নের উত্তর দিতে পারেন। অন্য কোনো বিষয়ের উত্তর আপনি কোনোভাবেই দেবেন না। ব্যবহারকারী বাংলা, ইংরেজি, অথবা বাংলিশ (Banglish - ইংরেজি অক্ষরে বাংলা) যেভাবেই প্রশ্ন করুক না কেন, আপনি সবসময় পরিষ্কার এবং সুন্দর বাংলা ভাষায় উত্তর দেবেন।"
      : "You are an Islamic assistant named 'Noor AI'. You help users with Islamic questions, Quran, Hadith, and daily practices. You are powered by Google's Gemini model, but your identity to the user is 'Noor AI'. Your answers should always be polite and accurate. MOST IMPORTANT RULE: You must ONLY answer questions related to Islam, Quran, Hadith, and Islamic topics. If a user asks about anything else (e.g., politics, science, entertainment, general knowledge, coding, etc.), you must politely decline and state that you can only answer Islamic questions. Under no circumstances should you answer non-Islamic questions. Even if the user asks in Banglish or Bengali, reply in English since the app is in English mode.";

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    return response.text || (language === 'bn' ? "দুঃখিত, আমি উত্তর দিতে পারছি না।" : "Sorry, I cannot answer that.");
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    const errorMessage = error?.message || "Unknown error";
    
    if (error?.message?.includes('API key not valid') || error?.status === 400) {
      return language === 'bn' 
        ? "দুঃখিত, আপনার দেওয়া API Key টি সঠিক নয়। দয়া করে সঠিক API Key ব্যবহার করুন।" 
        : "Sorry, the provided API Key is invalid. Please check your API Key.";
    }

    if (error?.status === 429 || errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
      return language === 'bn'
        ? "দুঃখিত, আপনার এপিআই (API) কোটা শেষ হয়ে গেছে (Quota Exceeded)। দয়া করে আপনার Google AI Studio অ্যাকাউন্টে গিয়ে নতুন একটি API Key তৈরি করে ব্যবহার করুন।"
        : "Sorry, your API quota has been exceeded. Please create and use a new API Key from your Google AI Studio account.";
    }
    
    // Include the actual error message for debugging
    return language === 'bn' ? `দুঃখিত, একটি ত্রুটি ঘটেছে: ${errorMessage}` : `Sorry, an error occurred: ${errorMessage}`;
  }
};
