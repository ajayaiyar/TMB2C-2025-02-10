import type { GeneratorOptions } from './types';
import type { GenerationResult } from '../../types/openai';
import { logger } from '../../utils/logger';
import { handleOpenAIError } from '../error';
import { openai } from '../client';

const DEFAULT_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4-turbo-preview';
const DEFAULT_MAX_TOKENS = parseInt(import.meta.env.VITE_OPENAI_MAX_TOKENS || '4000');
const DEFAULT_TEMPERATURE = parseFloat(import.meta.env.VITE_OPENAI_TEMPERATURE || '0.7');

export class BaseGenerator {
  protected static async generate(prompt: string, options: GeneratorOptions = {}): Promise<GenerationResult> {
    const { model = DEFAULT_MODEL, temperature = DEFAULT_TEMPERATURE, maxTokens = DEFAULT_MAX_TOKENS } = options;
    
    logger.info('Starting content generation', { 
      prompt: prompt.substring(0, 100) + '...',
      model
    });

    try {
      const response = await openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens,
      });
      
      return {
        success: true,
        data: {
          content: response.choices[0]?.message?.content || '',
          model: response.model,
          usage: response.usage
        }
      };
    } catch (error) {
      logger.error('Content generation failed', { error });
      return handleOpenAIError(error);
    }
  }
}