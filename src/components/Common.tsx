import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Home, BookOpen, Clock, Compass, Settings, Heart, Plus, Camera, Search, User, Hand, Building2, Columns, LayoutGrid, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/utils';

import { useAppState } from '../hooks/useAppState';

export const AppHeader = () => {
  const { state } = useAppState();
  const isBn = state.language === 'bn';

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-700/20">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-black text-emerald-900 dark:text-emerald-100 tracking-tight">
          {isBn ? 'দ্বীন' : 'Deen'}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <Search className="w-6 h-6" />
        </button>
        <Link to="/settings" className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-50 dark:border-emerald-800 overflow-hidden flex items-center justify-center">
          {state.profileImage ? (
            <img 
              src={state.profileImage} 
              alt="Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer" 
            />
          ) : (
            <User className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
          )}
        </Link>
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
    { icon: LayoutGrid, label: isBn ? 'দোয়া' : 'Dua', path: '/duas' },
    { icon: Building2, label: isBn ? 'হজ' : 'Hajj', path: '/hajj' },
    { icon: Columns, label: isBn ? '৫টি স্তম্ভ' : '5 Pillars', path: '/pillars' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-2 py-2 flex justify-around items-center pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all duration-300",
              isActive ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30" : "text-gray-400 dark:text-gray-500"
            )}
          >
            <item.icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
            <span className={cn("text-[10px] font-bold", isActive ? "opacity-100" : "opacity-80")}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export const Card = ({ children, className, ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn("bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-700", className)}
    {...props}
  >
    {children}
  </motion.div>
);

export const SectionTitle = ({ title, actionLabel, onAction }: { title: string, actionLabel?: string, onAction?: () => void }) => (
  <div className="flex items-center justify-between mb-3 px-1">
    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h2>
    {actionLabel && (
      <button onClick={onAction} className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">
        {actionLabel}
      </button>
    )}
  </div>
);
