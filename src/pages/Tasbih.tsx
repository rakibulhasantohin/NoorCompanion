import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, RotateCcw, Zap } from 'lucide-react';
import { Card } from '../components/Common';
import confetti from 'canvas-confetti';

export const Tasbih = () => {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    
    if (newCount % target === 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#065f46', '#fbbf24', '#ffffff']
      });
      if (window.navigator.vibrate) {
        window.navigator.vibrate([100, 50, 100]);
      }
    } else {
      if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  return (
    <div className="pb-24 px-4 pt-8 flex flex-col items-center justify-center min-h-[80vh] space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">ডিজিটাল তাসবিহ</h2>
        <p className="text-gray-500">আল্লাহর জিকির করুন</p>
      </div>

      <div className="relative">
        <motion.div
          key={count}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-64 h-64 rounded-full bg-white border-8 border-emerald-50 shadow-2xl flex flex-col items-center justify-center"
        >
          <span className="text-6xl font-black text-emerald-900">{count}</span>
          <span className="text-sm font-medium text-emerald-600 mt-2">লক্ষ্য: {target}</span>
        </motion.div>
        
        <button
          onClick={handleReset}
          className="absolute -top-2 -right-2 p-3 bg-white rounded-full shadow-lg border border-gray-100 text-gray-400 hover:text-rose-500 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-4 w-full max-w-xs">
        {[33, 100, 1000].map((t) => (
          <button
            key={t}
            onClick={() => setTarget(t)}
            className={cn(
              "flex-1 py-2 rounded-xl text-sm font-bold transition-all",
              target === t ? "bg-emerald-900 text-white shadow-lg" : "bg-white text-gray-400 border border-gray-100"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleIncrement}
        className="w-32 h-32 rounded-full bg-emerald-600 text-white shadow-2xl flex items-center justify-center hover:bg-emerald-700 transition-colors active:shadow-inner"
      >
        <Plus className="w-12 h-12" />
      </motion.button>

      <Card className="w-full max-w-xs bg-emerald-50 border-emerald-100 p-4">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="text-xs font-bold text-emerald-900">সুবহানাল্লাহ</p>
            <p className="text-[10px] text-emerald-700">পবিত্রতা আল্লাহর জন্য</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
