import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AppState {
  language: 'bn' | 'en';
  theme: 'light' | 'dark';
  city: string;
  bookmarks: number[];
  tasbihCount: number;
  lastReadSurah: number | null;
  notifications: boolean;
  prayerAlarms: boolean;
  profileImage: string | null;
}

const DEFAULT_STATE: AppState = {
  language: 'bn',
  theme: 'light',
  city: 'Dhaka',
  bookmarks: [],
  tasbihCount: 0,
  lastReadSurah: null,
  notifications: true,
  prayerAlarms: true,
  profileImage: null,
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

  const syncToSupabase = async (newState: AppState) => {
    if (!user) return;
    try {
      await supabase
        .from('user_profiles')
        .upsert({ id: user.id, state: newState, updated_at: new Date() });
    } catch (err) {
      console.error('Sync to Supabase error:', err);
    }
  };

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      syncToSupabase(newState);
      return newState;
    });
  };

  return { state, updateState, user };
}
