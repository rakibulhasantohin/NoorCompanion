import React from 'react';
import { motion } from 'motion/react';
import { Star, ChevronRight, BookOpen } from 'lucide-react';
import { Card, SectionTitle } from '../components/Common';
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
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِّ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِّ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِّ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِّ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    translation: 'হে আল্লাহ! মুহাম্মদ (সা.) ও তাঁর বংশধরদের ওপর রহমত বর্ষণ করুন, যেমন আপনি ইব্রাহিম (আ.) ও তাঁর বংশধরদের ওপর রহমত বর্ষণ করেছিলেন। নিশ্চয়ই আপনি অতি প্রশংসিত ও মহিমান্বিত। হে আল্লাহ! মুহাম্মদ (সা.) ও তাঁর বংশধরদের ওপর বরকত বর্ষণ করুন, যেমন আপনি ইব্রাহিম (আ.) ও তাঁর বংশধরদের ওপর বরকত বর্ষণ করেছিলেন। নিশ্চয়ই আপনি অতি প্রশংসিত ও মহিমান্বিত।',
  },
  {
    id: 3,
    title: 'দোয়া মাসুরা',
    arabic: 'اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ',
    translation: 'হে আল্লাহ! আমি আমার নিজের ওপর অনেক জুলুম করেছি। আর আপনি ছাড়া গুনাহ মাফ করার আর কেউ নেই। অতএব আপনি আপনার পক্ষ থেকে আমাকে ক্ষমা করুন এবং আমার ওপর দয়া করুন। নিশ্চয়ই আপনি ক্ষমাশীল ও দয়ালু।',
  },
  {
    id: 4,
    title: 'দোয়া কুনুত',
    arabic: 'اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ وَنَشْكُرُكَ وَلَا نَكْفُرُكَ وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ اللَّهُمَّ إِيَّاكَ نَعْبُدُ وَلَكَ نُصَلِّي وَنَسْجُدُ وَإِلَيْكَ نَسْعَى وَنَحْفِدُ وَنَرْجُو رَحْمَتَكَ وَنَخْشَى عَذَابَكَ إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحِقٌ',
    translation: 'হে আল্লাহ! আমরা আপনারই সাহায্য চাই, আপনারই নিকট ক্ষমা চাই, আপনারই ওপর ঈমান রাখি, আপনারই ওপর ভরসা করি এবং আপনারই উত্তম প্রশংসা করি। আমরা আপনার শোকর আদায় করি, আপনার না-শোকরি করি না। যারা আপনার নাফরমানি করে, আমরা তাদের সাথে সম্পর্ক ছিন্ন করি ও তাদের পরিত্যাগ করি। হে আল্লাহ! আমরা আপনারই ইবাদত করি, আপনারই জন্য নামাজ পড়ি ও সেজদা করি। আপনারই দিকে আমরা ধাবিত হই এবং আপনারই খিদমতে উপস্থিত হই। আমরা আপনার রহমতের আশা করি এবং আপনার আজাবকে ভয় করি। নিশ্চয়ই আপনার আজাব কাফেরদের গ্রাস করবে।',
  },
];

export const Surahs = () => {
  return (
    <div className="pb-24 px-4 pt-4 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">গুরুত্বপূর্ণ সূরা ও পাঠ</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">নামাজের প্রয়োজনীয় দোয়া ও সূরাসমূহ</p>
      </div>

      <div className="space-y-4">
        {SURAH_ITEMS.map((item) => (
          <Card key={item.id} className="p-6 space-y-4 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-700 pb-3">
              <h3 className="font-bold text-emerald-900 dark:text-emerald-400">{item.title}</h3>
              <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                {item.id}
              </div>
            </div>
            <p className="text-right font-serif text-xl text-gray-800 dark:text-gray-200 leading-loose" dir="rtl">
              {item.arabic}
            </p>
            <div className="bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-4">
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest mb-2">অনুবাদ</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                {item.translation}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="pt-4">
        <Link to="/quran">
          <Card className="bg-emerald-900 dark:bg-emerald-950 text-white flex items-center justify-between p-4 border-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 dark:bg-emerald-900 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">পূর্ণাঙ্গ কুরআন</h4>
                <p className="text-[10px] text-emerald-200 dark:text-emerald-400">১১৪টি সূরা পড়ুন</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </Card>
        </Link>
      </div>
    </div>
  );
};
