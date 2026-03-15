import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, MapPin, Moon, Sun, Clock, Book, Heart, 
  Compass, MessageSquare, Play, Radio, ChevronRight,
  User, Bell, Share2, Facebook, Users, X, Search,
  Globe, Shield, HelpCircle, Star
} from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { useTranslation } from '../hooks/useTranslation';
import { getPrayerTimes, getForbiddenTimes, getSahriIftarRange } from '../services/prayerService';
import { format, differenceInSeconds, addDays, isAfter, isBefore, addMinutes } from 'date-fns';
import { bn } from 'date-fns/locale';
import moment from 'moment-hijri';
import { cn } from '../utils/utils';
import { AnimatedRubElHizbIcon } from '../components/Common';
import { districts } from '../data/districts';

export const Home: React.FC = () => {
  const { state, user, updateState } = useAppState();
  const isBn = state.language === 'bn';
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {}
  });

  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onClose: () => {}
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const lat = state.location?.lat || 23.7289;
  const lng = state.location?.lng || 90.3944;
  const prayerData = getPrayerTimes(lat, lng, now);
  const forbiddenTimes = getForbiddenTimes(lat, lng, now);

  const currentForbiddenTime = forbiddenTimes.find(t => isAfter(now, t.start) && isBefore(now, t.end));
  const isForbidden = !!currentForbiddenTime;

  const currentPrayerProgress = (() => {
    if (isForbidden && currentForbiddenTime) {
      const total = differenceInSeconds(currentForbiddenTime.end, currentForbiddenTime.start);
      const elapsed = differenceInSeconds(now, currentForbiddenTime.start);
      return Math.min(100, Math.max(0, (elapsed / total) * 100));
    } else if (prayerData.current && prayerData.current.endTime) {
      const total = differenceInSeconds(prayerData.current.endTime, prayerData.current.time);
      const elapsed = differenceInSeconds(now, prayerData.current.time);
      return Math.min(100, Math.max(0, (elapsed / total) * 100));
    }
    return 0;
  })();

  const formatCountdown = (target: Date) => {
    const diff = differenceInSeconds(target, now);
    if (diff <= 0) return '00:00:00';
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatCountdownBn = (target: Date) => {
    const diff = differenceInSeconds(target, now);
    if (diff <= 0) return '০০:০০:০০';
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    
    const toBn = (n: number) => n.toString().split('').map(d => '০১২৩৪৫৬৭৮৯'[parseInt(d)]).join('').padStart(2, '০');
    return `${toBn(h)} ঘণ্টা ${toBn(m)} মিনিট`;
  };

  const hijriDate = moment().format('iD iMMMM iYYYY');
  const bengaliDate = new Intl.DateTimeFormat('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }).format(now);

  const countdownInfo = (() => {
    const today = getPrayerTimes(lat, lng, now);
    const iftarTime = today.maghrib;
    const sahriTime = today.imsak;

    if (isBefore(now, sahriTime)) {
      const yesterday = getPrayerTimes(lat, lng, addDays(now, -1));
      return { label: t('sahriTimeRemaining'), target: sahriTime, start: yesterday.maghrib, imsak: today.imsak, maghrib: today.maghrib };
    } else if (isBefore(now, iftarTime)) {
      return { label: t('iftarTimeRemaining'), target: iftarTime, start: today.imsak, imsak: today.imsak, maghrib: today.maghrib };
    } else {
      const tomorrow = getPrayerTimes(lat, lng, addDays(now, 1));
      return { label: t('sahriTimeRemaining'), target: tomorrow.imsak, start: today.maghrib, imsak: tomorrow.imsak, maghrib: tomorrow.maghrib };
    }
  })();

  const totalDuration = differenceInSeconds(countdownInfo.target, countdownInfo.start);
  const elapsedDuration = differenceInSeconds(now, countdownInfo.start);
  const progressPercentage = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));

  const features = [
    { id: 'prayer', name: 'নামাজের সময়সূচী', icon: <Clock className="text-teal-500" />, path: '/prayer-times', terms: 'prayer salat namaz সময়সূচী' },
    { id: 'quran', name: 'আল-কুরআন', icon: <Book className="text-emerald-500" />, path: '/quran', terms: 'quran koran কুরআন তিলাওয়াত' },
    { id: 'ramadan', name: 'সাহরী-ইফতার', icon: <Moon className="text-indigo-500" />, path: '/sahri-iftar', terms: 'ramadan roja sahri iftar রমজান রোজা' },
    { id: 'tasbih', name: 'তাসবিহ', icon: <Heart className="text-rose-500" />, path: '/tasbih', terms: 'tasbih zikir জিকির তাসবিহ' },
    { id: 'qibla', name: 'কিবলা কম্পাস', icon: <Compass className="text-amber-500" />, path: '/qibla', terms: 'qibla compass দিকনির্ণয় কিবলা' },
    { id: 'duas', name: 'দোয়া ও জিকির', icon: <Heart className="text-pink-500" />, path: '/duas', terms: 'dua zikir দোয়া জিকির মুনাজাত' },
    { id: 'hadith', name: 'হাদিস শরীফ', icon: <Book className="text-blue-500" />, path: '/hadith', terms: 'hadith sunnah হাদিস সুন্নাহ' },
    { id: 'pillars', name: 'ইসলামের স্তম্ভ', icon: <Users className="text-purple-500" />, path: '/pillars', terms: 'pillars islam স্তম্ভ ঈমান নামাজ রোজা হজ জাকাত' },
    { id: 'hajj', name: 'হজ্জ ও উমরাহ', icon: <MapPin className="text-amber-500" />, path: '/hajj', terms: 'hajj umrah হজ্জ উমরাহ' },
    { id: 'names', name: 'আসমা-উল-হুসনা', icon: <span className="text-xl font-bold text-blue-500">الله</span>, path: '/names-of-allah', terms: 'names allah asmaul husna আল্লাহর নাম' },
    { id: 'ai', name: 'নূর এআই', icon: <AnimatedRubElHizbIcon className="text-cyan-500" size={24} />, path: '/ai-assistant', terms: 'ai assistant chat নূর এআই চ্যাট' },
  ];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(state.fullName || user?.email || 'User')}&background=random`;
  };

  const handleLocationSelect = (loc: any) => {
    setConfirmDialog({
      isOpen: true,
      title: isBn ? 'লোকেশন পরিবর্তন' : 'Change Location',
      message: isBn ? `আপনি কি আপনার লোকেশন ${loc.name}-এ পরিবর্তন করতে চান?` : `Are you sure you want to change your location to ${loc.enName}?`,
      onConfirm: () => {
        updateState({ city: loc.enName, location: { lat: loc.lat, lng: loc.lng } });
        setShowLocationModal(false);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Find nearest district
          let nearestDistrict = districts[0];
          let minDistance = Infinity;
          
          districts.forEach(d => {
            const distance = Math.sqrt(Math.pow(d.lat - lat, 2) + Math.pow(d.lng - lng, 2));
            if (distance < minDistance) {
              minDistance = distance;
              nearestDistrict = d;
            }
          });

          setConfirmDialog({
            isOpen: true,
            title: isBn ? 'বর্তমান লোকেশন' : 'Current Location',
            message: isBn ? `আপনার বর্তমান লোকেশন ${nearestDistrict.name} শনাক্ত করা হয়েছে। আপনি কি এটি ব্যবহার করতে চান?` : `Your current location is detected as ${nearestDistrict.enName}. Do you want to use it?`,
            onConfirm: () => {
              updateState({ city: nearestDistrict.enName, location: { lat, lng } });
              setShowLocationModal(false);
              setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            },
            onCancel: () => {
              setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            }
          });
        },
        (error) => {
          setAlertDialog({
            isOpen: true,
            title: isBn ? 'ত্রুটি' : 'Error',
            message: isBn ? 'লোকেশন পাওয়া যায়নি। দয়া করে লোকেশন পারমিশন দিন।' : 'Location not found. Please enable location permissions.',
            onClose: () => setAlertDialog(prev => ({ ...prev, isOpen: false }))
          });
        }
      );
    } else {
      setAlertDialog({
        isOpen: true,
        title: isBn ? 'ত্রুটি' : 'Error',
        message: isBn ? 'আপনার ব্রাউজার লোকেশন সাপোর্ট করে না।' : 'Your browser does not support geolocation.',
        onClose: () => setAlertDialog(prev => ({ ...prev, isOpen: false }))
      });
    }
  };

  const allSearchableItems = [
    ...features,
    { id: 'lang', name: isBn ? 'ভাষা পরিবর্তন' : 'Change Language', icon: <Globe className="text-gray-400" />, path: '/settings', terms: 'language ভাষা settings' },
    { id: 'theme', name: isBn ? 'ডার্ক মোড / থিম' : 'Dark Mode / Theme', icon: <Moon className="text-gray-400" />, path: '/settings', terms: 'theme dark mode ডার্ক মোড' },
    { id: 'notif', name: isBn ? 'নোটিফিকেশন সেটিংস' : 'Notification Settings', icon: <Bell className="text-gray-400" />, path: '/settings', terms: 'notification নোটিফিকেশন' },
    { id: 'loc_set', name: isBn ? 'লোকেশন সেটিংস' : 'Location Settings', icon: <MapPin className="text-gray-400" />, path: '/settings', terms: 'location লোকেশন' },
    { id: 'profile_set', name: isBn ? 'প্রোফাইল এডিট' : 'Edit Profile', icon: <User className="text-gray-400" />, path: '/profile', terms: 'profile প্রোফাইল' },
    { id: 'privacy', name: isBn ? 'প্রাইভেসি পলিসি' : 'Privacy Policy', icon: <Shield className="text-gray-400" />, path: '/settings', terms: 'privacy policy প্রাইভেসি' },
    { id: 'help', name: isBn ? 'সাহায্য ও সাপোর্ট' : 'Help & Support', icon: <HelpCircle className="text-gray-400" />, path: '/settings', terms: 'help support সাহায্য' },
    { id: 'share', name: isBn ? 'অ্যাপটি শেয়ার করুন' : 'Share App', icon: <Share2 className="text-gray-400" />, path: '/settings', terms: 'share শেয়ার' },
    { id: 'rate', name: isBn ? 'রেটিং দিন' : 'Rate Us', icon: <Star className="text-gray-400" />, path: '/settings', terms: 'rate রেটিং' },
  ];

  const suggestedSearches = isBn 
    ? ['নামাজের সময়', 'আল-কুরআন', 'সাহরী ও ইফতার', 'দোয়া', 'তসবিহ']
    : ['Prayer Times', 'Al-Quran', 'Sahri & Iftar', 'Duas', 'Tasbih'];

  const filteredItems = allSearchableItems.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (f.terms && f.terms.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="pb-20 px-4 pt-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800">{t('noorCompanion')}</h1>
          <p className="text-xs text-gray-500 font-medium">
            {isBn ? 'আসসালামু আলাইকুম, ' : 'Assalamu Alaikum, '}
            {state.fullName || (user?.email?.split('@')[0] || (isBn ? 'অতিথি' : 'Guest'))}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-10 h-10 bg-white rounded-full shadow-sm text-gray-500 flex items-center justify-center border border-gray-100 active:scale-90 transition-transform"
          >
            <Search size={20} />
          </button>
          <button onClick={() => navigate('/profile')} className="w-10 h-10 bg-white rounded-full shadow-sm text-gray-500 overflow-hidden border-2 border-primary/10 flex items-center justify-center">
            {state.profileImage || profilePhoto ? (
              <img 
                src={state.profileImage || profilePhoto || ''} 
                alt="Profile" 
                className="w-full h-full object-cover" 
                onError={handleImageError}
              />
            ) : (
              <User size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Full Screen Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-white flex flex-col"
          >
            {/* Search Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white sticky top-0 z-10">
              <button 
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500" />
                <input 
                  autoFocus
                  type="text"
                  placeholder={isBn ? 'অ্যাপের যেকোনো কিছু সার্চ করুন...' : 'Search anything in the app...'}
                  className="w-full bg-white border border-gray-200 rounded-full pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Search Content */}
            <div className="flex-1 overflow-y-auto bg-[#F8FAFC] relative">
              <div className="relative z-10 p-6 max-w-2xl mx-auto">
                {!searchQuery ? (
                  <div className="space-y-10">
                    {/* Suggested Section */}
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                        <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                          {isBn ? 'জনপ্রিয় সার্চ' : 'Suggested Searches'}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {suggestedSearches.map((term, i) => (
                          <button
                            key={i}
                            onClick={() => setSearchQuery(term)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all active:scale-95 shadow-sm"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </section>

                    {/* Quick Access Section - Uniform Grid */}
                    <section>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                        <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                          {isBn ? 'দ্রুত এক্সেস' : 'Quick Access'}
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {features.slice(0, 9).map((f, idx) => (
                          <button
                            key={f.id}
                            onClick={() => {
                              navigate(f.path);
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="aspect-square bg-white border border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-2 hover:shadow-xl hover:shadow-emerald-900/5 transition-all group active:scale-95"
                          >
                            <div className={`p-3 rounded-2xl bg-slate-50 text-slate-600 group-hover:scale-110 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all`}>
                              {f.icon}
                            </div>
                            <span className="text-[10px] font-bold text-slate-600 group-hover:text-emerald-700 transition-colors px-2 text-center line-clamp-1">
                              {f.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                        <h3 className="text-sm font-bold text-slate-800">
                          {isBn ? 'সার্চ রেজাল্ট' : 'Search Results'}
                        </h3>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full">
                          {filteredItems.length}
                        </span>
                      </div>
                      {filteredItems.length > 0 && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="text-xs text-slate-400 hover:text-emerald-600 font-medium transition-colors"
                        >
                          {isBn ? 'ক্লিয়ার' : 'Clear'}
                        </button>
                      )}
                    </div>

                    {filteredItems.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {filteredItems.map((f, idx) => (
                          <motion.button
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={f.id}
                            onClick={() => {
                              navigate(f.path);
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-3xl hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 transition-all text-left group"
                          >
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                              {f.icon}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{f.name}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                <Globe size={10} />
                                {f.path.replace('/', '') || 'home'}
                              </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                              <ChevronRight size={16} />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                          <Search size={40} className="text-slate-200" />
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 border-2 border-emerald-100 rounded-full" 
                          />
                        </div>
                        <h4 className="text-slate-800 font-bold text-lg mb-2">{isBn ? 'কিছু পাওয়া যায়নি' : 'No results found'}</h4>
                        <p className="text-sm text-slate-500 max-w-[200px] mx-auto">
                          {isBn ? 'আপনার সার্চ কিওয়ার্ডটি সঠিক কিনা তা যাচাই করুন' : 'We couldn\'t find anything matching your search. Try different keywords.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Date & Location */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-primary font-bold text-sm">
            <span>{hijriDate}</span>
            <ChevronRight size={14} />
          </div>
          <div className="text-gray-400 text-xs mt-1">
            {format(now, 'dd MMMM yyyy')} | {bengaliDate}
          </div>
        </div>
        <button 
          onClick={() => setShowLocationModal(true)}
          className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <MapPin size={14} />
          <span>{state.city === 'Dhaka' ? 'বাংলাদেশ' : state.city}</span>
        </button>
      </div>

      {/* Current Prayer Card */}
      <motion.div 
        onClick={() => navigate('/prayer-times')}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          "text-white p-5 rounded-3xl shadow-xl mb-3 relative overflow-hidden transition-all duration-500 cursor-pointer active:scale-[0.98]",
          isForbidden ? "bg-rose-500 shadow-rose-500/20" : "bg-primary shadow-primary/20 hover:shadow-primary/30"
        )}
      >
        <div className="relative z-10">
          <div className="text-sm opacity-90 mb-1">
            {isForbidden ? t('forbiddenTime') : t('currentPrayer')}
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold">
                {isForbidden ? currentForbiddenTime?.bnName : prayerData.current?.bnName}
              </h2>
            </div>
            <div className="text-xl font-medium">
              {isForbidden 
                ? `${format(currentForbiddenTime!.start, 'p')} - ${format(currentForbiddenTime!.end, 'p')}`
                : `${prayerData.current?.formattedTime} - ${prayerData.current?.endTime ? format(prayerData.current.endTime, 'p') : prayerData.next?.formattedTime}`
              }
            </div>
          </div>
          <div className="text-sm font-medium mb-4">
            {isForbidden 
              ? `সময় বাকি: ${formatCountdownBn(currentForbiddenTime!.end)}`
              : `সময় বাকি: ${prayerData.current?.endTime && formatCountdownBn(prayerData.current.endTime)}`
            }
          </div>
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${currentPrayerProgress}%` }}
              className="h-full bg-white rounded-full"
            ></motion.div>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-10">
          {isForbidden ? <Sun size={160} /> : <Moon size={160} />}
        </div>
      </motion.div>

      {/* Next Prayer Card */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="text-xs text-gray-400 mb-1">{t('nextPrayer')}</div>
          <div className="font-bold text-gray-800">{prayerData.next?.bnName}</div>
          <div className="text-sm text-gray-500 mt-2">{prayerData.next?.formattedTime}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-around">
          <div className="flex flex-col items-center">
            <Sun size={20} className="text-amber-500 mb-1" />
            <div className="text-[10px] text-gray-400">সূর্যোদয়</div>
            <div className="text-xs font-bold text-gray-700">{format(prayerData.sunrise, 'p')}</div>
          </div>
          <div className="w-px h-8 bg-gray-100"></div>
          <div className="flex flex-col items-center">
            <Moon size={20} className="text-indigo-500 mb-1" />
            <div className="text-[10px] text-gray-400">সূর্যাস্ত</div>
            <div className="text-xs font-bold text-gray-700">{format(prayerData.sunset, 'p')}</div>
          </div>
        </div>
      </div>

      {/* Sahri & Iftar Card */}
      <div 
        onClick={() => navigate('/sahri-iftar')}
        className="bg-slate-800 text-white p-5 rounded-[28px] mb-6 shadow-lg cursor-pointer active:scale-[0.98] transition-all relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <Sun size={16} className="text-amber-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium">{t('sahriEnds')}</div>
                <div className="text-sm font-bold">{format(countdownInfo.imsak, 'p')}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <Moon size={16} className="text-indigo-400" />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium">{t('iftar')}</div>
                <div className="text-sm font-bold">{format(countdownInfo.maghrib, 'p')}</div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 mb-2 font-medium">{countdownInfo.label}</div>
            <div className="text-2xl font-mono font-bold tracking-tighter text-white">
              {formatCountdown(countdownInfo.target)}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative z-10 w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
          />
        </div>
        
        {/* Background Decoration */}
        <div className="absolute -right-6 -top-6 opacity-5">
          <Moon size={120} />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-3 gap-y-5 gap-x-3 mb-6">
        {features.map((f) => (
          <button 
            key={f.id} 
            onClick={() => navigate(f.path)}
            className="flex flex-col items-center gap-2 group active:scale-95 transition-all"
          >
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-primary/5 group-hover:shadow-md transition-all">
              {f.icon}
            </div>
            <span className="text-[11px] font-medium text-gray-600 text-center leading-tight">
              {f.name}
            </span>
          </button>
        ))}
      </div>

      {/* Forbidden Times */}
      <div className="bg-rose-50 border border-rose-100 rounded-3xl p-5 mb-6">
        <h3 className="text-center text-rose-400 font-bold mb-4 text-sm uppercase tracking-wider">{t('todaysForbiddenTimes')}</h3>
        <div className="space-y-4">
          {forbiddenTimes.map((t, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{t.bnName}</span>
              <span className="font-bold text-gray-700">
                {format(t.start, 'p')} - {format(t.end, 'p')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-3 mb-6">
        <button className="w-full p-4 bg-white border border-blue-100 rounded-2xl flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-full text-white">
              <Facebook size={18} />
            </div>
            <div className="text-left">
              <div className="text-xs text-gray-500">{t('appUpdate')}</div>
              <div className="text-sm font-bold text-gray-700">{t('followUs')}</div>
            </div>
          </div>
          <div className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-bold">{t('follow')}</div>
        </button>

        <button className="w-full p-4 bg-white border border-teal-100 rounded-2xl flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500 p-2 rounded-full text-white">
              <Users size={18} />
            </div>
            <div className="text-left">
              <div className="text-xs text-gray-500">{t('opinion')}</div>
              <div className="text-sm font-bold text-gray-700">{t('joinGroup')}</div>
            </div>
          </div>
          <div className="bg-teal-500 text-white px-4 py-1.5 rounded-full text-xs font-bold">{t('join')}</div>
        </button>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-400 text-xs mb-8">
        App Version: 3.6.1
      </div>

      {/* Location Selection Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowLocationModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-800">{isBn ? 'লোকেশন নির্বাচন করুন' : 'Select Location'}</h3>
                <button 
                  onClick={() => setShowLocationModal(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto p-2">
                <button
                  onClick={handleCurrentLocation}
                  className="w-full flex items-center gap-3 p-3 hover:bg-teal-50 rounded-xl transition-colors text-left mb-2 border border-teal-100 bg-teal-50/30"
                >
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-teal-700">{isBn ? 'বর্তমান লোকেশন' : 'Current Location'}</div>
                    <div className="text-xs text-teal-600/80">{isBn ? 'জিপিএস ব্যবহার করে' : 'Using GPS'}</div>
                  </div>
                </button>
                
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2">
                  {isBn ? 'শহরসমূহ' : 'Cities'}
                </div>
                
                <div className="grid grid-cols-1 gap-1">
                  {districts.map(loc => (
                    <button
                      key={loc.id}
                      onClick={() => handleLocationSelect(loc)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                        <MapPin size={18} />
                      </div>
                      <div className="font-medium text-gray-700">
                        {isBn ? loc.name : loc.enName}
                      </div>
                      {state.city === loc.enName && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-teal-500"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Confirm Dialog */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={confirmDialog.onCancel}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-[320px] overflow-hidden shadow-2xl relative z-10 p-6 text-center"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">{confirmDialog.title}</h3>
              <p className="text-sm text-gray-600 mb-6">{confirmDialog.message}</p>
              <div className="flex gap-3">
                <button 
                  onClick={confirmDialog.onCancel}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  {isBn ? 'না' : 'No'}
                </button>
                <button 
                  onClick={confirmDialog.onConfirm}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-teal-500 hover:bg-teal-600 transition-colors"
                >
                  {isBn ? 'হ্যাঁ' : 'Yes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Alert Dialog */}
      <AnimatePresence>
        {alertDialog.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={alertDialog.onClose}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-[320px] overflow-hidden shadow-2xl relative z-10 p-6 text-center"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">{alertDialog.title}</h3>
              <p className="text-sm text-gray-600 mb-6">{alertDialog.message}</p>
              <button 
                onClick={alertDialog.onClose}
                className="w-full py-3 rounded-xl font-bold text-white bg-teal-500 hover:bg-teal-600 transition-colors"
              >
                {isBn ? 'ঠিক আছে' : 'OK'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
