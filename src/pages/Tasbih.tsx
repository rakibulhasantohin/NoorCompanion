import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, RotateCcw, Zap, ChevronDown, ChevronUp, Settings2 } from 'lucide-react';
import { Card } from '../components/Common';
import confetti from 'canvas-confetti';
import { getBengaliNumber } from '../utils/utils';

const TASBIH_LIST = [
  { ar: 'سُبْحَانَ ٱللَّٰهِ', bn: 'সুবহানাল্লাহ', en: 'Subhanallah', meaning: 'পবিত্রতা আল্লাহর জন্য' },
  { ar: 'ٱلْحَمْدُ لِلَّٰهِ', bn: 'আলহামদুলিল্লাহ', en: 'Alhamdulillah', meaning: 'সকল প্রশংসা আল্লাহর জন্য' },
  { ar: 'ٱللَّٰهُ أَكْبَرُ', bn: 'আল্লাহু আকবার', en: 'Allahu Akbar', meaning: 'আল্লাহ সর্বশ্রেষ্ঠ' },
  { ar: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', bn: 'লা ইলাহা ইল্লাল্লাহ', en: 'La ilaha illallah', meaning: 'আল্লাহ ছাড়া কোনো উপাস্য নেই' },
  { ar: 'أَسْتَغْفِرُ ٱللَّٰهَ', bn: 'আস্তাগফিরুল্লাহ', en: 'Astaghfirullah', meaning: 'আমি আল্লাহর কাছে ক্ষমা চাই' },
  { ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', bn: 'সুবহানাল্লাহি ওয়া বিহামদিহি', en: 'Subhanallahi wa bihamdihi', meaning: 'আল্লাহর পবিত্রতা ঘোষণা করছি তাঁর প্রশংসার সাথে' },
];

export const Tasbih = () => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const selected = TASBIH_LIST[selectedIdx];

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    
    if (newCount % target === 0) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#065f46', '#fbbf24', '#ffffff', '#10b981']
      });
      if (window.navigator.vibrate) {
        window.navigator.vibrate([100, 50, 100, 50, 200]);
      }
    } else {
      if (window.navigator.vibrate) {
        window.navigator.vibrate(40);
      }
    }
  };

  const handleReset = () => {
    if (confirm('আপনি কি গণনা রিসেট করতে চান?')) {
      setCount(0);
    }
  };

  return (
    <div className="pb-24 px-4 pt-6 flex flex-col items-center space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-black text-emerald-900 dark:text-emerald-100">ডিজিটাল তাসবিহ</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">আল্লাহর জিকিরে মন শান্ত করুন</p>
      </div>

      {/* Phrase Selector */}
      <div className="w-full max-w-md">
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide no-scrollbar">
          {TASBIH_LIST.map((t, i) => (
            <button
              key={i}
              onClick={() => { setSelectedIdx(i); setCount(0); }}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-2xl text-sm font-bold transition-all shadow-sm",
                selectedIdx === i 
                  ? "bg-emerald-600 text-white shadow-emerald-200 dark:shadow-none" 
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700"
              )}
            >
              {t.bn}
            </button>
          ))}
        </div>
      </div>

      {/* Main Counter Display */}
      <div className="relative group">
        <motion.div
          key={count}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="w-72 h-72 rounded-full bg-white dark:bg-gray-800 border-[12px] border-emerald-50 dark:border-emerald-900/20 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-50/30 dark:to-emerald-900/10" />
          
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-2 uppercase tracking-widest">
            {selected.bn}
          </span>
          <span className="text-7xl font-black text-emerald-900 dark:text-white relative z-10">
            {getBengaliNumber(count)}
          </span>
          <div className="mt-4 flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-full">
            <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              লক্ষ্য: {getBengaliNumber(target)}
            </span>
          </div>
        </motion.div>
        
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-3 bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-100 dark:border-gray-600 text-gray-400 hover:text-rose-500 transition-colors z-20"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="absolute top-4 left-4 p-3 bg-white dark:bg-gray-700 rounded-full shadow-lg border border-gray-100 dark:border-gray-600 text-gray-400 hover:text-emerald-500 transition-colors z-20"
        >
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      {/* Target Selection */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full max-w-xs overflow-hidden"
          >
            <div className="flex gap-3 p-1">
              {[33, 34, 100, 1000].map((t) => (
                <button
                  key={t}
                  onClick={() => { setTarget(t); setShowSettings(false); }}
                  className={cn(
                    "flex-1 py-3 rounded-2xl text-sm font-black transition-all",
                    target === t 
                      ? "bg-emerald-900 text-white shadow-lg" 
                      : "bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-700"
                  )}
                >
                  {getBengaliNumber(t)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Big Tap Area */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={handleIncrement}
        className="w-full max-w-xs h-24 rounded-3xl bg-emerald-600 dark:bg-emerald-500 text-white shadow-xl flex items-center justify-center gap-4 hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-all active:shadow-inner"
      >
        <Plus className="w-10 h-10" />
        <span className="text-xl font-bold">গণনা করুন</span>
      </motion.button>

      {/* Meaning Card */}
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-emerald-100 dark:border-emerald-900/30 p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
              <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-3xl font-serif text-emerald-900 dark:text-emerald-100 text-right" dir="rtl">
              {selected.ar}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{selected.bn}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">
              "{selected.meaning}"
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
