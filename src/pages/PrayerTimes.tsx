import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bell, BellOff, Clock, ChevronRight, Info, MapPin, Clock as ClockIcon } from 'lucide-react';
import { Card, SectionTitle } from '../components/Common';
import { PRAYER_TIMES_MOCK } from '../data/mockData';
import { useAppState } from '../hooks/useAppState';
import { isFriday, getLiveTime, getBengaliDate, getHijriDate, getPrayerStatus, getCountdown, getBengaliNumber } from '../utils/utils';

export const PrayerTimes = () => {
  const { state } = useAppState();
  const [now, setNow] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isBn = state.language === 'bn';
  const isTodayFriday = isFriday(now);
  const liveTime = getLiveTime(now, state.language);
  
  const englishDate = now.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const { current, next } = getPrayerStatus(now, PRAYER_TIMES_MOCK);
  const countdown = getCountdown(now, next);
  
  const nextPrayerName = next.name === 'Dhuhr' && isTodayFriday 
    ? (isBn ? 'জুম্মা' : 'Jummah')
    : (isBn ? next.nameBn : next.name);

  const countdownText = isBn 
    ? `বাকি ${getBengaliNumber(countdown.h)} ঘণ্টা ${getBengaliNumber(countdown.m)} মিনিট`
    : `${countdown.h}h ${countdown.m}m left`;

  return (
    <div className="pb-24 px-4 pt-4 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">{state.city}</span>
        </div>
        <div className="flex flex-col items-end text-right">
          <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
            <ClockIcon className="w-3 h-3" />
            <span>{liveTime}</span>
          </div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 flex flex-col items-end">
            <span>{englishDate}</span>
            <div className="flex items-center gap-1">
              <span>{getBengaliDate(now)}</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-500 font-bold">{getHijriDate(now)}</span>
            </div>
          </div>
        </div>
      </div>

      <Card className="bg-emerald-900 text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800/50 rounded-full -mr-16 -mt-16 blur-2xl" />
        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-emerald-200 text-sm font-medium">{isBn ? 'পরবর্তী নামাজ' : 'Next Prayer'}</span>
            <div className="flex items-center gap-1 text-xs bg-emerald-800 px-2 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              <span>{countdownText}</span>
            </div>
          </div>
          <h2 className="text-5xl font-black">
            {nextPrayerName}
          </h2>
          <p className="text-emerald-200 text-sm">
            {isBn ? `শুরু হবে ${next.time} মিনিটে` : `Starts at ${next.time}`}
          </p>
        </div>
      </Card>

      <section>
        <SectionTitle title={isBn ? 'আজকের নামাজের সময়সূচী' : 'Today\'s Prayer Schedule'} />
        <div className="space-y-3">
          {PRAYER_TIMES_MOCK.map((prayer, i) => {
            const isDhuhr = prayer.name === 'Dhuhr';
            const prayerName = isDhuhr && isTodayFriday 
              ? (isBn ? 'জুম্মা' : 'Jummah')
              : (isBn ? prayer.nameBn : prayer.name);
            
            const isNext = prayer.name === next.name;
            const isCurrent = prayer.name === current.name;
            const currentTime = now.getHours() * 60 + now.getMinutes();
            
            // Re-calculate totalMinutes for each prayer in the list to determine if passed
            const [timeStr, period] = prayer.time.split(' ');
            const parseBn = (s: string) => s.replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d).toString());
            const h = parseInt(parseBn(timeStr.split(':')[0]));
            const m = parseInt(parseBn(timeStr.split(':')[1]));
            let prayerMinutes = h * 60 + m;
            if (period === 'PM' && h !== 12) prayerMinutes += 12 * 60;
            if (period === 'AM' && h === 12) prayerMinutes = m;

            const isPassed = prayerMinutes < currentTime && !isCurrent;
            
            return (
              <motion.div
                key={i}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "rounded-2xl p-4 border flex items-center justify-between transition-all",
                  isNext ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 shadow-md scale-[1.02]" : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm",
                  isPassed && "opacity-40 grayscale-[0.5]",
                  isCurrent && "border-emerald-500 ring-1 ring-emerald-500"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    isNext ? "bg-emerald-600 text-white" : "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500"
                  )}>
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className={cn("font-bold", isNext ? "text-emerald-900 dark:text-emerald-100" : "text-gray-800 dark:text-gray-200")}>
                      {prayerName}
                    </h4>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{prayer.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={cn("text-lg font-bold", isNext ? "text-emerald-700 dark:text-emerald-400" : "text-gray-900 dark:text-gray-100")}>
                    {prayer.time}
                  </span>
                  <button className={cn(
                    "p-2 rounded-xl transition-colors",
                    isNext ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" : "bg-gray-50 dark:bg-gray-900 text-gray-300 dark:text-gray-600"
                  )}>
                    {isNext || state.prayerAlarms ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold text-blue-900 dark:text-blue-100 text-sm">{isBn ? 'জুম্মার নামাজ' : 'Jummah Prayer'}</h5>
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
            {isBn 
              ? 'আজ শুক্রবার। জুম্মার খুতবা শুরু হবে ১২:৩০ মিনিটে। আগেভাগে মসজিদে যাওয়ার চেষ্টা করুন।' 
              : 'Today is Friday. Jummah Khutbah starts at 12:30 PM. Try to reach the mosque early.'}
          </p>
        </div>
      </Card>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
