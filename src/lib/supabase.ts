import { createClient } from '@supabase/supabase-js';

// Using the credentials provided by the user
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kzbkvyokaubyvxukmoev.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6Ymt2eW9rYXVieXZ4dWttb2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDcwMjYsImV4cCI6MjA4ODM4MzAyNn0.YcVrRLKtjyjkL0MeVydat_NnqGojL8PvWgYhe4kjBXM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options) => fetch(url, options),
  },
});
