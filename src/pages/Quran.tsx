import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { Card } from '../components/Common';
import { SURAHS_LIST } from '../data/surahs';

export const Quran = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<typeof SURAHS_LIST[0] | null>(null);
  const [ayahs, setAyahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSurahData = async (surahId: number) => {
    setLoading(true);
    setError(null);
    setAyahs([]);
    try {
      // Fetching Arabic text and Bengali translation
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,bn.bengali`);
      const data = await response.json();
      
      if (data.code === 200 && data.data.length >= 2) {
        const arabicAyahs = data.data[0].ayahs;
        const bengaliAyahs = data.data[1].ayahs;
        
        const combinedAyahs = arabicAyahs.map((ayah: any, index: number) => ({
          id: ayah.numberInSurah,
          arabic: ayah.text,
          translation: bengaliAyahs[index].text,
        }));
        
        setAyahs(combinedAyahs);
      } else {
        throw new Error('Failed to load Surah data');
      }
    } catch (err) {
      console.error('Error fetching surah:', err);
      setError('সূরা লোড করতে সমস্যা হয়েছে। দয়া করে ইন্টারনেট কানেকশন চেক করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleSurahSelect = (surah: typeof SURAHS_LIST[0]) => {
    setSelectedSurah(surah);
    fetchSurahData(surah.id);
  };

  const filteredSurahs = SURAHS_LIST.filter(s => 
    s.nameBn.includes(searchQuery) || 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toString() === searchQuery
  );

  if (selectedSurah) {
    return (
      <div className="pb-24 px-4 pt-4 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <button 
          onClick={() => setSelectedSurah(null)}
          className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>ফিরে যান</span>
        </button>

        <div className="bg-emerald-600 dark:bg-emerald-900 rounded-3xl p-8 text-white text-center space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <h2 className="text-3xl font-bold">{selectedSurah.nameAr}</h2>
          <h3 className="text-xl font-bold">{selectedSurah.nameBn}</h3>
          <div className="flex justify-center gap-4 text-xs text-emerald-100">
            <span>{selectedSurah.revelationType === 'Meccan' ? 'মাক্কী' : 'মাদানী'}</span>
            <span>•</span>
            <span>আয়াত: {selectedSurah.totalAyahs}</span>
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-500">সূরা লোড হচ্ছে...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl p-6 border border-red-100 dark:border-red-900/30">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-700 dark:text-gray-300 font-medium">{error}</p>
              <button 
                onClick={() => fetchSurahData(selectedSurah.id)}
                className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold"
              >
                আবার চেষ্টা করুন
              </button>
            </div>
          ) : ayahs.length > 0 ? (
            ayahs.map((ayah) => (
              <Card key={ayah.id} className="p-6 space-y-6 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-700 pb-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    {ayah.id}
                  </div>
                </div>
                <p className="text-right font-serif text-3xl text-gray-800 dark:text-gray-200 leading-loose" dir="rtl">
                  {ayah.arabic}
                </p>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-4">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">অনুবাদ</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                      {ayah.translation}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 px-4 pt-4 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">আল-কুরআন</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">১১৪টি সূরা অর্থসহ</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="সূরা খুঁজুন (নাম বা নম্বর)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredSurahs.map((surah) => (
          <motion.div
            key={surah.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSurahSelect(surah)}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                {surah.id}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{surah.nameBn}</h4>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                  {surah.name} • {surah.totalAyahs} আয়াত
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-serif text-emerald-900 dark:text-emerald-400">{surah.nameAr}</p>
              <p className="text-[10px] text-gray-400">{surah.meaningBn}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
