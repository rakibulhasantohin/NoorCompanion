import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Plus, Settings, ChevronDown } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { AppHeader } from '../components/Common';
import confetti from 'canvas-confetti';

export const Tasbih: React.FC = () => {
  const { state, updateState } = useAppState();
  const [count, setCount] = useState(state.tasbihCount);
  const [target, setTarget] = useState(33);
  const [showTargets, setShowTargets] = useState(false);

  useEffect(() => {
    updateState({ tasbihCount: count });
  }, [count]);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    
    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    if (newCount % target === 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#26a69a', '#b2dfdb', '#00796b']
      });
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  };

  const resetCount = () => {
    if (window.confirm('আপনি কি গণনা রিসেট করতে চান?')) {
      setCount(0);
    }
  };

  const targets = [33, 99, 100, 1000];

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <AppHeader title={state.language === 'bn' ? 'তাসবিহ' : 'Tasbih'} showBack />

      <div className="px-4 py-12 flex flex-col items-center justify-center min-h-[70vh]">
        {/* Target Selector */}
        <div className="relative mb-12">
          <button 
            onClick={() => setShowTargets(!showTargets)}
            className="bg-white px-6 py-2 rounded-full shadow-sm border border-gray-100 flex items-center gap-2 text-gray-600 font-bold"
          >
            <span>লক্ষ্য: {target}</span>
            <ChevronDown size={18} className={`transition-transform ${showTargets ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showTargets && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-10"
              >
                {targets.map(t => (
                  <button 
                    key={t}
                    onClick={() => { setTarget(t); setShowTargets(false); }}
                    className="w-full p-3 text-center hover:bg-gray-50 font-bold text-gray-700 border-b border-gray-50 last:border-0"
                  >
                    {t}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Counter Display */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-12">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-100"
            />
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="753.98"
              animate={{ strokeDashoffset: 753.98 - (753.98 * (count % target)) / target }}
              className="text-primary"
              strokeLinecap="round"
            />
          </svg>
          <div className="text-center">
            <motion.div 
              key={count}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-7xl font-black text-gray-800"
            >
              {count}
            </motion.div>
            <div className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Total Count</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          <button 
            onClick={resetCount}
            className="w-16 h-16 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center text-gray-400 active:scale-90 transition-all"
          >
            <RotateCcw size={24} />
          </button>
          
          <button 
            onClick={handleIncrement}
            className="w-32 h-32 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center active:scale-95 transition-all"
          >
            <Plus size={48} strokeWidth={3} />
          </button>

          <button 
            className="w-16 h-16 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center text-gray-400 active:scale-90 transition-all"
          >
            <Settings size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
