import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Search, Moon, Sun, Utensils, AlertTriangle, 
  Plane, Star, Droplet, ChevronRight, ArrowLeft, Copy, Share2
} from 'lucide-react';
import { Card, AppHeader } from '../components/Common';
import { cn } from '../utils/utils';

const DUA_CATEGORIES = [
  { id: 'purity', name: 'পবিত্রতা', icon: Droplet, color: 'text-blue-600 bg-blue-50' },
  { id: 'prayer', name: 'নামাজ', icon: Star, color: 'text-purple-600 bg-purple-50' },
  { id: 'morning-evening', name: 'সকাল-সন্ধ্যা', icon: Sun, color: 'text-amber-600 bg-amber-50' },
  { id: 'sleep', name: 'ঘুম', icon: Moon, color: 'text-indigo-600 bg-indigo-50' },
  { id: 'food', name: 'খাবার', icon: Utensils, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'travel', name: 'ভ্রমণ', icon: Plane, color: 'text-cyan-600 bg-cyan-50' },
  { id: 'danger', name: 'বিপদ-আপদ', icon: AlertTriangle, color: 'text-rose-600 bg-rose-50' },
  { id: 'sickness', name: 'অসুখ-বিসুখ', icon: Heart, color: 'text-pink-600 bg-pink-50' },
];

const DUA_ITEMS = [
  {
    category: 'daily',
    title: 'আয়াতুল কুরসি',
    arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْমٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَমَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    pronunciation: 'আল্লাহু লা ইলাহা ইল্লা হুয়াল হাইয়্যুল কাইয়্যুম। লা তা’খুযুহু সিনাতুও ওয়ালা নাউম। লাহূ মা ফিসসামাওয়াতি ওয়ামা ফিল আরয। মান যাল্লাযী ইয়াশফাউ ইনদাহূ ইল্লা বিইযনিহ। ইয়া’লামু মা বাইনা আইদীহিম ওয়ামা খালফাহুম, ওয়ালা ইউহীতূনা বিশাইয়িম মিন ইলমিহী ইল্লা বিমা শা-আ। ওয়াসিআ কুরসিইয়ুহুস সামাওয়াতি ওয়াল আরয, ওয়ালা ইয়াউদুহূ হিফযুহুমা ওয়াহুয়াল আলিয়্যুল আযীম।',
    translation: 'আল্লাহ ছাড়া অন্য কোনো উপাস্য নেই, তিনি চিরঞ্জীব, সবকিছুর ধারক। তাঁকে তন্দ্রা ও নিদ্রা স্পর্শ করে না। আকাশ ও পৃথিবীতে যা কিছু আছে সবই তাঁর। কে আছে এমন, যে তাঁর অনুমতি ছাড়া তাঁর কাছে সুপারিশ করবে? তাদের সামনে ও পেছনে যা কিছু আছে সবই তিনি জানেন। তাঁর জ্ঞানরাজি থেকে তারা কিছুই আয়ত্ত করতে পারে না, কেবল যতটুকু তিনি চান তা ছাড়া। তাঁর কুরসি আকাশ ও পৃথিবীময় পরিব্যাপ্ত। আর এ দুটির রক্ষণাবেক্ষণ তাঁকে ক্লান্ত করে না। তিনি অতি উচ্চ ও মহান।',
  },
  {
    category: 'prayer',
    title: 'দুরুদে ইব্রাহিম',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِّ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِّ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ মَجِيدٌ اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِّ مُحَمَّদٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِّ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ মَجِيدٌ',
    pronunciation: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মাদিও ওয়া আলা আলি মুহাম্মাদ, কামা সাল্লাইতা আলা ইব্রাহিমা ওয়া আলা আলি ইব্রাহিমা ইন্নাকা হামীদুম মাজীদ। আল্লাহুম্মা বারিক আলা মুহাম্মাদিও ওয়া আলা আলি মুহাম্মাদ, কামা বারাকতা আলা ইব্রাহিমা ওয়া আলা আলি ইব্রাহিমা ইন্নাকা হামীদুম মাজীদ।',
    translation: 'হে আল্লাহ! মুহাম্মদ (সা.) ও তাঁর বংশধরদের ওপর রহমত বর্ষণ করুন, যেমন আপনি ইব্রাহিম (আ.) ও তাঁর বংশধরদের ওপর রহমত বর্ষণ করেছিলেন। নিশ্চয়ই আপনি অতি প্রশংসিত ও মহিমান্বিত। হে আল্লাহ! মুহাম্মদ (সা.) ও তাঁর বংশধরদের ওপর বরকত বর্ষণ করুন, যেমন আপনি ইব্রাহিম (আ.) ও তাঁর বংশধরদের ওপর বরকত বর্ষণ করেছিলেন। নিশ্চয়ই আপনি অতি প্রশংসিত ও মহিমান্বিত।',
  },
  {
    category: 'food',
    title: 'খাওয়ার আগের দোয়া',
    arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
    pronunciation: 'বিসমিল্লাহি ওয়া আলা বারাকাতিল্লাহ।',
    translation: 'আল্লাহর নামে এবং আল্লাহর বরকতের ওপর (খাওয়া শুরু করছি)।',
  },
  {
    category: 'food',
    title: 'খাওয়ার পরের দোয়া',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    pronunciation: 'আলহামদুলিল্লাহিল্লাযী আতআমানা ওয়া সাকানা ওয়া জাআলানা মুসলিমীন।',
    translation: 'সকল প্রশংসা আল্লাহর জন্য, যিনি আমাদের খাইয়েছেন, পান করিয়েছেন এবং মুসলমান বানিয়েছেন।',
  },
  {
    category: 'sleep',
    title: 'ঘুমানোর আগের দোয়া',
    arabic: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا',
    pronunciation: 'আল্লাহুম্মা বিসমিকা আমূতু ওয়া আহইয়া।',
    translation: 'হে আল্লাহ! আপনারই নামে আমি মৃত্যুবরণ করছি (ঘুমাচ্ছি) এবং আপনারই নামে জীবিত হব (জাগব)।',
  },
  {
    category: 'danger',
    title: 'বিপদ মুক্তির দোয়া (ইউনুস আ.)',
    arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    pronunciation: 'লা ইলাহা ইল্লা আনতা সুবহানাকা ইন্নী কুনতু মিনায যালিমীন।',
    translation: 'আপনি ছাড়া কোনো উপাস্য নেই, আপনি পবিত্র। নিশ্চয়ই আমি জালেমদের অন্তর্ভুক্ত ছিলাম।',
  },
];

