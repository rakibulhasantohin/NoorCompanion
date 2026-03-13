import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, Star, Moon, Building2, Hand, 
  ChevronRight, BookOpen, GraduationCap 
} from 'lucide-react';
import { AppHeader } from '../components/Common';
import { cn } from '../utils/utils';
import { useTranslation } from '../hooks/useTranslation';

export const Pillars = () => {
  const { t } = useTranslation();

  const PILLARS = [
    { id: 'shahada', name: t('shahada'), icon: Hand, color: 'text-blue-600 bg-blue-50', desc: t('shahadaDesc') },
    { id: 'namaz', name: t('namaz'), icon: Building2, color: 'text-purple-600 bg-purple-50', desc: t('namazDesc') },
    { id: 'roza', name: t('roza'), icon: Moon, color: 'text-emerald-600 bg-emerald-50', desc: t('rozaDesc') },
    { id: 'zakat', name: t('zakat'), icon: Heart, color: 'text-rose-600 bg-rose-50', desc: t('zakatDesc') },
    { id: 'hajj', name: t('hajj'), icon: Star, color: 'text-amber-600 bg-amber-50', desc: t('hajjDesc') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <AppHeader title={t('fivePillars')} showBack />

      <div className="px-4 py-6 space-y-6">
        <div className="bg-primary rounded-3xl p-8 text-white text-center space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl" />
          <h2 className="text-3xl font-bold mb-2">{t('fivePillars')}</h2>
          <p className="text-white/80 text-sm">{t('pillarsGuide')}</p>
        </div>

        <div className="space-y-4">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-6 flex items-center justify-between border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-5">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm", pillar.color)}>
                  <pillar.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{pillar.name}</h3>
                  <p className="text-sm text-gray-400">{pillar.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-300" />
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">{t('namazEducation')}</h3>
          </div>
          <p className="text-sm text-white/80 leading-relaxed mb-6">
            {t('namazEducationDesc')}
          </p>
          <button className="w-full bg-white text-primary py-3 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
            <BookOpen className="w-4 h-4" />
            {t('startNow')}
          </button>
        </div>
      </div>
    </div>
  );
};
