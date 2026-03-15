import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, RefreshCw, ArrowLeft, Book, BookOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';
import { getAiResponse } from '../services/geminiService';
import { cn } from '../utils/utils';

// Custom 8-pointed star icon (Rub el Hizb)
const RubElHizbIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="4" y="4" width="16" height="16" rx="2" transform="rotate(45 12 12)" />
  </svg>
);

const AppLogo = ({ className }: { className?: string }) => (
  <div className={cn("relative flex items-center justify-center", className)}>
    <motion.svg 
      width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      animate={{ rotate: 360 }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
    >
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="#10b981" />
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="#8b5cf6" transform="rotate(45 12 12)" />
    </motion.svg>
  </div>
);

// Animated logo for chat bubbles and loading
const AnimatedLogo = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <motion.svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}
    animate={{ rotate: 360 }}
    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#10b981" />
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#8b5cf6" transform="rotate(45 12 12)" />
  </motion.svg>
);

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AiAssistant: React.FC = () => {
  const { state } = useAppState();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isBn = state.language === 'bn';

  // Rotating suggestions logic
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const allSuggestions = [
    { icon: <Book size={20} className="text-sky-400" strokeWidth={1.5} />, text: isBn ? 'হজ্জের গুরুত্ব কি?' : 'Importance of Hajj?' },
    { icon: <RubElHizbIcon size={20} className="text-teal-400" />, text: isBn ? 'সঠিক ঈমানের জন্য কয়টি শর্ত রয়েছে?' : 'Conditions for correct faith?' },
    { icon: <BookOpen size={20} className="text-emerald-500" strokeWidth={1.5} />, text: isBn ? 'কারা জাকাত গ্রহণ করতে পারে?' : 'Who can receive Zakat?' },
    
    { icon: <Book size={20} className="text-indigo-400" strokeWidth={1.5} />, text: isBn ? 'নামাজের ফজিলত সমূহ কি কি?' : 'What are the virtues of prayer?' },
    { icon: <RubElHizbIcon size={20} className="text-rose-400" />, text: isBn ? 'রিজিক বৃদ্ধির আমলগুলো কি?' : 'What are the deeds to increase sustenance?' },
    { icon: <BookOpen size={20} className="text-amber-500" strokeWidth={1.5} />, text: isBn ? 'কুরআন তিলাওয়াতের নিয়ম কি?' : 'What are the rules of reciting the Quran?' },
    
    { icon: <Book size={20} className="text-cyan-400" strokeWidth={1.5} />, text: isBn ? 'লাইলাতুল কদরের ফজিলত কি?' : 'What is the virtue of Laylatul Qadr?' },
    { icon: <RubElHizbIcon size={20} className="text-fuchsia-400" />, text: isBn ? 'তওবা করার সঠিক নিয়ম কি?' : 'What is the correct way to repent?' },
    { icon: <BookOpen size={20} className="text-lime-500" strokeWidth={1.5} />, text: isBn ? 'পিতামাতার প্রতি সন্তানের দায়িত্ব কি?' : 'What are the responsibilities of children towards parents?' },
    
    { icon: <Book size={20} className="text-violet-400" strokeWidth={1.5} />, text: isBn ? 'রমজানের রোজার গুরুত্ব কি?' : 'What is the importance of fasting in Ramadan?' },
    { icon: <RubElHizbIcon size={20} className="text-orange-400" />, text: isBn ? 'দোয়া কবুলের সময়গুলো কি কি?' : 'What are the times when prayers are answered?' },
    { icon: <BookOpen size={20} className="text-pink-500" strokeWidth={1.5} />, text: isBn ? 'হালাল উপার্জনের গুরুত্ব কি?' : 'What is the importance of halal earning?' },
    
    { icon: <Book size={20} className="text-blue-400" strokeWidth={1.5} />, text: isBn ? 'সাদাকাহ এর ফজিলত কি?' : 'What are the virtues of Sadaqah?' },
    { icon: <RubElHizbIcon size={20} className="text-emerald-400" />, text: isBn ? 'ওজুর সঠিক নিয়ম কি?' : 'What is the correct way to perform Wudu?' },
    { icon: <BookOpen size={20} className="text-purple-500" strokeWidth={1.5} />, text: isBn ? 'প্রতিবেশীর অধিকার সমূহ কি কি?' : 'What are the rights of neighbors?' },
    
    { icon: <Book size={20} className="text-sky-500" strokeWidth={1.5} />, text: isBn ? 'ঈমান ভঙ্গের কারণগুলো কি কি?' : 'What are the causes of breaking faith?' },
    { icon: <RubElHizbIcon size={20} className="text-rose-500" />, text: isBn ? 'গিবত বা পরনিন্দা করার শাস্তি কি?' : 'What is the punishment for backbiting?' },
    { icon: <BookOpen size={20} className="text-amber-600" strokeWidth={1.5} />, text: isBn ? 'সুদ খাওয়ার পরিণতি কি?' : 'What are the consequences of consuming interest?' },
    
    { icon: <Book size={20} className="text-teal-500" strokeWidth={1.5} />, text: isBn ? 'জান্নাত লাভের উপায় কি?' : 'What are the ways to attain Paradise?' },
    { icon: <RubElHizbIcon size={20} className="text-indigo-500" />, text: isBn ? 'জাহান্নাম থেকে বাঁচার আমল কি?' : 'What are the deeds to be saved from Hell?' },
    { icon: <BookOpen size={20} className="text-cyan-600" strokeWidth={1.5} />, text: isBn ? 'কবরের আজাব থেকে মুক্তির দোয়া কি?' : 'What is the prayer for salvation from the torment of the grave?' },
    
    { icon: <Book size={20} className="text-fuchsia-500" strokeWidth={1.5} />, text: isBn ? 'নবীজির (সাঃ) সুন্নাতগুলো কি কি?' : 'What are the Sunnahs of the Prophet (PBUH)?' },
    { icon: <RubElHizbIcon size={20} className="text-lime-600" />, text: isBn ? 'জুমার দিনের ফজিলত কি?' : 'What are the virtues of Friday?' },
    { icon: <BookOpen size={20} className="text-violet-500" strokeWidth={1.5} />, text: isBn ? 'আয়তুল কুরসির ফজিলত কি?' : 'What are the virtues of Ayatul Kursi?' },
    
    { icon: <Book size={20} className="text-orange-500" strokeWidth={1.5} />, text: isBn ? 'সূরা ইখলাসের ফজিলত কি?' : 'What are the virtues of Surah Ikhlas?' },
    { icon: <RubElHizbIcon size={20} className="text-pink-600" />, text: isBn ? 'তাহাজ্জুদ নামাজের নিয়ম ও ফজিলত কি?' : 'What are the rules and virtues of Tahajjud prayer?' },
    { icon: <BookOpen size={20} className="text-blue-500" strokeWidth={1.5} />, text: isBn ? 'ইস্তেখারা নামাজের নিয়ম কি?' : 'What is the rule of Istikhara prayer?' },
    
    { icon: <Book size={20} className="text-emerald-600" strokeWidth={1.5} />, text: isBn ? 'সালাতুল হাজত পড়ার নিয়ম কি?' : 'What is the rule of praying Salatul Hajat?' },
    { icon: <RubElHizbIcon size={20} className="text-purple-600" />, text: isBn ? 'মৃত ব্যক্তির জন্য করণীয় কি?' : 'What should be done for a deceased person?' },
    { icon: <BookOpen size={20} className="text-sky-600" strokeWidth={1.5} />, text: isBn ? 'শবে বরাতের ফজিলত কি?' : 'What are the virtues of Shab-e-Barat?' }
  ];

  const currentSuggestions = allSuggestions.slice(suggestionIndex * 3, suggestionIndex * 3 + 3);

  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        // If we reach the end of the list (10 sets of 3 = 30 items), loop back to 0
        return nextIndex >= Math.ceil(allSuggestions.length / 3) ? 0 : nextIndex;
      });
    }, 6 * 1000); // 6 seconds in milliseconds

    return () => clearInterval(interval);
  }, [allSuggestions.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string | React.MouseEvent | React.KeyboardEvent) => {
    const messageText = typeof textToSend === 'string' ? textToSend : input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    if (typeof textToSend !== 'string') setInput('');
    setIsLoading(true);

    const response = await getAiResponse(messageText, state.language, messages);
    const assistantMessage: Message = { role: 'assistant', content: response };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative font-sans">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white px-4 py-3 flex items-center border-b border-gray-50 relative">
        <button onClick={() => navigate(-1)} className="absolute left-4 text-gray-500 hover:text-gray-800">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center justify-center gap-2 w-full">
          <AppLogo />
          <h1 className="text-xl font-bold text-teal-600 ml-1">
            {isBn ? 'নূর এআই' : 'Noor AI'}
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-40 relative z-10">
        {messages.length === 0 && (
          <div className="flex flex-col h-full pt-4">
            {/* Hero Section */}
            <div className="pb-4 flex flex-col items-center text-center">
              <h2 className="text-[20px] font-bold text-gray-900 mb-1.5 font-serif leading-tight">
                {isBn ? 'ইসলামিক অনুশীলনের জন্য AI' : 'AI for Islamic Practice'}
              </h2>
              <p className="text-[13px] text-gray-600 flex items-center justify-center">
                {isBn ? 'ইসলামিক শিক্ষা সহজ করতে লার্নিং টুল ও টিউটর সহায়ত' : 'Learning tool and tutor to make Islamic education easy'}
                <span className="text-teal-500 ml-1 font-bold">|</span>
              </p>
            </div>

            {/* Suggestion Cards */}
            <div className="flex flex-col gap-3 pb-4 pt-2">
              <AnimatePresence mode="popLayout">
                {currentSuggestions.map((q, i) => (
                  <motion.button 
                    key={`${suggestionIndex}-${i}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    onClick={() => handleSend(q.text)}
                    className="w-full bg-white border border-gray-200 rounded-xl p-4 text-left flex items-center gap-4 shadow-sm hover:border-teal-200 transition-colors"
                  >
                    <div className="bg-gray-50 p-2 rounded-lg shrink-0">{q.icon}</div>
                    <span className="text-[14px] text-gray-700 font-medium leading-snug">{q.text}</span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "flex items-end gap-2 max-w-[88%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mb-1 shadow-sm",
              msg.role === 'user' 
                ? "bg-teal-500 text-white" 
                : "bg-white border border-gray-200 text-teal-600"
            )}>
              {msg.role === 'user' ? <User size={16} /> : <AnimatedLogo size={16} />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm",
              msg.role === 'user' 
                ? "bg-teal-500 text-white rounded-br-sm" 
                : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-2 max-w-[85%]"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 text-teal-600 shadow-sm flex items-center justify-center shrink-0 mb-1">
              <AnimatedLogo size={16} />
            </div>
            <div className="bg-white text-gray-800 border border-gray-100 p-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div 
        className="fixed left-0 right-0 p-4 bg-white max-w-md mx-auto z-40"
        style={{ bottom: 'calc(60px + env(safe-area-inset-bottom))' }}
      >
        <div className="relative flex items-center gap-2 bg-[#fcfcfc] p-1.5 rounded-full border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isBn ? 'ইসলামিক প্রশ্ন করুন' : 'Ask an Islamic question'}
            className="flex-1 bg-transparent py-2.5 pl-4 pr-2 text-[15px] text-gray-800 placeholder-gray-400 focus:outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 border",
              input.trim() && !isLoading 
                ? "bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/20" 
                : "bg-white text-gray-400 border-gray-200"
            )}
          >
            <ChevronRight size={20} className={cn(input.trim() && !isLoading ? "ml-0.5" : "")} />
          </button>
        </div>
      </div>
    </div>
  );
};
