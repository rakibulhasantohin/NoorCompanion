import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ChevronLeft, ChevronRight, Bell, BellOff, Clock } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { useTranslation } from '../hooks/useTranslation';
import { getPrayerTimes } from '../services/prayerService';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { AppHeader } from '../components/Common';
import { cn } from '../utils/utils';

export const PrayerTimes: React.FC = () => {
  const { state, updateState } = useAppState();
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const lat = state.location?.lat || 23.7289;
  const lng = state.location?.lng || 90.3944;
  const prayerData = getPrayerTimes(lat, lng, selectedDate);
  
  const isToday = isSameDay(selectedDate, new Date());

  const toggleAlarm = () => {
    updateState({ prayerAlarms: !state.prayerAlarms });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader title={t('prayerTimes')} showBack />

      <div className="px-4 py-4">
        {/* Date Selector */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-4 flex items-center justify-between">
          <button 
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
            className="p-2 hover:bg-gray-50 rounded-full text-gray-400"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Calendar size={18} />
              <span>{format(selectedDate, "dd MMMM',' yyyy")}</span>
            </div>
            {isToday && <span className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">{t('today')}</span>}
          </div>
          <button 
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            className="p-2 hover:bg-gray-50 rounded-full text-gray-400"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Location Info */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <MapPin size={16} />
            <span>{state.city}, Bangladesh</span>
          </div>
          <button 
            onClick={toggleAlarm}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              state.prayerAlarms ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
            }`}
          >
            {state.prayerAlarms ? <Bell size={14} /> : <BellOff size={14} />}
            {state.prayerAlarms ? t('alarmOn') : t('alarmOff')}
          </button>
        </div>

        {/* Prayer List */}
        <div className="space-y-3">
          {prayerData.times.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "p-4 rounded-xl flex items-center justify-between border-2 transition-all",
                p.isCurrent && isToday
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-teal-400 bg-white"
              )}
            >
              <div className="flex-1">
                <div className={cn(
                  "font-bold text-sm",
                  p.isCurrent && isToday ? "text-primary" : "text-gray-700"
                )}>
                  {state.language === 'bn' ? p.bnName : p.name}
                </div>
              </div>
              
              <div className="flex-[2] text-center">
                <div className="text-sm text-gray-500 font-medium">
                  {p.endTime 
                    ? `${p.formattedTime} - ${format(p.endTime, 'p')}`
                    : p.formattedTime
                  }
                </div>
              </div>

              <div className="flex-1 flex justify-end">
                <button className="text-gray-400 hover:text-primary transition-colors">
                  <BellOff size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Forbidden Times Section */}
        <div className="mt-6">
          <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-3 px-2">{t('forbiddenTimes')}</h3>
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-5 space-y-3">
            {getPrayerTimes(lat, lng, selectedDate).times.filter(prayerTime => prayerTime.name === 'Sunrise').map(prayerTime => (
              <div key="sunrise" className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{t('sunrise')}</span>
                <span className="font-bold text-rose-500">{prayerTime.formattedTime}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{t('sunset')}</span>
              <span className="font-bold text-rose-500">{format(prayerData.sunset, 'p')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
