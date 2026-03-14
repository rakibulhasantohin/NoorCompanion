import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Settings, MapPin, Moon, Sun, Clock, Book, Heart, 
  Compass, MessageSquare, Play, Radio, ChevronRight,
  User, Bell, Share2, Facebook, Users
} from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { useTranslation } from '../hooks/useTranslation';
import { getPrayerTimes, getForbiddenTimes, getSahriIftarRange } from '../services/prayerService';
import { format, differenceInSeconds, addDays, isAfter, isBefore, addMinutes } from 'date-fns';
import { bn } from 'date-fns/locale';
import moment from 'moment-hijri';
import { cn } from '../utils/utils';

export const Home: React.FC = () => {
  const { state, user } = useAppState();
  const isBn = state.language === 'bn';
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user?.email) {
      const usersStr = localStorage.getItem('noor_users') || '{}';
      const users = JSON.parse(usersStr);
      if (users[user.email] && users[user.email].photo) {
        setProfilePhoto(users[user.email].photo);
      } else {
        setProfilePhoto(null);
      }
    } else {
      setProfilePhoto(null);
    }
  }, [user]);

  const lat = state.location?.lat || 23.7289;
  const lng = state.location?.lng || 90.3944;
  const prayerData = getPrayerTimes(lat, lng, now);
  const forbiddenTimes = getForbiddenTimes(lat, lng, now);

  const currentForbiddenTime = forbiddenTimes.find(t => isAfter(now, t.start) && isBefore(now, t.end));
  const isForbidden = !!currentForbiddenTime;

  const currentPrayerProgress = (() => {
    if (isForbidden && currentForbiddenTime) {
      const total = differenceInSeconds(currentForbiddenTime.end, currentForbiddenTime.start);
      const elapsed = differenceInSeconds(now, currentForbiddenTime.start);
      return Math.min(100, Math.max(0, (elapsed / total) * 100));
    } else if (prayerData.current && prayerData.current.endTime) {
      const total = differenceInSeconds(prayerData.current.endTime, prayerData.current.time);
      const elapsed = differenceInSeconds(now, prayerData.current.time);
      return Math.min(100, Math.max(0, (elapsed / total) * 100));
    }
    return 0;
  })();

  const formatCountdown = (target: Date) => {
    const diff = differenceInSeconds(target, now);
    if (diff <= 0) return '00:00:00';
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatCountdownBn = (target: Date) => {
    const diff = differenceInSeconds(target, now);
    if (diff <= 0) return '০০:০০:০০';
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    
    const toBn = (n: number) => n.toString().split('').map(d => '০১২৩৪৫৬৭৮৯'[parseInt(d)]).join('').padStart(2, '০');
    return `${toBn(h)} ঘণ্টা ${toBn(m)} মিনিট`;
  };

  const hijriDate = moment().format('iD iMMMM iYYYY');
  const bengaliDate = new Intl.DateTimeFormat('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }).format(now);

  const countdownInfo = (() => {
    const today = getPrayerTimes(lat, lng, now);
    const iftarTime = today.maghrib;
    const sahriTime = today.imsak;

    if (isBefore(now, sahriTime)) {
      const yesterday = getPrayerTimes(lat, lng, addDays(now, -1));
      return { label: t('sahriTimeRemaining'), target: sahriTime, start: yesterday.maghrib, imsak: today.imsak, maghrib: today.maghrib };
    } else if (isBefore(now, iftarTime)) {
      return { label: t('iftarTimeRemaining'), target: iftarTime, start: today.imsak, imsak: today.imsak, maghrib: today.maghrib };
    } else {
      const tomorrow = getPrayerTimes(lat, lng, addDays(now, 1));
      return { label: t('sahriTimeRemaining'), target: tomorrow.imsak, start: today.maghrib, imsak: tomorrow.imsak, maghrib: tomorrow.maghrib };
    }
  })();

  const totalDuration = differenceInSeconds(countdownInfo.target, countdownInfo.start);
  const elapsedDuration = differenceInSeconds(now, countdownInfo.start);
  const progressPercentage = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));

  const features = [
    { id: 'prayer', name: 'নামাজের সময়সূচী', icon: <Clock className="text-teal-500" />, path: '/prayer-times' },
    { id: 'quran', name: 'আল-কুরআন', icon: <Book className="text-emerald-500" />, path: '/quran' },
    { id: 'ramadan', name: 'সাহরী-ইফতার', icon: <Moon className="text-indigo-500" />, path: '/sahri-iftar' },
    { id: 'tasbih', name: 'তাসবিহ', icon: <Heart className="text-rose-500" />, path: '/tasbih' },
    { id: 'qibla', name: 'কিবলা কম্পাস', icon: <Compass className="text-amber-500" />, path: '/qibla' },
    { id: 'duas', name: 'দোয়া ও জিকির', icon: <Heart className="text-pink-500" />, path: '/duas' },
    { id: 'hadith', name: 'হাদিস শরীফ', icon: <Book className="text-blue-500" />, path: '/hadith' },
    { id: 'pillars', name: 'ইসলামের স্তম্ভ', icon: <Users className="text-purple-500" />, path: '/pillars' },
    { id: 'hajj', name: 'হজ্জ ও উমরাহ', icon: <MapPin className="text-amber-500" />, path: '/hajj' },
    { id: 'names', name: 'আসমা-উল-হুসনা', icon: <span className="text-xl font-bold text-blue-500">الله</span>, path: '/surahs' },
    { id: 'ai', name: 'নূর এআই', icon: <MessageSquare className="text-cyan-500" />, path: '/ai-assistant' },
  ];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(state.fullName || user?.email || 'User')}&background=random`;
  };

  return (
    <div className="pb-20 px-4 pt-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t('noorCompanion')}</h1>
          <p className="text-xs text-gray-500 font-medium">
            {isBn ? 'আসসালামু আলাইকুম, ' : 'Assalamu Alaikum, '}
            {state.fullName || (user?.email?.split('@')[0] || (isBn ? 'অতিথি' : 'Guest'))}
          </p>
        </div>
        <button onClick={() => navigate('/profile')} className="w-10 h-10 bg-white rounded-full shadow-sm text-gray-500 overflow-hidden border-2 border-primary/10 flex items-center justify-center">
          {state.profileImage || profilePhoto ? (
            <img 
              src={state.profileImage || profilePhoto || ''} 
              alt="Profile" 
              className="w-full h-full object-cover" 
              onError={handleImageError}
            />
          ) : (
            <User size={20} />
          )}
        </button>
      </div>

      {/* Date & Location */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-primary font-bold text-sm">
            <span>{hijriDate}</span>
            <ChevronRight size={14} />
          </div>
          <div className="text-gray-400 text-xs mt-1">
            {format(now, 'dd MMMM yyyy')} | {bengaliDate}
          </div>
        </div>
        <div className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium text-gray-600">
          <MapPin size={14} />
          <span>{state.city === 'Dhaka' ? 'বাংলাদেশ' : state.city}</span>
        </div>
      </div>

      {/* Current Prayer Card */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          "text-white p-5 rounded-3xl shadow-xl mb-3 relative overflow-hidden transition-colors duration-500",
          isForbidden ? "bg-rose-500 shadow-rose-500/20" : "bg-primary shadow-primary/20"
        )}
      >
        <div className="relative z-10">
          <div className="text-sm opacity-90 mb-1">
            {isForbidden ? t('forbiddenTime') : t('currentPrayer')}
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold">
                {isForbidden ? currentForbiddenTime?.bnName : prayerData.current?.bnName}
              </h2>
            </div>
            <div className="text-xl font-medium">
              {isForbidden 
                ? `${format(currentForbiddenTime!.start, 'p')} - ${format(currentForbiddenTime!.end, 'p')}`
                : `${prayerData.current?.formattedTime} - ${prayerData.current?.endTime ? format(prayerData.current.endTime, 'p') : prayerData.next?.formattedTime}`
              }
            </div>
          </div>
          <div className="text-sm font-medium mb-4">
            {isForbidden 
              ? `সময় বাকি: ${formatCountdownBn(currentForbiddenTime!.end)}`
              : `সময় বাকি: ${prayerData.current?.endTime && formatCountdownBn(prayerData.current.endTime)}`
            }
          </div>
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${currentPrayerProgress}%` }}
              className="h-full bg-white rounded-full"
            ></motion.div>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-10">
          {isForbidden ? <Sun size={160} /> : <Moon size={160} />}
        </div>
      </motion.div>

      {/* Next Prayer Card */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="text-xs text-gray-400 mb-1">{t('nextPrayer')}</div>
          <div className="font-bold text-gray-800">{prayerData.next?.bnName}</div>
          <div className="text-sm text-gray-500 mt-2">{prayerData.next?.formattedTime}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-around">
          <div className="flex flex-col items-center">
            <Sun size={20} className="text-amber-500 mb-1" />
            <div className="text-[10px] text-gray-400">সূর্যোদয়</div>
            <div className="text-xs font-bold text-gray-700">{format(prayerData.sunrise, 'p')}</div>
          </div>
          <div className="w-px h-8 bg-gray-100"></div>
          <div className="flex flex-col items-center">
            <Moon size={20} className="text-indigo-500 mb-1" />
            <div className="text-[10px] text-gray-400">সূর্যাস্ত</div>
            <div className="text-xs font-bold text-gray-700">{format(prayerData.sunset, 'p')}</div>
          </div>
        </div>
      </div>

      {/* Sahri & Iftar Card */}
      <div 
        onClick={() => navigate('/sahri-iftar')}
        className="bg-slate-800 text-white p-5 rounded-[28px] mb-6 shadow-lg cursor-pointer active:scale-[0.98] transition-all relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <Sun size={16} className="text-amber-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium">{t('sahriEnds')}</div>
                <div className="text-sm font-bold">{format(countdownInfo.imsak, 'p')}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <Moon size={16} className="text-indigo-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium">{t('iftar')}</div>
                <div className="text-sm font-bold">{format(countdownInfo.maghrib, 'p')}</div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 mb-2 font-medium">{countdownInfo.label}</div>
            <div className="text-2xl font-mono font-bold tracking-tighter text-white">
              {formatCountdown(countdownInfo.target)}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative z-10 w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
          />
        </div>
        
        {/* Background Decoration */}
        <div className="absolute -right-6 -top-6 opacity-5">
          <Moon size={120} />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-3 gap-y-5 gap-x-3 mb-6">
        {features.map((f) => (
          <button 
            key={f.id} 
            onClick={() => navigate(f.path)}
            className="flex flex-col items-center gap-2 group active:scale-95 transition-all"
          >
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-primary/5 group-hover:shadow-md transition-all">
              {f.icon}
            </div>
            <span className="text-[11px] font-medium text-gray-600 text-center leading-tight">
              {f.name}
            </span>
          </button>
        ))}
      </div>

      {/* Forbidden Times */}
      <div className="bg-rose-50 border border-rose-100 rounded-3xl p-5 mb-6">
        <h3 className="text-center text-rose-400 font-bold mb-4 text-sm uppercase tracking-wider">{t('todaysForbiddenTimes')}</h3>
        <div className="space-y-4">
          {forbiddenTimes.map((t, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{t.bnName}</span>
              <span className="font-bold text-gray-700">
                {format(t.start, 'p')} - {format(t.end, 'p')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-3 mb-6">
        <button className="w-full p-4 bg-white border border-blue-100 rounded-2xl flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-full text-white">
              <Facebook size={18} />
            </div>
            <div className="text-left">
              <div className="text-xs text-gray-500">{t('appUpdate')}</div>
              <div className="text-sm font-bold text-gray-700">{t('followUs')}</div>
            </div>
          </div>
          <div className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-bold">{t('follow')}</div>
        </button>

        <button className="w-full p-4 bg-white border border-teal-100 rounded-2xl flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500 p-2 rounded-full text-white">
              <Users size={18} />
            </div>
            <div className="text-left">
              <div className="text-xs text-gray-500">{t('opinion')}</div>
              <div className="text-sm font-bold text-gray-700">{t('joinGroup')}</div>
            </div>
          </div>
          <div className="bg-teal-500 text-white px-4 py-1.5 rounded-full text-xs font-bold">{t('join')}</div>
        </button>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-400 text-xs mb-8">
        App Version: 3.6.1
      </div>
    </div>
  );
};
