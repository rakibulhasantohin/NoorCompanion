import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { AppHeader, BottomNav } from './components/Common';
import { cn } from './utils/utils';
import { Home } from './pages/Home';
import { Quran } from './pages/Quran';
import { PrayerTimes } from './pages/PrayerTimes';
import { Tasbih } from './pages/Tasbih';
import { Qibla } from './pages/Qibla';
import { Settings } from './pages/Settings';

import { useAppState } from './hooks/useAppState';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { state } = useAppState();
  
  const getTitle = (path: string) => {
    const isBn = state.language === 'bn';
    switch (path) {
      case '/': return isBn ? 'নূর কম্প্যানিয়ন' : 'Noor Companion';
      case '/quran': return isBn ? 'আল-কুরআন' : 'Al-Quran';
      case '/prayer-times': return isBn ? 'নামাজের সময়' : 'Prayer Times';
      case '/tasbih': return isBn ? 'তাসবিহ' : 'Tasbih';
      case '/qibla': return isBn ? 'কিবলা' : 'Qibla';
      case '/settings': return isBn ? 'সেটিংস' : 'Settings';
      default: return isBn ? 'সাকিনাহ' : 'Sakinah';
    }
  };

  return (
    <div className={cn("min-h-screen font-sans transition-colors duration-300", state.theme === 'dark' ? "bg-gray-900 text-white dark" : "bg-gray-50 text-gray-900")}>
      <AppHeader title={getTitle(location.pathname)} />
      <main className="max-w-md mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <PageWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/prayer-times" element={<PrayerTimes />} />
          <Route path="/tasbih" element={<Tasbih />} />
          <Route path="/qibla" element={<Qibla />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </PageWrapper>
    </Router>
  );
}
