// Define error types
export const SUPABASE_ERRORS = {
  INVALID_URL: 'INVALID_URL',
  INVALID_KEY: 'INVALID_KEY',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR'
} as const;

export type SupabaseError = typeof SUPABASE_ERRORS[keyof typeof SUPABASE_ERRORS];

export class SupabaseClientError extends Error {
  constructor(
    message: string,
    public code: SupabaseError,
    public status?: number
  ) {
    super(message);
    this.name = 'SupabaseClientError';
  }
}

export function handleSupabaseError(error: unknown): never {
  if (error instanceof SupabaseClientError) {
    throw error;
  }

  if (error instanceof Error) {
    // Handle URL-related errors
    if (error.message.toLowerCase().includes('url')) {
      throw new SupabaseClientError(
        'Invalid Supabase URL configuration. Please check your .env file.',
        SUPABASE_ERRORS.INVALID_URL
      );
    }
    
    // Handle authentication errors
    if (error.message.toLowerCase().includes('auth')) {
      throw new SupabaseClientError(
        'Authentication configuration error. Please check your Supabase anon key.',
        SUPABASE_ERRORS.AUTHENTICATION_ERROR
      );
    }

    throw new SupabaseClientError(
      error.message,
      SUPABASE_ERRORS.CONNECTION_ERROR
    );
  }

  throw new SupabaseClientError(
    'An unexpected Supabase error occurred. Please check your configuration.',
    SUPABASE_ERRORS.CONNECTION_ERROR
  );
}