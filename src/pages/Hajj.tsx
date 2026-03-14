import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Book, Compass, Heart, 
  Building2, Plane, Map as MapIcon, Info, ChevronLeft,
  CheckCircle2, AlertCircle, Clock, MapPin, Moon
} from 'lucide-react';
import { AppHeader } from '../components/Common';
import { cn } from '../utils/utils';
import { useAppState } from '../hooks/useAppState';

export const Hajj = () => {
  const { state } = useAppState();
  const isBn = state.language === 'bn';
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const HAJJ_CONTENT = {
    prep: {
      title: isBn ? 'হজ্জের প্রস্তুতি' : 'Hajj Preparation',
      sections: [
        {
          subtitle: isBn ? 'মানসিক ও আধ্যাত্মিক প্রস্তুতি' : 'Mental & Spiritual Preparation',
          content: isBn ? 'একমাত্র আল্লাহর সন্তুষ্টির জন্য যাওয়ার সংকল্প (নিয়ত) করুন। সফরের কষ্ট ও ভিড়ের মধ্যে ধৈর্য ধরার মানসিকতা তৈরি করুন।' : 'Make the intention (Niyyah) solely for the pleasure of Allah. Develop a mindset of patience during the hardships and crowds of the journey.'
        },
        {
          subtitle: isBn ? 'আর্থিক স্বচ্ছতা' : 'Financial Transparency',
          content: isBn ? 'হজ্জের অর্থ অবশ্যই হালাল হতে হবে। সমস্ত ঋণ পরিশোধ করুন এবং পরিবারের জন্য পর্যাপ্ত খরচ রেখে যান।' : 'Hajj funds must be Halal. Pay off all debts and leave sufficient expenses for your family.'
        },
        {
          subtitle: isBn ? 'শারীরিক সক্ষমতা' : 'Physical Fitness',
          content: isBn ? 'প্রতিদিন অন্তত ৩০ মিনিট হাঁটার অভ্যাস করুন। হজ্জে প্রচুর শারীরিক পরিশ্রম প্রয়োজন।' : 'Practice walking at least 30 minutes daily. Hajj requires significant physical exertion.'
        },
        {
          subtitle: isBn ? 'প্রয়োজনীয় মালামাল' : 'Essential Items',
          list: isBn ? [
            'সেলাইবিহীন দুই সেট ইহরামের কাপড়।',
            'আরামদায়ক চপ্পল (পায়ের উপরিভাগ ও গোড়ালি খোলা থাকে এমন)।',
            'মাজলু বা কোমরের বেল্ট (টাকা ও পাসপোর্ট রাখার জন্য)।',
            'টুথব্রাশ, সুগন্ধিহীন সাবান, ভ্যাসলিন, ছাতা এবং ব্যক্তিগত প্রয়োজনীয় ঔষধ।'
          ] : [
            'Two sets of unstitched Ihram clothes.',
            'Comfortable sandals (top of foot and ankles exposed).',
            'Waist belt (for money and passport).',
            'Toothbrush, unscented soap, Vaseline, umbrella, and personal medicines.'
          ]
        },
        {
          subtitle: isBn ? 'কাগজপত্র' : 'Documents',
          content: isBn ? 'পাসপোর্ট, হজ্জের কার্ড, মেডিকেল রিপোর্ট এবং এজেন্সির কন্টাক্ট নম্বর সবসময় সাথে রাখুন।' : 'Keep your passport, Hajj card, medical report, and agency contact number with you at all times.'
        }
      ]
    },
    rules: {
      title: isBn ? 'হজ্জের নিয়ম' : 'Hajj Rules',
      sections: [
        {
          subtitle: isBn ? '৮ই জিলহজ (মিনায় গমন)' : '8th Zil-Hajj (Going to Mina)',
          content: isBn ? 'মক্কা থেকে ইহরাম বেঁধে মিনায় পৌঁছানো। সেখানে ৫ ওয়াক্ত (জোহর থেকে ফজর) নামাজ আদায় করা সুন্নত।' : 'Put on Ihram from Makkah and reach Mina. Performing 5 prayers (Dhuhr to Fajr) there is Sunnah.'
        },
        {
          subtitle: isBn ? '৯ই জিলহজ (আরাফাত ও মুজদালিফা)' : '9th Zil-Hajj (Arafat & Muzdalifah)',
          content: isBn ? 'হজ্জের প্রধান রুকন। এদিন সকালে আরাফাতের ময়দানে গিয়ে অবস্থান করতে হয়। সূর্যাস্তের পর মাগরিব না পড়ে মুজদালিফার দিকে রওনা হতে হয়। মুজদালিফায় মাগরিব ও এশা একত্রে পড়ে খোলা আকাশের নিচে রাত কাটাতে হয়।' : 'The main pillar of Hajj. Stay at the plain of Arafat in the morning. After sunset, head to Muzdalifah without praying Maghrib. Pray Maghrib and Isha together at Muzdalifah and spend the night under the open sky.'
        },
        {
          subtitle: isBn ? '১০ই জিলহজ (পাথর মারা ও কুরবানি)' : '10th Zil-Hajj (Stoning & Sacrifice)',
          content: isBn ? 'সকালে মিনায় ফিরে বড় শয়তানকে ৭টি পাথর মারা। এরপর কুরবানি করা এবং পুরুষদের মাথা মুণ্ডানো বা চুল ছোট করা। এরপর সাধারণ পোশাক পরে মক্কায় গিয়ে ‘তাওয়াফে যিয়ারত’ করা।' : 'Return to Mina in the morning and stone the Jamrat al-Aqaba (Big Shaitan) with 7 pebbles. Then perform sacrifice and shave or trim hair (for men). Then wear normal clothes and go to Makkah for Tawaf al-Ziyarah.'
        },
        {
          subtitle: isBn ? '১১ ও ১২ই জিলহজ (মিনায় অবস্থান)' : '11th & 12th Zil-Hajj (Stay in Mina)',
          content: isBn ? 'প্রতিদিন ছোট, মেজো ও বড়—তিন শয়তানকে ৭টি করে মোট ২১টি পাথর মারা।' : 'Stone all three Jamarat (Small, Medium, Big) with 7 pebbles each daily (total 21 pebbles).'
        }
      ]
    },
    umrah: {
      title: isBn ? 'ওমরাহর নিয়ম' : 'Umrah Rules',
      sections: [
        {
          subtitle: isBn ? '১. ইহরাম' : '1. Ihram',
          content: isBn ? 'মিকাত অতিক্রম করার আগে ওমরাহর নিয়ত করে ইহরামের কাপড় পরা।' : 'Make the intention for Umrah and put on Ihram clothes before crossing the Miqat.'
        },
        {
          subtitle: isBn ? '২. তাওয়াফ' : '2. Tawaf',
          content: isBn ? 'কাবা ঘরকে বাম দিকে রেখে ৭ বার চক্কর দেওয়া। হাজরে আসওয়াদ থেকে শুরু করে সেখানেই শেষ করা।' : 'Circumambulate the Kaaba 7 times keeping it on your left. Start and end at the Hajar al-Aswad.'
        },
        {
          subtitle: isBn ? '৩. সাঈ' : '3. Sa\'i',
          content: isBn ? 'সাফা ও মারওয়া পাহাড়ের মাঝখানে ৭ বার দ্রুতপদে হাঁটা। সাফা থেকে শুরু করে মারওয়াতে শেষ হবে।' : 'Walk briskly 7 times between Safa and Marwa hills. Start at Safa and end at Marwa.'
        },
        {
          subtitle: isBn ? '৪. হলক বা কসর' : '4. Halq or Qasr',
          content: isBn ? 'সাঈ শেষে পুরুষদের মাথা মুণ্ডানো বা চুল ছোট করা। মহিলাদের চুলের অগ্রভাগ থেকে ১ ইঞ্চি পরিমাণ কাটা।' : 'After Sa\'i, men shave or trim their hair. Women cut about an inch from the ends of their hair.'
        }
      ]
    },
    duas: {
      title: isBn ? 'হজ্জ ও ওমরাহর দোয়া' : 'Hajj & Umrah Duas',
      sections: [
        {
          subtitle: isBn ? 'তালবিয়াহ (সব সময়ের জন্য)' : 'Talbiyah (For all times)',
          arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لاَ شَرِيكَ لَكَ',
          pronunciation: isBn ? 'লাব্বাইক আল্লাহুম্মা লাব্বাইক, লাব্বাইকা লা-শারীকা লাকা লাব্বাইক। ইন্নাল হামদা ওয়ান নি\'মাতা লাকা ওয়াল মুলক, লা-শারীকা লাক।' : 'Labbayk Allahumma Labbayk, Labbayka la sharika laka Labbayk. Innal-hamda wan-ni\'mata laka wal-mulk, la sharika lak.',
          meaning: isBn ? 'আমি হাজির হে আল্লাহ, আমি হাজির। আপনার কোনো শরিক নেই, আমি হাজির। নিশ্চয়ই সমস্ত প্রশংসা, নেয়ামত এবং রাজত্ব আপনারই। আপনার কোনো শরিক নেই।' : 'I am here, O Allah, I am here. I am here, You have no partner, I am here. Verily all praise and blessings are Yours, and all sovereignty, You have no partner.'
        },
        {
          subtitle: isBn ? 'তাওয়াফের দোয়া' : 'Tawaf Dua',
          arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
          pronunciation: isBn ? 'রাব্বানা আতিনা ফিদ্দুনিয়া হাসানাতাও ওয়া ফিল আখিরাতি হাসানাতাও ওয়া কিনা আজাবান নার।' : 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina \'adhaban-nar.',
          meaning: isBn ? 'হে আমাদের পালনকর্তা! আমাদের দুনিয়াতেও কল্যাণ দিন এবং আখেরাতেও কল্যাণ দিন এবং আমাদের দোজখের আগুন থেকে রক্ষা করুন।' : 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.'
        },
        {
          subtitle: isBn ? 'আরাফাতের দিনের বিশেষ দোয়া' : 'Special Dua for Arafat Day',
          arabic: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
          pronunciation: isBn ? 'লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারিকা লাহু, লাহুল মুলকু ওয়া লাহুল হামদু ওয়া হুয়া আলা কুল্লি শাইয়িন কাদির।' : 'La ilaha illallahu wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu wa huwa \'ala kulli shay\'in qadir.',
          meaning: isBn ? 'আল্লাহ ছাড়া কোনো উপাস্য নেই, তিনি একক, তাঁর কোনো শরিক নেই। রাজত্ব তাঁরই এবং সমস্ত প্রশংসা তাঁরই। তিনি সবকিছুর ওপর ক্ষমতাবান।' : 'There is no god but Allah alone, He has no partner, His is the sovereignty and His is the praise and He is over all things powerful.'
        }
      ]
    },
    places: {
      title: isBn ? 'মক্কা ও মদিনা যিয়ারত' : 'Makkah & Madinah Ziyarah',
      sections: [
        {
          subtitle: isBn ? 'মক্কা মুকাররমা' : 'Makkah Mukarramah',
          list: isBn ? [
            'কাবা শরীফ ও মসজিদুল হারাম: পৃথিবীর শ্রেষ্ঠ পবিত্র স্থান।',
            'জাবালে নূর ও হেরা গুহা: যেখানে প্রথম ওহী নাজিল হয়েছিল।',
            'জাবালে সওর: হিজরতের সময় রাসূল (সা.) ও আবু বকর (রা.) এখানে আশ্রয় নিয়েছিলেন।'
          ] : [
            'Kaaba & Masjid al-Haram: The holiest place on Earth.',
            'Jabal al-Noor & Hira Cave: Where the first revelation was sent.',
            'Jabal Thawr: Where the Prophet (PBUH) and Abu Bakr (RA) took refuge during Hijrah.'
          ]
        },
        {
          subtitle: isBn ? 'মদিনা মুনাওয়ারা' : 'Madinah Munawwarah',
          list: isBn ? [
            'মসজিদে নববী: রাসূলুল্লাহ (সা.)-এর রওজা মোবারক এবং রিয়াজুল জান্নাহ।',
            'মসজিদে কুবা: ইসলামের প্রথম মসজিদ, যেখানে ২ রাকাত নামাজ পড়লে ১টি ওমরাহর সওয়াব পাওয়া যায়।',
            'ওহুদ পাহাড়: বীর শহীদের কবর ও ঐতিহাসিক যুদ্ধের ময়দান।',
            'জান্নাতুল বাকি: ১০ হাজারেরও বেশি সাহাবীর কবরস্থান।'
          ] : [
            'Masjid al-Nabawi: The Prophet\'s (PBUH) tomb and Rawdah al-Jannah.',
            'Masjid Quba: The first mosque in Islam, 2 rak\'ahs here equals one Umrah reward.',
            'Mount Uhud: Graves of martyrs and historical battlefield.',
            'Jannat al-Baqi: Cemetery of over 10,000 companions.'
          ]
        }
      ]
    },
    map: {
      title: isBn ? 'হজ্জের ম্যাপ ও লোকেশন' : 'Hajj Map & Locations',
      sections: [
        {
          subtitle: isBn ? 'গুরুত্বপূর্ণ স্থানসমূহ' : 'Important Locations',
          list: isBn ? [
            'মক্কা (Holy Makkah): হজ্জ ও ওমরাহর মূল কেন্দ্র।',
            'মিনা (Mina): ‘তঁবুর শহর’ নামে পরিচিত, মক্কা থেকে প্রায় ৭ কিমি দূরে।',
            'আরাফাত (Arafat): মিনা থেকে প্রায় ১০ কিমি দূরে বিশাল ময়দান।',
            'মুজদালিফা (Muzdalifah): আরাফাত ও মিনার ঠিক মাঝখানে অবস্থিত।'
          ] : [
            'Makkah: The main center of Hajj and Umrah.',
            'Mina: Known as the "City of Tents", about 7km from Makkah.',
            'Arafat: A vast plain about 10km from Mina.',
            'Muzdalifah: Located between Arafat and Mina.'
          ]
        },
        {
          subtitle: isBn ? 'টিপস' : 'Tips',
          content: isBn ? 'স্মার্টফোনে \'Nusuk\' অ্যাপ এবং গুগল ম্যাপ ব্যবহার করুন। ম্যাপে আপনার হোটেলের লোকেশন এবং মিনার তঁবুর নম্বর আগে থেকেই সেভ করে রাখুন।' : 'Use the \'Nusuk\' app and Google Maps on your smartphone. Save your hotel location and Mina tent number in advance.'
        }
      ]
    }
  };

  const CATEGORIES = [
    { id: 'prep', name: isBn ? 'হজ্জের প্রস্তুতি' : 'Preparation', icon: Plane, color: 'text-blue-600 bg-blue-50' },
    { id: 'rules', name: isBn ? 'হজ্জের নিয়ম' : 'Hajj Rules', icon: Book, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'umrah', name: isBn ? 'ওমরাহর নিয়ম' : 'Umrah Rules', icon: Compass, color: 'text-amber-600 bg-amber-50' },
    { id: 'duas', name: isBn ? 'হজ্জ ও ওমরাহর দোয়া' : 'Duas', icon: Heart, color: 'text-rose-600 bg-rose-50' },
    { id: 'places', name: isBn ? 'মক্কা ও মদিনা যিয়ারত' : 'Historical Places', icon: Building2, color: 'text-purple-600 bg-purple-50' },
    { id: 'map', name: isBn ? 'ম্যাপ ও লোকেশন' : 'Map & Locations', icon: MapIcon, color: 'text-cyan-600 bg-cyan-50' },
  ];

  const IslamicGraphic = ({ type, title }: { type: string, title: string }) => {
    const getIcon = () => {
      switch (type) {
        case 'prep': return <Plane className="w-16 h-16 text-white/20" />;
        case 'rules': return <Book className="w-16 h-16 text-white/20" />;
        case 'umrah': return <Compass className="w-16 h-16 text-white/20" />;
        case 'duas': return <Heart className="w-16 h-16 text-white/20" />;
        case 'places': return <Building2 className="w-16 h-16 text-white/20" />;
        case 'map': return <MapIcon className="w-16 h-16 text-white/20" />;
        default: return <Moon className="w-16 h-16 text-white/20" />;
      }
    };

    const getGradient = () => {
      switch (type) {
        case 'prep': return 'from-blue-600 to-indigo-700';
        case 'rules': return 'from-emerald-600 to-teal-700';
        case 'umrah': return 'from-amber-600 to-orange-700';
        case 'duas': return 'from-rose-600 to-pink-700';
        case 'places': return 'from-purple-600 to-violet-700';
        case 'map': return 'from-cyan-600 to-sky-700';
        default: return 'from-emerald-800 to-emerald-950';
      }
    };

    return (
      <div className={cn("w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br", getGradient())}>
        {/* Islamic Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="p-6 bg-white/10 rounded-full backdrop-blur-sm mb-4 border border-white/20">
            {getIcon()}
          </div>
          <h2 className="text-2xl font-bold text-white text-center px-6">{title}</h2>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-black/5 rounded-full blur-3xl" />
      </div>
    );
  };

  const renderDetail = (catId: string) => {
    const data = HAJJ_CONTENT[catId as keyof typeof HAJJ_CONTENT];
    if (!data) return null;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4"
      >
        <div className="relative h-40 w-full overflow-hidden rounded-3xl shadow-md mb-4">
          <IslamicGraphic type={catId} title={data.title} />
        </div>

        <div className="space-y-4">
          {data.sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-primary mb-2 flex items-center gap-2">
                <div className="w-1.5 h-5 bg-primary rounded-full" />
                {section.subtitle}
              </h3>
              
              {section.content && (
                <p className="text-gray-700 leading-relaxed text-sm">
                  {section.content}
                </p>
              )}

              {section.list && (
                <ul className="space-y-1.5">
                  {section.list.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.arabic && (
                <div className="mt-3 space-y-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <p className="text-xl font-arabic text-right text-gray-800 leading-relaxed">
                    {section.arabic}
                  </p>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-primary italic">
                      {section.pronunciation}
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-bold">{isBn ? 'অর্থ: ' : 'Meaning: '}</span>
                      {section.meaning}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button 
          onClick={() => setSelectedCategory(null)}
          className="w-full py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          {isBn ? 'ফিরে যান' : 'Go Back'}
        </button>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader 
        title={selectedCategory ? HAJJ_CONTENT[selectedCategory as keyof typeof HAJJ_CONTENT]?.title : (isBn ? 'হজ ও ওমরাহ' : 'Hajj & Umrah')} 
        showBack={!!selectedCategory}
        onBack={() => setSelectedCategory(null)}
      />

      <div className="px-4 py-4">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="relative h-48 w-full overflow-hidden rounded-3xl shadow-md">
                <IslamicGraphic type="main" title={isBn ? 'হজ ও ওমরাহ গাইড' : 'Hajj & Umrah Guide'} />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white/80 text-xs font-medium">{isBn ? 'আপনার পবিত্র সফরের পূর্ণাঙ্গ নির্দেশিকা' : 'A complete guide for your holy journey'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                  <motion.div
                    key={cat.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="bg-white rounded-3xl p-4 border border-gray-100 flex flex-col items-center gap-3 shadow-sm cursor-pointer hover:shadow-md transition-all"
                  >
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm", cat.color)}>
                      <cat.icon className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-gray-800 text-center text-xs">
                      {cat.name}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="bg-primary/5 border border-primary/10 rounded-3xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-primary/10 rounded-xl text-primary">
                    <Info className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-primary text-sm">{isBn ? 'জরুরি তথ্য' : 'Emergency Info'}</h3>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {isBn 
                    ? 'হজ ও ওমরাহ পালনের সময় আপনার এজেন্সির সাথে সার্বক্ষণিক যোগাযোগ রাখুন এবং প্রয়োজনীয় ঔষধ ও কাগজপত্র সাথে রাখুন।' 
                    : 'Keep constant contact with your agency during Hajj and Umrah, and always keep necessary medicines and documents with you.'}
                </p>
              </div>
            </motion.div>
          ) : (
            renderDetail(selectedCategory)
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
