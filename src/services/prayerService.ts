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
  
  const prayerTimes = new PrayerTimes(coordinates, date, params);
  const sunnahTimes = new SunnahTimes(prayerTimes);

  // Standard prayers
  const fajr = prayerTimes.fajr;
  const sunrise = prayerTimes.sunrise;
  const dhuhr = prayerTimes.dhuhr;
  const asr = prayerTimes.asr;
  const maghrib = prayerTimes.maghrib;
  const isha = prayerTimes.isha;
  const sunset = prayerTimes.sunset;

  // Calculated prayers
  const tahajjud = sunnahTimes.lastThirdOfTheNight;
  const ishraq = addMinutes(sunrise, 15);
  const chasht = addMinutes(sunrise, 45); // Approximate start of Chasht
  const awwabin = addMinutes(maghrib, 10); // Starts shortly after Maghrib

  const prayerItems = [
    { id: 'tahajjud', name: 'Tahajjud', bnName: 'তাহাজ্জুদ', time: tahajjud, endTime: addMinutes(fajr, -1) },
    { id: 'fajr', name: 'Fajr', bnName: 'ফজর', time: fajr, endTime: addMinutes(sunrise, -1) },
    { id: 'sunrise', name: 'Sunrise', bnName: 'সূর্যোদয়', time: sunrise, isEvent: true },
    { id: 'ishraq', name: 'Ishraq', bnName: 'ইশরাক', time: ishraq, endTime: addMinutes(ishraq, 30) },
    { id: 'chasht', name: 'Chasht', bnName: 'চাশত', time: chasht, endTime: addMinutes(dhuhr, -15) },
    { id: 'dhuhr', name: 'Zuhr', bnName: date.getDay() === 5 ? "জুম'আ" : 'যোহর', time: dhuhr, endTime: addMinutes(asr, -1) },
    { id: 'asr', name: 'Asr', bnName: 'আসর', time: asr, endTime: addMinutes(sunset, -1) },
    { id: 'sunset', name: 'Sunset', bnName: 'সূর্যাস্ত', time: sunset, isEvent: true },
    { id: 'maghrib', name: 'Maghrib', bnName: 'মাগরিব', time: maghrib, endTime: addMinutes(isha, -1) },
    { id: 'awwabin', name: 'Awwabin', bnName: 'আওয়াবিন', time: awwabin, endTime: addMinutes(isha, -1) },
    { id: 'isha', name: 'Isha', bnName: 'এশা', time: isha, endTime: addMinutes(tahajjud, -1) },
  ];

  const times: PrayerTimeInfo[] = prayerItems.map((p) => ({
    name: p.name,
    bnName: p.bnName,
    time: p.time,
    formattedTime: format(p.time, 'p'),
    isCurrent: false,
    isNext: false,
    endTime: p.endTime,
  }));

  // Calculate current prayer
  const now = new Date();
  let currentIdx = -1;

  for (let i = 0; i < times.length; i++) {
    const start = times[i].time;
    const end = times[i].endTime || (i < times.length - 1 ? times[i+1].time : addMinutes(times[0].time, 24 * 60));
    
    if (isAfter(now, start) && isBefore(now, end)) {
      currentIdx = i;
      break;
    }
  }

  // Fallback for currentIdx if not found (e.g. exactly at a time)
  if (currentIdx === -1) {
    for (let i = times.length - 1; i >= 0; i--) {
      if (isAfter(now, times[i].time)) {
        currentIdx = i;
        break;
      }
    }
  }
  
  if (currentIdx === -1) currentIdx = times.length - 1; // Default to Isha if before Tahajjud

  times[currentIdx].isCurrent = true;
  const nextIdx = (currentIdx + 1) % times.length;
  times[nextIdx].isNext = true;

  return {
    times,
    fajr,
    maghrib,
    sunrise,
    sunset,
    imsak: addMinutes(fajr, -10),
    current: times[currentIdx],
    next: times[nextIdx],
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
