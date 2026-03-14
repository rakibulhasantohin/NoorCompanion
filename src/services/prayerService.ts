import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  SunnahTimes,
  Prayer,
  Madhab,
} from 'adhan';
import { format, addMinutes, isAfter, isBefore, addDays } from 'date-fns';

export interface PrayerTimeInfo {
  name: string;
  bnName: string;
  time: Date;
  formattedTime: string;
  isCurrent: boolean;
  isNext: boolean;
  endTime?: Date;
}

export const getPrayerTimes = (lat: number, lng: number, date: Date = new Date()) => {
  const coordinates = new Coordinates(lat, lng);
  const params = CalculationMethod.Karachi();
  params.madhab = Madhab.Hanafi;
  
  // Adjustments for Bangladesh (Islamic Foundation)
  params.adjustments.fajr = -2;
  params.adjustments.maghrib = 1;
  
  const generatePrayersForDate = (d: Date) => {
    const pt = new PrayerTimes(coordinates, d, params);
    const st = new SunnahTimes(pt);
    
    // We need the previous day's SunnahTimes to get today's Tahajjud
    const prevDay = addDays(d, -1);
    const prevPt = new PrayerTimes(coordinates, prevDay, params);
    const prevSt = new SunnahTimes(prevPt);

    const tahajjud = prevSt.lastThirdOfTheNight;
    const fajr = pt.fajr;
    const sunrise = pt.sunrise;
    const ishraq = addMinutes(sunrise, 15);
    const chasht = addMinutes(sunrise, 45);
    const dhuhr = pt.dhuhr;
    const asr = pt.asr;
    const sunset = pt.sunset;
    const maghrib = pt.maghrib;
    const awwabin = addMinutes(maghrib, 10);
    const isha = pt.isha;
    const nextTahajjud = st.lastThirdOfTheNight;

    return [
      { id: 'tahajjud', name: 'Tahajjud', bnName: 'তাহাজ্জুদ', time: tahajjud, endTime: fajr },
      { id: 'fajr', name: 'Fajr', bnName: 'ফজর', time: fajr, endTime: sunrise },
      { id: 'sunrise', name: 'Sunrise', bnName: 'সূর্যোদয়', time: sunrise, isEvent: true, endTime: ishraq },
      { id: 'ishraq', name: 'Ishraq', bnName: 'ইশরাক', time: ishraq, endTime: chasht },
      { id: 'chasht', name: 'Chasht', bnName: 'চাশত', time: chasht, endTime: dhuhr },
      { id: 'dhuhr', name: 'Zuhr', bnName: d.getDay() === 5 ? "জুম'আ" : 'যোহর', time: dhuhr, endTime: asr },
      { id: 'asr', name: 'Asr', bnName: 'আসর', time: asr, endTime: sunset },
      { id: 'sunset', name: 'Sunset', bnName: 'সূর্যাস্ত', time: sunset, isEvent: true, endTime: maghrib },
      { id: 'maghrib', name: 'Maghrib', bnName: 'মাগরিব', time: maghrib, endTime: awwabin },
      { id: 'awwabin', name: 'Awwabin', bnName: 'আওয়াবিন', time: awwabin, endTime: isha },
      { id: 'isha', name: 'Isha', bnName: 'এশা', time: isha, endTime: nextTahajjud },
    ];
  };

  const todayPrayers = generatePrayersForDate(date);
  
  // To find current and next, we need a continuous timeline
  const now = new Date();
  const yesterdayPrayers = generatePrayersForDate(addDays(now, -1));
  const nowTodayPrayers = generatePrayersForDate(now);
  const tomorrowPrayers = generatePrayersForDate(addDays(now, 1));
  
  const allPrayers = [...yesterdayPrayers, ...nowTodayPrayers, ...tomorrowPrayers];
  
  let currentPrayer = allPrayers[0];
  let nextPrayer = allPrayers[1];
  
  for (let i = 0; i < allPrayers.length - 1; i++) {
    const start = allPrayers[i].time;
    const end = allPrayers[i].endTime || allPrayers[i+1].time;
    
    if (now.getTime() >= start.getTime() && now.getTime() < end.getTime()) {
      currentPrayer = allPrayers[i];
      // Find the next non-event prayer
      let nextIdx = i + 1;
      while (nextIdx < allPrayers.length && allPrayers[nextIdx].isEvent) {
        nextIdx++;
      }
      nextPrayer = allPrayers[nextIdx];
      break;
    }
  }

  const times: PrayerTimeInfo[] = todayPrayers.map((p) => ({
    name: p.name,
    bnName: p.bnName,
    time: p.time,
    formattedTime: format(p.time, 'p'),
    isCurrent: p.id === currentPrayer.id && p.time.getTime() === currentPrayer.time.getTime(),
    isNext: p.id === nextPrayer.id && p.time.getTime() === nextPrayer.time.getTime(),
    endTime: p.endTime,
  }));

  // If current or next prayer is not in today's list (e.g. tomorrow's fajr), we still need to return them
  const currentInfo: PrayerTimeInfo = {
    name: currentPrayer.name,
    bnName: currentPrayer.bnName,
    time: currentPrayer.time,
    formattedTime: format(currentPrayer.time, 'p'),
    isCurrent: true,
    isNext: false,
    endTime: currentPrayer.endTime,
  };

  const nextInfo: PrayerTimeInfo = {
    name: nextPrayer.name,
    bnName: nextPrayer.bnName,
    time: nextPrayer.time,
    formattedTime: format(nextPrayer.time, 'p'),
    isCurrent: false,
    isNext: true,
    endTime: nextPrayer.endTime,
  };

  // Mark in the list if they match
  times.forEach(t => {
    if (t.name === currentInfo.name && t.time.getTime() === currentInfo.time.getTime()) t.isCurrent = true;
    if (t.name === nextInfo.name && t.time.getTime() === nextInfo.time.getTime()) t.isNext = true;
  });

  const pt = new PrayerTimes(coordinates, date, params);

  return {
    times,
    fajr: pt.fajr,
    maghrib: pt.maghrib,
    sunrise: pt.sunrise,
    sunset: pt.sunset,
    imsak: pt.fajr,
    current: currentInfo,
    next: nextInfo,
  };
};

export const getSahriIftarRange = (lat: number, lng: number, startDate: Date, days: number) => {
  const range = [];
  for (let i = 0; i < days; i++) {
    const date = addDays(startDate, i);
    const prayerData = getPrayerTimes(lat, lng, date);
    range.push({
      date,
      imsak: prayerData.imsak,
      maghrib: prayerData.maghrib,
      fajr: prayerData.fajr,
    });
  }
  return range;
};

export const getForbiddenTimes = (lat: number, lng: number, date: Date = new Date()) => {
  const coordinates = new Coordinates(lat, lng);
  const params = CalculationMethod.Karachi();
  const prayerTimes = new PrayerTimes(coordinates, date, params);

  return [
    {
      name: 'Sunrise',
      bnName: 'সূর্যোদয় (সকাল)',
      start: prayerTimes.sunrise,
      end: addMinutes(prayerTimes.sunrise, 15),
    },
    {
      name: 'Zawal',
      bnName: 'যাওয়াল (দুপুর)',
      start: addMinutes(prayerTimes.dhuhr, -10),
      end: prayerTimes.dhuhr,
    },
    {
      name: 'Sunset',
      bnName: 'সূর্যাস্ত (সন্ধ্যা)',
      start: addMinutes(prayerTimes.maghrib, -15),
      end: prayerTimes.maghrib,
    }
  ];
};
