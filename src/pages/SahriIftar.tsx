import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, MapPin, Sun, Moon } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { getSahriIftarRange, getPrayerTimes } from '../services/prayerService';
import { format, differenceInSeconds, addDays, isAfter, isBefore, addMinutes } from 'date-fns';
import { bn } from 'date-fns/locale';
import moment from 'moment-hijri';
import { useTranslation } from '../hooks/useTranslation';

export const SahriIftar: React.FC = () => {
  const { state } = useAppState();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const lat = state.location?.lat || 23.7289;
  const lng = state.location?.lng || 90.3944;

  const formatCountdown = (target: Date) => {
    const diff = differenceInSeconds(target, now);
    if (diff <= 0) return '00:00:00';
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const countdownInfo = (() => {
    const today = getPrayerTimes(lat, lng, now);
    const iftarTime = today.maghrib;
    const sahriTime = today.imsak;

    if (isBefore(now, sahriTime)) {
      return { label: t('sahriTimeRemaining'), target: sahriTime, imsak: today.imsak, maghrib: today.maghrib };
    } else if (isBefore(now, iftarTime)) {
      return { label: t('iftarTimeRemaining'), target: iftarTime, imsak: today.imsak, maghrib: today.maghrib };
    } else {
      const tomorrow = getPrayerTimes(lat, lng, addDays(now, 1));
      return { label: t('sahriTimeRemaining'), target: tomorrow.imsak, imsak: tomorrow.imsak, maghrib: tomorrow.maghrib };
    }
  })();

  const progress = (() => {
    const today = getPrayerTimes(lat, lng, now);
    const iftarTime = today.maghrib;
    const sahriTime = today.imsak;
    
    if (isBefore(now, sahriTime)) {
      const yesterday = getPrayerTimes(lat, lng, addDays(now, -1));
      const total = differenceInSeconds(sahriTime, yesterday.maghrib);
      const passed = differenceInSeconds(now, yesterday.maghrib);
      return Math.min(100, Math.max(0, (passed / total) * 100));
    } else if (isBefore(now, iftarTime)) {
      const total = differenceInSeconds(iftarTime, sahriTime);
      const passed = differenceInSeconds(now, sahriTime);
      return Math.min(100, Math.max(0, (passed / total) * 100));
    } else {
      const tomorrow = getPrayerTimes(lat, lng, addDays(now, 1));
      const total = differenceInSeconds(tomorrow.imsak, iftarTime);
      const passed = differenceInSeconds(now, iftarTime);
      return Math.min(100, Math.max(0, (passed / total) * 100));
    }
  })();

  const currentHijriYear = moment(now).iYear();

  const sahriIftarList = getSahriIftarRange(lat, lng, now, 400)
    .filter(item => {
      const m = moment(item.date);
      return m.iYear() === currentHijriYear;
    })
    .filter(item => {
      const iftarWithBuffer = addMinutes(item.maghrib, 10);
      return isAfter(iftarWithBuffer, now);
    });

  const getBengaliNumber = (n: number | string): string => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return n.toString().replace(/\d/g, (d) => bengaliDigits[parseInt(d)]);
  };

  const hijriMonthNames = [
    'মুহররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি', 'জামাদিউল আউয়াল', 'জামাদিউস সানি',
    'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ'
  ];

  const groups: { monthName: string, year: string, items: any[] }[] = [];
  let currentMonthKey = "";
  
  sahriIftarList.forEach(item => {
    const m = moment(item.date);
    const monthKey = m.format('iMMMM iYYYY');
    if (monthKey !== currentMonthKey) {
      groups.push({
        monthName: hijriMonthNames[m.iMonth()],
        year: getBengaliNumber(m.iYear()),
        items: [item]
      });
      currentMonthKey = monthKey;
    } else {
      groups[groups.length - 1].items.push(item);
    }
  });

  return (
    <div className="pb-20 px-4 pt-4 max-w-md mx-auto min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-gray-50 rounded-full text-gray-600 active:scale-95 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">{t('sahriIftarSchedule')}</h1>
        </div>
        <div className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium text-gray-600">
          <MapPin size={14} />
          <span>{state.city === 'Dhaka' ? t('bangladesh') : state.city}</span>
        </div>
      </div>

      {/* Countdown Card */}
      <div className="bg-[#1A2634] text-white p-6 rounded-[32px] mb-6 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                <Sun size={20} className="text-yellow-400" />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{t('sahriEnds')}</div>
                <div className="text-base font-bold">{format(countdownInfo.imsak, 'p')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                <Moon size={20} className="text-indigo-400" />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{t('iftar')}</div>
                <div className="text-base font-bold">{format(countdownInfo.maghrib, 'p')}</div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-[10px] text-gray-400 mb-2 font-medium uppercase tracking-wider">{countdownInfo.label}</div>
            <div className="text-4xl font-mono font-bold tracking-tighter text-white">
              {formatCountdown(countdownInfo.target)}
            </div>
          </div>
        </div>

        {/* Progress Bar Label */}
        <div className="flex justify-between text-[10px] text-gray-400 mb-2 font-medium uppercase tracking-wider">
          <span>{t('sahriEnds')}</span>
          <span>{t('iftar')}</span>
        </div>

        {/* Progress Bar */}
        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
          />
        </div>
      </div>

      {/* List Section grouped by Month */}
      <div className="space-y-6">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-3">
            {/* Month Header */}
            <div className="bg-[#1A3644] text-white py-3 px-6 rounded-2xl text-center font-bold text-lg shadow-sm">
              {group.monthName} {group.year}
            </div>

            <div className="space-y-3">
              {group.items.map((item, idx) => {
                const dayName = format(item.date, 'EEEE', { locale: bn });
                const dateStr = format(item.date, 'd MMMM', { locale: bn });
                const ramadanDay = moment(item.date).format('iD');
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (gIdx * 5 + idx) * 0.02 }}
                    key={idx} 
                    className="bg-[#E0F2F1] rounded-2xl p-4 flex items-center justify-between border border-teal-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-xs">
                        {getBengaliNumber(ramadanDay)}
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 font-medium">{dayName}</div>
                        <div className="text-xs font-bold text-gray-800">{dateStr}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">{t('sahriEnds')}</div>
                        <div className="text-xs font-bold text-gray-800">{format(item.imsak, 'p')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">{t('iftar')}</div>
                        <div className="text-xs font-bold text-gray-800">{format(item.maghrib, 'p')}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
