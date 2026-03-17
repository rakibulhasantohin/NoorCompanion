import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface Zikir {
  id: string;
  arabic: string;
  pronunciation: {
    bn: string;
    en: string;
  };
  meaning: {
    bn: string;
    en: string;
  };
}

export interface AppState {
  language: 'bn' | 'en';
  theme: 'light' | 'dark';
  city: string;
  location: { lat: number; lng: number } | null;
  onboardingComplete: boolean;
  bookmarks: number[];
  tasbihCount: number;
  lastReadSurah: number | null;
  notifications: boolean;
  prayerAlarms: boolean;
  profileImage: string | null;
  lastBackup: string | null;
  fullName: string | null;
  dateOfBirth: string | null;
  customZikirs: Zikir[];
  vibrationEnabled: boolean;
  soundEnabled: boolean;
}

const DEFAULT_STATE: AppState = {
  language: 'bn',
  theme: 'light',
  city: 'Dhaka',
  location: { lat: 23.7289, lng: 90.3944 },
  onboardingComplete: false,
  bookmarks: [],
  tasbihCount: 0,
  lastReadSurah: null,
  notifications: true,
  prayerAlarms: true,
  profileImage: null,
  lastBackup: null,
  fullName: null,
  dateOfBirth: null,
  customZikirs: [],
  vibrationEnabled: true,
  soundEnabled: true,
};

interface AppStateContextType {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  user: User | null;
  isAuthReady: boolean;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const isInternalUpdate = useRef(false);

  const getStateKey = (email: string | null) => {
    return email ? `noor_state_${email}` : 'noor_companion_state';
  };

  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(getStateKey(auth.currentUser?.email || null));
    return saved ? JSON.parse(saved) : DEFAULT_STATE;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      
      let userData = {};
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            userData = userDoc.data();
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }

      const saved = localStorage.getItem(getStateKey(currentUser?.email || null));
      if (saved) {
        setState(prev => ({ ...JSON.parse(saved), ...userData }));
      } else {
        setState(prev => ({ ...DEFAULT_STATE, onboardingComplete: prev.onboardingComplete, ...userData }));
      }
    });

    return () => unsubscribe();
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    localStorage.setItem(getStateKey(user?.email || null), JSON.stringify(state));
  }, [state, user]);

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AppStateContext.Provider value={{ state, updateState, user, isAuthReady }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppStateContext = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppStateContext must be used within an AppStateProvider');
  }
  return context;
};
