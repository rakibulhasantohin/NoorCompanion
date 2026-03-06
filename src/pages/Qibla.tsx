import React from 'react';
import { motion } from 'motion/react';
import { Compass, Navigation, Info } from 'lucide-react';
import { Card } from '../components/Common';

export const Qibla = () => {
  return (
    <div className="pb-24 px-4 pt-8 flex flex-col items-center space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">কিবলা কম্পাস</h2>
        <p className="text-gray-500">কাবার সঠিক দিক নির্ণয় করুন</p>
      </div>

      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-emerald-50 shadow-inner" />
        
        {/* Compass Face */}
        <motion.div
          animate={{ rotate: 45 }} // Mock rotation
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          className="relative w-64 h-64 rounded-full bg-white shadow-2xl flex items-center justify-center"
        >
          <div className="absolute top-4 font-bold text-emerald-900">N</div>
          <div className="absolute bottom-4 font-bold text-gray-300">S</div>
          <div className="absolute left-4 font-bold text-gray-300">W</div>
          <div className="absolute right-4 font-bold text-gray-300">E</div>
          
          {/* Kaaba Indicator */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 flex flex-col items-center">
            <div className="w-8 h-8 bg-emerald-900 rounded-lg flex items-center justify-center text-white shadow-lg">
              <Navigation className="w-5 h-5 fill-white" />
            </div>
            <div className="w-1 h-32 bg-emerald-900/20 rounded-full" />
          </div>
          
          <Compass className="w-12 h-12 text-emerald-100" />
        </motion.div>
      </div>

      <div className="w-full space-y-4">
        <Card className="bg-emerald-900 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-200 text-xs uppercase tracking-widest">কিবলার দিক</p>
              <h4 className="text-2xl font-bold">২৮৫.৪° পশ্চিম</h4>
            </div>
            <div className="w-12 h-12 bg-emerald-800 rounded-2xl flex items-center justify-center">
              <Navigation className="w-6 h-6 rotate-[285deg]" />
            </div>
          </div>
        </Card>

        <Card className="flex items-start gap-3 bg-amber-50 border-amber-100">
          <Info className="w-5 h-5 text-amber-600 mt-0.5" />
          <p className="text-xs text-amber-900 leading-relaxed">
            সঠিক দিক পেতে আপনার ফোনটি সমতল স্থানে রাখুন এবং ধাতব বস্তু থেকে দূরে থাকুন।
          </p>
        </Card>
      </div>
    </div>
  );
};
