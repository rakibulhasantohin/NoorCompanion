import React from 'react';
import { motion } from 'motion/react';
import { User, Award, BookOpen, Hash, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { supabase } from '../lib/supabase';

export const ProfileSection = () => {
  const { state, user, updateState } = useAppState();

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
