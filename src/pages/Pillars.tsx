import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, Star, Moon, Building2, Hand, Info, 
  ChevronRight, BookOpen, GraduationCap 
} from 'lucide-react';
import { Card } from '../components/Common';
import { cn } from '../utils/utils';

const PILLARS = [
  { id: 'shahada', name: 'কালিমা', icon: Hand, color: 'text-blue-600 bg-blue-50', desc: 'আল্লাহ ছাড়া কোনো ইলাহ নেই' },
  { id: 'namaz', name: 'নামাজ', icon: Building2, color: 'text-purple-600 bg-purple-50', desc: 'দৈনিক ৫ ওয়াক্ত নামাজ' },
  { id: 'roza', name: 'রোজা', icon: Moon, color: 'text-emerald-600 bg-emerald-50', desc: 'রমজান মাসে রোজা রাখা' },
  { id: 'zakat', name: 'যাকাত', icon: Heart, color: 'text-rose-600 bg-rose-50', desc: 'সম্পদের নির্দিষ্ট অংশ দান' },
  { id: 'hajj', name: 'হজ্জ', icon: Star, color: 'text-amber-600 bg-amber-50', desc: 'সামর্থ্য থাকলে হজ্জ করা' },
];

export const Pillars = () => {
  return (
    <div className="pb-24 space-y-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="bg-emerald-700 dark:bg-emerald-900 px-6 pt-12 pb-12 text-white text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl" />
        <h2 className="text-4xl font-black mb-2">ইসলামের ৫টি স্তম্ভ</h2>
        <p className="text-emerald-100/90 text-sm">ইসলামের বুনিয়াদী শিক্ষা ও পালনীয় বিধান</p>
      </div>

      <div className="px-4 space-y-4">
        {PILLARS.map((pillar, i) => (
          <motion.div
            key={pillar.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6 flex items-center justify-between border-none shadow-xl shadow-emerald-900/5 cursor-pointer hover:shadow-md transition-all">
              <div className="flex items-center gap-5">
                <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center shadow-sm", pillar.color)}>
                  <pillar.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">{pillar.name}</h3>
                  <p className="text-sm text-gray-500 font-medium">{pillar.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-300" />
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="px-4">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-6 border-none shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black">নামাজ শিক্ষা</h3>
          </div>
          <p className="text-sm text-emerald-50 font-medium leading-relaxed mb-6">
            নামাজ ইসলামের দ্বিতীয় স্তম্ভ। নামাজের সঠিক নিয়ম, দোয়া ও সূরাগুলো শিখুন আমাদের এই বিশেষ গাইড থেকে।
          </p>
          <button className="w-full bg-white text-emerald-700 py-3 rounded-2xl font-black text-sm shadow-lg flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4" />
            শুরু করুন
          </button>
        </Card>
      </div>
    </div>
  );
};
