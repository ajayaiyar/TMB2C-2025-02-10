import OpenAI from 'openai';
import { logger } from '../utils/logger';

let openaiInstance: OpenAI | null = null;

function createOpenAIClient(): OpenAI {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Increase default timeout and add exponential backoff
    const timeout = parseInt(import.meta.env.VITE_API_TIMEOUT || '60000'); // 60 seconds
    const maxRetries = 3;

    return new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
      timeout,
      maxRetries,
      defaultHeaders: {
        'OpenAI-Beta': 'assistants=v1'
      },
      defaultQuery: {
        'api-version': '2024-02'
      }
    });
  } catch (error) {
    logger.error('Failed to initialize OpenAI client', { error });
    throw error;
  }
}

export function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    openaiInstance = createOpenAIClient();
  }
  return openaiInstance;
}

// Reset client (useful for handling timeouts)
export function resetOpenAIClient(): void {
  openaiInstance = null;
}

export const openai = getOpenAIClient();