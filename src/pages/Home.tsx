import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Settings, MapPin, Moon, Sun, Clock, Book, Heart, 
  Compass, MessageSquare, Play, Radio, ChevronRight,
  User, Bell, Share2, Facebook, Users
} from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { getPrayerTimes, getForbiddenTimes, getSahriIftarRange } from '../services/prayerService';
import { format, differenceInSeconds, addDays, isAfter, isBefore, addMinutes } from 'date-fns';
import { bn } from 'date-fns/locale';
import moment from 'moment-hijri';
import { cn } from '../utils/utils';

export const Home: React.FC = () => {
  const { state } = useAppState();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const lat = state.location?.lat || 23.8103;
  const lng = state.location?.lng || 90.4125;
  const prayerData = getPrayerTimes(lat, lng, now);
  const forbiddenTimes = getForbiddenTimes(lat, lng, now);

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
    const iftarWithBuffer = addMinutes(iftarTime, 10);

    if (isBefore(now, sahriTime)) {
      return { label: 'সাহরির সময় বাকি', target: sahriTime, imsak: today.imsak, maghrib: today.maghrib };
    } else if (isBefore(now, iftarTime)) {
      return { label: 'ইফতারের সময় বাকি', target: iftarTime, imsak: today.imsak, maghrib: today.maghrib };
    } else {
      const tomorrow = getPrayerTimes(lat, lng, addDays(now, 1));
      return { label: 'সাহরির সময় বাকি', target: tomorrow.imsak, imsak: tomorrow.imsak, maghrib: tomorrow.maghrib };
    }
  })();

  const features = [
    { id: 'prayer', name: 'নামাজের সময়সূচী', icon: <Clock className="text-teal-500" />, path: '/prayer-times' },
    { id: 'quran', name: 'আল-কুরআন', icon: <Book className="text-emerald-500" />, path: '/quran' },
    { id: 'ramadan', name: 'সাহরী-ইফতার', icon: <Moon className="text-indigo-500" />, path: '/sahri-iftar' },
    { id: 'tasbih', name: 'তাসবিহ', icon: <Heart className="text-rose-500" />, path: '/tasbih' },
    { id: 'qibla', name: 'কিবলা কম্পাস', icon: <Compass className="text-amber-500" />, path: '/qibla' },
    { id: 'names', name: 'আসমা-উল-হুসনা', icon: <span className="text-xl font-bold text-blue-500">الله</span>, path: '/settings' },
    { id: 'khutba', name: 'জুমুআর খুতবা', icon: <MessageSquare className="text-cyan-500" />, path: '/' },
    { id: 'waz', name: 'ওয়াজ', icon: <Play className="text-purple-500" />, path: '/' },
    { id: 'live', name: 'লাইভ', icon: <Radio className="text-red-500" />, path: '/' },
  ];

  return (
    <div className="pb-24 px-4 pt-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">নূর কম্প্যানিয়ন</h1>
        </div>
        <button onClick={() => navigate('/settings')} className="p-2 bg-white rounded-full shadow-sm text-gray-500">
          <Settings size={24} />
        </button>
      </div>

      {/* Date & Location */}
      <div className="flex items-center justify-between mb-6">
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
        className="bg-primary text-white p-6 rounded-3xl shadow-xl shadow-primary/20 mb-4 relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="text-sm opacity-90 mb-1">বর্তমান ওয়াক্ত</div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold">{prayerData.current?.bnName}</h2>
            </div>
            <div className="text-xl font-medium">
              {prayerData.current?.formattedTime} - {prayerData.current?.endTime ? format(prayerData.current.endTime, 'p') : prayerData.next?.formattedTime}
            </div>
          </div>
          <div className="text-sm font-medium mb-4">
            সময় বাকি: {prayerData.next && formatCountdownBn(prayerData.next.time)}
          </div>
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '65%' }}
              className="h-full bg-white rounded-full"
            ></motion.div>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-10">
          <Moon size={160} />
        </div>
      </motion.div>

      {/* Next Prayer Card */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="text-xs text-gray-400 mb-1">পরবর্তী নামাজ</div>
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
        className="bg-slate-800 text-white p-6 rounded-[32px] mb-8 flex items-center justify-between shadow-lg cursor-pointer active:scale-[0.98] transition-all"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-400 font-medium">সাহরী শেষ</span>
            <span className="text-xl font-bold">{format(countdownInfo.imsak, 'p')}</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-400 font-medium">ইফতার</span>
            <span className="text-xl font-bold">{format(countdownInfo.maghrib, 'p')}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400 mb-2 font-medium">{countdownInfo.label}</div>
          <div className="text-3xl font-mono font-bold tracking-tighter text-white">
            {formatCountdown(countdownInfo.target)}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-3 gap-y-8 gap-x-4 mb-10">
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
      <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 mb-8">
        <h3 className="text-center text-rose-400 font-bold mb-4 text-sm uppercase tracking-wider">আজকের নিষিদ্ধ সময়সমূহ</h3>
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
      <div className="space-y-3 mb-8">
        <button className="w-full p-4 bg-white border border-blue-100 rounded-2xl flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-full text-white">
              <Facebook size={18} />
            </div>
            <div className="text-left">
              <div className="text-xs text-gray-500">অ্যাপ সম্পর্কিত সকল আপডেট পেতে</div>
              <div className="text-sm font-bold text-gray-700">আমাদের ফেসবুক পেজ ফলো করুন।</div>
            </div>
          </div>
          <div className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-bold">Follow</div>
        </button>

        <button className="w-full p-4 bg-white border border-teal-100 rounded-2xl flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500 p-2 rounded-full text-white">
              <Users size={18} />
            </div>
            <div className="text-left">
              <div className="text-xs text-gray-500">অ্যাপ সম্পর্কে আপনার মতামত জানাতে</div>
              <div className="text-sm font-bold text-gray-700">আমাদের ফেসবুক গ্রুপে জয়েন করুন।</div>
            </div>
          </div>
          <div className="bg-teal-500 text-white px-4 py-1.5 rounded-full text-xs font-bold">Join</div>
        </button>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-400 text-xs mb-8">
        App Version: 3.6.1
      </div>
    </div>
  );
};
