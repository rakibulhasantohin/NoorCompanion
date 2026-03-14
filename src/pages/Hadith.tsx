import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Book, Copy, Share2 } from 'lucide-react';
import { AppHeader } from '../components/Common';
import { cn } from '../utils/utils';
import { useTranslation } from '../hooks/useTranslation';

export const Hadith = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('bukhari');
  const [searchQuery, setSearchQuery] = useState('');

  const HADITH_COLLECTIONS = [
    { id: 'bukhari', name: t('bukhari'), count: '৭৫৬৩', color: 'bg-emerald-50 text-emerald-600' },
    { id: 'muslim', name: t('muslim'), count: '৭৪৫৩', color: 'bg-blue-50 text-blue-600' },
    { id: 'tirmidhi', name: t('tirmidhi'), count: '৩৯৫৬', color: 'bg-amber-50 text-amber-600' },
    { id: 'nasai', name: t('nasai'), count: '৫৭৫৮', color: 'bg-rose-50 text-rose-600' },
    { id: 'abu-dawud', name: t('abuDawud'), count: '৫২৭৪', color: 'bg-purple-50 text-purple-600' },
    { id: 'ibn-majah', name: t('ibnMajah'), count: '৪৩৪১', color: 'bg-indigo-50 text-indigo-600' },
  ];

  const MOCK_HADITHS = [
    {
      collection: 'bukhari',
      id: 1,
      title: 'নিয়ত সম্পর্কিত হাদিস',
      arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
      translation: 'নিশ্চয়ই সকল কাজ নিয়তের ওপর নির্ভরশীল। আর প্রত্যেক ব্যক্তি তাই পাবে যার সে নিয়ত করবে।',
      narrator: 'উমর ইবনুল খাত্তাব (রা.)',
      reference: 'সহিহ বুখারী, হাদিস নং ১',
    },
    {
      collection: 'bukhari',
      id: 2,
      title: 'কুরআন শিক্ষা',
      arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
      translation: 'তোমাদের মধ্যে সর্বোত্তম ব্যক্তি সেই যে নিজে কুরআন শিখে এবং অন্যকে শেখায়।',
      narrator: 'উসমান ইবনে আফফান (রা.)',
      reference: 'সহিহ বুখারী, হাদিস নং ৫০২৭',
    },
    {
      collection: 'muslim',
      id: 1,
      title: 'পবিত্রতা ঈমানের অঙ্গ',
      arabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ',
      translation: 'পবিত্রতা ঈমানের অর্ধেক।',
      narrator: 'আবু মালেক আল-আশআরী (রা.)',
      reference: 'সহিহ মুসলিম, হাদিস নং ২২৩',
    },
  ];

  const filteredHadiths = MOCK_HADITHS.filter(h => 
    h.collection === activeTab && 
    (h.title.includes(searchQuery) || h.translation.includes(searchQuery))
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader title={t('hadithSharif')} showBack />

      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchHadith')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Collections Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {HADITH_COLLECTIONS.map((col) => (
            <button
              key={col.id}
              onClick={() => setActiveTab(col.id)}
              className={cn(
                "flex flex-col items-start min-w-[120px] p-3 rounded-2xl border transition-all",
                activeTab === col.id 
                  ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' 
                  : 'bg-white border-gray-100 text-gray-600'
              )}
            >
              <span className="text-sm font-bold mb-1">{col.name}</span>
              <span className={`text-[10px] ${activeTab === col.id ? 'text-white/80' : 'text-gray-400'}`}>
                {col.count} {t('hadithCount')}
              </span>
            </button>
          ))}
        </div>

        {/* Hadith List */}
        <div className="space-y-4">
          {filteredHadiths.length > 0 ? (
            filteredHadiths.map((hadith, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <h3 className="font-bold text-primary text-sm">{hadith.title}</h3>
                  <div className="flex items-center gap-3 text-gray-300">
                    <button className="hover:text-primary transition-colors"><Copy size={16} /></button>
                    <button className="hover:text-primary transition-colors"><Share2 size={16} /></button>
                  </div>
                </div>
                <p className="text-right font-serif text-xl text-gray-800 leading-relaxed" dir="rtl">
                  {hadith.arabic}
                </p>
                <div className="space-y-2">
                  <div className="bg-gray-50 rounded-2xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">{t('translation')}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {hadith.translation}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">
                    <span>{t('narrator')}: {hadith.narrator}</span>
                    <span>{hadith.reference}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-400">
              <Book size={48} className="mx-auto mb-4 opacity-20" />
              <p>{t('noHadithFound')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
