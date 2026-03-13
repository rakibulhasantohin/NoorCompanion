import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  User, Bell, Moon, Globe, MapPin, Shield, 
  HelpCircle, LogOut, ChevronRight, Share2, Star, Camera
} from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { AppHeader } from '../components/Common';
import { AuthModal } from '../components/AuthModal';

export const Settings: React.FC = () => {
  const { state, updateState, user } = useAppState();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBn = state.language === 'bn';

  useEffect(() => {
    if (user?.email) {
      const usersStr = localStorage.getItem('noor_users') || '{}';
      const users = JSON.parse(usersStr);
      if (users[user.email] && users[user.email].photo) {
        setProfilePhoto(users[user.email].photo);
      } else {
        setProfilePhoto(null);
      }
    } else {
      setProfilePhoto(null);
    }
  }, [user]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user?.email) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePhoto(base64String);
        
        // Save to local storage
        const usersStr = localStorage.getItem('noor_users') || '{}';
        const users = JSON.parse(usersStr);
        if (users[user.email]) {
          users[user.email].photo = base64String;
          localStorage.setItem('noor_users', JSON.stringify(users));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('noor_current_user');
    window.dispatchEvent(new Event('auth_changed'));
  };

  const toggleTheme = () => {
    updateState({ theme: state.theme === 'light' ? 'dark' : 'light' });
  };

  const toggleLanguage = () => {
    updateState({ language: state.language === 'bn' ? 'en' : 'bn' });
  };

  const resetOnboarding = () => {
    if (window.confirm(isBn ? 'আপনি কি পুনরায় সেটআপ করতে চান?' : 'Do you want to setup again?')) {
      updateState({ onboardingComplete: false });
    }
  };

  const sections = [
    {
      title: isBn ? 'অ্যাকাউন্ট' : 'Account',
      items: [
        { icon: <User size={20} />, label: isBn ? 'প্রোফাইল' : 'Profile', value: user?.email || (isBn ? 'লগইন করুন' : 'Login'), onClick: () => !user && setIsAuthModalOpen(true) },
        { icon: <Bell size={20} />, label: isBn ? 'নোটিফিকেশন' : 'Notifications', toggle: true, active: state.notifications, onToggle: () => updateState({ notifications: !state.notifications }) },
      ]
    },
    {
      title: isBn ? 'অ্যাপ সেটিংস' : 'App Settings',
      items: [
        { icon: <Moon size={20} />, label: isBn ? 'ডার্ক মোড' : 'Dark Mode', toggle: true, active: state.theme === 'dark', onToggle: toggleTheme },
        { icon: <Globe size={20} />, label: isBn ? 'ভাষা' : 'Language', value: state.language === 'bn' ? 'বাংলা' : 'English', onClick: toggleLanguage },
        { icon: <MapPin size={20} />, label: isBn ? 'লোকেশন' : 'Location', value: state.city, onClick: resetOnboarding },
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
    <div className="min-h-screen bg-gray-50 pb-32">
      <AppHeader title={isBn ? 'সেটিংস' : 'Settings'} showBack />

      <div className="px-4 py-6 space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden">
          <div 
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary relative cursor-pointer group overflow-hidden border-2 border-primary/20"
            onClick={() => user ? fileInputRef.current?.click() : setIsAuthModalOpen(true)}
          >
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={32} />
            )}
            {user && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <div className="flex-1">
            {user ? (
              <>
                <h2 className="text-lg font-bold text-gray-800 truncate">{user.email.split('@')[0]}</h2>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-gray-800">{isBn ? 'অতিথি ইউজার' : 'Guest User'}</h2>
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-sm text-primary font-medium mt-1"
                >
                  {isBn ? 'লগইন / রেজিস্টার করুন' : 'Login / Register'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Sections */}
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">{section.title}</h3>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {section.items.map((item, i) => (
                <div 
                  key={i}
                  onClick={() => item.onClick?.()}
                  className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer ${
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
                      <button 
                        onClick={(e) => { e.stopPropagation(); item.onToggle?.(); }}
                        className={`w-12 h-6 rounded-full transition-all relative ${
                          item.active ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                          item.active ? 'left-7' : 'left-1'
                        }`}></div>
                      </button>
                    ) : (
                      <ChevronRight size={18} className="text-gray-300" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        {user && (
          <button 
            onClick={handleLogout}
            className="w-full p-4 bg-rose-50 text-rose-500 font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <LogOut size={20} />
            <span>{isBn ? 'লগ আউট' : 'Logout'}</span>
          </button>
        )}

        <div className="text-center text-gray-300 text-xs py-4">
          Nour Companion v3.6.1
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};
