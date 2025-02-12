import { openai } from '../client';
import type { AssessmentFormData } from '../../../types/forms';
import type { GenerationResult } from '../../types/openai';
import type { Chapter } from '../../../utils/ncertData';
import { logger } from '../../utils/logger';
import { handleOpenAIError } from '../error';

export async function generateAssessment(data: AssessmentFormData & {
  topic: string;
  subject: string;
  grade: string;
  chapters: Chapter[];
  textbook?: string;
  section?: string;
  isFullSyllabus: boolean;
}): Promise<GenerationResult> {
  // Debug logging
  console.log('Assessment Generation Data:', {
    subject: data.subject,
    grade: data.grade,
    chapters: data.chapters,
    textbook: data.textbook,
    section: data.section,
    topic: data.topic,
    isFullSyllabus: data.isFullSyllabus
  });

  const chaptersSection = data.chapters.map(chapter => `- ${chapter.title}`).join('\n');

  const prompt = `Generate a complete ${data.assessmentType} in Markdown format with the following specifications:

# ${data.subject} ${data.assessmentType.charAt(0).toUpperCase() + data.assessmentType.slice(1)}
## Grade ${data.grade}
## Textbook: ${data.textbook || data.subject}
## Chapters:
${data.isFullSyllabus ? 'As per syllabus' : data.chapters.map((ch, index) => `${index + 1}) ${ch.title}`).join('\n')}

### Assessment Information
1. Duration: ${data.duration}
2. Total Marks: ${data.totalMarks}
3. Question Types: ${data.sectionTypes.join(', ')}

### Instructions
1. All questions are compulsory
2. Marks for each question are indicated against it
3. Write answers in clear, legible handwriting

### Questions
${data.sectionTypes.map((type, index) => `
#### Section ${String.fromCharCode(65 + index)} - ${type}
[Generate questions for this section with proper numbering and marks indicated in brackets]`).join('\n')}

${data.includeRubric ? `
### Marking Scheme
[Provide detailed marking scheme with points breakdown]

### Evaluation Rubrics
1. Marking criteria for each question type
2. Common errors and misconceptions
3. Guidelines for partial marking` : ''}

${data.additionalInstructions ? `### Additional Instructions\n${data.additionalInstructions}` : ''}`;

  logger.info('Starting assessment generation', { 
    subject: data.subject,
    grade: data.grade,
    topic: data.topic
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an expert assessment creator who follows CBSE guidelines and NCF 2023 framework. 

CRITICAL FORMATTING RULES - READ CAREFULLY:
1. NEVER start any line with special characters
2. NO dashes (-) at the start of any line
3. NO asterisks (*) at the start of any line
4. NO bullet points (•) at the start of any line

ALWAYS use these formats instead:
1. For sequential lists: Use numbers followed by period (1., 2., 3.)
2. For options/choices: Use letters in parentheses ((a), (b), (c))
3. For marking points: Use numbers (1., 2., 3.)
4. For multiple choice: Use letters in parentheses ((a), (b), (c), (d))

Document Structure:
1. Use # for main title
2. Use ## for grade and topic
3. Use ### for main sections
4. Use #### for subsections
5. Use **text** for bold emphasis (but never at start of line)

Correct Examples:

Multiple Choice Question:
1. What is the capital of India? [2 marks]
   (a) Mumbai
   (b) Chennai
   (c) New Delhi
   (d) Kolkata

Marking Scheme:
1. Full marks for correct answer: New Delhi
2. No partial marks for this question

Evaluation Points:
1. Clear understanding of capitals
2. Knowledge of administrative centers
3. Basic geography concepts

INCORRECT FORMATS (NEVER USE):
❌ - Point starting with dash
❌ * Point starting with asterisk
❌ • Point starting with bullet
❌ - Option A
❌ - Option B`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Failed to generate assessment content');
    }

    logger.info('Assessment generated successfully', {
      contentLength: content.length,
      model: response.model
    });

    return {
      success: true,
      data: {
        content: content + "\n\n---\n\n*Note: This content is generated using AI. Please review before use.*",
        model: response.model,
        usage: response.usage
      }
    };
  } catch (error) {
    logger.error('Assessment generation failed', { error });
    return handleOpenAIError(error);
  }
}