import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Award, BookOpen, Hash, LogOut, Settings as SettingsIcon, RefreshCw, CloudCheck, Cloud } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { supabase } from '../lib/supabase';
import { getBengaliNumber } from '../utils/utils';

export const ProfileSection = () => {
  const { state, user, updateState, manualSync } = useAppState();
  const [syncing, setSyncing] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleManualSync = async () => {
    setSyncing(true);
    await manualSync();
    setTimeout(() => setSyncing(false), 1000);
  };

  if (!user) {
    return null;
  }

  const stats = [
    {
      label: 'তাসবিহ',
      value: state.tasbihCount,
      icon: Hash,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'বুকমার্ক',
      value: state.bookmarks.length,
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'শেষ পড়া',
      value: state.lastReadSurah ? `সূরা ${state.lastReadSurah}` : 'নেই',
      icon: Award,
      color: 'text-emerald-600 bg-emerald-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{user.email?.split('@')[0]}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="ml-auto p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-gray-500 mb-1">{stat.label}</span>
              <span className="text-sm font-bold text-gray-900">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <CloudCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">সর্বশেষ ব্যাকআপ</p>
              <p className="text-xs font-bold text-gray-700">
                {state.lastBackup ? new Date(state.lastBackup).toLocaleDateString('bn-BD') : 'কখনো হয়নি'}
              </p>
            </div>
          </div>
          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 rounded-xl text-xs font-bold transition-all border border-transparent hover:border-emerald-100"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'ব্যাকআপ হচ্ছে...' : 'এখনই ব্যাকআপ নিন'}
          </button>
        </div>
      </div>

      <div className="bg-emerald-900 rounded-3xl p-6 text-white overflow-hidden relative">
        <div className="relative z-10">
          <h4 className="font-bold mb-2">আপনার প্রগ্রেস</h4>
          <p className="text-emerald-100 text-sm mb-4">আপনি নিয়মিত ইবাদত চালিয়ে যাচ্ছেন। মাশাআল্লাহ!</p>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>কুরআন খতম প্রগ্রেস</span>
                <span>{Math.round((state.lastReadSurah || 0) / 114 * 100)}%</span>
              </div>
              <div className="h-2 bg-emerald-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(state.lastReadSurah || 0) / 114 * 100}%` }}
                  className="h-full bg-emerald-400"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <Award className="w-32 h-32" />
        </div>
      </div>
    </div>
  );
};
