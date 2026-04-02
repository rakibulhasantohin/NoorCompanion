export interface HijriDate {
  day: number;
  month: number;
  year: number;
}

export function getHijriDate(date: Date): HijriDate {
  // Using Intl API for accurate Hijri conversion (Umm al-Qura)
  const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-uma-nu-latn', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  const parts = formatter.formatToParts(date);
  const hijri: any = {};
  parts.forEach(part => {
    if (part.type !== 'literal') {
      hijri[part.type] = parseInt(part.value, 10);
    }
  });

  return {
    day: hijri.day,
    month: hijri.month,
    year: hijri.year
  };
}

export function isLastFridayOfRamadan(date: Date): boolean {
  const hijri = getHijriDate(date);
  if (hijri.month !== 9 || date.getDay() !== 5) return false;

  // Check if next Friday is still in Ramadan
  const nextFriday = new Date(date);
  nextFriday.setDate(date.getDate() + 7);
  const nextHijri = getHijriDate(nextFriday);
  
  return nextHijri.month !== 9;
}
