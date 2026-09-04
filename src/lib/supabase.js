import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from localStorage or Vite env
const savedUrl = localStorage.getItem('sg_supabase_url');
const savedKey = localStorage.getItem('sg_supabase_key');

const supabaseUrl = savedUrl || import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = savedKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(
    (savedUrl || import.meta.env.VITE_SUPABASE_URL) && 
    (savedKey || import.meta.env.VITE_SUPABASE_ANON_KEY)
  );
};

export const getSupabaseConfig = () => ({
  url: savedUrl || import.meta.env.VITE_SUPABASE_URL || '',
  key: savedKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '',
});

export const saveSupabaseConfig = (url, key) => {
  if (url) localStorage.setItem('sg_supabase_url', url.trim());
  if (key) localStorage.setItem('sg_supabase_key', key.trim());
  window.location.reload();
};

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
