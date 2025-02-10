import { openai, resetOpenAIClient } from '../../lib/openai/client';
import { logger } from '../../lib/utils/logger';
import type { Grade, Subject } from '../../utils/constants';
import { validateTopic } from '../../lib/openai/generators/pedagogy';

interface GeneratePedagogyParams {
  grade: Grade;
  subject: Subject;
  topic: string;
  approach: string;
  additionalInstructions?: string;
}

export class ContentGenerationService {
  static async generatePedagogy(params: GeneratePedagogyParams): Promise<string> {
    try {
      // First validate the topic
      const validation = validateTopic(params.topic, params.grade, params.subject);
      
      if (!validation.isValid) {
        if (validation.correctSubject && validation.correctSubject !== params.subject) {
          throw new Error(
            `Topic "${params.topic}" belongs to ${validation.correctSubject} curriculum, not ${params.subject}. ` +
            `Please select the correct subject or choose a relevant topic for ${params.subject}.`
          );
        }
      }

      // Double check that we have all required parameters
      if (!params.topic.trim()) {
        throw new Error('Topic is required');
      }
      if (!params.approach.trim()) {
        throw new Error('Pedagogical approach is required');
      }

      // Ensure OpenAI client is properly initialized
      if (!openai) {
        throw new Error('OpenAI client is not initialized');
      }

      // Optimize prompt to be more concise
      const prompt = `Create teaching activities for:
Topic: ${params.topic}
Subject: ${params.subject}
Grade: ${params.grade}
Approach: ${params.approach}
${validation.section ? `Section: ${validation.section}` : ''}
${validation.chapter ? `Chapter: ${validation.chapter}` : ''}

Format the response in Markdown with:
1. Learning Objectives (Knowledge, Skills, Values)
2. Pre-Activity Setup
3. Main Activities
4. Assessment Strategy

${params.additionalInstructions ? `Additional Notes: ${params.additionalInstructions}` : ''}`;

      const systemPrompt = `You are an expert teacher creating activities following NCERT guidelines and NCF 2023 framework.
Focus on activities that are:
1. Age-appropriate (Grade ${params.grade})
2. Subject-specific (${params.subject})
3. NCERT curriculum aligned
4. Interactive and practical`;

      try {
        logger.info('Generating pedagogy content', {
          subject: params.subject,
          grade: params.grade,
          topic: params.topic,
          approach: params.approach
        });

        const response = await openai.chat.completions.create({
          model: "gpt-4-turbo-preview",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500, // Reduced from 2000 to help with timeouts
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error('No content was generated. Please try again.');
        }

        logger.info('Successfully generated pedagogy content');
        return content + "\n\n---\n\n*Note: This content is generated using AI. Please review before use.*";
      } catch (apiError: any) {
        // Handle specific OpenAI API errors
        if (apiError.message?.toLowerCase().includes('timeout') || apiError.code === 'ETIMEDOUT') {
          logger.error('Request timed out', { error: apiError });
          // Reset the client to force a new connection
          resetOpenAIClient();
          throw new Error('Request timed out. Please try again. If the issue persists, try a more specific topic or shorter prompt.');
        }
        if (apiError.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a few moments.');
        }
        if (apiError.status === 401 || apiError.status === 403) {
          throw new Error('Authentication error. Please check your API key configuration.');
        }
        if (apiError.status >= 500) {
          throw new Error('OpenAI service is temporarily unavailable. Please try again later.');
        }
        if (apiError.message?.toLowerCase().includes('network') || apiError.message?.toLowerCase().includes('failed to fetch')) {
          throw new Error('Network error. Please check your internet connection and try again.');
        }
        
        // Log the detailed error for debugging
        logger.error('OpenAI API error', { error: apiError });
        throw new Error(`Failed to generate content: ${apiError.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      logger.error('Pedagogy generation failed', { error });
      
      // If it's already a properly formatted error, rethrow it
      if (error instanceof Error) {
        throw error;
      }
      
      // Generic error fallback
      throw new Error('An unexpected error occurred while generating content. Please try again.');
    }
  }
} 