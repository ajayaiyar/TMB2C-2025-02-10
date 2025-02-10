export const OAUTH_CONFIG = {
  ALLOWED_DOMAINS: [], // Add domains here to restrict sign-in to specific domains
  SCOPES: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ]
} as const;

export const AUTH_ORIGINS = {
  development: ['http://localhost:5173'],
  production: ['https://lovely-madeleine-0f8c23.netlify.app']
} as const;