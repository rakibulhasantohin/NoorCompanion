import React from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, Book, Compass, Heart, ChevronRight, 
  Building2, Plane, Map as MapIcon, Info 
} from 'lucide-react';
import { Card, AppHeader } from '../components/Common';
import { cn } from '../utils/utils';

const HAJJ_CATEGORIES = [
  { id: 'prep', name: 'হজ্জের প্রস্তুতি', icon: Plane, color: 'text-blue-600 bg-blue-50' },
  { id: 'hajj-rules', name: 'হজ্জের নিয়ম', icon: Book, color: 'text-emerald-600 bg-emerald-50' },
  { id: 'umrah-rules', name: 'ওমরাহর নিয়ম', icon: Compass, color: 'text-amber-600 bg-amber-50' },
  { id: 'duas', name: 'হজ্জের দোয়া', icon: Heart, color: 'text-rose-600 bg-rose-50' },
  { id: 'places', name: 'মক্কা ও মদিনা', icon: Building2, color: 'text-purple-600 bg-purple-50' },
  { id: 'map', name: 'হজ্জের ম্যাপ', icon: MapIcon, color: 'text-cyan-600 bg-cyan-50' },
];

export const Hajj = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <AppHeader title="হজ্জ ও ওমরাহ" showBack />

      <div className="px-4 py-6 space-y-6">
        <div className="relative h-64 w-full overflow-hidden rounded-3xl shadow-xl">
          <img 
            src="https://picsum.photos/seed/kaaba/800/600" 
            alt="Hajj" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
            <h2 className="text-3xl font-bold mb-2">হজ্জ ও ওমরাহ</h2>
            <p className="text-white/80 text-sm">হজ্জ ও ওমরাহর সম্পূর্ণ গাইডলাইন</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {HAJJ_CATEGORIES.map((cat) => (
            <motion.div
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 flex flex-col items-center gap-4 shadow-sm cursor-pointer hover:shadow-md transition-all"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm", cat.color)}>
                <cat.icon className="w-7 h-7" />
              </div>
              <span className="font-bold text-gray-800 text-center text-sm">
                {cat.name}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Info className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-primary">জরুরি তথ্য</h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            হজ্জ ইসলামের একটি গুরুত্বপূর্ণ স্তম্ভ। সামর্থ্যবান মুসলিমদের জন্য জীবনে অন্তত একবার হজ্জ করা ফরজ। এই সেকশনে আপনি হজ্জ ও ওমরাহর যাবতীয় নিয়ম-কানুন ও দোয়া পাবেন।
          </p>
        </div>
      </div>
    </div>
  );
};
