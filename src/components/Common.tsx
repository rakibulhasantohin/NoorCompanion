import React from 'react';
import { motion } from 'motion/react';
import { Home, BookOpen, HandHelping, Building2, User, Settings as SettingsIcon, ChevronLeft } from 'lucide-react';
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
          <SettingsIcon size={22} onClick={() => navigate('/settings')} />
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
    { icon: HandHelping, label: isBn ? 'দোয়া' : 'Dua', path: '/duas' },
    { icon: Building2, label: isBn ? 'হজ' : 'Hajj', path: '/hajj' },
    { icon: SettingsIcon, label: isBn ? 'সেটিংস' : 'Settings', path: '/settings' },
  ];

  // Hide bottom nav on onboarding
  if (!state.onboardingComplete) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-safe">
      <nav className="max-w-md mx-auto px-2 py-2 flex justify-around items-end">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 transition-all duration-300 min-w-[64px]"
            >
              <div className={cn(
                "w-16 h-10 flex items-center justify-center rounded-3xl transition-all duration-300",
                isActive ? "bg-primary/10" : "bg-transparent"
              )}>
                <item.icon className={cn(
                  "w-6 h-6 transition-colors duration-300",
                  isActive ? "text-primary fill-primary/20" : "text-gray-800"
                )} />
              </div>
              <span className={cn(
                "text-[11px] font-bold transition-colors duration-300",
                isActive ? "text-primary" : "text-gray-500"
              )}>
                {item.label}
              </span>
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
