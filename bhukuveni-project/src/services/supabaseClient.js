import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// These can be set in environment variables or left empty to work offline-only
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase = null;
let isSupabaseEnabled = false;

// Initialize Supabase only if credentials are provided
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    isSupabaseEnabled = true;
    console.log('✅ Supabase cloud sync enabled');
  } catch (error) {
    console.warn('⚠️ Supabase initialization failed, using localStorage only', error);
  }
} else {
  console.log('📱 Running in offline-only mode (localStorage)');
}

export { supabase, isSupabaseEnabled };
