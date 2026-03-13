import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ArrowLeft, RefreshCw, AlertTriangle, 
  Book, Download, ChevronRight, Star, Play, 
  Pause, Bookmark, Share2, Copy
} from 'lucide-react';
import { Card, AppHeader } from '../components/Common';
import { SURAHS_LIST } from '../data/surahs';
import { cn } from '../utils/utils';
import { useTranslation } from '../hooks/useTranslation';
import { useAppState } from '../hooks/useAppState';

export const Quran = () => {
  const { state, updateState } = useAppState();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'surah' | 'para' | 'bookmarks'>('surah');
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
      const response = await globalThis.fetch(`https://api.alquran.cloud/v1/surah/${surahId}/editions/quran-uthmani,bn.bengali`);
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
        updateState({ lastReadSurah: surahId });
      } else {
        throw new Error('Failed to load Surah data');
      }
    } catch (err) {
      console.error('Error fetching surah:', err);
      setError(t('errorLoadingSurah'));
    } finally {
      setLoading(false);
    }
  };

  const handleSurahSelect = (surah: typeof SURAHS_LIST[0]) => {
    setSelectedSurah(surah);
    fetchSurahData(surah.id);
  };

  const toggleBookmark = (surahId: number) => {
    const isBookmarked = state.bookmarks.includes(surahId);
    if (isBookmarked) {
      updateState({ bookmarks: state.bookmarks.filter(id => id !== surahId) });
    } else {
      updateState({ bookmarks: [...state.bookmarks, surahId] });
    }
  };

  const filteredSurahs = SURAHS_LIST.filter(s => 
    s.nameBn.includes(searchQuery) || 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toString() === searchQuery
  );

  const bookmarkedSurahs = SURAHS_LIST.filter(s => state.bookmarks.includes(s.id));

  if (selectedSurah) {
    return (
      <div className="min-h-screen bg-gray-50 pb-32">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedSurah(null)} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">{selectedSurah.nameBn}</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {selectedSurah.revelationType === 'Meccan' ? t('meccan') : t('madani')} • {selectedSurah.totalAyahs} {t('ayah')}
              </p>
            </div>
          </div>
          <button onClick={() => toggleBookmark(selectedSurah.id)} className="p-2 text-primary">
            <Star size={24} fill={state.bookmarks.includes(selectedSurah.id) ? "currentColor" : "none"} />
          </button>
        </header>

        <div className="px-4 py-6">
          <div className="bg-primary rounded-3xl p-8 text-white text-center space-y-4 shadow-xl relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="text-4xl font-serif mb-2">{selectedSurah.nameAr}</div>
            <div className="text-xl font-bold">{selectedSurah.meaningBn}</div>
            <div className="w-24 h-px bg-white/30 mx-auto"></div>
            <div className="text-sm opacity-80">বিসমিল্লাহির রাহমানির রাহিম</div>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-20">
                <RefreshCw className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                <p className="text-gray-500">{t('loadingSurah')}</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-white rounded-3xl p-6 border border-red-100">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-700 font-medium">{error}</p>
                <button 
                  onClick={() => fetchSurahData(selectedSurah.id)}
                  className="mt-4 px-6 py-2 bg-primary text-white rounded-xl font-bold"
                >
                  {t('retry')}
                </button>
              </div>
            ) : ayahs.length > 0 ? (
              ayahs.map((ayah) => (
                <div key={ayah.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                      {ayah.id}
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                      <button className="hover:text-primary transition-colors"><Play size={18} /></button>
                      <button className="hover:text-primary transition-colors"><Copy size={18} /></button>
                      <button className="hover:text-primary transition-colors"><Bookmark size={18} /></button>
                    </div>
                  </div>
                  <p className="text-right font-serif text-3xl text-gray-800 leading-[2.5]" dir="rtl">
                    {ayah.arabic}
                  </p>
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-sm text-gray-700 leading-relaxed italic">
                      {ayah.translation}
                    </p>
                  </div>
                </div>
              ))
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <AppHeader title={t('quran')} showBack />

      {/* Tabs */}
      <div className="bg-white px-4 py-2 sticky top-[64px] z-40 border-b border-gray-100 overflow-x-auto scrollbar-hide flex gap-2">
        {[
          { id: 'surah', label: t('surah') },
          { id: 'para', label: t('para') },
          { id: 'bookmarks', label: t('bookmarks') },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-gray-500 hover:bg-gray-50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchSurah')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* List */}
        <div className="space-y-3">
          {(activeTab === 'surah' ? filteredSurahs : activeTab === 'bookmarks' ? bookmarkedSurahs : []).map((surah) => (
            <motion.div
              key={surah.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSurahSelect(surah)}
              className="bg-white rounded-3xl p-4 border border-gray-100 flex items-center justify-between shadow-sm cursor-pointer hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-bold text-sm">
                  {surah.id}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{surah.nameBn}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {surah.revelationType === 'Meccan' ? t('meccan') : t('madani')} • {surah.totalAyahs} {t('ayah')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-serif text-primary">{surah.nameAr}</p>
                <p className="text-[10px] text-gray-400">{surah.meaningBn}</p>
              </div>
            </motion.div>
          ))}

          {activeTab === 'bookmarks' && bookmarkedSurahs.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <Star size={48} className="mx-auto mb-4 opacity-20" />
              <p>{t('noBookmarks')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
