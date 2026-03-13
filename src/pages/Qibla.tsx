import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Compass, Navigation, MapPin, AlertCircle } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { AppHeader } from '../components/Common';
import { useTranslation } from '../hooks/useTranslation';

export const Qibla: React.FC = () => {
  const { state } = useAppState();
  const { t } = useTranslation();
  const [heading, setHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Calculate Qibla direction from current location
    const lat = state.location?.lat || 23.7289;
    const lng = state.location?.lng || 90.3944;
    
    // Kaaba coordinates
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;

    const y = Math.sin(Math.toRadians(kaabaLng - lng));
    const x = Math.cos(Math.toRadians(lat)) * Math.tan(Math.toRadians(kaabaLat)) - 
              Math.sin(Math.toRadians(lat)) * Math.cos(Math.toRadians(kaabaLng - lng));
    
    const qibla = Math.toDegrees(Math.atan2(y, x));
    setQiblaDirection((qibla + 360) % 360);

    // Device orientation
    const handleOrientation = (e: any) => {
      if (e.webkitCompassHeading) {
        setHeading(e.webkitCompassHeading);
      } else if (e.alpha) {
        setHeading(360 - e.alpha);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    } else {
      setError(t('noCompassSupport'));
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [state.location, t]);

  // Helper functions for math
  Math.toRadians = (degrees: number) => degrees * (Math.PI / 180);
  Math.toDegrees = (radians: number) => radians * (180 / Math.PI);

  const isAligned = Math.abs(heading - qiblaDirection) < 5;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <AppHeader title={t('qiblaCompass')} showBack />

      <div className="px-4 py-12 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-primary font-bold mb-2">
            <MapPin size={18} />
            <span>{state.city}, Bangladesh</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{t('qiblaDirection')}</h2>
          <p className="text-gray-400 text-sm mt-1">{t('phoneFlat')}</p>
        </div>

        {/* Compass Container */}
        <div className="relative w-72 h-72 flex items-center justify-center mb-12">
          {/* Compass Ring */}
          <motion.div 
            animate={{ rotate: -heading }}
            transition={{ type: 'spring', stiffness: 50 }}
            className="absolute inset-0 w-full h-full border-8 border-gray-100 rounded-full flex items-center justify-center"
          >
            {[0, 90, 180, 270].map(deg => (
              <div 
                key={deg} 
                className="absolute font-bold text-gray-300"
                style={{ transform: `rotate(${deg}deg) translateY(-110px)` }}
              >
                {deg === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : 'W'}
              </div>
            ))}
            
            {/* Qibla Indicator on Ring */}
            <div 
              className="absolute w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg"
              style={{ transform: `rotate(${qiblaDirection}deg) translateY(-120px)` }}
            >
              <Navigation size={16} fill="currentColor" />
            </div>
          </motion.div>

          {/* Center Needle */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.div 
              animate={{ rotate: qiblaDirection - heading }}
              transition={{ type: 'spring', stiffness: 50 }}
              className={`w-1 h-40 rounded-full transition-colors duration-500 ${isAligned ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors duration-500 ${isAligned ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <Compass size={24} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Status Info */}
        <div className="w-full max-w-xs space-y-4">
          <div className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all duration-500 ${isAligned ? 'bg-primary/5 border-primary' : 'bg-white border-gray-100'}`}>
            <div className={`p-2 rounded-xl ${isAligned ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
              <Navigation size={20} />
            </div>
            <div className="text-left">
              <div className={`font-bold ${isAligned ? 'text-primary' : 'text-gray-800'}`}>
                {isAligned ? t('qiblaAligned') : t('rotatePhone')}
              </div>
              <div className="text-xs text-gray-400">অ্যাঙ্গেল: {Math.round(qiblaDirection)}°</div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-500 text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add TypeScript declarations for Math
declare global {
  interface Math {
    toRadians(degrees: number): number;
    toDegrees(radians: number): number;
  }
}
