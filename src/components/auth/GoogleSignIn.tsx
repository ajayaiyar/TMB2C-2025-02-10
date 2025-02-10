import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { signInWithGoogle } from '../../lib/auth/providers/google';

export function GoogleSignIn() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await signInWithGoogle();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Failed to sign in with Google:', error);
      // Show error to user
      if (error instanceof Error) {
        // Handle specific error cases
        const message = error.message.includes('popup_closed_by_user')
          ? 'Sign in was cancelled'
          : 'Failed to sign in with Google';
        // You can show this message to the user
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
          Connecting...
        </>
      ) : (
        <>
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="h-5 w-5 mr-2"
          />
          Continue with Google
        </>
      )}
    </button>
  );
}