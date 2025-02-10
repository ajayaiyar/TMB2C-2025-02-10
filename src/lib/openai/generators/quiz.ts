import { ContentGenerationService } from '../../services/content-generation/service';
import type { QuizFormData } from '../../../types/forms';
import type { Chapter } from '../../../utils/ncertData';

const DISCLAIMER = "\n\n---\n\n*Note: This content is generated using AI. Please review before use.*";

export async function generateQuiz(data: QuizFormData & {
  topic: string;
  subject: string;
  grade: string;
  chapter?: Chapter;
  textbook?: string;
  section?: string;
}): Promise<string> {
  // Debug logging
  console.log('Quiz Generation Data:', {
    subject: data.subject,
    grade: data.grade,
    chapter: data.chapter,
    textbook: data.textbook,
    section: data.section,
    topic: data.topic
  });

  const prompt = `Generate a comprehensive quiz in Markdown format:

# ${data.subject} Quiz
## Grade ${data.grade}
## Textbook: ${data.textbook || data.subject}
${data.section ? `## Section: ${data.section} (for guidance)` : ''}
## Chapter: ${data.chapter?.title || data.topic}

### Quiz Information
1. Number of Questions: ${data.questionCount}
2. Difficulty Level: ${data.difficultyLevel}
3. Taxonomy Type: ${data.taxonomyType}
4. Taxonomy Levels: ${data.taxonomyLevels.join(', ')}

### Instructions
1. Read each question carefully
2. All questions carry equal marks
3. Choose the most appropriate answer

### Questions

${Array.from({ length: data.questionCount }, (_, i) => `
#### Question ${i + 1} [1 mark]
[Question text here]

(a) Option A
(b) Option B
(c) Option C
(d) Option D

Correct Answer: [letter]
Explanation: [brief explanation]
Taxonomy Level: [relevant level]
`).join('\n')}

### Answer Key
${Array.from({ length: data.questionCount }, (_, i) => `${i + 1}. Answer: [letter] - [brief explanation]`).join('\n')}

${data.additionalInstructions ? `### Additional Instructions\n${data.additionalInstructions}` : ''}`;

  const systemPrompt = `You are an expert teacher who creates engaging and educational quizzes following NCERT guidelines.

CRITICAL FORMATTING RULES:
1. NEVER start any line with special characters
2. NO dashes (-) at the start of any line
3. NO asterisks (*) at the start of any line
4. NO bullet points (•) at the start of any line

ALWAYS use these formats:
1. For sequential items: Use numbers followed by period (1., 2., 3.)
2. For multiple choice options: Use letters in parentheses ((a), (b), (c), (d))
3. For answer key: Use numbers (1., 2., 3.)

Document Structure:
1. Use # for main title
2. Use ## for grade and topic
3. Use ### for main sections
4. Use #### for questions
5. Use **text** for emphasis (but never at start of line)

Ensure all questions:
1. Are clear and unambiguous
2. Match the specified taxonomy level
3. Include proper explanations
4. Are age-appropriate
5. Align with NCERT guidelines`;

  const content = await ContentGenerationService.generate(prompt, {
    systemPrompt,
    maxTokens: 2000,
    temperature: 0.7
  });

  return content + DISCLAIMER;
}