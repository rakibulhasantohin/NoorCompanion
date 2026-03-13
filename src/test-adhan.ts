import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';
import { format, addMinutes, addDays } from 'date-fns';

const coordinates = new Coordinates(23.7289, 90.3944);
const params = CalculationMethod.Karachi();
params.madhab = Madhab.Hanafi;
params.adjustments.fajr = -2;
params.adjustments.maghrib = 1;

let date = new Date('2026-03-13T12:00:00+06:00');
for (let i = 0; i < 8; i++) {
  const prayerTimes = new PrayerTimes(coordinates, date, params);
  console.log(
    format(date, 'dd MMM'), 
    "Sahri:", format(prayerTimes.fajr, 'p'), 
    "Iftar:", format(prayerTimes.maghrib, 'p')
  );
  date = addDays(date, 1);
}
