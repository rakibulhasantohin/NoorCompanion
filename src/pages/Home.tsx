import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Bell, RefreshCw, ChevronRight, Book, Star, Heart, Moon, Sun, Zap, Clock as ClockIcon } from 'lucide-react';
import { Card, SectionTitle } from '../components/Common';
import { PRAYER_TIMES_MOCK, RAMADAN_MOCK, SURAHS_MOCK, HADITHS_MOCK } from '../data/mockData';
import { getBengaliNumber, getBengaliDate, getHijriDate, isFriday, getLiveTime, getPrayerStatus, getCountdown } from '../utils/utils';
import { Link } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';

export const Home = () => {
  const { state } = useAppState();
  const [now, setNow] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isTodayFriday = isFriday(now);
  const greeting = state.language === 'bn' ? 'আসসালামু আলাইকুম' : 'Assalamu Alaikum';
  const locationLabel = state.language === 'bn' ? `${state.city}, বাংলাদেশ` : `${state.city}, Bangladesh`;

  // English date in English script
  const hijriDate = getHijriDate(now);
  const bengaliDate = getBengaliDate(now);
  const liveTime = getLiveTime(now, state.language);

  // Prayer Logic
  const { current, next } = getPrayerStatus(now, PRAYER_TIMES_MOCK);
  const countdown = getCountdown(now, next);
  
  const currentPrayerName = current.name === 'Dhuhr' && isTodayFriday 
    ? (state.language === 'bn' ? 'জুম্মা' : 'Jummah')
    : (state.language === 'bn' ? current.nameBn : current.name);

  const nextPrayerName = next.name === 'Dhuhr' && isTodayFriday 
    ? (state.language === 'bn' ? 'জুম্মা' : 'Jummah')
    : (state.language === 'bn' ? next.nameBn : next.name);

  const countdownText = state.language === 'bn' 
    ? `বাকি ${getBengaliNumber(countdown.h)} ঘণ্টা ${getBengaliNumber(countdown.m)} মিনিট`
    : `${countdown.h}h ${countdown.m}m left`;

  return (
    <div className="pb-24 px-4 pt-4 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Greeting & Location */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{greeting}</h2>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
            {state.language === 'bn' ? 'নামাজ, কুরআন, হাদিস — সব এক অ্যাপে' : 'Prayer, Quran, Hadith — All in one app'}
          </p>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mt-1">
            <MapPin className="w-3 h-3" />
            <span>{locationLabel}</span>
          </div>
        </div>
        <div className="flex flex-col items-end text-right">
          <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
            <ClockIcon className="w-3 h-3" />
            <span>{liveTime}</span>
          </div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 flex flex-col items-end">
            <span className="text-emerald-600 dark:text-emerald-500 font-bold">{hijriDate}</span>
            <span>{bengaliDate}</span>
          </div>
        </div>
      </div>

      {/* Hero Card - Prayer Status */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="relative overflow-hidden bg-emerald-900 rounded-3xl p-6 text-white shadow-xl"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800/50 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-700/30 rounded-full -ml-12 -mb-12 blur-xl" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-200 text-xs font-medium uppercase tracking-wider">
                {state.language === 'bn' ? 'বর্তমান নামাজ' : 'Current Prayer'}
              </p>
              <h3 className="text-3xl font-bold mt-0.5">{currentPrayerName}</h3>
              <div className="mt-4">
                <p className="text-emerald-200 text-xs font-medium uppercase tracking-wider">
                  {state.language === 'bn' ? 'পরবর্তী নামাজ' : 'Next Prayer'}
                </p>
                <h4 className="text-xl font-bold mt-0.5">{nextPrayerName}</h4>
              </div>
            </div>
            <div className="bg-emerald-800/50 backdrop-blur-sm px-3 py-2 rounded-2xl border border-emerald-700 text-center">
              <p className="text-[10px] text-emerald-300 uppercase tracking-tighter mb-1">
                {state.language === 'bn' ? 'সময় বাকি' : 'Time Left'}
              </p>
              <span className="text-sm font-bold block">{countdownText}</span>
            </div>
          </div>
          
          <div className="mt-8 flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-emerald-200 text-xs">
                {state.language === 'bn' ? 'আজকের সেহরি ও ইফতার' : 'Today\'s Sehri & Iftar'}
              </p>
              <div className="flex gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-300">
                    {state.language === 'bn' ? 'সেহরি' : 'Sehri'}
                  </span>
                  <p className="font-bold">{RAMADAN_MOCK.sehri}</p>
                </div>
                <div className="w-px h-8 bg-emerald-700" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-300">
                    {state.language === 'bn' ? 'ইফতার' : 'Iftar'}
                  </span>
                  <p className="font-bold">{RAMADAN_MOCK.iftar}</p>
                </div>
              </div>
            </div>
            <Link to="/prayer-times" className="bg-white text-emerald-900 p-2 rounded-full shadow-lg">
              <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Book, label: 'কুরআন', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400', path: '/quran' },
          { icon: Star, label: '১১৪ সূরা', color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400', path: '/quran' },
          { icon: Heart, label: 'দোয়া', color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400', path: '/duas' },
          { icon: Zap, label: 'হাদিস', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400', path: '/hadith' },
        ].map((item, i) => (
          <Link key={i} to={item.path} className="flex flex-col items-center gap-2">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm", item.color)}>
              <item.icon className="w-7 h-7" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Prayer Times Summary */}
      <section>
        <SectionTitle 
          title={state.language === 'bn' ? 'আজকের নামাজের সময়' : 'Today\'s Prayer Times'} 
          actionLabel={state.language === 'bn' ? 'সবগুলো' : 'All'} 
          onAction={() => {}} 
        />
        <div className="grid grid-cols-3 gap-3">
          {(() => {
            // Find next 3 prayers
            const currentTime = now.getHours() * 60 + now.getMinutes();
            const parsed = PRAYER_TIMES_MOCK.map(p => {
              const [timeStr, period] = p.time.split(' ');
              const parseBn = (s: string) => s.replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d).toString());
              const h = parseInt(parseBn(timeStr.split(':')[0]));
              const m = parseInt(parseBn(timeStr.split(':')[1]));
              let totalMinutes = h * 60 + m;
              if (period === 'PM' && h !== 12) totalMinutes += 12 * 60;
              if (period === 'AM' && h === 12) totalMinutes = m;
              return { ...p, totalMinutes };
            }).sort((a, b) => a.totalMinutes - b.totalMinutes);

            let nextIndices = [];
            let firstNext = parsed.findIndex(p => p.totalMinutes > currentTime);
            if (firstNext === -1) firstNext = 0;

            for (let i = 0; i < 3; i++) {
              nextIndices.push((firstNext + i) % parsed.length);
            }

            return nextIndices.map(idx => {
              const prayer = parsed[idx];
              const isDhuhr = prayer.name === 'Dhuhr';
              const displayName = isDhuhr && isTodayFriday 
                ? (state.language === 'bn' ? 'জুম্মা' : 'Jummah')
                : (state.language === 'bn' ? prayer.nameBn : prayer.name);
              
              return (
                <Card key={idx} className="flex flex-col items-center p-3 text-center dark:bg-gray-800 dark:border-gray-700">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-tighter">{displayName}</span>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-100">{prayer.time}</span>
                </Card>
              );
            });
          })()}
        </div>
      </section>

      {/* Daily Ayah/Hadith */}
      <section className="space-y-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/10 dark:to-gray-800 border-emerald-100 dark:border-emerald-900/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-700 dark:text-emerald-400">
              <Book className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-emerald-900 dark:text-emerald-100">আজকের আয়াত</h4>
          </div>
          <p className="text-right font-serif text-lg text-gray-800 dark:text-gray-200 mb-3 leading-relaxed" dir="rtl">
            إِنَّ مَعَ الْعُسْرِ يُسْرًا
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">"নিশ্চয়ই কষ্টের সাথেই স্বস্তি রয়েছে।" (সুরা ইনশিরাহ: ৬)</p>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-700 dark:text-amber-400">
              <Star className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100">আজকের হাদিস</h4>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
            {HADITHS_MOCK[0].textBn}
          </p>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest">— {HADITHS_MOCK[0].source}</span>
        </Card>
      </section>

      {/* Offline Status Indicator */}
      <div className="flex items-center justify-center gap-2 py-4">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">সর্বশেষ আপডেট: ০৮:০৫ AM</span>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
