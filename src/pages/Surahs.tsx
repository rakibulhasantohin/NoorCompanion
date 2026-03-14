import React from 'react';
import { motion } from 'motion/react';
import { Star, ChevronRight, BookOpen } from 'lucide-react';
import { Card, AppHeader } from '../components/Common';
import { Link } from 'react-router-dom';

const SURAH_ITEMS = [
  {
    id: 1,
    title: 'আত্তাহিয়্যাতু (তাশাহহুদ)',
    arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    translation: 'সকল সম্মান, সকল ইবাদত এবং সকল পবিত্রতা আল্লাহর জন্য। হে নবী! আপনার প্রতি শান্তি, আল্লাহর রহমত ও তাঁর বরকত বর্ষিত হোক। আমাদের প্রতি এবং আল্লাহর নেক বান্দাদের প্রতি শান্তি বর্ষিত হোক। আমি সাক্ষ্য দিচ্ছি যে, আল্লাহ ছাড়া কোনো উপাস্য নেই এবং আমি আরও সাক্ষ্য দিচ্ছি যে, মুহাম্মদ (সা.) আল্লাহর বান্দা ও রাসূল।',
  },
  {
    id: 2,
    title: 'দুরুদে ইব্রাহিম',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِّ مُحَمَّদٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِّ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ اللَّهُمَّ بَارِكْ عَلَى مُحَمَّদٍ وَعَلَى آلِّ مُحَمَّদٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِّ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    translation: 'হে আল্লাহ! মুহাম্মদ (সা.) ও তাঁর বংশধরদের ওপর রহমত বর্ষণ করুন, যেমন আপনি ইব্রাহিম (আ.) ও তাঁর বংশধরদের ওপর রহমত বর্ষণ করেছিলেন। নিশ্চয়ই আপনি অতি প্রশংসিত ও মহিমান্বিত। হে আল্লাহ! মুহাম্মদ (সা.) ও তাঁর বংশধরদের ওপর বরকত বর্ষণ করুন, যেমন আপনি ইব্রাহিম (আ.) ও তাঁর বংশধরদের ওপর বরকত বর্ষণ করেছিলেন। নিশ্চয়ই আপনি অতি প্রশংসিত ও মহিমান্বিত।',
  },
];

export const Surahs = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader title="গুরুত্বপূর্ণ দোয়া ও সূরা" showBack />

      <div className="px-4 py-4 space-y-4">
        <div className="space-y-3">
          {SURAH_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <h3 className="font-bold text-primary text-sm">{item.title}</h3>
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                  {item.id}
                </div>
              </div>
              <p className="text-right font-serif text-xl text-gray-800 leading-relaxed" dir="rtl">
                {item.arabic}
              </p>
              <div className="bg-gray-50 rounded-2xl p-3">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">অনুবাদ</p>
                <p className="text-sm text-gray-700 leading-relaxed italic">
                  {item.translation}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <Link to="/quran">
          <div className="bg-primary rounded-3xl p-4 text-white flex items-center justify-between shadow-md shadow-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">পূর্ণাঙ্গ কুরআন</h4>
                <p className="text-[10px] text-white/70">১১৪টি সূরা পড়ুন</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </div>
        </Link>
      </div>
    </div>
  );
};
