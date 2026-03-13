import { useState, useEffect } from 'react';

interface AppState {
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
};

export function useAppState() {
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('noor_current_user');
  });

  const getStateKey = (email: string | null) => {
    return email ? `noor_state_${email}` : 'noor_companion_state';
  };

  const [state, setState] = useState<AppState>(() => {
    const email = localStorage.getItem('noor_current_user');
    const saved = localStorage.getItem(getStateKey(email));
    return saved ? JSON.parse(saved) : DEFAULT_STATE;
  });

  // When user changes, load their specific state
  useEffect(() => {
    const handleUserChange = () => {
      const email = localStorage.getItem('noor_current_user');
      setUserEmail(email);
      const saved = localStorage.getItem(getStateKey(email));
      if (saved) {
        setState(JSON.parse(saved));
      } else {
        // If new user, maybe keep some settings but reset personal data
        setState({ ...DEFAULT_STATE, onboardingComplete: state.onboardingComplete });
      }
    };

    const handleStateChange = (e: Event) => {
      const customEvent = e as CustomEvent<AppState>;
      setState(customEvent.detail);
    };

    window.addEventListener('auth_changed', handleUserChange);
    window.addEventListener('app_state_changed', handleStateChange);
    return () => {
      window.removeEventListener('auth_changed', handleUserChange);
      window.removeEventListener('app_state_changed', handleStateChange);
    };
  }, [state.onboardingComplete]);

  // Save state whenever it changes
  useEffect(() => {
    localStorage.setItem(getStateKey(userEmail), JSON.stringify(state));
  }, [state, userEmail]);

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      localStorage.setItem(getStateKey(userEmail), JSON.stringify(newState));
      window.dispatchEvent(new CustomEvent('app_state_changed', { detail: newState }));
      return newState;
    });
  };

  return { state, updateState, user: userEmail ? { email: userEmail } : null };
}
