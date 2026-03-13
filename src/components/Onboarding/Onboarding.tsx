import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, MapPin, ChevronRight, Check } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { DISTRICTS, District } from '../../utils/districts';

const findNearestDistrict = (lat: number, lng: number): District => {
  let nearest = DISTRICTS[0];
  let minDistance = Infinity;

  const distance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const p = 0.017453292519943295;
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
    return 12742 * Math.asin(Math.sqrt(a));
  };

  DISTRICTS.forEach(district => {
    const dist = distance(lat, lng, district.lat, district.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = district;
    }
  });

  return nearest;
};

export const Onboarding: React.FC = () => {
  const { state, updateState } = useAppState();
  const [step, setStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState<'bn' | 'en'>(state.language);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  const handleLanguageSelect = (lang: 'bn' | 'en') => {
    setSelectedLang(lang);
  };

  const nextStep = () => {
    if (step === 1) {
      updateState({ language: selectedLang });
      setStep(2);
    }
  };

  const handleDistrictSelect = (district: District) => {
    setSelectedDistrict(district);
    setStep(3);
  };

  const completeOnboarding = () => {
    if (selectedDistrict) {
      updateState({
        location: { lat: selectedDistrict.lat, lng: selectedDistrict.lng },
        city: selectedDistrict.bnName,
        onboardingComplete: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-md flex flex-col items-center"
          >
            <div className="w-48 h-48 mb-8 relative">
              <img 
                src="https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=400&q=80" 
                alt="Islamic Calligraphy" 
                className="w-full h-full object-cover rounded-full border-4 border-primary/20 shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -bottom-2 -right-2 bg-primary text-white p-4 rounded-2xl shadow-lg"
              >
                <Globe size={28} />
              </motion.div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
              নূর কম্প্যানিয়ন
            </h1>
            <p className="text-gray-500 mb-10 text-center">
              আপনার দ্বীনি সফরের বিশ্বস্ত সঙ্গী
            </p>

            <div className="w-full space-y-4 mb-12">
              <button
                onClick={() => handleLanguageSelect('bn')}
                className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  selectedLang === 'bn' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-100 hover:border-primary/30'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="text-xl font-bold">বাংলা</span>
                  <span className="text-xs text-gray-400">Bengali Language</span>
                </div>
                {selectedLang === 'bn' && (
                  <div className="bg-primary text-white p-1 rounded-full">
                    <Check size={16} />
                  </div>
                )}
              </button>
              <button
                onClick={() => handleLanguageSelect('en')}
                className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  selectedLang === 'en' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-100 hover:border-primary/30'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="text-xl font-bold">English</span>
                  <span className="text-xs text-gray-400">ইংরেজি ভাষা</span>
                </div>
                {selectedLang === 'en' && (
                  <div className="bg-primary text-white p-1 rounded-full">
                    <Check size={16} />
                  </div>
                )}
              </button>
            </div>

            <button
              onClick={nextStep}
              className="w-full btn-primary py-4 text-lg shadow-xl shadow-primary/30"
            >
              পরবর্তী <ChevronRight size={20} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-md flex flex-col items-center h-[80vh]"
          >
            <div className="w-32 h-32 mb-6 relative shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&w=400&q=80" 
                alt="Islamic Architecture" 
                className="w-full h-full object-cover rounded-full border-4 border-primary/20 shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-2xl shadow-lg"
              >
                <MapPin size={24} />
              </motion.div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center shrink-0">
              লোকেশন সেট করুন
            </h1>
            <p className="text-gray-500 mb-6 text-center px-4 shrink-0">
              সঠিক নামাজের সময়সূচী পেতে আপনার জেলা নির্বাচন করুন।
            </p>

            <div className="w-full flex-1 overflow-hidden flex flex-col bg-gray-50 rounded-3xl border border-gray-100">
              <div className="overflow-y-auto p-2 flex-1">
                {DISTRICTS.map((district) => (
                  <button
                    key={district.id}
                    onClick={() => handleDistrictSelect(district)}
                    className="w-full p-4 text-left hover:bg-white rounded-xl flex items-center justify-between group transition-colors"
                  >
                    <span className="font-medium text-gray-700 group-hover:text-primary">
                      {district.bnName} ({district.name})
                    </span>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-primary" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && selectedDistrict && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-md flex flex-col items-center justify-center h-full"
          >
            <div className="w-32 h-32 mb-8 relative">
              <div className="w-full h-full bg-emerald-100 rounded-full flex items-center justify-center border-4 border-emerald-500/20 shadow-2xl">
                <MapPin size={48} className="text-emerald-600" />
              </div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-3 rounded-2xl shadow-lg"
              >
                <Check size={24} />
              </motion.div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              আলহামদুলিল্লাহ!
            </h1>
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-10 w-full text-center">
              <p className="text-gray-500 mb-2">আপনার বর্তমান জেলা</p>
              <p className="text-2xl font-bold text-primary">
                {selectedDistrict.bnName}
              </p>
            </div>

            <button
              onClick={completeOnboarding}
              className="w-full btn-primary py-4 text-lg shadow-xl shadow-primary/30"
            >
              হোমপেজে যান <ChevronRight size={20} className="ml-2 inline" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
