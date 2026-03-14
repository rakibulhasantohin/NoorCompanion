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

// Animated Rub el Hizb for chat bubbles
const AnimatedRubElHizbIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <motion.svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}
    animate={{ rotate: 360 }}
    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="4" y="4" width="16" height="16" rx="2" transform="rotate(45 12 12)" />
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

    const response = await getAiResponse(messageText, state.language);
    const assistantMessage: Message = { role: 'assistant', content: response };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative font-sans">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white px-4 py-3 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="mr-1 text-gray-500 hover:text-gray-800">
            <ArrowLeft size={20} />
          </button>
          <AppLogo />
          <h1 className="text-xl font-bold text-teal-600 ml-1">
            {isBn ? 'নূর এআই' : 'Noor AI'}
          </h1>
          <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">Beta</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-40 relative z-10">
        {messages.length === 0 && (
          <div className="flex flex-col h-full pt-4">
            {/* Hero Section */}
            <div className="pb-4">
              <h2 className="text-[20px] font-bold text-gray-900 mb-1.5 font-serif leading-tight">
                {isBn ? 'ইসলামিক অনুশীলনের জন্য AI' : 'AI for Islamic Practice'}
              </h2>
              <p className="text-[13px] text-gray-600 flex items-center">
                {isBn ? 'ইসলামিক শিক্ষা সহজ করতে লার্নিং টুল ও টিউটর সহায়ত' : 'Learning tool and tutor to make Islamic education easy'}
                <span className="text-teal-500 ml-1 font-bold">|</span>
              </p>
            </div>

            {/* Suggestion Cards */}
            <div 
              className="flex gap-2.5 overflow-x-auto pb-4 pt-2 snap-x -mx-4 px-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style>{`::-webkit-scrollbar { display: none; }`}</style>
              {[
                { icon: <Book size={20} className="text-sky-400" strokeWidth={1.5} />, text: isBn ? 'হজ্জের গুরুত্ব কি' : 'Importance of Hajj' },
                { icon: <RubElHizbIcon size={20} className="text-teal-400" />, text: isBn ? 'সঠিক ঈমানের জন্য কয়টি শর্ত রয়েছে?' : 'Conditions for correct faith?' },
                { icon: <BookOpen size={20} className="text-emerald-500" strokeWidth={1.5} />, text: isBn ? 'কারা জাকাত গ্রহণ করতে পারে?' : 'Who can receive Zakat?' }
              ].map((q, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(q.text)}
                  className="min-w-[110px] w-[110px] bg-white border border-gray-200 rounded-xl p-3 text-left flex flex-col gap-3 shadow-sm snap-start hover:border-teal-200 transition-colors"
                >
                  <div>{q.icon}</div>
                  <span className="text-[12px] text-gray-700 font-medium leading-snug">{q.text}</span>
                </button>
              ))}
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
              {msg.role === 'user' ? <User size={16} /> : <AnimatedRubElHizbIcon size={16} />}
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
              <AnimatedRubElHizbIcon size={16} />
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
