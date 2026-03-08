import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Compass, Navigation, Info, AlertCircle } from 'lucide-react';
import { Card } from '../components/Common';

export const Qibla = () => {
  const [heading, setHeading] = useState(0);
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      // More robust check: check for orientation support or touch
      const hasOrientation = 'DeviceOrientationEvent' in window;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsDesktop(!isTouch && !hasOrientation);
    };
    checkDesktop();
  }, []);

  const calculateQibla = (lat: number, lng: number) => {
    const kaabaLat = 21.4225 * (Math.PI / 180);
    const kaabaLng = 39.8262 * (Math.PI / 180);
    const userLat = lat * (Math.PI / 180);
    const userLng = lng * (Math.PI / 180);

    const deltaLng = kaabaLng - userLng;
    const y = Math.sin(deltaLng);
    const x = Math.cos(userLat) * Math.tan(kaabaLat) - Math.sin(userLat) * Math.cos(deltaLng);
    let qibla = Math.atan2(y, x) * (180 / Math.PI);
    return (qibla + 360) % 360;
  };

  const startCompass = async () => {
    setError(null);
    
    // Request Geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const angle = calculateQibla(position.coords.latitude, position.coords.longitude);
        setQiblaAngle(angle);
      },
      (err) => {
        setError('অবস্থান পাওয়া যায়নি। কিবলার দিক নির্ণয়ের জন্য লোকেশন পারমিশন প্রয়োজন।');
      },
      { enableHighAccuracy: true }
    );

    // Request Orientation Permission (iOS 13+)
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
          setError('কম্পাস ব্যবহারের অনুমতি পাওয়া যায়নি। ব্রাউজার সেটিংসে গিয়ে মোশন পারমিশন এলাউ করুন।');
        }
      } catch (err) {
        setError('কম্পাস চালু করতে সমস্যা হয়েছে। অনুগ্রহ করে পেজটি রিফ্রেশ করে আবার চেষ্টা করুন।');
      }
    } else {
      // Android or non-iOS
      setPermissionGranted(true);
      // Try both events for maximum compatibility
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    let heading = 0;

    if ((event as any).webkitCompassHeading) {
      // iOS
      heading = (event as any).webkitCompassHeading;
    } else if (event.absolute && event.alpha !== null) {
      // Android Absolute
      heading = 360 - event.alpha;
    } else if (event.alpha !== null) {
      // Android Relative (fallback)
      heading = 360 - event.alpha;
    }
    
    setHeading(heading);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
    };
  }, []);

  return (
    <div className="pb-24 px-4 pt-8 flex flex-col items-center space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">কিবলা কম্পাস</h2>
        <p className="text-gray-500">কাবার সঠিক দিক নির্ণয় করুন</p>
      </div>

      {!permissionGranted ? (
        <div className="flex flex-col items-center space-y-6 py-12">
          <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Compass className="w-12 h-12" />
          </div>
          {isDesktop ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-amber-600 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                কম্পাস ফিচারটি শুধুমাত্র মোবাইল ডিভাইসে কাজ করে। আপনার স্মার্টফোন থেকে ওয়েবসাইটটি ভিজিট করুন।
              </p>
            </div>
          ) : (
            <button
              onClick={startCompass}
              className="px-8 py-4 bg-emerald-900 text-white rounded-2xl font-bold shadow-xl hover:bg-emerald-800 transition-colors"
            >
              কম্পাস চালু করুন
            </button>
          )}
          <p className="text-xs text-gray-400 text-center max-w-[250px]">
            সঠিক দিক পেতে আপনার ফোনের কম্পাস এবং লোকেশন পারমিশন প্রয়োজন।
          </p>
        </div>
      ) : (
        <div className="relative w-72 h-72 flex items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-emerald-50 shadow-inner" />
          
          {/* Compass Face */}
          <motion.div
            animate={{ rotate: -heading }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="relative w-64 h-64 rounded-full bg-white shadow-2xl flex items-center justify-center"
          >
            <div className="absolute top-4 font-bold text-emerald-900">N</div>
            <div className="absolute bottom-4 font-bold text-gray-300">S</div>
            <div className="absolute left-4 font-bold text-gray-300">W</div>
            <div className="absolute right-4 font-bold text-gray-300">E</div>
            
            {/* Kaaba Indicator */}
            {qiblaAngle !== null && (
              <div 
                className="absolute inset-0 flex flex-col items-center"
                style={{ transform: `rotate(${qiblaAngle}deg)` }}
              >
                <div className="mt-2 flex flex-col items-center">
                  <div className="w-8 h-8 bg-emerald-900 rounded-lg flex items-center justify-center text-white shadow-lg">
                    <Navigation className="w-5 h-5 fill-white" />
                  </div>
                  <div className="w-1 h-28 bg-emerald-900/20 rounded-full" />
                </div>
              </div>
            )}
            
            <Compass className="w-12 h-12 text-emerald-100" />
          </motion.div>
        </div>
      )}

      {error && (
        <Card className="bg-rose-50 border-rose-100 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5" />
          <p className="text-sm text-rose-900">{error}</p>
        </Card>
      )}

      <div className="w-full space-y-4">
        <Card className="bg-emerald-900 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-200 text-xs uppercase tracking-widest">কিবলার দিক</p>
              <h4 className="text-2xl font-bold">
                {qiblaAngle !== null ? `${qiblaAngle.toFixed(1)}°` : '--'} 
                {qiblaAngle !== null && (qiblaAngle > 180 ? ' পশ্চিম' : ' পূর্ব')}
              </h4>
            </div>
            <div className="w-12 h-12 bg-emerald-800 rounded-2xl flex items-center justify-center">
              <Navigation 
                className="w-6 h-6" 
                style={{ transform: `rotate(${qiblaAngle || 0}deg)` }}
              />
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
