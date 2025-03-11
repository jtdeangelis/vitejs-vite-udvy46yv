import { createClient } from '@supabase/supabase-js';

// Get environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!SUPABASE_URL) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!SUPABASE_ANON_KEY) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client with error handling and retries
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-application-name': 'phoenix-rehab' }
  },
  db: {
    schema: 'public'
  },
  storage: {
    retryInterval: 500,
    maxRetries: 3
  }
});

// Add error handling for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Clear any cached data
    localStorage.removeItem('googlePhotosToken');
    localStorage.removeItem('googlePhotosTokenExpires');
    localStorage.removeItem('projectData');
  }
});

// Utility function to handle Supabase errors
export const handleSupabaseError = async <T>(
  promise: Promise<{ data: T | null; error: any }>,
  context: string
): Promise<T> => {
  try {
    const { data, error } = await promise;
    if (error) throw error;
    if (!data) throw new Error('No data returned');
    return data;
  } catch (err: any) {
    console.error(`Error in ${context}:`, err);
    throw new Error(err.message || `Error in ${context}`);
  }
};

// Export typed version of the client
export type SupabaseClient = typeof supabase;