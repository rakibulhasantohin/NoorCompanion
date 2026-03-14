export interface Zikir {
  id: string;
  arabic: string;
  pronunciation: {
    bn: string;
    en: string;
  };
  meaning: {
    bn: string;
    en: string;
  };
}

export const ZIKIRS: Zikir[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    pronunciation: {
      bn: 'সুবহানাল্লাহ',
      en: 'SubhanAllah'
    },
    meaning: {
      bn: 'আল্লাহ মহান ও পবিত্র',
      en: 'Allah is pure and exalted'
    }
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    pronunciation: {
      bn: 'আলহামদুলিল্লাহ',
      en: 'Alhamdulillah'
    },
    meaning: {
      bn: 'সমস্ত প্রশংসা আল্লাহর',
      en: 'All praise is for Allah'
    }
  },
  {
    id: 'allahu-akbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    pronunciation: {
      bn: 'আল্লাহু আকবার',
      en: 'Allahu Akbar'
    },
    meaning: {
      bn: 'আল্লাহ সবচেয়ে মহান',
      en: 'Allah is the Greatest'
    }
  },
  {
    id: 'la-ilaha-illallah',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
    pronunciation: {
      bn: 'লা ইলাহা ইল্লাল্লাহ',
      en: 'La ilaha illallah'
    },
    meaning: {
      bn: 'আল্লাহ ছাড়া কোনো ইলাহ নেই',
      en: 'There is no god but Allah'
    }
  },
  {
    id: 'la-hawla',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    pronunciation: {
      bn: 'লা হাওলা ওয়ালা কুওয়াতা ইল্লা বিল্লাহ',
      en: 'La hawla wa la quwwata illa billah'
    },
    meaning: {
      bn: 'আল্লাহ ছাড়া কোনো শক্তি বা সামর্থ্য নেই',
      en: 'There is no power or might except with Allah'
    }
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    pronunciation: {
      bn: 'আস্তাগফিরুল্লাহ',
      en: 'Astaghfirullah'
    },
    meaning: {
      bn: 'আমি আল্লাহর কাছে ক্ষমা চাই',
      en: 'I seek forgiveness from Allah'
    }
  },
  {
    id: 'subhanallahi-wa-bihamdihi',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    pronunciation: {
      bn: 'সুবহানাল্লাহি ওয়া বিহামদিহি',
      en: 'SubhanAllahi wa bihamdihi'
    },
    meaning: {
      bn: 'আল্লাহ পবিত্র ও প্রশংসাসম্মিত',
      en: 'Glory be to Allah and praise be to Him'
    }
  },
  {
    id: 'subhanallahil-azim',
    arabic: 'سُبْحَانَ اللَّهِ الْعَظِيمِ',
    pronunciation: {
      bn: 'সুবহানাল্লাহিল আযীম',
      en: 'SubhanAllahil Azim'
    },
    meaning: {
      bn: 'আল্লাহ মহান ও পবিত্র',
      en: 'Glory be to Allah the Almighty'
    }
  },
  {
    id: 'la-ilaha-illa-anta',
    arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    pronunciation: {
      bn: 'লা ইলাহা ইল্লা আনতা সুবহানাকা, ইন্নি কুন্তু মিনাজ-জ্বলিমীন',
      en: 'La ilaha illa anta subhanaka inni kuntu minaz zalimin'
    },
    meaning: {
      bn: 'আপনি ব্যতীত কোনো ইলাহ নেই; আপনি মহান ও পবিত্র। নিশ্চয়ই আমি জালিমদের অন্তর্ভুক্ত ছিলাম।',
      en: 'There is no god but You, glory be to You, I was one of the wrongdoers'
    }
  },
  {
    id: 'darud-1',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    pronunciation: {
      bn: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মাদ',
      en: 'Allahumma salli ala Muhammad'
    },
    meaning: {
      bn: 'হে আল্লাহ, মুহাম্মাদ (সা.)-এর প্রতি দরুদ/রহমত প্রেরণ করুন।',
      en: 'O Allah, send blessings upon Muhammad'
    }
  }
];
