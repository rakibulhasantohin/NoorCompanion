import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  SunnahTimes,
  Prayer,
  Madhab,
} from 'adhan';
import { format, addMinutes, isAfter, isBefore } from 'date-fns';

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

  const prayerNames = [
    { id: Prayer.Fajr, name: 'Fajr', bnName: 'ফজর' },
    { id: Prayer.Sunrise, name: 'Sunrise', bnName: 'সূর্যোদয়' },
    { id: Prayer.Dhuhr, name: 'Dhuhr', bnName: 'যোহর' },
    { id: Prayer.Asr, name: 'Asr', bnName: 'আসর' },
    { id: Prayer.Maghrib, name: 'Maghrib', bnName: 'মাগরিব' },
    { id: Prayer.Isha, name: 'Isha', bnName: 'এশা' },
  ];

  const times: PrayerTimeInfo[] = prayerNames.map((p) => {
    const time = prayerTimes.timeForPrayer(p.id)!;
    return {
      name: p.name,
      bnName: p.bnName,
      time,
      formattedTime: format(time, 'h:mm a'),
      isCurrent: prayerTimes.currentPrayer() === p.id,
      isNext: prayerTimes.nextPrayer() === p.id,
    };
  });

  // Add Tahajjud
  const tahajjudTime = sunnahTimes.lastThirdOfTheNight;
  times.unshift({
    name: 'Tahajjud',
    bnName: 'তাহাজ্জুদ',
    time: tahajjudTime,
    formattedTime: format(tahajjudTime, 'h:mm a'),
    isCurrent: false, // Will calculate manually
    isNext: false,
    endTime: prayerTimes.fajr
  });

  // Calculate current prayer more accurately including Tahajjud
  const now = new Date();
  let currentIdx = -1;
  
  if (isAfter(now, tahajjudTime) && isBefore(now, prayerTimes.fajr)) {
    times[0].isCurrent = true;
    currentIdx = 0;
  } else {
    const currentPrayer = prayerTimes.currentPrayer();
    currentIdx = times.findIndex(t => t.name === (currentPrayer === Prayer.None ? 'Isha' : currentPrayer));
    if (currentIdx !== -1) times[currentIdx].isCurrent = true;
  }

  // Find next prayer
  let nextIdx = (currentIdx + 1) % times.length;
  times[nextIdx].isNext = true;

  return {
    times,
    fajr: prayerTimes.fajr,
    maghrib: prayerTimes.maghrib,
    sunrise: prayerTimes.sunrise,
    sunset: prayerTimes.sunset,
    imsak: addMinutes(prayerTimes.fajr, -10), // Sahri ends 10 mins before Fajr usually
    current: times[currentIdx],
    next: times[nextIdx],
  };
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
