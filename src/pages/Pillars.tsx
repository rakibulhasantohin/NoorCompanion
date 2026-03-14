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
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader title={t('fivePillars')} showBack />

      <div className="px-4 py-4 space-y-4">
        <div className="bg-primary rounded-3xl p-6 text-white text-center space-y-3 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <h2 className="text-2xl font-bold mb-1">{t('fivePillars')}</h2>
          <p className="text-white/80 text-xs">{t('pillarsGuide')}</p>
        </div>

        <div className="space-y-3">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-4 flex items-center justify-between border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm", pillar.color)}>
                  <pillar.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{pillar.name}</h3>
                  <p className="text-xs text-gray-400">{pillar.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-5 rounded-3xl shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">{t('namazEducation')}</h3>
          </div>
          <p className="text-xs text-white/80 leading-relaxed mb-4">
            {t('namazEducationDesc')}
          </p>
          <button className="w-full bg-white text-primary py-2.5 rounded-2xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all">
            <BookOpen className="w-4 h-4" />
            {t('startNow')}
          </button>
        </div>
      </div>
    </div>
  );
};
