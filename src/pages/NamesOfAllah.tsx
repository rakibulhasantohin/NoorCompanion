import React from 'react';
import { AppHeader } from '../components/Common';
import { useAppState } from '../hooks/useAppState';

export const NamesOfAllah = () => {
  const { state } = useAppState();
  const isBn = state.language === 'bn';

  const names = [
    { ar: 'ٱللَّه', tr: 'Allah', bn: 'আল্লাহ', m: 'The One God' },
    { ar: 'ٱلرَّحْمَٰنُ', tr: 'Ar-Rahman', bn: 'আর-রহমান', m: 'The Most Gracious' },
    { ar: 'ٱلرَّحِيمُ', tr: 'Ar-Rahim', bn: 'আর-রহীম', m: 'The Most Merciful' },
    { ar: 'ٱلْمَلِكُ', tr: 'Al-Malik', bn: 'আল-মালিক', m: 'The Sovereign' },
    { ar: 'ٱلْقُدُّوسُ', tr: 'Al-Quddus', bn: 'আল-কুদ্দুস', m: 'The Pure' },
    { ar: 'ٱلسَّلَٰمُ', tr: 'As-Salam', bn: 'আস-সালাম', m: 'The Source of Peace' },
    { ar: 'ٱلْمُؤْمِنُ', tr: 'Al-Mu’min', bn: 'আল-মুমিন', m: 'The Giver of Faith' },
    { ar: 'ٱلْمُهَيْمِنُ', tr: 'Al-Muhaymin', bn: 'আল-মুহাইমিন', m: 'The Guardian' },
    { ar: 'ٱلْعَزِيزُ', tr: 'Al-Aziz', bn: 'আল-আজিজ', m: 'The Mighty' },
    { ar: 'ٱلْجَبَّارُ', tr: 'Al-Jabbar', bn: 'আল-জাব্বার', m: 'The Compeller' },
  ];

  return (
    <div className="pb-24">
      <AppHeader title={isBn ? 'আল্লাহর ৯৯ নাম' : '99 Names of Allah'} showBack />
      <div className="p-4 grid grid-cols-2 gap-4">
        {names.map((name, i) => (
          <div key={i} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="text-2xl font-arabic text-primary mb-2">{name.ar}</div>
            <div className="font-bold text-gray-800">{isBn ? name.bn : name.tr}</div>
            <div className="text-xs text-gray-500">{name.m}</div>
          </div>
        ))}
      </div>
      <div className="p-4 text-center text-gray-400 text-sm">
        {isBn ? 'আরও নাম শীঘ্রই আসছে...' : 'More names coming soon...'}
      </div>
    </div>
  );
};
