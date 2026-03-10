import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, MapPin, Navigation, ChevronRight, Check } from 'lucide-react';
import { useAppState } from '../../hooks/useAppState';
import { DISTRICTS, District } from '../../utils/districts';

export const Onboarding: React.FC = () => {
  const { state, updateState } = useAppState();
  const [step, setStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState<'bn' | 'en'>(state.language);
  const [showDistrictModal, setShowDistrictModal] = useState(false);

  const handleLanguageSelect = (lang: 'bn' | 'en') => {
    setSelectedLang(lang);
  };

  const nextStep = () => {
    if (step === 1) {
      updateState({ language: selectedLang });
      setStep(2);
    } else {
      updateState({ onboardingComplete: true });
    }
  };

  const handleUseGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateState({
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            city: 'Current Location',
            onboardingComplete: true,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get location. Please select manually.');
        }
      );
    }
  };

  const handleDistrictSelect = (district: District) => {
    updateState({
      location: { lat: district.lat, lng: district.lng },
      city: district.name,
      onboardingComplete: true,
    });
    setShowDistrictModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md flex flex-col items-center"
          >
            <div className="w-48 h-48 mb-8 relative">
              <img 
                src="https://picsum.photos/seed/islamic-art/400/400" 
                alt="Welcome" 
                className="w-full h-full object-cover rounded-full border-4 border-primary/20"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-2xl shadow-lg">
                <Globe size={24} />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              পছন্দের ভাষা নির্বাচন করুন
            </h1>
            <p className="text-gray-500 mb-8 text-center">
              Choose your preferred language to continue
            </p>

            <div className="w-full space-y-4 mb-12">
              <button
                onClick={() => handleLanguageSelect('bn')}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  selectedLang === 'bn' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30'
                }`}
              >
                <span className="text-lg font-medium">বাংলা</span>
                {selectedLang === 'bn' && <Check className="text-primary" />}
              </button>
              <button
                onClick={() => handleLanguageSelect('en')}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  selectedLang === 'en' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30'
                }`}
              >
                <span className="text-lg font-medium">English</span>
                {selectedLang === 'en' && <Check className="text-primary" />}
              </button>
            </div>

            <button
              onClick={nextStep}
              className="w-full btn-primary py-4 text-lg"
            >
              পরবর্তী <ChevronRight size={20} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md flex flex-col items-center"
          >
            <div className="w-48 h-48 mb-8 relative">
              <img 
                src="https://picsum.photos/seed/location/400/400" 
                alt="Location" 
                className="w-full h-full object-cover rounded-full border-4 border-primary/20"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-2xl shadow-lg">
                <MapPin size={24} />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              আপনার লোকেশন সেট করুন
            </h1>
            <p className="text-gray-500 mb-8 text-center px-4">
              আপনার এলাকার জন্য সঠিক নামাজের সময়সূচী প্রদান করতে আপনার লোকেশন প্রয়োজন।
            </p>

            <div className="w-full space-y-4">
              <button
                onClick={handleUseGPS}
                className="w-full p-6 rounded-2xl bg-primary text-white flex items-center gap-4 shadow-lg shadow-primary/20 active:scale-95 transition-all"
              >
                <div className="bg-white/20 p-3 rounded-xl">
                  <Navigation size={24} />
                </div>
                <div className="text-left">
                  <div className="font-bold">বর্তমান অবস্থান ব্যবহার করুন</div>
                  <div className="text-sm opacity-80 text-white/90">GPS এর মাধ্যমে শনাক্ত করুন</div>
                </div>
              </button>

              <div className="flex items-center gap-4 py-4">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-gray-400 text-sm">অথবা</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <button
                onClick={() => setShowDistrictModal(true)}
                className="w-full p-6 rounded-2xl border-2 border-gray-100 flex items-center gap-4 hover:border-primary/30 active:scale-95 transition-all"
              >
                <div className="bg-gray-100 p-3 rounded-xl">
                  <MapPin size={24} className="text-gray-500" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-800">জেলা নির্বাচন করুন</div>
                  <div className="text-sm text-gray-500">তালিকা থেকে জেলা ও উপজেলা নির্বাচন করুন</div>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* District Selection Modal */}
      <AnimatePresence>
        {showDistrictModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold">জেলা নির্বাচন করুন</h2>
                <button 
                  onClick={() => setShowDistrictModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  বন্ধ করুন
                </button>
              </div>
              <div className="overflow-y-auto p-2">
                {DISTRICTS.map((district) => (
                  <button
                    key={district.id}
                    onClick={() => handleDistrictSelect(district)}
                    className="w-full p-4 text-left hover:bg-gray-50 rounded-xl flex items-center justify-between group"
                  >
                    <span className="font-medium text-gray-700 group-hover:text-primary">
                      {district.bnName} ({district.name})
                    </span>
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-primary" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