export const Duas = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDuas = DUA_ITEMS.filter(item => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (selectedCategory) {
    const category = DUA_CATEGORIES.find(c => c.id === selectedCategory);
    return (
      <div className="min-h-screen bg-gray-50 pb-32">
        <AppHeader title={category?.name || 'দোয়া'} showBack />

        <div className="px-4 py-6 space-y-6">
          {filteredDuas.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <h3 className="font-bold text-primary">{item.title}</h3>
                <div className="flex items-center gap-3 text-gray-300">
                  <button className="hover:text-primary transition-colors"><Copy size={18} /></button>
                  <button className="hover:text-primary transition-colors"><Share2 size={18} /></button>
                </div>
              </div>
              <p className="text-right font-serif text-2xl text-gray-800 leading-loose" dir="rtl">
                {item.arabic}
              </p>
              <div className="space-y-3">
                <div className="bg-primary/5 rounded-2xl p-4">
                  <p className="text-[10px] text-primary uppercase font-bold tracking-widest mb-1">উচ্চারণ</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {item.pronunciation}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">অনুবাদ</p>
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
    <div className="min-h-screen bg-gray-50 pb-32">
      <AppHeader title="দোয়া ও জিকির" showBack />

      <div className="px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="দোয়া খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4">
          {DUA_CATEGORIES.map((cat) => (
            <motion.div
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.id)}
              className="bg-white rounded-3xl p-6 border border-gray-100 flex flex-col items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all"
            >
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm", cat.color)}>
                <cat.icon className="w-8 h-8" />
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
