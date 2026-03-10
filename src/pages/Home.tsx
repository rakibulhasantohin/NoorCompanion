import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Bell, RefreshCw, ChevronRight, Book, Star, Heart, Moon, Sun, Zap, 
  Clock as ClockIcon, Plus, Search, User, Hand, Building2, Columns, LayoutGrid, 
  Cloud, Share2, Utensils, Coffee, BookOpen, GraduationCap, Calculator, HelpCircle 
} from 'lucide-react';
import { Card, SectionTitle } from '../components/Common';
import { PRAYER_TIMES_MOCK, RAMADAN_MOCK, SURAHS_MOCK, HADITHS_MOCK } from '../data/mockData';
import { getBengaliNumber, getBengaliDate, getHijriDate, isFriday, getLiveTime, getPrayerStatus, getCountdown, cn } from '../utils/utils';
import { Link } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';

export const Home = () => {
  const { state } = useAppState();
  const [now, setNow] = useState(new Date());
  const [heroIndex, setHeroIndex] = useState(0);
  const isBn = state.language === 'bn';
  
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const heroTimer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(heroTimer);
  }, []);

  const isTodayFriday = isFriday(now);
  const hijriDate = getHijriDate(now);
  const bengaliDate = getBengaliDate(now);
  const liveTime = getLiveTime(now, state.language);

  // Prayer Logic
  const { current, next } = getPrayerStatus(now, PRAYER_TIMES_MOCK);
  const countdown = getCountdown(now, next);
  
  const currentPrayerName = current.name === 'Dhuhr' && isTodayFriday 
    ? (isBn ? 'জুম্মা' : 'Jummah')
    : (isBn ? current.nameBn : current.name);

  const countdownText = isBn 
    ? `${getBengaliNumber(countdown.h)}:${getBengaliNumber(countdown.m)}:${getBengaliNumber(now.getSeconds())}`
    : `${countdown.h}:${countdown.m}:${now.getSeconds()}`;

  const heroSlides = [
    {
      title: isBn ? 'এখন সময়' : 'Current Time',
      prayer: isBn ? 'চাশত' : 'Chasht',
      timeRange: '০৯:১৮ AM - ১২:০৩ PM',
      nextLabel: isBn ? 'পরবর্তী: নিষিদ্ধ সময়' : 'Next: Prohibited Time',
      image: 'https://picsum.photos/seed/mosque/800/600'
    },
    {
      title: isBn ? 'এখন সময়' : 'Current Time',
      prayer: currentPrayerName,
      timeRange: current.time,
      nextLabel: isBn ? `পরবর্তী: ${next.nameBn}` : `Next: ${next.name}`,
      image: 'https://picsum.photos/seed/desert/800/600'
    },
    {
      title: isBn ? 'এখন সময়' : 'Current Time',
      prayer: isBn ? 'তাহাজ্জুদ' : 'Tahajjud',
      timeRange: '০২:০০ AM - ০৪:৫৫ AM',
      nextLabel: isBn ? 'পরবর্তী: ফজর' : 'Next: Fajr',
      image: 'https://picsum.photos/seed/stars/800/600'
    }
  ];

  const quickAccess = [
    { icon: BookOpen, label: isBn ? 'আল কুরআন' : 'Al Quran', path: '/quran', color: 'text-blue-600' },
    { icon: Moon, label: isBn ? 'রোজা' : 'Roza', path: '/prayer-times', color: 'text-emerald-600' },
    { icon: Building2, label: isBn ? 'নামাজ শিক্ষা' : 'Namaz Shikkha', path: '/pillars', color: 'text-amber-600' },
    { icon: GraduationCap, label: isBn ? 'কুরআন ক্লাস' : 'Quran Class', path: '/quran', color: 'text-purple-600' },
    { icon: Book, label: isBn ? 'খতমে কুরআন' : 'Khatme Quran', path: '/quran', color: 'text-rose-600' },
    { icon: Heart, label: isBn ? 'যাকাত' : 'Zakat', path: '/pillars', color: 'text-pink-600' },
    { icon: Zap, label: isBn ? 'সহজ কুরআন' : 'Easy Quran', path: '/quran', color: 'text-cyan-600' },
    { icon: Star, label: isBn ? 'হাদিস' : 'Hadith', path: '/hadith', color: 'text-orange-600' },
  ];

  return (
    <div className="pb-24 space-y-4 bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Hero Carousel */}
      <div className="relative h-96 w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img 
              src={heroSlides[heroIndex].image} 
              alt="Hero" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
          <p className="text-emerald-100/80 text-sm font-medium mb-1">{heroSlides[heroIndex].title}</p>
          <h2 className="text-4xl font-black mb-2">{heroSlides[heroIndex].prayer}</h2>
          <p className="text-emerald-100/90 text-sm mb-6">{heroSlides[heroIndex].timeRange}</p>
          
          <div className="space-y-1 mb-8">
            <p className="text-emerald-200/70 text-xs uppercase tracking-widest font-bold">
              {heroSlides[heroIndex].nextLabel}
            </p>
            <p className="text-3xl font-mono font-bold tracking-tighter">{countdownText}</p>
          </div>

          <div className="flex items-center justify-between">
            <Link to="/prayer-times" className="flex items-center gap-1 text-sm font-bold bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              {isBn ? 'সকল নামাজ' : 'All Prayers'}
              <ChevronRight className="w-4 h-4" />
            </Link>
            <button className="flex items-center gap-1 text-sm font-bold bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              {state.city} ({isBn ? 'গাজীপুর' : 'Gazipur'})
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Date & Weather Bar */}
      <div className="px-4 -mt-6 relative z-10">
        <Card className="flex items-center justify-between py-3 px-5 border-none shadow-xl shadow-emerald-900/5">
          <div className="space-y-0.5">
            <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
              {isBn ? 'মঙ্গলবার, মার্চ ১০ • ২৫ ফাল্গুন, ১৪৩২' : 'Tuesday, March 10 • 25 Falgun, 1432'}
            </p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {isBn ? '২০ রমজান, ১৪৪৭ হিজরী' : '20 Ramadan, 1447 Hijri'}
            </p>
          </div>
          <div className="text-amber-500">
            <Sun className="w-8 h-8 fill-amber-500/20" />
          </div>
        </Card>
      </div>

      {/* DeenAI Bar */}
      <div className="px-4">
        <div className="bg-gradient-to-r from-emerald-50 to-purple-50 dark:from-emerald-900/20 dark:to-purple-900/20 rounded-full p-1 border border-white dark:border-gray-800 shadow-sm flex items-center gap-3 pr-4">
          <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
            <LayoutGrid className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <span className="font-black text-emerald-700 dark:text-emerald-400">DeenAI</span>
            <span className="text-gray-400 text-sm">{isBn ? 'জিজ্ঞাসা করুন না' : 'Ask anything'}</span>
          </div>
          <div className="w-0.5 h-4 bg-emerald-300" />
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="px-4">
        <Card className="grid grid-cols-4 gap-y-6 gap-x-2 py-6">
          {quickAccess.map((item, i) => (
            <Link key={i} to={item.path} className="flex flex-col items-center gap-2">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800", item.color)}>
                <item.icon className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 text-center leading-tight">
                {item.label}
              </span>
            </Link>
          ))}
          <div className="col-span-4 pt-2 flex justify-center">
            <button className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {isBn ? 'আরও দেখুন' : 'See More'}
              <ChevronRight className="w-3 h-3 rotate-90" />
            </button>
          </div>
        </Card>
      </div>

      {/* Ramadan Section */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-3 px-1">
          <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-700 dark:text-emerald-400">
            <Moon className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100">{isBn ? 'রমজান' : 'Ramadan'}</h3>
        </div>
        
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-0 overflow-hidden relative border-none">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl" />
          <div className="p-6 relative z-10">
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">
              {isBn ? 'মঙ্গলবার, ১০ মার্চ ২০২৬' : 'Tuesday, 10 March 2026'}
            </p>
            <h4 className="text-3xl font-black mb-6">{isBn ? '২০ রমজান' : '20 Ramadan'}</h4>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-4 text-gray-900 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Utensils className="w-6 h-6 text-emerald-600" />
                  <Bell className="w-4 h-4 text-gray-300" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {isBn ? 'সাহরী শেষ' : 'Sehri Ends'}
                  </p>
                  <p className="text-lg font-black">০৪:৫৬ AM</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 text-gray-900 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Coffee className="w-6 h-6 text-emerald-600" />
                  <Bell className="w-4 h-4 text-gray-300" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {isBn ? 'ইফতারের সময়' : 'Iftar Time'}
                  </p>
                  <p className="text-lg font-black">০৬:০৬ PM</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="font-bold text-sm">{isBn ? 'আজ রোজা আছেন?' : 'Are you fasting today?'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold opacity-70">{isBn ? 'না' : 'No'}</span>
                <div className="w-12 h-6 bg-white/20 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-white text-emerald-700 py-3 rounded-xl font-black text-sm shadow-lg">
                {isBn ? 'আরও দেখুন' : 'See More'}
              </button>
              <button className="flex-1 bg-emerald-800 text-white py-3 rounded-xl font-black text-sm shadow-lg flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                {isBn ? 'শেয়ার করুন' : 'Share'}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
