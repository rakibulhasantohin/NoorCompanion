import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Bell, Moon, Globe, MapPin, Shield, 
  HelpCircle, ChevronRight, Share2, Star, Camera, Edit2, LogIn, LogOut, LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, logout } from '../lib/firebase';
import { AppHeader, ConfirmModal } from '../components/Common';

export const Settings: React.FC = () => {
  const { state, updateState } = useAppState();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempName, setTempName] = useState(state.fullName || '');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(state.profileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBn = state.language === 'bn';

  useEffect(() => {
    setProfilePhoto(state.profileImage || null);
    setTempName(state.fullName || '');
  }, [state.profileImage, state.fullName]);

  const toggleTheme = () => {
    updateState({ theme: state.theme === 'light' ? 'dark' : 'light' });
  };

  const toggleLanguage = () => {
    updateState({ language: state.language === 'bn' ? 'en' : 'bn' });
  };

  const resetOnboarding = () => {
    updateState({ onboardingComplete: false });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePhoto(base64String);
        updateState({ profileImage: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    updateState({ fullName: tempName });
    setIsEditModalOpen(false);
  };

  const sections = [
    {
      title: isBn ? 'ব্যক্তিগত' : 'Personal',
      items: [
        { icon: <User size={20} />, label: isBn ? 'প্রোফাইল' : 'Profile', value: state.fullName || (isBn ? 'অতিথি' : 'Guest'), onClick: () => setIsEditModalOpen(true) },
        { 
          icon: user ? <LogOut size={20} /> : <LogIn size={20} />, 
          label: user ? (isBn ? 'লগআউট' : 'Logout') : (isBn ? 'গুগল দিয়ে লগইন' : 'Login with Google'), 
          onClick: user ? logout : signInWithGoogle 
        },
        { icon: <Bell size={20} />, label: isBn ? 'নোটিফিকেশন' : 'Notifications', toggle: true, active: state.notifications, onToggle: () => updateState({ notifications: !state.notifications }) },
        { icon: <Bell size={20} />, label: isBn ? 'নামাজের অ্যালার্ম' : 'Prayer Alarms', toggle: true, active: state.prayerAlarms, onToggle: () => updateState({ prayerAlarms: !state.prayerAlarms }) },
        { icon: <Bell size={20} />, label: isBn ? 'দৈনিক ইসলামিক তথ্য' : 'Daily Islamic Facts', toggle: true, active: state.dailyFactsNotification, onToggle: () => updateState({ dailyFactsNotification: !state.dailyFactsNotification }) },
        { icon: <Star size={20} />, label: isBn ? 'অনুপ্রেরণামূলক উক্তি' : 'Daily Motivational Quotes', toggle: true, active: state.dailyMotivationNotification, onToggle: () => updateState({ dailyMotivationNotification: !state.dailyMotivationNotification }) },
      ]
    },
    ...(isAdmin ? [{
      title: isBn ? 'অ্যাডমিন' : 'Admin',
      items: [
        { icon: <LayoutDashboard size={20} />, label: isBn ? 'অ্যাডমিন প্যানেল' : 'Admin Panel', onClick: () => navigate('/admin') },
      ]
    }] : []),
    {
      title: isBn ? 'অ্যাপ সেটিংস' : 'App Settings',
      items: [
        { icon: <Moon size={20} />, label: isBn ? 'ডার্ক মোড' : 'Dark Mode', toggle: true, active: state.theme === 'dark', onToggle: toggleTheme },
        { icon: <Globe size={20} />, label: isBn ? 'ভাষা' : 'Language', value: state.language === 'bn' ? 'বাংলা' : 'English', onClick: toggleLanguage },
        { icon: <MapPin size={20} />, label: isBn ? 'লোকেশন' : 'Location', value: state.city, onClick: () => setIsResetModalOpen(true) },
      ]
    },
    {
      title: isBn ? 'অন্যান্য' : 'Others',
      items: [
        { icon: <Shield size={20} />, label: isBn ? 'প্রাইভেসি পলিসি' : 'Privacy Policy', path: '/' },
        { icon: <HelpCircle size={20} />, label: isBn ? 'সাহায্য ও সাপোর্ট' : 'Help & Support', path: '/' },
        { icon: <Share2 size={20} />, label: isBn ? 'অ্যাপটি শেয়ার করুন' : 'Share App', path: '/' },
        { icon: <Star size={20} />, label: isBn ? 'রেটিং দিন' : 'Rate Us', path: '/' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader title={isBn ? 'সেটিংস' : 'Settings'} showBack />

      <div className="px-4 py-4 space-y-6">
        {/* Profile Card */}
        <div 
          onClick={() => setIsEditModalOpen(true)}
          className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden active:scale-95 transition-transform cursor-pointer"
        >
          <div 
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary relative group overflow-hidden border-2 border-primary/20"
          >
            {profilePhoto || state.profileImage ? (
              <img src={profilePhoto || state.profileImage || ''} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={32} />
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-800 truncate">
                {state.fullName || (isBn ? 'অতিথি ইউজার' : 'Guest User')}
              </h2>
              <Edit2 size={14} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 truncate">{isBn ? 'অফলাইন মোড' : 'Offline Mode'}</p>
          </div>
        </div>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handlePhotoUpload} 
          accept="image/*" 
          className="hidden" 
        />

        {/* Sections */}
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">{section.title}</h3>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {section.items.map((item, i) => (
                <div 
                  key={i}
                  onClick={() => item.onClick?.()}
                  className={`p-3 flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer ${
                    i !== section.items.length - 1 ? 'border-b border-gray-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-gray-400">{item.icon}</div>
                    <span className="font-medium text-gray-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.value && <span className="text-sm text-gray-400">{item.value}</span>}
                    {item.toggle ? (
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); item.onToggle?.(); }}
                        className={`w-12 h-6 rounded-full relative ${
                          item.active ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full ${
                          item.active ? 'left-7' : 'left-1'
                        }`}></div>
                      </motion.button>
                    ) : (
                      <ChevronRight size={18} className="text-gray-300" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center text-gray-300 text-xs py-4">
          Nour Companion v3.6.2
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="flex flex-col items-center gap-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {isBn ? 'প্রোফাইল এডিট করুন' : 'Edit Profile'}
                </h3>

                <div 
                  className="relative cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-24 h-24 rounded-full border-4 border-primary/20 overflow-hidden bg-primary/5 flex items-center justify-center text-primary">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg border-2 border-white">
                    <Camera size={16} />
                  </div>
                </div>

                <div className="w-full space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">
                    {isBn ? 'আপনার নাম' : 'Your Name'}
                  </label>
                  <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder={isBn ? 'নাম লিখুন' : 'Enter name'}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    autoFocus
                  />
                </div>

                <div className="w-full flex gap-3 mt-2">
                  <button 
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 p-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button 
                    onClick={saveProfile}
                    className="flex-1 p-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors"
                  >
                    {isBn ? 'সেভ করুন' : 'Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={resetOnboarding}
        title={isBn ? 'রিসেট নিশ্চিত করুন' : 'Confirm Reset'}
        message={isBn ? 'আপনি কি পুনরায় সেটআপ করতে চান?' : 'Do you want to setup again?'}
        confirmLabel={isBn ? 'হ্যাঁ' : 'Yes'}
        cancelLabel={isBn ? 'না' : 'No'}
      />
    </div>
  );
};
