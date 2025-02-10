import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Clear any existing sessions first
        await supabase.auth.signOut();

        console.log('Auth callback URL:', window.location.href);

        // Get code from URL
        const code = new URL(window.location.href).searchParams.get('code');
        const error = new URL(window.location.href).searchParams.get('error');
        const errorDescription = new URL(window.location.href).searchParams.get('error_description');
        
        if (error || errorDescription) {
          throw new Error(errorDescription || 'Authentication failed');
        }

        if (!code) {
          throw new Error('No code parameter found in URL');
        }

        // Get stored PKCE verifier
        const verifier = sessionStorage.getItem('pkce_verifier');
        if (!verifier) {
          throw new Error('No PKCE verifier found');
        }

        // Exchange code for session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        
        // Clear PKCE verifier
        sessionStorage.removeItem('pkce_verifier');

        console.log('Exchange code result:', exchangeError ? 'Error' : 'Success');

        if (exchangeError) throw exchangeError;
        
        // Get session to confirm authentication
        const { data: { session } } = await supabase.auth.getSession();
        
        // Redirect based on session
        navigate(session ? '/dashboard' : '/');
      } catch (error) {
        console.error('Error during auth callback:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
        // Clear any stored PKCE data
        sessionStorage.removeItem('pkce_verifier');
        // Redirect after a short delay
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return error ? (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
        <p className="text-sm text-red-600 mt-2">Redirecting to login...</p>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p className="mt-4 text-gray-600">Completing authentication...</p>
    </div>
  );
}