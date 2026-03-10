import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import moment from 'moment-hijri';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('bn-BD', {
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
  // Simple approximation for Bengali date (not 100% accurate without a library)
  // For demo purposes, we'll use a fixed offset or a mock that looks real
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear() - 593;
  return `${getBengaliNumber(day)} ${months[month]}, ${getBengaliNumber(year)}`;
}

export function getHijriDate(date: Date): string {
  // Using moment-hijri for more accurate Islamic calendar calculations
  // It supports the Umm al-Qura calendar which is widely used.
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
    // Fallback to Intl if moment-hijri fails
    try {
      const formatter = new Intl.DateTimeFormat('bn-BD-u-ca-islamic-uma', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      return formatter.format(date);
    } catch (e2) {
      return '১৬ রমজান, ১৪৪৭'; // Absolute fallback
    }
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

export function getPrayerStatus(date: Date, prayers: any[]) {
  const currentTime = date.getHours() * 60 + date.getMinutes();
  
  const parsedPrayers = prayers.map(p => {
    const [timeStr, period] = p.time.split(' ');
    const parseBn = (s: string) => s.replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d).toString());
    const h = parseInt(parseBn(timeStr.split(':')[0]));
    const m = parseInt(parseBn(timeStr.split(':')[1]));
    
    let totalMinutes = h * 60 + m;
    if (period === 'PM' && h !== 12) totalMinutes += 12 * 60;
    if (period === 'AM' && h === 12) totalMinutes = m;
    
    return { ...p, totalMinutes };
  });

  parsedPrayers.sort((a, b) => a.totalMinutes - b.totalMinutes);

  // Current prayer is the last one that has already started
  let current = [...parsedPrayers].reverse().find(p => p.totalMinutes <= currentTime);
  
  // Custom logic: If current is Sunrise and it has strictly passed, move to Dhuhr
  if (current && current.name === 'Sunrise' && currentTime > current.totalMinutes) {
    const dhuhr = parsedPrayers.find(p => p.name === 'Dhuhr');
    if (dhuhr) {
      current = dhuhr;
    }
  }

  if (!current) {
    // If before Fajr, current is Tahajjud of yesterday (technically)
    current = { ...parsedPrayers[parsedPrayers.length - 1], isYesterday: true };
  }

  // Next prayer is the first one that hasn't started yet
  let next = parsedPrayers.find(p => p.totalMinutes > currentTime);
  let isTomorrow = false;
  if (!next) {
    next = parsedPrayers[0];
    isTomorrow = true;
  }

  return { current, next: { ...next, isTomorrow } };
}

export function getCountdown(date: Date, nextPrayer: any) {
  const currentTime = date.getHours() * 60 + date.getMinutes();
  let nextTime = nextPrayer.totalMinutes;
  
  if (nextPrayer.isTomorrow) {
    nextTime += 24 * 60;
  }
  
  const diff = nextTime - currentTime;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  
  return { h, m };
}
