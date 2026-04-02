import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, Search, Moon, Sun, Utensils, AlertTriangle, 
  Plane, Star, Droplet, Copy, Share2
} from 'lucide-react';
import { AppHeader } from '../components/Common';
import { cn } from '../utils/utils';
import { useTranslation } from '../hooks/useTranslation';

export const Duas = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const DUA_CATEGORIES = [
    { id: 'purity', name: t('purity'), icon: Droplet, color: 'text-blue-600 bg-blue-50' },
    { id: 'prayer', name: t('prayer'), icon: Star, color: 'text-purple-600 bg-purple-50' },
    { id: 'morning-evening', name: t('morningEvening'), icon: Sun, color: 'text-amber-600 bg-amber-50' },
    { id: 'sleep', name: t('sleep'), icon: Moon, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'food', name: t('food'), icon: Utensils, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'travel', name: t('travel'), icon: Plane, color: 'text-cyan-600 bg-cyan-50' },
    { id: 'danger', name: t('danger'), icon: AlertTriangle, color: 'text-rose-600 bg-rose-50' },
    { id: 'sickness', name: t('sickness'), icon: Heart, color: 'text-pink-600 bg-pink-50' },
  ];

  const DUA_ITEMS = [
    {
      category: 'daily',
      title: t('ayatulKursi'),
      arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْমٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَমَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
      pronunciation: t('ayatulKursiPronunciation'),
      translation: t('ayatulKursiTranslation'),
    },
    {
      category: 'prayer',
      title: t('duroodIbrahim'),
      arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِّ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِّ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ মَجِيدٌ اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِّ مُحَمَّদٍ كَمَا بَارَكْتَ عَلَى إِبْرَাহِيمَ وَعَلَى آلِّ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ মَجِيدٌ',
      pronunciation: t('duroodIbrahimPronunciation'),
      translation: t('duroodIbrahimTranslation'),
    },
    {
      category: 'food',
      title: t('beforeEating'),
      arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
      pronunciation: t('beforeEatingPronunciation'),
      translation: t('beforeEatingTranslation'),
    },
    {
      category: 'food',
      title: t('afterEating'),
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
      pronunciation: t('afterEatingPronunciation'),
      translation: t('afterEatingTranslation'),
    },
    {
      category: 'sleep',
      title: t('beforeSleeping'),
      arabic: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا',
      pronunciation: t('beforeSleepingPronunciation'),
      translation: t('beforeSleepingTranslation'),
    },
    {
      category: 'danger',
      title: t('duaYunus'),
      arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
      pronunciation: t('duaYunusPronunciation'),
      translation: t('duaYunusTranslation'),
    },
  ];

  const filteredDuas = DUA_ITEMS.filter(item => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (selectedCategory) {
    const category = DUA_CATEGORIES.find(c => c.id === selectedCategory);
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <AppHeader title={category?.name || t('duasAndZikir')} showBack />

        <div className="px-4 py-4 space-y-4">
          {filteredDuas.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <h3 className="font-bold text-primary">{item.title}</h3>
                <div className="flex items-center gap-3 text-gray-300">
                  <button className="hover:text-primary transition-colors"><Copy size={18} /></button>
                  <button className="hover:text-primary transition-colors"><Share2 size={18} /></button>
                </div>
              </div>
              <p className="text-right font-serif text-2xl text-gray-800 leading-relaxed" dir="rtl">
                {item.arabic}
              </p>
              <div className="space-y-3">
                <div className="bg-primary/5 rounded-2xl p-3">
                  <p className="text-[10px] text-primary uppercase font-bold tracking-widest mb-1">{t('pronunciation')}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {item.pronunciation}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{t('translation')}</p>
                  <p className="text-sm text-gray-700 leading-relaxed italic">
                    {item.translation}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader title={t('duasAndZikir')} showBack />

      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchDua')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-3">
          {DUA_CATEGORIES.map((cat) => (
            <motion.div
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.id)}
              className="bg-white rounded-3xl p-4 border border-gray-100 flex flex-col items-center gap-3 shadow-sm cursor-pointer hover:shadow-md transition-all"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm", cat.color)}>
                <cat.icon className="w-7 h-7" />
              </div>
              <span className="font-bold text-gray-800 text-center">
                {cat.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
