import { openai } from '../../openai/client';
import { logger } from '../../utils/logger';
import type { GenerationResult } from '../../types/openai';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export class ContentGenerationService {
  static async generate(prompt: string, options: {
    maxTokens?: number;
    temperature?: number;
    systemPrompt?: string;
  } = {}): Promise<string> {
    try {
      const response = await this.generateWithRetry(prompt, options);
      return response.data?.content || '';
    } catch (error) {
      logger.error('Content generation failed', { error });
      throw error;
    }
  }

  private static async generateWithRetry(
    prompt: string,
    options: {
      maxTokens?: number;
      temperature?: number;
      systemPrompt?: string;
    },
    attempt: number = 1
  ): Promise<GenerationResult> {
    const { maxTokens = 2000, temperature = 0.7, systemPrompt } = options;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          ...(systemPrompt ? [{
            role: "system" as const,
            content: systemPrompt
          }] : []),
          {
            role: "user" as const,
            content: prompt
          }
        ],
        temperature,
        max_tokens: maxTokens
      });

      return {
        success: true,
        data: {
          content: response.choices[0]?.message?.content || '',
          model: response.model,
          usage: response.usage
        }
      };

    } catch (error: any) {
      logger.warn(`Generation attempt ${attempt} failed`, { error });

      if (attempt < MAX_RETRIES && this.shouldRetry(error)) {
        const delayMs = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        logger.info(`Retrying in ${delayMs}ms`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return this.generateWithRetry(prompt, options, attempt + 1);
      }

      throw error;
    }
  }

  private static shouldRetry(error: any): boolean {
    return [
      'timeout',
      'rate_limit_exceeded',
      'api_error'
    ].some(type => error.message?.toLowerCase().includes(type));
  }
}