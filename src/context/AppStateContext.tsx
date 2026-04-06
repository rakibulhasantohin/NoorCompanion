import React, { createContext, useContext, useState, useEffect } from 'react';

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
  user: null;
  isAuthReady: boolean;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

const STATE_KEY = 'noor_companion_local_state';

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthReady, setIsAuthReady] = useState(true);

  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STATE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_STATE;
  });

  // Save state whenever it changes to Local Storage
  useEffect(() => {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }, [state]);

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AppStateContext.Provider value={{ state, updateState, user: null, isAuthReady }}>
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
