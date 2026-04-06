import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (typeof window !== 'undefined') {
  if (!supabaseUrl) console.error('❌ Supabase URL is missing in environment variables!');
  if (!supabaseAnonKey) console.error('❌ Supabase Anon Key is missing in environment variables!');
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
