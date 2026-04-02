import moment from 'moment-hijri';

export interface Holiday {
  id: string;
  name: string;
  bnName: string;
  date: Date;
  hijriDate: string;
}

export const getHolidays = (year: number): Holiday[] => {
  const holidays: Holiday[] = [];
  
  // We need to check a range of Hijri years that might fall into the Gregorian year
  // A Hijri year is ~354 days, so it can start/end within one Gregorian year or overlap
  const startHijriYear = moment(`${year}-01-01`, 'YYYY-MM-DD').iYear();
  const endHijriYear = moment(`${year}-12-31`, 'YYYY-MM-DD').iYear();

  const holidayConfigs = [
    { id: 'shab-e-barat', name: 'Shab-e-Barat', bnName: 'শবে বরাত', iMonth: 8, iDay: 15 },
    { id: 'laylat-al-qadr', name: 'Laylat al-Qadr', bnName: 'শবে কদর', iMonth: 9, iDay: 27 },
    { id: 'eid-ul-fitr', name: 'Eid-ul-Fitr', bnName: 'ঈদুল ফিতর', iMonth: 10, iDay: 1 },
    { id: 'eid-ul-adha', name: 'Eid-ul-Adha', bnName: 'ঈদুল আযহা', iMonth: 12, iDay: 10 },
    { id: 'ashura', name: 'Ashura', bnName: 'আশুরা', iMonth: 1, iDay: 10 },
  ];

  for (let iYear = startHijriYear - 1; iYear <= endHijriYear + 1; iYear++) {
    holidayConfigs.forEach(config => {
      const m = moment().iYear(iYear).iMonth(config.iMonth - 1).iDate(config.iDay);
      const date = m.toDate();
      if (date.getFullYear() === year) {
        holidays.push({
          ...config,
          date,
          hijriDate: m.format('iD iMMMM iYYYY')
        });
      }
    });

    // Special case for Jumatul Wida (Last Friday of Ramadan)
    // Find the last day of Ramadan
    const ramadanEnd = moment().iYear(iYear).iMonth(8).endOf('iMonth');
    let jumatulWida = ramadanEnd.clone();
    while (jumatulWida.day() !== 5) { // 5 is Friday
      jumatulWida.subtract(1, 'day');
    }
    const jwDate = jumatulWida.toDate();
    if (jwDate.getFullYear() === year) {
      holidays.push({
        id: 'jumatul-wida',
        name: 'Jumatul Wida',
        bnName: 'জুমাতুল বিদা',
        date: jwDate,
        hijriDate: jumatulWida.format('iD iMMMM iYYYY')
      });
    }
  }

  return holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
};
