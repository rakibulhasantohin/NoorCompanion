import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Home, BookOpen, Clock, Compass, Settings, Heart, Plus, Camera } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/utils';

import { useAppState } from '../hooks/useAppState';

export const AppHeader = ({ title }: { title: string }) => {
  const { state, updateState } = useAppState();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateState({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-emerald-900 text-white px-4 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center font-bold text-emerald-100">N</div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/bookmarks">
          <Heart className="w-6 h-6 text-emerald-100" />
        </Link>
        <div 
          onClick={handleImageClick}
          className="w-10 h-10 rounded-full bg-emerald-800 border-2 border-emerald-700 overflow-hidden cursor-pointer flex items-center justify-center relative group"
        >
          {state.profileImage ? (
            <img 
              src={state.profileImage} 
              alt="Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer" 
            />
          ) : (
            <Plus className="w-5 h-5 text-emerald-200" />
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>
    </header>
  );
};

export const BottomNav = () => {
  const location = useLocation();
  const { state } = useAppState();
  
  const navItems = [
    { icon: Home, label: state.language === 'bn' ? 'হোম' : 'Home', path: '/' },
    { icon: Clock, label: state.language === 'bn' ? 'নামাজ' : 'Prayer', path: '/prayer-times' },
    { icon: BookOpen, label: state.language === 'bn' ? 'কুরআন' : 'Quran', path: '/quran' },
    { icon: Compass, label: state.language === 'bn' ? 'কিবলা' : 'Qibla', path: '/qibla' },
    { icon: Settings, label: state.language === 'bn' ? 'সেটিংস' : 'Settings', path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 px-2 py-2 flex justify-around items-center pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-300",
              isActive ? "text-emerald-700 bg-emerald-50" : "text-gray-400"
            )}
          >
            <item.icon className={cn("w-6 h-6", isActive && "fill-emerald-700/10")} />
            <span className="text-[10px] font-medium">{item.label}</span>
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
    className={cn("bg-white rounded-2xl p-4 shadow-sm border border-gray-100", className)}
    {...props}
  >
    {children}
  </motion.div>
);

export const SectionTitle = ({ title, actionLabel, onAction }: { title: string, actionLabel?: string, onAction?: () => void }) => (
  <div className="flex items-center justify-between mb-3 px-1">
    <h2 className="text-lg font-bold text-gray-800">{title}</h2>
    {actionLabel && (
      <button onClick={onAction} className="text-emerald-600 text-sm font-medium">
        {actionLabel}
      </button>
    )}
  </div>
);
