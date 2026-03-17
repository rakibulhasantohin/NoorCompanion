import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Settings, ChevronDown, ChevronLeft, ChevronRight, List, Share2, X, Volume2, VolumeX, Smartphone, Save } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { useTranslation } from '../hooks/useTranslation';
import { AppHeader, ConfirmModal } from '../components/Common';
import { cn } from '../utils/utils';
import confetti from 'canvas-confetti';
import { ZIKIRS as BASE_ZIKIRS, Zikir } from '../data/zikirs';

export const Tasbih: React.FC = () => {
  const { state, updateState } = useAppState();
  const { t } = useTranslation();
  const isBn = state.language === 'bn';
  
  const [count, setCount] = useState(state.tasbihCount);
  const [target, setTarget] = useState(33);
  const [showTargets, setShowTargets] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [currentZikirIndex, setCurrentZikirIndex] = useState(0);
  const [showZikirList, setShowZikirList] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // New Zikir Form State
  const [newZikir, setNewZikir] = useState({
    arabic: '',
    pronunciationBn: '',
    pronunciationEn: '',
    meaningBn: '',
    meaningEn: ''
  });

  const allZikirs = [...BASE_ZIKIRS, ...(state.customZikirs || [])];
  const currentZikir = allZikirs[currentZikirIndex] || allZikirs[0];

  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (state.tasbihCount !== count) {
      updateState({ tasbihCount: count });
    }
  }, [count, state.tasbihCount, updateState]);

  const playClickSound = () => {
    if (!state.soundEnabled) return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    
    playClickSound();

    if (state.vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    if (newCount % target === 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#26a69a', '#b2dfdb', '#00796b']
      });
      if (state.vibrationEnabled && 'vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  };

  const resetCount = () => {
    setCount(0);
    setIsResetModalOpen(false);
  };

  const nextZikir = () => {
    setCurrentZikirIndex((prev) => (prev + 1) % allZikirs.length);
    setCount(0);
  };

  const prevZikir = () => {
    setCurrentZikirIndex((prev) => (prev - 1 + allZikirs.length) % allZikirs.length);
    setCount(0);
  };

  const handleAddZikir = () => {
    if (!newZikir.arabic || !newZikir.pronunciationBn) return;

    const zikir: Zikir = {
      id: `custom-${Date.now()}`,
      arabic: newZikir.arabic,
      pronunciation: {
        bn: newZikir.pronunciationBn,
        en: newZikir.pronunciationEn || newZikir.pronunciationBn
      },
      meaning: {
        bn: newZikir.meaningBn,
        en: newZikir.meaningEn || newZikir.meaningBn
      }
    };

    updateState({
      customZikirs: [...(state.customZikirs || []), zikir]
    });

    setNewZikir({
      arabic: '',
      pronunciationBn: '',
      pronunciationEn: '',
      meaningBn: '',
      meaningEn: ''
    });
    setShowAddModal(false);
  };

  const targets = [33, 99, 100, 1000];

  return (
    <div className="min-h-screen bg-[#f0f9f9] pb-20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <AppHeader title={t('tasbih')} showBack />

      <div className="px-4 py-4 flex flex-col items-center relative z-10">
        
        {/* Counter Display - Circular */}
        <div className="relative w-56 h-56 flex items-center justify-center mb-4">
          {/* Outer Glow */}
          <div className="absolute inset-0 bg-white rounded-full shadow-[0_0_50px_rgba(38,166,154,0.1)]" />
          
          {/* Progress Circle */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="100"
              fill="none"
              stroke="#e0f2f1"
              strokeWidth="4"
            />
            <motion.circle
              cx="112"
              cy="112"
              r="100"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray="628.3"
              animate={{ strokeDashoffset: 628.3 - (628.3 * (count % target)) / target }}
              className="text-primary"
              strokeLinecap="round"
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </svg>

          {/* Inner Circle Content */}
          <div className="relative w-44 h-44 bg-white rounded-full shadow-inner flex flex-col items-center justify-center border border-primary/5">
            <motion.div 
              key={count}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-black text-primary mb-1"
            >
              {count}
            </motion.div>
            <div className="text-gray-400 font-bold text-lg">
              /{target}
            </div>
          </div>
        </div>

        {/* Zikir Display with Navigation */}
        <div className="w-full max-w-sm bg-white/50 backdrop-blur-sm rounded-[24px] p-4 mb-6 border border-white shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevZikir} className="p-2 text-gray-400 hover:text-primary transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div className="text-center flex-1 px-2">
              <div className="text-xl font-arabic text-gray-800 mb-1 leading-relaxed">
                {currentZikir.arabic}
              </div>
              <div className="text-sm font-bold text-primary mb-0.5">
                {isBn ? currentZikir.pronunciation.bn : currentZikir.pronunciation.en}
              </div>
              <div className="text-[10px] text-gray-500 italic line-clamp-2">
                {isBn ? currentZikir.meaning.bn : currentZikir.meaning.en}
              </div>
            </div>
            <button onClick={nextZikir} className="p-2 text-gray-400 hover:text-primary transition-colors">
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Target Selector */}
            <div className="relative flex-1">
              <button 
                onClick={() => setShowTargets(!showTargets)}
                className="w-full bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between text-gray-600 font-bold text-sm"
              >
                <span>{t('countLabel')}: {target}</span>
                <ChevronDown size={16} className={`transition-transform ${showTargets ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showTargets && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20"
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

            {/* Zikir List Button */}
            <button 
              onClick={() => setShowZikirList(true)}
              className="bg-primary text-white px-6 py-2.5 rounded-2xl shadow-lg shadow-primary/20 flex items-center gap-2 font-bold text-sm"
            >
              <List size={18} />
              <span>{t('zikirList')}</span>
            </button>

            {/* Controls Button */}
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "p-2.5 rounded-2xl shadow-sm border transition-all",
                showSettings ? "bg-primary text-white border-primary" : "bg-white text-gray-400 border-gray-100"
              )}
            >
              <Settings size={18} />
            </button>
          </div>
          
          {/* Quick Settings Popover */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-100 flex justify-around overflow-hidden"
              >
                <button 
                  onClick={() => updateState({ soundEnabled: !state.soundEnabled })}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                    state.soundEnabled ? "text-primary" : "text-gray-400"
                  )}
                >
                  {state.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  <span className="text-[10px] font-bold">{isBn ? 'শব্দ' : 'Sound'}</span>
                </button>
                <button 
                  onClick={() => updateState({ vibrationEnabled: !state.vibrationEnabled })}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                    state.vibrationEnabled ? "text-primary" : "text-gray-400"
                  )}
                >
                  <Smartphone size={20} className={state.vibrationEnabled ? "animate-pulse" : ""} />
                  <span className="text-[10px] font-bold">{isBn ? 'ভাইব্রেশন' : 'Vibration'}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Counter Button */}
        <div className="relative">
          {/* Animated Ripples */}
          <motion.div 
            animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary/20 rounded-full"
          />
          <motion.div 
            animate={{ scale: [1, 1.8], opacity: [0.2, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-0 bg-primary/10 rounded-full"
          />
          
          <button 
            onClick={handleIncrement}
            className="relative w-32 h-32 bg-primary text-white rounded-full shadow-[0_20px_50px_rgba(38,166,154,0.3)] flex items-center justify-center active:scale-90 transition-all z-10"
          >
            <Plus size={48} strokeWidth={3} />
          </button>
        </div>

      </div>

      {/* Zikir List Modal */}
      <AnimatePresence>
        {showZikirList && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-[40px] sm:rounded-[40px] max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="text-xl font-bold text-gray-800">{t('zikirList')}</h3>
                <button onClick={() => setShowZikirList(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {allZikirs.map((zikir, index) => (
                  <button
                    key={zikir.id}
                    onClick={() => {
                      setCurrentZikirIndex(index);
                      setCount(0);
                      setShowZikirList(false);
                    }}
                    className={`w-full p-5 rounded-3xl border text-left transition-all ${
                      currentZikirIndex === index 
                        ? 'bg-primary/5 border-primary shadow-sm' 
                        : 'bg-white border-gray-100 hover:border-primary/30'
                    }`}
                  >
                    <div className="text-xl font-arabic text-right mb-2 text-gray-800">
                      {zikir.arabic}
                    </div>
                    <div className="font-bold text-gray-800 mb-1">
                      {isBn ? zikir.pronunciation.bn : zikir.pronunciation.en}
                    </div>
                    <div className="text-xs text-gray-500">
                      {isBn ? zikir.meaning.bn : zikir.meaning.en}
                    </div>
                  </button>
                ))}

                <button 
                  onClick={() => {
                    setShowZikirList(false);
                    setShowAddModal(true);
                  }}
                  className="w-full p-5 rounded-3xl border-2 border-dashed border-primary/20 text-primary font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"
                >
                  <Plus size={20} />
                  <span>{t('addZikir')}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Zikir Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">{t('addZikir')}</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">{isBn ? 'আরবী' : 'Arabic'}</label>
                  <input 
                    type="text" 
                    value={newZikir.arabic}
                    onChange={(e) => setNewZikir({...newZikir, arabic: e.target.value})}
                    placeholder="سُبْحَانَ اللَّهِ"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-right font-arabic text-lg focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">{isBn ? 'উচ্চারণ (বাংলা)' : 'Pronunciation (BN)'}</label>
                  <input 
                    type="text" 
                    value={newZikir.pronunciationBn}
                    onChange={(e) => setNewZikir({...newZikir, pronunciationBn: e.target.value})}
                    placeholder="সুবহানাল্লাহ"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">{isBn ? 'অর্থ (বাংলা)' : 'Meaning (BN)'}</label>
                  <input 
                    type="text" 
                    value={newZikir.meaningBn}
                    onChange={(e) => setNewZikir({...newZikir, meaningBn: e.target.value})}
                    placeholder="আল্লাহ পবিত্র"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <button 
                onClick={handleAddZikir}
                disabled={!newZikir.arabic || !newZikir.pronunciationBn}
                className="w-full mt-8 bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                <Save size={20} />
                <span>{isBn ? 'সংরক্ষণ করুন' : 'Save Zikir'}</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={resetCount}
        title={t('resetConfirmTitle')}
        message={t('resetConfirm')}
        confirmLabel={t('confirm')}
        cancelLabel={t('cancel')}
      />
    </div>
  );
};
