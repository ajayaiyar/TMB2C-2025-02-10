import { openai } from '../openai/client';
import { generateBlueprint } from './blueprints';
import { getAssessmentPrompt } from './prompts';
import type { AssessmentMetadata } from './types';
import { logger } from '../utils/logger';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export interface AssessmentGenerationResult {
  success: boolean;
  content?: string;
  metadata?: AssessmentMetadata;
  error?: {
    message: string;
    details?: any;
  };
}

export async function generateAssessment(data: {
  subject: string;
  grade: string;
  chapter: string;
  duration: string;
  totalMarks: number;
  sectionTypes: string[];
  includeRubric: boolean;
  additionalInstructions: string;
}): Promise<AssessmentGenerationResult> {
  logger.info('Starting assessment generation', { 
    subject: data.subject,
    grade: data.grade,
    chapter: data.chapter
  });

  try {
    // Generate assessment blueprint
    const sections = generateBlueprint(data.totalMarks, data.sectionTypes);
    logger.debug('Generated blueprint', { sections });
    
    // Generate the assessment content
    const prompt = getAssessmentPrompt({
      ...data,
      sections,
      isFullSyllabus: data.chapter === 'full_syllabus',
      includeSolutions: true
    });

    // Split generation into multiple requests with retry logic
    const responses = await Promise.all([
      generateWithRetry('questions', prompt),
      generateWithRetry('rubrics', prompt)
    ]);

    // Verify responses
    const questionsContent = responses[0].choices[0].message.content;
    const rubricsContent = responses[1].choices[0].message.content;

    if (!questionsContent || !rubricsContent) {
      throw new Error('Incomplete response from OpenAI');
    }

    // Combine responses
    const content = [
      questionsContent,
      '\n\nMARKING SCHEME AND EVALUATION RUBRICS\n',
      rubricsContent
    ].join('\n');

    // Generate metadata
    const metadata: AssessmentMetadata = {
      blueprint: {
        sections,
        totalMarks: data.totalMarks,
        duration: data.duration
      },
      learningOutcomes: [],
      competencies: [],
      markingScheme: {},
      rubrics: data.includeRubric ? {
        markingCriteria: {},
        scoringGuidelines: {},
        commonErrors: {}
      } : undefined
    };

    logger.info('Assessment generated successfully', {
      contentLength: content.length,
      sections: sections.length
    });

    return {
      success: true,
      content,
      metadata
    };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    logger.error('Assessment generation failed', { error });
    return {
      success: false,
      error: {
        message: errorMessage,
        details: error
      }
    };
  }
}

async function generateWithRetry(
  type: 'questions' | 'rubrics',
  prompt: string,
  attempt: number = 1
) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: type === 'questions'
            ? `You are an expert CBSE assessment creator who follows the latest CBSE guidelines and NCF 2023 framework. Focus on generating detailed questions and answers.`
            : `You are an expert CBSE assessment creator. Focus on generating detailed marking schemes and evaluation rubrics.`
        },
        {
          role: "user",
          content: `${prompt}\n\n${
            type === 'questions'
              ? 'Generate the questions and answers for all sections.'
              : 'Generate the detailed marking scheme and evaluation rubrics.'
          }`
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    logger.debug(`Generated ${type}`, {
      tokens: response.usage?.total_tokens,
      model: response.model
    });

    return response;

  } catch (error: any) {
    logger.warn(`${type} generation attempt ${attempt} failed`, { error });

    if (attempt < MAX_RETRIES && shouldRetry(error)) {
      const delayMs = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
      logger.info(`Retrying ${type} generation in ${delayMs}ms`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      return generateWithRetry(type, prompt, attempt + 1);
    }

    throw error;
  }
}

function shouldRetry(error: any): boolean {
  return [
    'timeout',
    'rate_limit_exceeded',
    'api_error'
  ].some(type => error.message?.toLowerCase().includes(type));
}