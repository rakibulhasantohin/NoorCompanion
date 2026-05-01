
import React, { useEffect, useRef } from 'react';
import { useAppState } from '../hooks/useAppState';
import { 
  requestNotificationPermission, 
  showNotification, 
  ISLAMIC_FACTS, 
  MOTIVATIONAL_QUOTES 
} from '../services/notificationService';
import { getPrayerTimes } from '../services/prayerService';
import { format } from 'date-fns';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const NotificationManager: React.FC = () => {
  const { state } = useAppState();
  const lastNotifiedRef = useRef<{ 
    day: string | null; 
    prayer: string | null; 
    time: number 
  }>({
    day: localStorage.getItem('last_notified_day'),
    prayer: localStorage.getItem('last_notified_prayer'),
    time: 0
  });

  const getDynamicContent = async (type: 'fact' | 'motivation') => {
    try {
      const q = query(collection(db, 'notifications_content'), where('type', '==', type));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docs = snapshot.docs.map(d => d.data());
        return docs[Math.floor(Math.random() * docs.length)] as any;
      }
    } catch (e) {
      console.error("Firestore fetch error:", e);
    }
    return null;
  };

  useEffect(() => {
    if (state.notifications) {
      requestNotificationPermission();
    }
  }, [state.notifications]);

  useEffect(() => {
    if (!state.notifications) return;

    const checkNotifications = async () => {
      const now = new Date();
      const todayStr = format(now, 'yyyy-MM-dd');
      
      // 1. Daily Fact / Quote (Approx. at 9:00 AM)
      const hour = now.getHours();
      if (hour >= 9 && lastNotifiedRef.current.day !== todayStr) {
        if (state.dailyFactsNotification || state.dailyMotivationNotification) {
          const isFact = state.dailyFactsNotification && (!state.dailyMotivationNotification || Math.random() > 0.5);
          
          let content = await getDynamicContent(isFact ? 'fact' : 'motivation');
          
          // Fallback to static data
          if (!content) {
            if (isFact) {
              content = ISLAMIC_FACTS[now.getDate() % ISLAMIC_FACTS.length];
            } else {
              content = MOTIVATIONAL_QUOTES[now.getDate() % MOTIVATIONAL_QUOTES.length];
            }
          }
          
          if (content) {
            showNotification(
              state.language === 'bn' 
                ? (isFact ? 'ইসলামিক তথ্য' : 'অনুপ্রেরণা') 
                : (isFact ? 'Islamic Fact' : 'Motivational Quote'),
              state.language === 'bn' ? content.text_bn : content.text_en
            );
          }
          
          lastNotifiedRef.current.day = todayStr;
          localStorage.setItem('last_notified_day', todayStr);
        }
      }

      // 2. Prayer Reminders
      if (state.prayerAlarms) {
        const lat = state.location?.lat || 23.7289;
        const lng = state.location?.lng || 90.3944;
        const { times } = getPrayerTimes(lat, lng, now);
        
        // Find if any prayer is starting now (within 1 minute)
        const currentPrayer = times.find(p => {
          const diff = Math.abs(p.time.getTime() - now.getTime());
          return diff < 60000; // 1 minute window
        });

        if (currentPrayer && lastNotifiedRef.current.prayer !== currentPrayer.name + todayStr) {
           // Skip sunrise/sunset as they are events usually
           if (currentPrayer.name !== 'Sunrise' && currentPrayer.name !== 'Sunset') {
             showNotification(
               state.language === 'bn' ? 'নামাজের সময়' : 'Prayer Time',
               state.language === 'bn' 
                 ? `${currentPrayer.bnName} নামাজের সময় হয়েছে` 
                 : `It's time for ${currentPrayer.name} prayer`
             );
             lastNotifiedRef.current.prayer = currentPrayer.name + todayStr;
             localStorage.setItem('last_notified_prayer', currentPrayer.name + todayStr);
           }
        }
      }
    };

    // Initial check
    checkNotifications();

    // Check every minute
    const interval = setInterval(checkNotifications, 60000);
    return () => clearInterval(interval);
  }, [
    state.notifications, 
    state.prayerAlarms, 
    state.dailyFactsNotification, 
    state.dailyMotivationNotification, 
    state.language, 
    state.location
  ]);

  return null; // Side-effect only component
};
