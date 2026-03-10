import React from 'react';
import { motion } from 'motion/react';
import { Home, BookOpen, Clock, Compass, Settings, LayoutGrid, ChevronLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../utils/utils';
import { useAppState } from '../hooks/useAppState';

export const AppHeader = ({ title, showBack = false }: { title?: string, showBack?: boolean }) => {
  const navigate = useNavigate();
  const { state } = useAppState();
  const isBn = state.language === 'bn';

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-gray-100">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
        ) : (
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
        )}
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
          {title || (isBn ? 'নূর কম্প্যানিয়ন' : 'Noor Companion')}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Settings size={22} onClick={() => navigate('/settings')} />
        </button>
      </div>
    </header>
  );
};

export const BottomNav = () => {
  const location = useLocation();
  const { state } = useAppState();
  const isBn = state.language === 'bn';
  
  const navItems = [
    { icon: Home, label: isBn ? 'হোম' : 'Home', path: '/' },
    { icon: BookOpen, label: isBn ? 'কুরআন' : 'Quran', path: '/quran' },
    { icon: Clock, label: isBn ? 'নামাজ' : 'Prayer', path: '/prayer-times' },
    { icon: Compass, label: isBn ? 'কিবলা' : 'Qibla', path: '/qibla' },
    { icon: Settings, label: isBn ? 'সেটিংস' : 'Settings', path: '/settings' },
  ];

  // Hide bottom nav on onboarding
  if (!state.onboardingComplete) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
      <nav className="bg-white/90 backdrop-blur-xl border border-white/20 px-4 py-3 flex justify-around items-center rounded-3xl shadow-2xl shadow-black/10">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300 relative",
                isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
              {isActive && (
                <motion.div 
                  layoutId="active-dot"
                  className="absolute -bottom-1.5 w-1 h-1 bg-primary rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export const Card = ({ children, className, ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn("bg-white rounded-3xl p-4 shadow-sm border border-gray-100", className)}
    {...props}
  >
    {children}
  </motion.div>
);

export const SectionTitle = ({ title, actionLabel, onAction }: { title: string, actionLabel?: string, onAction?: () => void }) => (
  <div className="flex items-center justify-between mb-3 px-1">
    <h2 className="text-lg font-bold text-gray-800">{title}</h2>
    {actionLabel && (
      <button onClick={onAction} className="text-primary text-sm font-medium">
        {actionLabel}
      </button>
    )}
  </div>
);
