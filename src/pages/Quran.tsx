import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Book, Bookmark, Play, ChevronRight, ArrowLeft, Loader2, Volume2 } from 'lucide-react';
import { Card, SectionTitle } from '../components/Common';
import { SURAHS_LIST } from '../data/surahs';
import { useAppState } from '../hooks/useAppState';

interface Ayah {
  number: number;
  text: string;
  translation: string;
  transliteration?: string;
}

export const Quran = () => {
  const { state, updateState } = useAppState();
  const [search, setSearch] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [surahData, setSurahData] = useState<{ ayahs: Ayah[], name: string, nameBn: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredSurahs = SURAHS_LIST.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.nameBn.includes(search)
  );

  const fetchSurahData = async (id: number) => {
    setLoading(true);
    try {
      // Fetching Arabic, Bengali translation and English transliteration
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${id}/editions/quran-simple,bn.bengali,en.transliteration`);
      const data = await response.json();
      
      if (data.code === 200) {
        const arabicAyahs = data.data[0].ayahs;
        const bengaliAyahs = data.data[1].ayahs;
        const translitAyahs = data.data[2].ayahs;
        
        const combinedAyahs: Ayah[] = arabicAyahs.map((a: any, index: number) => ({
          number: a.numberInSurah,
          text: a.text,
          translation: bengaliAyahs[index].text,
          transliteration: translitAyahs[index].text
        }));

        const surahInfo = SURAHS_LIST.find(s => s.id === id);
        setSurahData({
          ayahs: combinedAyahs,
          name: surahInfo?.name || '',
          nameBn: surahInfo?.nameBn || ''
        });
        updateState({ lastReadSurah: id });
      }
    } catch (error) {
      console.error('Error fetching surah:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSurahClick = (id: number) => {
    setSelectedSurah(id);
    fetchSurahData(id);
  };

  const lastRead = SURAHS_LIST.find(s => s.id === state.lastReadSurah) || SURAHS_LIST[35]; // Default to Yaseen

  if (selectedSurah && surahData) {
    return (
      <div className="pb-24 px-0 pt-0 min-h-screen bg-white">
        <div className="sticky top-0 z-50 bg-emerald-900 text-white p-4 flex items-center gap-4 shadow-md">
          <button onClick={() => setSelectedSurah(null)} className="p-1 hover:bg-emerald-800 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="font-bold text-lg leading-tight">{surahData.nameBn}</h2>
            <p className="text-xs text-emerald-200">{surahData.name} • {surahData.ayahs.length} আয়াত</p>
          </div>
        </div>

        <div className="p-4 space-y-8">
          {selectedSurah !== 1 && selectedSurah !== 9 && (
            <div className="text-center py-8 border-b border-gray-100">
              <p className="text-3xl font-serif text-emerald-900 mb-2" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              <p className="text-sm text-gray-500 italic">পরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি</p>
            </div>
          )}

          {surahData.ayahs.map((ayah) => (
            <div key={ayah.number} className="space-y-6 pb-10 border-b border-gray-50 last:border-0">
              <div className="flex flex-col items-end gap-4">
                <div className="flex items-center gap-3 w-full justify-between">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-xs font-bold text-emerald-700 shrink-0 border border-emerald-100">
                    {ayah.number}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-4xl font-serif text-right leading-[2] text-gray-900 w-full" dir="rtl">
                  {ayah.text}
                </p>
              </div>
              <div className="space-y-3 bg-emerald-50/30 p-4 rounded-2xl border border-emerald-50/50">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">উচ্চারণ</p>
                    <p className="text-sm text-emerald-800 italic leading-relaxed">
                      {ayah.transliteration}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pt-2 border-t border-emerald-100/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">অর্থ</p>
                    <p className="text-base text-emerald-900 font-medium leading-relaxed">
                      {ayah.translation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {selectedSurah < 114 && (
            <div className="pt-8 pb-12">
              <button 
                onClick={() => {
                  window.scrollTo(0, 0);
                  handleSurahClick(selectedSurah + 1);
                }}
                className="w-full bg-emerald-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-emerald-800 transition-colors"
              >
                পরবর্তী সুরা: {SURAHS_LIST.find(s => s.id === selectedSurah + 1)?.nameBn}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 px-4 pt-4 space-y-6">
      {loading && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
            <p className="text-emerald-900 font-medium">সুরা লোড হচ্ছে...</p>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="সুরা খুঁজুন..."
          className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card 
          onClick={() => handleSurahClick(lastRead.id)}
          className="bg-emerald-900 text-white flex flex-col items-center justify-center py-6 cursor-pointer"
        >
          <Bookmark className="w-8 h-8 mb-2 text-emerald-300" />
          <span className="text-xs font-medium text-emerald-200">পড়া চালিয়ে যান</span>
          <p className="font-bold text-lg">{lastRead.nameBn}</p>
        </Card>
        <Card className="bg-amber-50 border-amber-100 flex flex-col items-center justify-center py-6">
          <Play className="w-8 h-8 mb-2 text-amber-600" />
          <span className="text-xs font-medium text-amber-600">অডিও তিলাওয়াত</span>
          <p className="font-bold text-lg text-amber-900">শুনুন</p>
        </Card>
      </div>

      <section>
        <SectionTitle title="সুরা সমূহ" />
        <div className="space-y-3">
          {filteredSurahs.map((surah) => (
            <motion.div
              key={surah.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSurahClick(surah.id)}
              className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between shadow-sm cursor-pointer hover:border-emerald-200 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 font-bold">
                  {surah.id}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{surah.nameBn}</h4>
                  <p className="text-xs text-gray-400">{surah.name} • {surah.totalAyahs} আয়াত</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-serif text-emerald-800" dir="rtl">{surah.nameAr}</span>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
