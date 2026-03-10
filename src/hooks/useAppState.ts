import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  location: { lat: 23.8103, lng: 90.4125 },
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
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('noor_companion_state');
    return saved ? JSON.parse(saved) : DEFAULT_STATE;
  });

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('noor_companion_state', JSON.stringify(state));
  }, [state]);

  // Supabase Auth & Sync
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('state')
        .eq('id', userId)
        .single();

      if (data && data.state) {
        setState(data.state);
      } else if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }
    } catch (err) {
      console.error('Sync error:', err);
    }
  };

  const syncToSupabase = async (newState: AppState, force = false) => {
    if (!user) return;
    
    const now = new Date();
    const lastBackupDate = newState.lastBackup ? new Date(newState.lastBackup) : null;
    const isOneDayApart = !lastBackupDate || (now.getTime() - lastBackupDate.getTime() > 24 * 60 * 60 * 1000);

    if (force || isOneDayApart) {
      try {
        const stateWithTimestamp = { ...newState, lastBackup: now.toISOString() };
        await supabase
          .from('user_profiles')
          .upsert({ id: user.id, state: stateWithTimestamp, updated_at: now });
        
        if (isOneDayApart) {
          setState(stateWithTimestamp);
        }
      } catch (err) {
        console.error('Sync to Supabase error:', err);
      }
    }
  };

  const updateState = (updates: Partial<AppState>, forceSync = false) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      syncToSupabase(newState, forceSync);
      return newState;
    });
  };

  const manualSync = () => {
    syncToSupabase(state, true);
  };

  return { state, updateState, user, manualSync };
}
