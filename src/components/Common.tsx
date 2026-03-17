import React from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  BookOpen, 
  Sparkles, 
  Building2, 
  Settings as SettingsIcon, 
  ChevronLeft,
  Clock,
  Moon,
  CircleDot,
  Compass,
  HandHelping,
  Book,
  LayoutGrid
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../utils/utils';
import { useAppState } from '../hooks/useAppState';

export const AppHeader = ({ title, showBack = false, onBack }: { title?: string, showBack?: boolean, onBack?: () => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAppState();
  const isBn = state.language === 'bn';

  return (
    <header className="sticky top-0 z-50 w-full bg-emerald-600 px-4 py-4 flex items-center justify-between border-b border-emerald-700 shadow-lg">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button 
            onClick={() => onBack ? onBack() : navigate(-1)}
            className="p-2 hover:bg-emerald-700 rounded-full transition-colors text-white"
          >
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-6 h-6 text-emerald-600" />
          </div>
        )}
        <h1 className="text-xl font-bold text-white tracking-tight">
          {title || (isBn ? 'নূর কম্প্যানিয়ন' : 'Noor Companion')}
        </h1>
      </div>
    </header>
  );
};

export const AnimatedRubElHizbIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <motion.svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}
    animate={{ rotate: 360 }}
    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="4" y="4" width="16" height="16" rx="2" transform="rotate(45 12 12)" />
  </motion.svg>
);

export const StaticNoorAILogo = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}
  >
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#10b981" />
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#8b5cf6" transform="rotate(45 12 12)" />
  </svg>
);

export const BottomNav = () => {
  const location = useLocation();
  const { state } = useAppState();
  const isBn = state.language === 'bn';

  // Rotation logic: 10 minutes = 600,000 ms
  const [rotationIndex, setRotationIndex] = React.useState(Math.floor(Date.now() / (10 * 60 * 1000)) % 5);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRotationIndex(Math.floor(Date.now() / (10 * 60 * 1000)) % 5);
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);
  
  const setA = [
    { icon: BookOpen, label: isBn ? 'কুরআন' : 'Quran', path: '/quran' },
    { icon: Clock, label: isBn ? 'নামাজের সময়' : 'Prayer Times', path: '/prayer-times' },
    { icon: Moon, label: isBn ? 'সাহরী-ইফতার' : 'Sahri & Iftar', path: '/sahri-iftar' },
    { icon: CircleDot, label: isBn ? 'তাসবিহ' : 'Tasbih', path: '/tasbih' },
    { icon: Compass, label: isBn ? 'কিবলা' : 'Qibla', path: '/qibla' },
  ];

  const setB = [
    { icon: HandHelping, label: isBn ? 'দোয়া' : 'Dua', path: '/duas' },
    { icon: Book, label: isBn ? 'হাদিস' : 'Hadith', path: '/hadith' },
    { icon: LayoutGrid, label: isBn ? 'স্তম্ভ' : 'Pillars', path: '/pillars' },
    { icon: Building2, label: isBn ? 'হজ' : 'Hajj', path: '/hajj' },
    { icon: Sparkles, label: isBn ? 'আল্লাহর নাম' : 'Allah Names', path: '/names-of-allah' },
  ];

  const navItems = [
    { icon: Home, label: isBn ? 'হোম' : 'Home', path: '/' },
    setA[rotationIndex],
    { icon: StaticNoorAILogo, label: isBn ? 'নূর এআই' : 'Noor AI', path: '/ai-assistant' },
    setB[rotationIndex],
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

export const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel = 'Confirm', 
  cancelLabel = 'Cancel' 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: () => void, 
  title: string, 
  message: string, 
  confirmLabel?: string, 
  cancelLabel?: string 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm active:scale-95 transition-all"
          >
            {cancelLabel}
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
