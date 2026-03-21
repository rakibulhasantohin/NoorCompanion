import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Moon } from 'lucide-react';

export const EidGreetingModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if today is Eid (March 20, 2026)
    const now = new Date();
    const isEidDay = 
      now.getFullYear() === 2026 && 
      now.getMonth() === 2 && // March is index 2
      now.getDate() === 20;

    if (isEidDay) {
      // Removed sessionStorage check so it appears immediately on every visit today
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Notice Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header / Cross Button */}
            <div className="absolute top-3 right-3 z-20">
              <button 
                onClick={handleClose}
                className="p-2 bg-black/20 hover:bg-black/30 backdrop-blur-md rounded-full text-white transition-colors shadow-sm"
                aria-label="Close Notice"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Banner Image / Graphic Area */}
            <div className="bg-emerald-600 p-8 pb-10 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -top-10 -left-10 w-32 h-32 border-4 border-white rounded-full blur-xl" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 border-4 border-white rounded-full blur-xl" />
              </div>
              <Moon className="text-yellow-300 w-16 h-16 mb-4 relative z-10 fill-current" />
              <h2 className="text-4xl font-black text-white relative z-10 tracking-tight text-center drop-shadow-md">
                ঈদ মোবারক
              </h2>
            </div>

            {/* Content Area */}
            <div className="p-6 pt-8 text-center bg-white relative">
              {/* Overlapping Badge */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-md border border-gray-100">
                <h3 className="text-sm font-bold text-emerald-600 whitespace-nowrap">
                  পবিত্র ঈদুল ফিতর
                </h3>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6 mt-2">
                <span className="text-lg font-arabic text-emerald-800 block mb-2">تقبل الله منا ومنكم</span>
                তাকাব্বালাল্লাহু মিন্না ওয়া মিনকুম।<br/>
                আল্লাহ তাআলা আমাদের ও আপনাদের নেক আমলগুলো কবুল করুন। এই ঈদ নিয়ে আসুক অনাবিল আনন্দ ও প্রশান্তি।
              </p>
              
              {/* Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                <Heart size={14} className="fill-current" />
                <span>নূর কম্প্যানিয়ন</span>
                <Heart size={14} className="fill-current" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
