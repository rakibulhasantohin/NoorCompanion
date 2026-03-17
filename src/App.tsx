import React, { useEffect } from 'react';
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
import { Surahs } from './pages/Surahs';
import { Duas } from './pages/Duas';
import { Hadith } from './pages/Hadith';
import { Hajj } from './pages/Hajj';
import { Pillars } from './pages/Pillars';
import { SahriIftar } from './pages/SahriIftar';
import { AiAssistant } from './pages/AiAssistant';
import { NamesOfAllah } from './pages/NamesOfAllah';

import { ProfilePage } from './pages/ProfilePage';

import { useAppState } from './hooks/useAppState';
import { Onboarding } from './components/Onboarding/Onboarding';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { state } = useAppState();
  
  if (!state.onboardingComplete) {
    return <Onboarding />;
  }
  
  const getTitle = (path: string) => {
    const isBn = state.language === 'bn';
    switch (path) {
      case '/': return isBn ? 'নূর কম্প্যানিয়ন' : 'Noor Companion';
      case '/quran': return isBn ? 'আল-কুরআন' : 'Al-Quran';
      case '/prayer-times': return isBn ? 'নামাজের সময়' : 'Prayer Times';
      case '/tasbih': return isBn ? 'তাসবিহ' : 'Tasbih';
      case '/qibla': return isBn ? 'কিবলা' : 'Qibla';
      case '/sahri-iftar': return isBn ? 'সাহরী ও ইফতার' : 'Sahri & Iftar';
      case '/names-of-allah': return isBn ? 'আল্লাহর নাম' : 'Allah Names';
      case '/profile': return isBn ? 'প্রোফাইল' : 'Profile';
      case '/settings': return isBn ? 'সেটিংস' : 'Settings';
      default: return isBn ? 'নূর কম্প্যানিয়ন' : 'Noor Companion';
    }
  };

  const currentTitle = getTitle(location.pathname);

  React.useEffect(() => {
    document.title = `${currentTitle} | নূর কম্প্যানিয়ন`;
  }, [currentTitle]);

  return (
    <div className={cn("min-h-screen font-sans", state.theme === 'dark' ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900")}>
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
  const { state } = useAppState();
  
  useEffect(() => {
    // Robust dark mode toggle
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

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
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/surahs" element={<Surahs />} />
          <Route path="/duas" element={<Duas />} />
          <Route path="/hadith" element={<Hadith />} />
          <Route path="/hajj" element={<Hajj />} />
          <Route path="/pillars" element={<Pillars />} />
          <Route path="/sahri-iftar" element={<SahriIftar />} />
          <Route path="/ai-assistant" element={<AiAssistant />} />
          <Route path="/names-of-allah" element={<NamesOfAllah />} />
        </Routes>
      </PageWrapper>
    </Router>
  );
}
