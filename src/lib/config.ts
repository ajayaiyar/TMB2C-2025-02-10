export const API_CONFIG = {
  RETRY_ATTEMPTS: 3,
  TIMEOUT_MS: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  RETRY_DELAY_MS: 1000
} as const; 