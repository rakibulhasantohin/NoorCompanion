import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Globe, Moon, Shield, ChevronRight, LogOut, Info, MapPin, X, Check, User } from 'lucide-react';
import { Card, SectionTitle } from '../components/Common';
import { useAppState } from '../hooks/useAppState';
import { Auth } from '../components/Auth';

export const Settings = () => {
  const { state, updateState } = useAppState();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const toggleTheme = () => {
    updateState({ theme: state.theme === 'light' ? 'dark' : 'light' });
  };

  const toggleNotifications = () => {
    updateState({ notifications: !state.notifications });
  };

  const toggleAlarms = () => {
    updateState({ prayerAlarms: !state.prayerAlarms });
  };

  const settingsSections = [
    {
      title: 'সাধারণ',
      items: [
        { 
          icon: Globe, 
          label: 'ভাষা', 
          value: state.language === 'bn' ? 'বাংলা' : 'English', 
          color: 'text-blue-600 bg-blue-50',
          onClick: () => setActiveModal('language')
        },
        { 
          icon: MapPin, 
          label: 'অবস্থান', 
          value: state.city, 
          color: 'text-emerald-600 bg-emerald-50',
          onClick: () => setActiveModal('city')
        },
        { 
          icon: Moon, 
          label: 'ডার্ক মোড', 
          value: state.theme === 'dark' ? 'চালু' : 'বন্ধ', 
          color: 'text-purple-600 bg-purple-50',
          onClick: toggleTheme
        },
      ]
    },
    {
      title: 'নোটিফিকেশন',
      items: [
        { 
          icon: Bell, 
          label: 'নামাজের আজান', 
          value: state.prayerAlarms ? 'চালু' : 'বন্ধ', 
          color: 'text-amber-600 bg-amber-50',
          onClick: toggleAlarms
        },
        { 
          icon: Bell, 
          label: 'সেহরি ও ইফতার', 
          value: state.notifications ? 'চালু' : 'বন্ধ', 
          color: 'text-rose-600 bg-rose-50',
          onClick: toggleNotifications
        },
      ]
    },
    {
      title: 'অন্যান্য',
      items: [
        { icon: Shield, label: 'গোপনীয়তা নীতি', color: 'text-gray-600 bg-gray-50', onClick: () => alert('গোপনীয়তা নীতি শীঘ্রই আসছে') },
        { icon: Info, label: 'অ্যাপ সম্পর্কে', color: 'text-gray-600 bg-gray-50', onClick: () => alert('নূর কম্প্যানিয়ন - আপনার দৈনন্দিন ইবাদতের সঙ্গী') },
      ]
    }
  ];

  return (
    <div className="pb-24 px-4 pt-4 space-y-6">
      <div className="flex flex-col items-center py-6 space-y-3">
        <div className="w-24 h-24 rounded-3xl bg-emerald-900 flex items-center justify-center text-white text-4xl font-black shadow-xl border-4 border-white">
          N
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900">নূর কম্প্যানিয়ন</h3>
          <p className="text-sm text-gray-400">ভার্সন ১.০.০ (বেটা)</p>
        </div>
      </div>

      <section>
        <SectionTitle title="অ্যাকাউন্ট" />
        <Auth />
      </section>

      {settingsSections.map((section, i) => (
        <section key={i}>
          <SectionTitle title={section.title} />
          <div className="space-y-2">
            {section.items.map((item, j) => (
              <motion.div
                key={j}
                whileTap={{ scale: 0.98 }}
                onClick={item.onClick}
                className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.color)}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && <span className="text-sm text-gray-400">{item.value}</span>}
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      ))}

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'language' && (
          <Modal title="ভাষা নির্বাচন করুন" onClose={() => setActiveModal(null)}>
            <div className="space-y-2">
              {[
                { id: 'bn', label: 'বাংলা' },
                { id: 'en', label: 'English' }
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    updateState({ language: lang.id as 'bn' | 'en' });
                    setActiveModal(null);
                  }}
                  className={cn(
                    "w-full p-4 rounded-xl flex items-center justify-between border transition-all",
                    state.language === lang.id ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-white border-gray-100 text-gray-700"
                  )}
                >
                  <span className="font-bold">{lang.label}</span>
                  {state.language === lang.id && <Check className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </Modal>
        )}

        {activeModal === 'city' && (
          <Modal title="শহর নির্বাচন করুন" onClose={() => setActiveModal(null)}>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ'].map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    updateState({ city });
                    setActiveModal(null);
                  }}
                  className={cn(
                    "w-full p-4 rounded-xl flex items-center justify-between border transition-all",
                    state.city === city ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-white border-gray-100 text-gray-700"
                  )}
                >
                  <span className="font-bold">{city}</span>
                  {state.city === city && <Check className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

const Modal = ({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
    />
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="relative w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-400">
          <X className="w-5 h-5" />
        </button>
      </div>
      {children}
    </motion.div>
  </div>
);

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
