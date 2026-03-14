import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, RefreshCw, ArrowLeft, Sparkles } from 'lucide-react';
import { AppHeader } from '../components/Common';
import { useAppState } from '../hooks/useAppState';
import { getAiResponse } from '../services/geminiService';
import { cn } from '../utils/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AiAssistant: React.FC = () => {
  const { state } = useAppState();
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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await getAiResponse(input, state.language);
    const assistantMessage: Message = { role: 'assistant', content: response };
    
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader title={isBn ? 'নূর এআই সহকারী' : 'Noor AI Assistant'} showBack />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 pt-12">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary animate-pulse">
              <Bot size={40} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {isBn ? 'আস-সালামু আলাইকুম!' : 'As-Salamu Alaykum!'}
              </h2>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                {isBn 
                  ? 'আমি নূর এআই। আমি আপনাকে ইসলাম সম্পর্কে যেকোনো প্রশ্ন জিজ্ঞাসা করতে সাহায্য করতে পারি।' 
                  : 'I am Noor AI. I can help you with any questions about Islam.'}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 w-full max-w-xs">
              {[
                isBn ? 'কুরআনের গুরুত্ব কী?' : 'What is the importance of Quran?',
                isBn ? 'নামাজের নিয়মগুলো কী কী?' : 'What are the rules of Prayer?',
                isBn ? 'একটি ছোট দোয়া শিখিয়ে দিন' : 'Teach me a short Dua'
              ].map((q, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(q)}
                  className="p-3 bg-white border border-gray-100 rounded-2xl text-xs text-gray-600 hover:border-primary/30 transition-all text-left flex items-center gap-2"
                >
                  <Sparkles size={14} className="text-primary" />
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
              "flex items-start gap-3 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-primary text-white" : "bg-white border border-gray-100 text-primary shadow-sm"
            )}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={cn(
              "p-4 rounded-3xl text-sm leading-relaxed shadow-sm",
              msg.role === 'user' 
                ? "bg-primary text-white rounded-tr-none" 
                : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-100 text-primary shadow-sm flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-white text-gray-800 border border-gray-100 p-4 rounded-3xl rounded-tl-none shadow-sm">
              <RefreshCw size={16} className="animate-spin text-primary" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 max-w-md mx-auto">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isBn ? 'আপনার প্রশ্ন লিখুন...' : 'Type your question...'}
            className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "absolute right-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
              input.trim() && !isLoading ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-gray-100 text-gray-400"
            )}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
