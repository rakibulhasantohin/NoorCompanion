import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Search, ChevronRight, Star, ArrowLeft, BookOpen, Info } from 'lucide-react';
import { Card } from '../components/Common';
import { SURAHS_LIST } from '../data/surahs';

const SURAH_AYAH_DATA: Record<number, any[]> = {
  1: [
    { id: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', pronunciation: 'বিসমিল্লাহির রাহমানির রাহিম', translation: 'পরম করুণাময়, অতিশয় দয়ালু আল্লাহর নামে (শুরু করছি)।' },
    { id: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', pronunciation: 'আলহামদুলিল্লাহি রাব্বিল আলামিন', translation: 'যাবতীয় প্রশংসা আল্লাহর জন্য, যিনি সকল সৃষ্টির পালনকর্তা।' },
    { id: 3, arabic: 'الرَّحْمَنِ الرَّحِيمِ', pronunciation: 'আর-রাহমানির রাহিম', translation: 'যিনি পরম করুণাময় ও অতিশয় দয়ালু।' },
    { id: 4, arabic: 'مَالِكِ يَوْمِ الدِّিনِ', pronunciation: 'মালিকি ইয়াওমিদ্দীন', translation: 'যিনি বিচার দিবসের মালিক।' },
    { id: 5, arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', pronunciation: 'ইয়্যাকা না’বুদু ওয়া ইয়্যাকা নাস্তাঈন', translation: 'আমরা একমাত্র আপনারই ইবাদত করি এবং একমাত্র আপনারই সাহায্য চাই।' },
    { id: 6, arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', pronunciation: 'ইহদিনাস সিরাতাল মুস্তাকীম', translation: 'আমাদের সরল পথ দেখান।' },
    { id: 7, arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', pronunciation: 'সিরাতাল্লাযীনা আনআমতা আলাইহিম গাইরিল মাগদূবি আলাইহিম ওয়ালাদ্দাল্লীন', translation: 'তাদের পথ, যাদের আপনি নেয়ামত দান করেছেন। তাদের পথ নয় যারা আপনার গজবের শিকার এবং যারা পথভ্রষ্ট।' },
  ],
  112: [
    { id: 1, arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', pronunciation: 'কুল হুওয়াল্লাহু আহাদ', translation: 'বলুন, তিনি আল্লাহ, এক।' },
    { id: 2, arabic: 'اللَّهُ الصَّمَدُ', pronunciation: 'আল্লাহুস সামাদ', translation: 'আল্লাহ অমুখাপেক্ষী।' },
    { id: 3, arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', pronunciation: 'লাম ইয়ালিদ ওয়া লাম ইউলাদ', translation: 'তিনি কাউকে জন্ম দেননি এবং কেউ তাকে জন্ম দেয়নি।' },
    { id: 4, arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', pronunciation: 'ওয়া লাম ইয়াকুল্লাহু কুফুওয়ান আহাদ', translation: 'এবং তার সমতুল্য কেউ নেই।' },
  ],
  113: [
    { id: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', pronunciation: 'কুল আউযু বিরাব্বিল ফালাক', translation: 'বলুন, আমি আশ্রয় গ্রহণ করছি প্রভাতের পালনকর্তার।' },
    { id: 2, arabic: 'مِن شَرِّ مَا خَلَقَ', pronunciation: 'মিন শাররি মা খালাক', translation: 'তিনি যা সৃষ্টি করেছেন, তার অনিষ্ট থেকে।' },
    { id: 3, arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', pronunciation: 'ওয়া মিন শাররি গাসিকিন ইযা ওয়াকাব', translation: 'এবং অন্ধকার রাত্রির অনিষ্ট থেকে, যখন তা সমাগত হয়।' },
    { id: 4, arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', pronunciation: 'ওয়া মিন শাররিন নাফফাসাতি ফিল উকাদ', translation: 'এবং গ্রন্থিতে ফুঁৎকারদানকারিণীদের অনিষ্ট থেকে।' },
    { id: 5, arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', pronunciation: 'ওয়া মিন শাররি হাসিদিন ইযা হাসাদ', translation: 'এবং হিংসুকের অনিষ্ট থেকে যখন সে হিংসা করে।' },
  ],
  114: [
    { id: 1, arabic: 'قُل_ أَعُوذُ بِرَبِّ النَّاسِ', pronunciation: 'কুল আউযু বিরাব্বিন নাস', translation: 'বলুন, আমি আশ্রয় গ্রহণ করছি মানুষের পালনকর্তার।' },
    { id: 2, arabic: 'مَلِكِ النَّاسِ', pronunciation: 'মালিকিন নাস', translation: 'মানুষের অধিপতির।' },
    { id: 3, arabic: 'إِلَهِ النَّاسِ', pronunciation: 'ইলাহিন নাস', translation: 'মানুষের উপাস্যের।' },
    { id: 4, arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', pronunciation: 'মিন শাররিল ওয়াসওয়াসিল খাননাস', translation: 'প্ররোচনাকারীর অনিষ্ট থেকে, যে আত্মগোপন করে।' },
    { id: 5, arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', pronunciation: 'আল্লাযী ইউওয়াসউিসু ফী সুদূরিন নাস', translation: 'যে প্ররোচনা দেয় মানুষের অন্তরে।' },
    { id: 6, arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ', pronunciation: 'মিনাল জিন্নাতি ওয়ান নাস', translation: 'জিনের মধ্য থেকে অথবা মানুষের মধ্য থেকে।' },
  ]
};

export const Quran = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<typeof SURAHS_LIST[0] | null>(null);

  const filteredSurahs = SURAHS_LIST.filter(s => 
    s.nameBn.includes(searchQuery) || 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toString() === searchQuery
  );

  if (selectedSurah) {
    const ayahs = SURAH_AYAH_DATA[selectedSurah.id] || [];

    return (
      <div className="pb-24 px-4 pt-4 space-y-6">
        <button 
          onClick={() => setSelectedSurah(null)}
          className="flex items-center gap-2 text-emerald-600 font-bold mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>ফিরে যান</span>
        </button>

        <div className="bg-emerald-600 dark:bg-emerald-900 rounded-3xl p-8 text-white text-center space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <h2 className="text-3xl font-bold">{selectedSurah.nameAr}</h2>
          <h3 className="text-xl font-bold">{selectedSurah.nameBn}</h3>
          <div className="flex justify-center gap-4 text-xs text-emerald-100">
            <span>{selectedSurah.revelationType === 'Meccan' ? 'মাক্কী' : 'মাদানী'}</span>
            <span>•</span>
            <span>আয়াত: {selectedSurah.totalAyahs}</span>
          </div>
        </div>

        <div className="space-y-6">
          {ayahs.length > 0 ? (
            ayahs.map((ayah) => (
              <Card key={ayah.id} className="p-6 space-y-6 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-700 pb-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    {ayah.id}
                  </div>
                </div>
                <p className="text-right font-serif text-3xl text-gray-800 dark:text-gray-200 leading-loose" dir="rtl">
                  {ayah.arabic}
                </p>
                <div className="space-y-4">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4">
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-widest mb-1">উচ্চারণ</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {ayah.pronunciation}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-4">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">অনুবাদ</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                      {ayah.translation}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-3xl">
              <BookOpen className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">সূরা {selectedSurah.nameBn} এর আয়াতসমূহ লোড হচ্ছে...</p>
              <p className="text-[10px] text-gray-500 mt-2 px-8">
                আমরা ১১৪টি সূরার বিস্তারিত ডাটাবেজ যুক্ত করছি। শীঘ্রই সব আয়াত এখানে দেখতে পাবেন।
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 px-4 pt-4 space-y-6">
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">আল-কুরআন</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">১১৪টি সূরা অর্থসহ</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="সূরা খুঁজুন (নাম বা নম্বর)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredSurahs.map((surah) => (
          <motion.div
            key={surah.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedSurah(surah)}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                {surah.id}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{surah.nameBn}</h4>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                  {surah.name} • {surah.totalAyahs} আয়াত
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-serif text-emerald-900 dark:text-emerald-400">{surah.nameAr}</p>
              <p className="text-[10px] text-gray-400">{surah.meaningBn}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
