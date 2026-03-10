import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import moment from 'moment-hijri';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date, language: 'bn' | 'en' = 'bn'): string {
  return date.toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function getBengaliNumber(n: number | string): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return n.toString().replace(/\d/g, (d) => bengaliDigits[parseInt(d)]);
}

export function getBengaliDate(date: Date): string {
  const months = [
    'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন', 
    'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
  ];
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear() - 593;
  return `${getBengaliNumber(day)} ${months[month]}, ${getBengaliNumber(year)}`;
}

export function getHijriDate(date: Date): string {
  try {
    const m = moment(date);
    const hijriMonthNames = [
      'মুহররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি', 'জামাদিউল আউয়াল', 'জামাদিউস সানি',
      'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ'
    ];
    
    const day = m.iDate();
    const monthIndex = m.iMonth();
    const year = m.iYear();
    
    return `${getBengaliNumber(day)} ${hijriMonthNames[monthIndex]}, ${getBengaliNumber(year)} হিজরি`;
  } catch (e) {
    return '২০ রমজান, ১৪৪৭ হিজরী';
  }
}

export function isFriday(date: Date): boolean {
  return date.getDay() === 5;
}

export function getLiveTime(date: Date, language: 'bn' | 'en'): string {
  return date.toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}
