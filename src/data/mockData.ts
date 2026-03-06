import { SURAHS_LIST } from './surahs';

export interface PrayerTime {
  name: string;
  nameBn: string;
  time: string;
  icon: string;
}

export interface Surah {
  id: number;
  name: string;
  nameBn: string;
  nameAr: string;
  totalAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  meaningBn: string;
}

export interface Hadith {
  id: number;
  text: string;
  textBn: string;
  source: string;
  category: string;
}

export interface Dua {
  id: number;
  title: string;
  titleBn: string;
  arabic: string;
  translationBn: string;
  reference: string;
}

export const PRAYER_TIMES_MOCK: PrayerTime[] = [
  { name: 'Fajr', nameBn: 'ফজর', time: '০৫:০৫ AM', icon: 'Sunrise' },
  { name: 'Sunrise', nameBn: 'সূর্যোদয়', time: '০৬:২০ AM', icon: 'Sun' },
  { name: 'Dhuhr', nameBn: 'যোহর', time: '১২:১৫ PM', icon: 'SunMedium' },
  { name: 'Asr', nameBn: 'আসর', time: '০৪:১০ PM', icon: 'SunDim' },
  { name: 'Maghrib', nameBn: 'মাগরিব', time: '০৬:০৫ PM', icon: 'Sunset' },
  { name: 'Isha', nameBn: 'এশা', time: '০৭:৩০ PM', icon: 'Moon' },
  { name: 'Tahajjud', nameBn: 'তাহাজ্জুদ', time: '০২:০০ AM', icon: 'MoonStar' },
];

export const RAMADAN_MOCK = {
  sehri: '০৪:৫৫ AM',
  iftar: '০৬:০৮ PM',
  day: 12,
};

export const SURAHS_MOCK = SURAHS_LIST;

export const HADITHS_MOCK: Hadith[] = [
  {
    id: 1,
    text: "Actions are but by intentions.",
    textBn: "নিশ্চয়ই সকল কাজ নিয়তের ওপর নির্ভরশীল।",
    source: "Bukhari & Muslim",
    category: "Iman"
  },
  {
    id: 2,
    text: "The best among you are those who learn the Quran and teach it.",
    textBn: "তোমাদের মধ্যে সর্বোত্তম ব্যক্তি সেই যে নিজে কুরআন শিখে এবং অন্যকে শেখায়।",
    source: "Bukhari",
    category: "Knowledge"
  }
];

export const DUAS_MOCK: Dua[] = [
  {
    id: 1,
    title: "Before Eating",
    titleBn: "খাওয়ার আগের দোয়া",
    arabic: "بِسْمِ اللَّهِ",
    translationBn: "আল্লাহর নামে শুরু করছি।",
    reference: "Abu Dawud"
  },
  {
    id: 2,
    title: "After Eating",
    titleBn: "খাওয়ার পরের দোয়া",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    translationBn: "সকল প্রশংসা আল্লাহর জন্য, যিনি আমাদের খাইয়েছেন, পান করিয়েছেন এবং মুসলিম বানিয়েছেন।",
    reference: "Tirmidhi"
  }
];

export const ALLAH_NAMES_MOCK = [
  { id: 1, name: 'Ar-Rahman', nameAr: 'الرحمن', meaningBn: 'পরম করুণাময়' },
  { id: 2, name: 'Ar-Rahim', nameAr: 'الرحيم', meaningBn: 'অতিশয় দয়ালু' },
  { id: 3, name: 'Al-Malik', nameAr: 'الملك', meaningBn: 'সর্বাধিপতি' },
  { id: 4, name: 'Al-Quddus', nameAr: 'القدوس', meaningBn: 'অতি পবিত্র' },
];
