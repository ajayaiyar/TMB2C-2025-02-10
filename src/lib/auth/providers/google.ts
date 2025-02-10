import { supabase } from '../../supabase';
import { OAUTH_CONFIG } from '../config';
import { generatePKCEVerifier, generatePKCEChallenge } from '../utils/pkce';

export async function signInWithGoogle() {
  try {
    // Generate PKCE verifier and challenge
    const codeVerifier = generatePKCEVerifier();
    const codeChallenge = await generatePKCEChallenge(codeVerifier);
    
    // Store verifier in sessionStorage
    sessionStorage.setItem('pkce_verifier', codeVerifier);

    const redirectUrl = new URL('/auth/callback', window.location.origin).toString();
    console.log('Redirect URL:', redirectUrl);

    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: false,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          code_challenge: codeChallenge,
          code_challenge_method: 'S256'
        }
      }
    });
  } catch (error) {
    console.error('Google sign in error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      origin: window.location.origin
    });
    throw error;
  }
}