console.log('SupabaseClient: Top of supabaseClient.ts file.');

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('SupabaseClient: Missing Supabase environment variables. Check .env file.');
  throw new Error('Please check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

// Initialize Supabase client directly. It will be a singleton by module caching.
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'ecommerce-admin-auth',
  },
});

console.log('SupabaseClient: Supabase client initialized.');
