import React from 'react';
import { AppHeader } from '../components/Common';
import { useAppState } from '../hooks/useAppState';

export const NamesOfAllah = () => {
  const { state } = useAppState();
  const isBn = state.language === 'bn';

  const names = [
    { ar: 'الله', tr: 'Allah', bn: 'আল্লাহ', m: 'The One God' },
    { ar: 'الرحمن', tr: 'Ar-Rahman', bn: 'আর-রহমান', m: 'The Most Gracious' },
    { ar: 'الرحيم', tr: 'Ar-Rahim', bn: 'আর-রহীম', m: 'The Most Merciful' },
    { ar: 'الملك', tr: 'Al-Malik', bn: 'আল-মালিক', m: 'The Sovereign' },
    { ar: 'القدوس', tr: 'Al-Quddus', bn: 'আল-কুদ্দুস', m: 'The Pure' },
    { ar: 'السلام', tr: 'As-Salam', bn: 'আস-সালাম', m: 'The Source of Peace' },
    { ar: 'المؤمن', tr: 'Al-Mu’min', bn: 'আল-মুমিন', m: 'The Giver of Faith' },
    { ar: 'المهيمن', tr: 'Al-Muhaymin', bn: 'আল-মুহাইমিন', m: 'The Guardian' },
    { ar: 'العزيز', tr: 'Al-Aziz', bn: 'আল-আজিজ', m: 'The Mighty' },
    { ar: 'الجبار', tr: 'Al-Jabbar', bn: 'আল-জাব্বার', m: 'The Compeller' },
    { ar: 'المتكبر', tr: 'Al-Mutakabbir', bn: 'আল-মুতাকাব্বির', m: 'The Greatest' },
    { ar: 'الخالق', tr: 'Al-Khaliq', bn: 'আল-খালিক', m: 'The Creator' },
    { ar: 'البارئ', tr: 'Al-Bari’', bn: 'আল-বারিউ', m: 'The Evolver' },
    { ar: 'المصور', tr: 'Al-Musawwir', bn: 'আল-মুসাব্বির', m: 'The Fashioner' },
    { ar: 'الغفار', tr: 'Al-Ghaffar', bn: 'আল-গাফফার', m: 'The Forgiver' },
    { ar: 'القهار', tr: 'Al-Qahhar', bn: 'আল-কাহহার', m: 'The Subduer' },
    { ar: 'الوهاب', tr: 'Al-Wahhab', bn: 'আল-ওয়াহহাব', m: 'The Bestower' },
    { ar: 'الرزاق', tr: 'Ar-Razzaq', bn: 'আর-রাজ্জাক', m: 'The Provider' },
    { ar: 'الفتاح', tr: 'Al-Fattah', bn: 'আল-ফাত্তাহ', m: 'The Opener' },
    { ar: 'العليم', tr: 'Al-Alim', bn: 'আল-আলীম', m: 'The All-Knowing' },
    { ar: 'القابض', tr: 'Al-Qabid', bn: 'আল-কাবিদ', m: 'The Constrictor' },
    { ar: 'الباسط', tr: 'Al-Basit', bn: 'আল-বাসিত', m: 'The Expander' },
    { ar: 'الخافض', tr: 'Al-Khafid', bn: 'আল-খাফিদ', m: 'The Abaser' },
    { ar: 'الرافع', tr: 'Ar-Rafi’', bn: 'আর-রাফি', m: 'The Exalter' },
    { ar: 'المعز', tr: 'Al-Mu’izz', bn: 'আল-মুইজ', m: 'The Giver of Honor' },
    { ar: 'المذل', tr: 'Al-Mudhill', bn: 'আল-মুজিল', m: 'The Giver of Dishonor' },
    { ar: 'السميع', tr: 'As-Sami’', bn: 'আস-সামি', m: 'The All-Hearing' },
    { ar: 'البصير', tr: 'Al-Basir', bn: 'আল-বাসির', m: 'The All-Seeing' },
    { ar: 'الحكم', tr: 'Al-Hakam', bn: 'আল-হাকাম', m: 'The Judge' },
    { ar: 'العدل', tr: 'Al-Adl', bn: 'আল-আদল', m: 'The Just' },
    { ar: 'اللطيف', tr: 'Al-Latif', bn: 'আল-লাতিফ', m: 'The Subtle One' },
    { ar: 'الخبير', tr: 'Al-Khabir', bn: 'আল-খাবির', m: 'The All-Aware' },
    { ar: 'الحليم', tr: 'Al-Halim', bn: 'আল-হালিম', m: 'The Forbearing' },
    { ar: 'العظيم', tr: 'Al-Azim', bn: 'আল-আজিম', m: 'The Magnificent' },
    { ar: 'الغفور', tr: 'Al-Ghafur', bn: 'আল-গাফুর', m: 'The Forgiving' },
    { ar: 'الشكور', tr: 'Ash-Shakur', bn: 'আশ-শাকুর', m: 'The Grateful' },
    { ar: 'العلي', tr: 'Al-Aliyy', bn: 'আল-আলী', m: 'The Most High' },
    { ar: 'الكبير', tr: 'Al-Kabir', bn: 'আল-কাবীর', m: 'The Most Great' },
    { ar: 'الحفيظ', tr: 'Al-Hafiz', bn: 'আল-হাফিজ', m: 'The Preserver' },
    { ar: 'المقيت', tr: 'Al-Muqit', bn: 'আল-মুকিত', m: 'The Sustainer' },
    { ar: 'الحسيب', tr: 'Al-Hasib', bn: 'আল-হাসিব', m: 'The Reckoner' },
    { ar: 'الجليل', tr: 'Al-Jalil', bn: 'আল-জলীল', m: 'The Majestic' },
    { ar: 'الكريم', tr: 'Al-Karim', bn: 'আল-কারীম', m: 'The Generous' },
    { ar: 'الرقيب', tr: 'Ar-Raqib', bn: 'আর-রাকীব', m: 'The Watchful' },
    { ar: 'المجيب', tr: 'Al-Mujib', bn: 'আল-মুজিব', m: 'The Responsive' },
    { ar: 'الواسع', tr: 'Al-Wasi’', bn: 'আল-ওয়াসি', m: 'The All-Encompassing' },
    { ar: 'الحكيم', tr: 'Al-Hakim', bn: 'আল-হাকীম', m: 'The Wise' },
    { ar: 'الودود', tr: 'Al-Wadud', bn: 'আল-ওয়াদুদ', m: 'The Loving' },
    { ar: 'المجيد', tr: 'Al-Majid', bn: 'আল-মাজীদ', m: 'The Glorious' },
    { ar: 'الباعث', tr: 'Al-Ba’ith', bn: 'আল-বাইস', m: 'The Resurrector' },
    { ar: 'الشهيد', tr: 'Ash-Shahid', bn: 'আশ-শহীদ', m: 'The Witness' },
    { ar: 'الحق', tr: 'Al-Haqq', bn: 'আল-হাক', m: 'The Truth' },
    { ar: 'الوكيل', tr: 'Al-Wakil', bn: 'আল-ওয়াকীল', m: 'The Trustee' },
    { ar: 'القوي', tr: 'Al-Qawiyy', bn: 'আল-কাবি', m: 'The Strong' },
    { ar: 'المتين', tr: 'Al-Matin', bn: 'আল-মতীন', m: 'The Firm' },
    { ar: 'الولي', tr: 'Al-Waliyy', bn: 'আল-ওয়ালী', m: 'The Friend' },
    { ar: 'الحميد', tr: 'Al-Hamid', bn: 'আল-হামীদ', m: 'The Praiseworthy' },
    { ar: 'المحصي', tr: 'Al-Muhsi', bn: 'আল-মুহসী', m: 'The Accounter' },
    { ar: 'المبدئ', tr: 'Al-Mubdi’', bn: 'আল-মুবদী', m: 'The Originator' },
    { ar: 'المعيد', tr: 'Al-Mu’id', bn: 'আল-মুঈদ', m: 'The Restorer' },
    { ar: 'المحيي', tr: 'Al-Muhyi', bn: 'আল-মুহয়ী', m: 'The Giver of Life' },
    { ar: 'المميت', tr: 'Al-Mumit', bn: 'আল-মুমীত', m: 'The Giver of Death' },
    { ar: 'الحي', tr: 'Al-Hayy', bn: 'আল-হাইয়্যু', m: 'The Ever-Living' },
    { ar: 'القيوم', tr: 'Al-Qayyum', bn: 'আল-কাইয়্যুম', m: 'The Self-Subsisting' },
    { ar: 'الواجد', tr: 'Al-Wajid', bn: 'আল-ওয়াজিদ', m: 'The Finder' },
    { ar: 'الماجد', tr: 'Al-Majid', bn: 'আল-মাজিদ', m: 'The Noble' },
    { ar: 'الواحد', tr: 'Al-Wahid', bn: 'আল-ওয়াহিদ', m: 'The Unique' },
    { ar: 'الأحد', tr: 'Al-Ahad', bn: 'আল-আহাদ', m: 'The One' },
    { ar: 'الصمد', tr: 'As-Samad', bn: 'আস-সামাদ', m: 'The Eternal' },
    { ar: 'القادر', tr: 'Al-Qadir', bn: 'আল-কাদির', m: 'The Able' },
    { ar: 'المقتدر', tr: 'Al-Muqtadir', bn: 'আল-মুক্তাদির', m: 'The Powerful' },
    { ar: 'المقدم', tr: 'Al-Muqaddim', bn: 'আল-মুকাদ্দিম', m: 'The Expediter' },
    { ar: 'المؤخر', tr: 'Al-Mu’akhkhir', bn: 'আল-মুয়াখখির', m: 'The Delayer' },
    { ar: 'الأول', tr: 'Al-Awwal', bn: 'আল-আউয়াল', m: 'The First' },
    { ar: 'الآخر', tr: 'Al-Akhir', bn: 'আল-আখির', m: 'The Last' },
    { ar: 'الظاهر', tr: 'Az-Zahir', bn: 'আজ-জাহির', m: 'The Manifest' },
    { ar: 'الباطن', tr: 'Al-Batin', bn: 'আল-বাতিন', m: 'The Hidden' },
    { ar: 'الوالي', tr: 'Al-Wali', bn: 'আল-ওয়ালী', m: 'The Governor' },
    { ar: 'المتعالي', tr: 'Al-Muta’ali', bn: 'আল-মুতাআলী', m: 'The Most Exalted' },
    { ar: 'البر', tr: 'Al-Barr', bn: 'আল-বারর', m: 'The Source of Goodness' },
    { ar: 'التواب', tr: 'At-Tawwab', bn: 'আত-তাওয়াব', m: 'The Acceptor of Repentance' },
    { ar: 'المنتقم', tr: 'Al-Muntaqim', bn: 'আল-মুনতাকিম', m: 'The Avenger' },
    { ar: 'العفو', tr: 'Al-Afuww', bn: 'আল-আফউ', m: 'The Pardoner' },
    { ar: 'الرؤوف', tr: 'Ar-Ra’uf', bn: 'আর-রাউফ', m: 'The Compassionate' },
    { ar: 'مالك الملك', tr: 'Malik-ul-Mulk', bn: 'মালিকুল মুলক', m: 'The Owner of All' },
    { ar: 'ذو الجلال والإكرام', tr: 'Dhul-Jalal wal-Ikram', bn: 'জুল জালালি ওয়াল ইকরাম', m: 'The Lord of Majesty' },
    { ar: 'المقسط', tr: 'Al-Muqsit', bn: 'আল-মুকসিত', m: 'The Equitable' },
    { ar: 'الجامع', tr: 'Al-Jami’', bn: 'আল-জামি', m: 'The Gatherer' },
    { ar: 'الغني', tr: 'Al-Ghaniyy', bn: 'আল-গানী', m: 'The Rich' },
    { ar: 'المغني', tr: 'Al-Mughni', bn: 'আল-মুগনী', m: 'The Enricher' },
    { ar: 'المانع', tr: 'Al-Mani’', bn: 'আল-মানি', m: 'The Preventer' },
    { ar: 'الضار', tr: 'Ad-Darr', bn: 'আদ-দারর', m: 'The Distresser' },
    { ar: 'النافع', tr: 'An-Nafi’', bn: 'আন-নাফি', m: 'The Propitious' },
    { ar: 'النور', tr: 'An-Nur', bn: 'আন-নূর', m: 'The Light' },
    { ar: 'الهادي', tr: 'Al-Hadi', bn: 'আল-হাদী', m: 'The Guide' },
    { ar: 'البديع', tr: 'Al-Badi’', bn: 'আল-বাদী', m: 'The Incomparable' },
    { ar: 'الباقي', tr: 'Al-Baqi', bn: 'আল-বাকী', m: 'The Everlasting' },
    { ar: 'الوارث', tr: 'Al-Warith', bn: 'আল-ওয়ারিস', m: 'The Inheritor' },
    { ar: 'الرشيد', tr: 'Ar-Rashid', bn: 'আর-রাশীদ', m: 'The Guide' },
    { ar: 'الصبور', tr: 'As-Sabur', bn: 'আস-সবুর', m: 'The Patient' },
  ];

  return (
    <div className="pb-20">
      <AppHeader title={isBn ? 'আল্লাহর ৯৯ নাম' : '99 Names of Allah'} showBack />
      <div className="p-4 grid grid-cols-2 gap-3">
        {names.map((name, i) => (
          <div key={i} className="bg-white p-3 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="text-xl font-arabic text-primary mb-1">{name.ar}</div>
            <div className="font-bold text-gray-800 text-sm">{isBn ? name.bn : name.tr}</div>
            <div className="text-[10px] text-gray-500">{name.m}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
