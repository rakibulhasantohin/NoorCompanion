export interface Holiday {
  nameBn: string;
  nameEn: string;
  messageBn: string;
  messageEn: string;
  hijriDate?: {
    month: number;
    day: number;
    range?: number; // Number of days to show (e.g. 2 for Eid)
  };
  isSpecial?: 'last-friday-ramadan';
}

export const HOLIDAYS: Holiday[] = [
  {
    nameBn: 'শবে বরাত',
    nameEn: 'Shab-e-Barat',
    messageBn: 'আল্লাহ তাআলা আপনার ও আপনার পরিবারের সকল ইবাদত কবুল করুন।',
    messageEn: 'May Allah accept all your and your family\'s prayers.',
    hijriDate: { month: 8, day: 15 }
  },
  {
    nameBn: 'শবে কদর',
    nameEn: 'Shab-e-Qadr',
    messageBn: 'এই পবিত্র রজনীতে আল্লাহ আপনার সকল দোয়া কবুল করুন।',
    messageEn: 'May Allah accept all your prayers on this holy night.',
    hijriDate: { month: 9, day: 26, range: 2 } // 26-27 Ramadan
  },
  {
    nameBn: 'জুমাতুল বিদা',
    nameEn: 'Jumatul Bida',
    messageBn: 'রমজানের শেষ জুমায় আল্লাহ আমাদের ক্ষমা করুন।',
    messageEn: 'May Allah forgive us on this last Friday of Ramadan.',
    isSpecial: 'last-friday-ramadan'
  },
  {
    nameBn: 'ঈদুল ফিতর',
    nameEn: 'Eid-ul-Fitr',
    messageBn: 'ঈদ মোবারক! আল্লাহ আপনার সকল ইবাদত কবুল করুন।',
    messageEn: 'Eid Mubarak! May Allah accept all your prayers.',
    hijriDate: { month: 10, day: 1, range: 2 }
  },
  {
    nameBn: 'ঈদুল আযহা',
    nameEn: 'Eid-ul-Adha',
    messageBn: 'ঈদ মোবারক! আপনার কোরবানি কবুল হোক।',
    messageEn: 'Eid Mubarak! May your sacrifice be accepted.',
    hijriDate: { month: 12, day: 10, range: 2 }
  },
  {
    nameBn: 'আশুরা',
    nameEn: 'Ashura',
    messageBn: 'আশুরার এই দিনে আল্লাহ আমাদের রহমত দান করুন।',
    messageEn: 'May Allah bestow His mercy upon us on this day of Ashura.',
    hijriDate: { month: 1, day: 10 }
  }
];
