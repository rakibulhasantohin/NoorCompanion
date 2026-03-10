import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, ChevronLeft, ChevronRight, Bell, BellOff, Clock } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { getPrayerTimes } from '../services/prayerService';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { AppHeader } from '../components/Common';

export const PrayerTimes: React.FC = () => {
  const { state, updateState } = useAppState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const lat = state.location?.lat || 23.8103;
  const lng = state.location?.lng || 90.4125;
  const prayerData = getPrayerTimes(lat, lng, selectedDate);
  
  const isToday = isSameDay(selectedDate, new Date());

  const toggleAlarm = () => {
    updateState({ prayerAlarms: !state.prayerAlarms });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <AppHeader title={state.language === 'bn' ? 'নামাজের সময়সূচী' : 'Prayer Times'} showBack />

      <div className="px-4 py-6">
        {/* Date Selector */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
          <button 
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
            className="p-2 hover:bg-gray-50 rounded-full text-gray-400"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Calendar size={18} />
              <span>{format(selectedDate, 'dd MMMM, yyyy')}</span>
            </div>
            {isToday && <span className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Today</span>}
          </div>
          <button 
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            className="p-2 hover:bg-gray-50 rounded-full text-gray-400"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Location Info */}
        <div className="flex items-center justify-between mb-6 px-2">
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
            {state.language === 'bn' ? (state.prayerAlarms ? 'অ্যালার্ম অন' : 'অ্যালার্ম অফ') : (state.prayerAlarms ? 'Alarm On' : 'Alarm Off')}
          </button>
        </div>

        {/* Prayer List */}
        <div className="space-y-3">
          {prayerData.times.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-5 rounded-3xl flex items-center justify-between transition-all ${
                p.isCurrent && isToday
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                  : 'bg-white border border-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  p.isCurrent && isToday ? 'bg-white/20' : 'bg-gray-50'
                }`}>
                  <Clock size={24} className={p.isCurrent && isToday ? 'text-white' : 'text-primary'} />
                </div>
                <div>
                  <div className={`font-bold ${p.isCurrent && isToday ? 'text-white' : 'text-gray-800'}`}>
                    {state.language === 'bn' ? p.bnName : p.name}
                  </div>
                  {p.isCurrent && isToday && (
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Current</div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${p.isCurrent && isToday ? 'text-white' : 'text-gray-900'}`}>
                  {p.formattedTime}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Forbidden Times Section */}
        <div className="mt-10">
          <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-4 px-2">নিষিদ্ধ সময়</h3>
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 space-y-4">
            {getPrayerTimes(lat, lng, selectedDate).times.filter(t => t.name === 'Sunrise').map(t => (
              <div key="sunrise" className="flex items-center justify-between text-sm">
                <span className="text-gray-500">সূর্যোদয় (সকাল)</span>
                <span className="font-bold text-rose-500">{t.formattedTime}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">সূর্যাস্ত (সন্ধ্যা)</span>
              <span className="font-bold text-rose-500">{format(prayerData.sunset, 'h:mm a')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
