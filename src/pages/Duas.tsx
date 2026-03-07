import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Search, Moon, Sun, Utensils, AlertTriangle, LogOut, Plane, BookOpen, Star } from 'lucide-react';
import { Card } from '../components/Common';

const DUA_CATEGORIES = [
  { id: 'daily', name: 'দৈনন্দিন', icon: Sun, color: 'text-amber-600 bg-amber-50' },
  { id: 'food', name: 'খাবার', icon: Utensils, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'sleep', name: 'ঘুম', icon: Moon, color: 'text-indigo-600 bg-indigo-50' },
  { id: 'danger', name: 'বিপদ', icon: AlertTriangle, color: 'text-rose-600 bg-rose-50' },
  { id: 'travel', name: 'ভ্রমণ', icon: Plane, color: 'text-blue-600 bg-blue-50' },
  { id: 'prayer', name: 'নামাজ', icon: Star, color: 'text-purple-600 bg-purple-50' },
];

const DUA_ITEMS = [
  {
    category: 'daily',
    title: 'আয়াতুল কুরসি',
    arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّমَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    pronunciation: 'আল্লাহু লা ইলাহা ইল্লা হুয়াল হাইয়্যুল কাইয়্যুম। লা তা’খুযুহু সিনাতুও ওয়ালা নাউম। লাহূ মা ফিসসামাওয়াতি ওয়ামা ফিল আরয। মান যাল্লাযী ইয়াশফাউ ইনদাহূ ইল্লা বিইযনিহ। ইয়া’লামু মা বাইনা আইদীহিম ওয়ামা খালফাহুম, ওয়ালা ইউহীতূনা বিশাইয়িম মিন ইলমিহী ইল্লা বিমা শা-আ। ওয়াসিআ কুরসিইয়ুহুস সামাওয়াতি ওয়াল আরয, ওয়ালা ইয়াউদুহূ হিফযুহুমা ওয়াহুয়াল আলিয়্যুল আযীম।',
    translation: 'আল্লাহ ছাড়া অন্য কোনো উপাস্য নেই, তিনি চিরঞ্জীব, সবকিছুর ধারক। তাঁকে তন্দ্রা ও নিদ্রা স্পর্শ করে না। আকাশ ও পৃথিবীতে যা কিছু আছে সবই তাঁর। কে আছে এমন, যে তাঁর অনুমতি ছাড়া তাঁর কাছে সুপারিশ করবে? তাদের সামনে ও পেছনে যা কিছু আছে সবই তিনি জানেন। তাঁর জ্ঞানরাজি থেকে তারা কিছুই আয়ত্ত করতে পারে না, কেবল যতটুকু তিনি চান তা ছাড়া। তাঁর কুরসি আকাশ ও পৃথিবীময় পরিব্যাপ্ত। আর এ দুটির রক্ষণাবেক্ষণ তাঁকে ক্লান্ত করে না। তিনি অতি উচ্চ ও মহান।',
  },
  {
    category: 'prayer',
    title: 'দুরুদে ইব্রাহিম',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِّ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِّ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ اللَّهُمَّ بَارِكْ عَلَى مُحَمَّদٍ وَعَلَى آلِّ مُحَمَّদٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِّ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    pronunciation: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মাদিও ওয়া আলা আলি মুহাম্মাদ, কামা সাল্লাইতা আলা ইব্রাহিমা ওয়া আলা আলি ইব্রাহিমা ইন্নাকা হামীদুম মাজীদ। আল্লাহুম্মা বারিক আলা মুহাম্মাদিও ওয়া আলা আলি মুহাম্মাদ, কামা বারাকতা আলা ইব্রাহিমা ওয়া আলা আলি ইব্রাহিমা ইন্নাকা হামীদুম মাজীদ।',
    translation: 'হে আল্লাহ! মুহাম্মদ (সা.) ও তাঁর বংশধরদের ওপর রহমত বর্ষণ করুন, যেমন আপনি ইব্রাহিম (আ.) ও তাঁর বংশধরদের ওপর রহমত বর্ষণ করেছিলেন। নিশ্চয়ই আপনি অতি প্রশংসিত ও মহিমান্বিত। হে আল্লাহ! মুহাম্মদ (সা.) ও তাঁর বংশধরদের ওপর বরকত বর্ষণ করুন, যেমন আপনি ইব্রাহিম (আ.) ও তাঁর বংশধরদের ওপর বরকত বর্ষণ করেছিলেন। নিশ্চয়ই আপনি অতি প্রশংসিত ও মহিমান্বিত।',
  },
  {
    category: 'prayer',
    title: 'দোয়া কুনুত',
    arabic: 'اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ وَنَشْكُرُكَ وَلَا نَكْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ وَإِلَيْكَ نَسْعَى وَنَحْفِدُ وَنَرْجُو رَحْمَتَكَ وَنَخْشَى عَذَابَكَ إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحِقٌ',
    pronunciation: 'আল্লাহুম্মা ইন্না নাস্তাঈনুকা ওয়া নাস্তাগফিরুকা ওয়া নু’মিনু বিকা ওয়া নাতাওয়াককালু আলাইকা ওয়া নুছনী আলাইকাল খাইরা ওয়া নাশকুরুকা ওয়ালা নাকফুরুকা ওয়া নাখলাউ ওয়া নাতরুকু মাই ইয়াফজুরুকা। আল্লাহুম্মা ইয়্যাকা না’বুদু ওয়ালাকা নুসল্লী ওয়া নাসজুদু ওয়া ইলাইকা নাসআ ওয়া নাহফিদু ওয়া নারজু রাহমাতাকা ওয়া নাখশা আযাবাকা ইন্না আযাবাকা বিল কুফফারি মুলহিক।',
    translation: 'হে আল্লাহ! আমরা আপনারই সাহায্য চাই, আপনারই নিকট ক্ষমা চাই, আপনারই ওপর ঈমান রাখি, আপনারই ওপর ভরসা করি এবং আপনারই উত্তম প্রশংসা করি। আমরা আপনার শোকর আদায় করি, আপনার না-শোকরি করি না। যারা আপনার নাফরমানি করে, আমরা তাদের সাথে সম্পর্ক ছিন্ন করি ও তাদের পরিত্যাগ করি। হে আল্লাহ! আমরা আপনারই ইবাদত করি, আপনারই জন্য নামাজ পড়ি ও সেজদা করি। আপনারই দিকে আমরা ধাবিত হই এবং আপনারই খিদমতে উপস্থিত হই। আমরা আপনার রহমতের আশা করি এবং আপনার আজাবকে ভয় করি। নিশ্চয়ই আপনার আজাব কাফেরদের গ্রাস করবে।',
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
    category: 'sleep',
    title: 'ঘুম থেকে ওঠার দোয়া',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    pronunciation: 'আলহামদুলিল্লাহিল্লাযী আহইয়ানা বা’দা মা আমাতানা ওয়া ইলাইহিন নুশূর।',
    translation: 'সকল প্রশংসা আল্লাহর জন্য, যিনি আমাদের মৃত্যুর (ঘুমের) পর পুনরায় জীবিত করলেন এবং তাঁরই দিকে আমাদের ফিরে যেতে হবে।',
  },
  {
    category: 'danger',
    title: 'বিপদ মুক্তির দোয়া (ইউনুস আ.)',
    arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    pronunciation: 'লা ইলাহা ইল্লা আনতা সুবহানাকা ইন্নী কুনতু মিনায যালিমীন।',
    translation: 'আপনি ছাড়া কোনো উপাস্য নেই, আপনি পবিত্র। নিশ্চয়ই আমি জালেমদের অন্তর্ভুক্ত ছিলাম।',
  },
  {
    category: 'daily',
    title: 'ঘর থেকে বের হওয়ার দোয়া',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    pronunciation: 'বিসমিল্লাহি তাওয়াককালতু আলাল্লাহি লা হাওলা ওয়ালা কুওয়াতা ইল্লা বিল্লাহ।',
    translation: 'আল্লাহর নামে (বের হচ্ছি), আল্লাহর ওপরই ভরসা করলাম। আল্লাহর সাহায্য ছাড়া গুনাহ থেকে বাঁচার এবং নেক কাজ করার কোনো শক্তি নেই।',
  },
];

export const Duas = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDuas = DUA_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-24 px-4 pt-4 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">প্রয়োজনীয় দোয়া</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">আরবি, উচ্চারণ ও অর্থসহ সংকলন</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="দোয়া খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'all' ? 'bg-emerald-900 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-100 dark:border-gray-700'
          }`}
        >
          সবগুলো
        </button>
        {DUA_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id ? 'bg-emerald-900 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-100 dark:border-gray-700'
            }`}
          >
            <cat.icon className={`w-4 h-4 ${selectedCategory === cat.id ? 'text-white' : cat.color.split(' ')[0]}`} />
            {cat.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredDuas.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-6 space-y-4 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="font-bold text-emerald-900 dark:text-emerald-400 border-b border-gray-50 dark:border-gray-700 pb-3">{item.title}</h3>
              <p className="text-right font-serif text-2xl text-gray-800 dark:text-gray-200 leading-loose" dir="rtl">
                {item.arabic}
              </p>
              <div className="space-y-3">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4">
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-widest mb-1">উচ্চারণ</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item.pronunciation}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-4">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">অনুবাদ</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    {item.translation}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
