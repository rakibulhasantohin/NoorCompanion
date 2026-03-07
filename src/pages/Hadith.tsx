import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { Card } from '../components/Common';

const HADITH_COLLECTIONS = [
  { id: 'bukhari', name: 'সহিহ বুখারী', count: '৭৫৬৩', color: 'bg-emerald-50 text-emerald-600' },
  { id: 'muslim', name: 'সহিহ মুসলিম', count: '৭৪৫৩', color: 'bg-blue-50 text-blue-600' },
  { id: 'tirmidhi', name: 'সুনানে তিরমিজী', count: '৩৯৫৬', color: 'bg-amber-50 text-amber-600' },
  { id: 'nasai', name: 'সুনানে নাসাঈ', count: '৫৭৫৮', color: 'bg-rose-50 text-rose-600' },
  { id: 'abu-dawud', name: 'সুনানে আবু দাউদ', count: '৫২৭৪', color: 'bg-purple-50 text-purple-600' },
  { id: 'ibn-majah', name: 'সুনানে ইবনে মাজাহ', count: '৪৩৪১', color: 'bg-indigo-50 text-indigo-600' },
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
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّমَ الْقُرْآنَ وَعَلَّমَهُ',
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
  {
    collection: 'muslim',
    id: 2,
    title: 'ইসলামের স্তম্ভ',
    arabic: 'بُنِيَ الإِسْلَامُ عَلَى خَمْسٍ',
    translation: 'ইসলামের ভিত্তি পাঁচটি স্তম্ভের ওপর।',
    narrator: 'আবদুল্লাহ ইবনে উমর (রা.)',
    reference: 'সহিহ মুসলিম, হাদিস নং ১৬',
  },
  {
    collection: 'tirmidhi',
    id: 1,
    title: 'উত্তম চরিত্র',
    arabic: 'أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا',
    translation: 'মুমিনদের মধ্যে পূর্ণ ঈমানদার সেই ব্যক্তি, যার চরিত্র সবচেয়ে সুন্দর।',
    narrator: 'আবু হুরায়রা (রা.)',
    reference: 'সুনানে তিরমিজী, হাদিস নং ১১৬২',
  },
  {
    collection: 'nasai',
    id: 1,
    title: 'সালাত বা নামাজ',
    arabic: 'أَوَّلُ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْমَ الْقِيَامَةِ الصَّلَاةُ',
    translation: 'কিয়ামতের দিন বান্দার আমলসমূহের মধ্যে সর্বপ্রথম নামাজের হিসাব নেওয়া হবে।',
    narrator: 'আবু হুরায়রা (রা.)',
    reference: 'সুনানে নাসাঈ, হাদিস নং ৪৬৩',
  },
  {
    collection: 'abu-dawud',
    id: 1,
    title: 'দোয়া ইবাদত',
    arabic: 'الدُّعَاءُ هُوَ الْعِبَادَةُ',
    translation: 'দোয়া-ই হলো ইবাদত।',
    narrator: 'নুমান ইবনে বশীর (রা.)',
    reference: 'সুনানে আবু দাউদ, হাদিস নং ১৪৭৯',
  },
  {
    collection: 'ibn-majah',
    id: 1,
    title: 'জ্ঞান অর্জন',
    arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
    translation: 'জ্ঞান অর্জন করা প্রত্যেক মুসলিমের জন্য ফরজ।',
    narrator: 'আনাস ইবনে মালিক (রা.)',
    reference: 'সুনানে ইবনে মাজাহ, হাদিস নং ২২৪',
  },
];

export const Hadith = () => {
  const [activeTab, setActiveTab] = useState('bukhari');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHadiths = MOCK_HADITHS.filter(h => 
    h.collection === activeTab && 
    (h.title.includes(searchQuery) || h.translation.includes(searchQuery))
  );

  return (
    <div className="pb-24 px-4 pt-4 space-y-6">
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">হাদিস শরীফ</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">সহিহ হাদিসের সংকলন</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="হাদিস খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
        />
      </div>

      {/* Collections Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {HADITH_COLLECTIONS.map((col) => (
          <button
            key={col.id}
            onClick={() => setActiveTab(col.id)}
            className={`flex flex-col items-start min-w-[140px] p-4 rounded-2xl border transition-all ${
              activeTab === col.id 
                ? 'bg-emerald-900 border-emerald-900 text-white shadow-lg' 
                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            <span className="text-sm font-bold mb-1">{col.name}</span>
            <span className={`text-[10px] ${activeTab === col.id ? 'text-emerald-200' : 'text-gray-400 dark:text-gray-500'}`}>
              {col.count} টি হাদিস
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
            >
              <Card className="p-6 space-y-4 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-700 pb-3">
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-400">{hadith.title}</h3>
                  <div className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-lg">
                    {hadith.narrator}
                  </div>
                </div>
                <p className="text-right font-serif text-xl text-gray-800 dark:text-gray-200 leading-loose" dir="rtl">
                  {hadith.arabic}
                </p>
                <div className="space-y-3">
                  <div className="bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-4">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest mb-1">অনুবাদ</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {hadith.translation}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">
                    <span>বর্ণনায়: {hadith.narrator}</span>
                    <span>{hadith.reference}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">এই ক্যাটাগরিতে কোনো হাদিস পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  );
};
