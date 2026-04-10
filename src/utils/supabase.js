import { createClient } from '@supabase/supabase-js';

// These keys must be populated in a .env.local file at the root of the project
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Helper constant to check if the app should use LocalStorage 
 * or attempt asynchronous Database connections.
 */
export const isSupabaseConfigured = () => {
  return supabase !== null;
};
