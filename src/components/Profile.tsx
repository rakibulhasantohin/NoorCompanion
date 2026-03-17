import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Award, BookOpen, Hash, LogOut, Settings as SettingsIcon, CloudCheck, Cloud, Camera, X, Calendar, Edit2 } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { supabase } from '../lib/supabase';
import { getBengaliNumber } from '../utils/utils';

import { useNavigate } from 'react-router-dom';

export const ProfileSection = () => {
  const { state, user, updateState } = useAppState();
  const navigate = useNavigate();
  const [syncing, setSyncing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: state.fullName || '',
    dateOfBirth: state.dateOfBirth || '',
    profileImage: state.profileImage || ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openEdit = () => {
    setEditData({
      fullName: state.fullName || '',
      dateOfBirth: state.dateOfBirth || '',
      profileImage: state.profileImage || ''
    });
    setIsEditing(true);
  };

  const handleManualSync = async () => {
    setSyncing(true);
    // manualSync(); // Removed
    setTimeout(() => setSyncing(false), 1000);
  };

  const handleSave = () => {
    updateState(editData);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(state.fullName || user?.email || 'User')}&background=random`;
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
    <div className="space-y-4">
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 overflow-hidden border-2 border-emerald-50">
              {state.profileImage ? (
                <img 
                  src={state.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                  onError={handleImageError}
                />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 truncate">
              {state.fullName || user.email?.split('@')[0]}
            </h3>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            {state.dateOfBirth && (
              <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                <Calendar className="w-3 h-3" />
                <span>{state.dateOfBirth}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={openEdit}
              className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-emerald-600 transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/settings')}
              className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-emerald-600 transition-colors"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center p-3 rounded-2xl bg-gray-50 border border-gray-100">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1.5 ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-gray-500 mb-0.5">{stat.label}</span>
              <span className="text-xs font-bold text-gray-900">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
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
        </div>
      </div>

      <div className="bg-emerald-900 rounded-3xl p-5 text-white overflow-hidden relative">
        <div className="relative z-10">
          <h4 className="font-bold text-sm mb-1">আপনার প্রগ্রেস</h4>
          <p className="text-emerald-100 text-xs mb-3">আপনি নিয়মিত ইবাদত চালিয়ে যাচ্ছেন। মাশাআল্লাহ!</p>
          
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

      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">প্রোফাইল এডিট করুন</h3>
                <button onClick={() => setIsEditing(false)} className="p-2 bg-gray-50 rounded-full text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col items-center mb-4">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-24 h-24 rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-600 overflow-hidden border-2 border-emerald-100">
                      {editData.profileImage ? (
                        <img 
                          src={editData.profileImage} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                          onError={handleImageError}
                        />
                      ) : (
                        <User className="w-10 h-10" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">ছবি পরিবর্তন করুন</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">পুরো নাম</label>
                  <input
                    type="text"
                    placeholder="আপনার নাম"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    value={editData.fullName}
                    onChange={(e) => setEditData(prev => ({ ...prev, fullName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">জন্ম তারিখ</label>
                  <input
                    type="date"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    value={editData.dateOfBirth}
                    onChange={(e) => setEditData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="w-full py-4 rounded-xl bg-emerald-900 text-white font-bold shadow-lg hover:bg-emerald-800 transition-colors mt-4"
                >
                  সেভ করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
