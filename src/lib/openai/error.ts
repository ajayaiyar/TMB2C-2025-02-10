import type { OpenAIError } from '../types/openai';
import type { GenerationResult } from '../types/openai';

export function handleOpenAIError(error: unknown): GenerationResult {
  const apiError = error as any;
  const errorResponse: OpenAIError = {
    type: getErrorType(apiError),
    message: apiError.message || 'Unknown error occurred',
    code: apiError.code,
    param: apiError.param
  };

  return {
    success: false,
    error: errorResponse
  };
}

function getErrorType(error: any): OpenAIError['type'] {
  if (error.name === 'AbortError' || error.code === 'ETIMEDOUT') {
    return 'timeout';
  }
  if (error.status === 429) {
    return 'rate_limit';
  }
  if (error.status >= 500) {
    return 'api_error';
  }
  if (error.status === 400) {
    return 'validation';
  }
  return 'unknown';
} 