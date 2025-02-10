import { ContentGenerationService } from '../../services/content-generation/service';
import type { WorksheetFormData } from '../../../types/forms';
import type { Chapter } from '../../../utils/ncertData';

const DISCLAIMER = "\n\n---\n\n*Note: This content is generated using AI. Please review before use.*";

export async function generateWorksheet(data: WorksheetFormData & {
  topic: string;
  subject: string;
  grade: string;
  chapters: Chapter[];
  textbook?: string;
}): Promise<string> {
  // Debug logging
  console.log('Worksheet Generation Data:', {
    subject: data.subject,
    grade: data.grade,
    chapters: data.chapters,
    textbook: data.textbook,
    topic: data.topic
  });

  const prompt = `Generate a comprehensive worksheet in Markdown format:

# ${data.subject} Worksheet
## Grade ${data.grade}
## Textbook: ${data.textbook || data.subject}
## Chapters Covered:
${data.chapters.map(ch => `- ${ch.title}`).join('\n')}

### Worksheet Information
1. Question Types: ${data.questionTypes.join(', ')}
2. Difficulty Level: ${data.difficultyLevel}
3. Answer Key Included: ${data.includeAnswerKey ? 'Yes' : 'No'}

### Instructions
1. Read all questions carefully
2. Write answers in the space provided
3. Show all necessary work/calculations

### Questions

#### Section A: Knowledge and Understanding
1. [First knowledge question]
2. [Second knowledge question]
3. [Third knowledge question]

#### Section B: Application and Skills
4. [First application question]
5. [Second application question]
6. [Third application question]

#### Section C: Higher Order Thinking
7. [First HOTS question]
8. [Second HOTS question]
9. [Third HOTS question]

${data.includeAnswerKey ? `
### Answer Key
[Provide answers with numbers matching exactly to the question numbers above]
1. Answer to Question 1
2. Answer to Question 2
3. Answer to Question 3
4. Answer to Question 4
5. Answer to Question 5
6. Answer to Question 6
7. Answer to Question 7
8. Answer to Question 8
9. Answer to Question 9` : ''}

${data.additionalInstructions ? `### Additional Instructions\n${data.additionalInstructions}` : ''}`;

  const systemPrompt = `You are an expert teacher who creates engaging and educational worksheets following NCERT guidelines.

CRITICAL FORMATTING RULES:
1. NEVER start any line with special characters
2. NO dashes (-) at the start of any line
3. NO asterisks (*) at the start of any line
4. NO bullet points (•) at the start of any line

CRITICAL NUMBERING RULES:
1. Questions MUST be numbered sequentially across all sections (1, 2, 3, ...)
2. Answer key numbers MUST exactly match question numbers
3. DO NOT restart numbering in each section
4. Each answer in the answer key must correspond to the same number as its question

ALWAYS use these formats:
1. For sequential items: Use numbers followed by period (1., 2., 3.)
2. For sub-points: Use letters in parentheses ((a), (b), (c))
3. For answer key: Use numbers matching question numbers (1., 2., 3.)

Document Structure:
1. Use # for main title
2. Use ## for grade and topic
3. Use ### for main sections
4. Use #### for subsections
5. Use **text** for emphasis (but never at start of line)

Ensure all questions:
1. Cover content from ALL listed chapters
2. Are clear and well-structured
3. Include adequate space for answers
4. Progress in difficulty
5. Are age-appropriate
6. Align with NCERT guidelines`;

  const content = await ContentGenerationService.generate(prompt, {
    systemPrompt,
    maxTokens: 2000,
    temperature: 0.7
  });

  return content + DISCLAIMER;
}