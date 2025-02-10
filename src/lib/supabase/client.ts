import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { SUPABASE_ERRORS, SupabaseClientError } from './errors';

function getEnvVar(name: string): string {
  const value = import.meta.env[name];
  if (!value) {
    throw new SupabaseClientError(
      `Missing required environment variable: ${name}\n` +
      'Please check your .env file and ensure all required variables are set.\n' +
      'Required format:\n' +
      'VITE_SUPABASE_URL=your-project-id.supabase.co\n' +
      'VITE_SUPABASE_ANON_KEY=your-anon-key',
      SUPABASE_ERRORS.INVALID_URL
    );
  }
  return value.trim();
}

function validateSupabaseUrl(url: string): string {
  if (!url) {
    throw new SupabaseClientError('Supabase URL cannot be empty', SUPABASE_ERRORS.INVALID_URL);
  }

  try {
    // Try to parse the URL first
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    
    // Get the hostname without protocol
    const hostname = urlObj.hostname;
  
    // Validate Supabase URL format
    if (!hostname.endsWith('.supabase.co')) {
      throw new SupabaseClientError(
        'Invalid Supabase URL format. Expected: your-project-id.supabase.co',
        SUPABASE_ERRORS.INVALID_URL
      );
    }

    // Return the full URL with https protocol
    return urlObj.toString().replace(/\/$/, '');
  } catch (error) {
    if (error instanceof SupabaseClientError) throw error;
    throw new SupabaseClientError(
      'Invalid Supabase URL. Please check your VITE_SUPABASE_URL environment variable.',
      SUPABASE_ERRORS.INVALID_URL
    );
  }
}

export const supabase = createClient<Database>(
  validateSupabaseUrl(getEnvVar('VITE_SUPABASE_URL')),
  getEnvVar('VITE_SUPABASE_ANON_KEY'),
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      debug: import.meta.env.DEV // Enable debug logging in development
    }
  }
);