
export interface IslamicContent {
  text_bn: string;
  text_en: string;
}

export const ISLAMIC_FACTS: IslamicContent[] = [
  { text_bn: "কুরআন মজিদে মোট ১১৪টি সূরা আছে।", text_en: "There are a total of 114 Surahs in the Holy Quran." },
  { text_bn: "নামাজ ইসলামের দ্বিতীয় স্তম্ভ।", text_en: "Prayer (Salat) is the second pillar of Islam." },
  { text_bn: "রমজান মাসে কুরআন নাজিল হয়েছে।", text_en: "The Quran was revealed in the month of Ramadan." },
  { text_bn: "হজ জীবনে একবার করা ফরজ।", text_en: "Hajj is obligatory once in a lifetime for those who can afford it." },
  { text_bn: "ইসলামের প্রথম খলিফা ছিলেন হযরত আবু বকর (রা)।", text_en: "The first Caliph of Islam was Hazrat Abu Bakr (RA)." },
  { text_bn: "যাকাত সম্পদের পবিত্রতা আনে।", text_en: "Zakat brings purity to wealth." },
  { text_bn: "কুরআনের দীর্ঘতম সূরা হলো সূরা আল-বাকারা।", text_en: "The longest Surah in the Quran is Surah Al-Baqarah." },
];

export const MOTIVATIONAL_QUOTES: IslamicContent[] = [
  { text_bn: "আল্লাহর ওপর ভরসা রাখো, তিনিই উত্তম কর্মবিধায়ক।", text_en: "Put your trust in Allah; Allah is sufficient as a disposer of affairs." },
  { text_bn: "ধৈর্য ধরো, নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সাথে আছেন।", text_en: "Be patient; indeed, Allah is with the patient." },
  { text_bn: "নিশ্চয়ই কষ্টের সাথেই স্বস্তি রয়েছে।", text_en: "Indeed, with hardship comes ease." },
  { text_bn: "আল্লাহর জিকিরেই অন্তরে প্রশান্তি আসে।", text_en: "In the remembrance of Allah do hearts find rest." },
  { text_bn: "মুমিনের প্রতিটি কাজই বরকতময়।", text_en: "Every deed of a believer is blessed." },
  { text_bn: "তওবা করো, আল্লাহ ক্ষমাশীল।", text_en: "Repent, for Allah is Most Merciful." },
];

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

export function showNotification(title: string, body: string, icon = '/logo.png') {
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon });
  }
}
