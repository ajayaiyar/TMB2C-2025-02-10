import { ContentGenerationService } from '../../services/content-generation/service';
import type { PresentationFormData } from '../../../types/forms';
import type { Chapter } from '../../../utils/ncertData';

const DISCLAIMER = "\n\n---\n\n*Note: This content is generated using AI. Please review before use.*";

export async function generatePresentation(data: PresentationFormData & {
  topic: string;
  subject: string;
  grade: string;
  chapters: Chapter[];
  textbook?: string;
}): Promise<string> {
  // Debug logging
  console.log('Presentation Generation Data:', {
    subject: data.subject,
    grade: data.grade,
    chapters: data.chapters,
    textbook: data.textbook,
    topic: data.topic
  });

  const prompt = `Generate a comprehensive presentation outline in Markdown format:

# ${data.subject} Presentation
## Grade ${data.grade}
## Textbook: ${data.textbook || data.subject}
## Chapters Covered:
${data.chapters.map(ch => `- ${ch.title}`).join('\n')}

### Presentation Information
1. Number of Slides: ${data.slideCount}
2. Visual Style: ${data.visualPreference}
3. Include Activities: ${data.includeActivities ? 'Yes' : 'No'}
4. Include Assessment: ${data.includeAssessment ? 'Yes' : 'No'}

### Slide Structure

#### Slide 1: Title
1. Title: ${data.subject} - ${data.topic}
2. Subtitle: Grade ${data.grade}
3. Brief Overview

#### Slide 2: Learning Objectives
1. Knowledge Objectives
2. Skill Objectives
3. Application Objectives

#### Slide 3-4: Introduction
1. Key Concepts
2. Prior Knowledge Connection
3. Real-world Applications

#### Slide 5-${data.slideCount - 3}: Main Content
1. Topic Breakdown
   (a) Concept explanation
   (b) Visual aids
   (c) Examples

2. Interactive Elements
   (a) Discussion points
   (b) Student activities
   (c) Check for understanding

${data.includeActivities ? `
### Learning Activities
1. Individual Activities
   (a) Practice exercises
   (b) Concept mapping
   (c) Problem-solving

2. Group Activities
   (a) Discussions
   (b) Presentations
   (c) Projects` : ''}

${data.includeAssessment ? `
### Assessment Components
1. Formative Assessment
   (a) Quick questions
   (b) Concept checks
   (c) Exit tickets

2. Summative Assessment
   (a) Practice problems
   (b) Application questions
   (c) Project guidelines` : ''}

### Visual Elements
1. Suggested Diagrams
2. Chart Types
3. Illustration Ideas

${data.additionalInstructions ? `### Additional Instructions\n${data.additionalInstructions}` : ''}`;

  const systemPrompt = `You are an expert teacher who creates engaging and educational presentation outlines following NCERT guidelines.

CRITICAL FORMATTING RULES:
1. NEVER start any line with special characters
2. NO dashes (-) at the start of any line
3. NO asterisks (*) at the start of any line
4. NO bullet points (•) at the start of any line

ALWAYS use these formats:
1. For sequential items: Use numbers followed by period (1., 2., 3.)
2. For sub-points: Use letters in parentheses ((a), (b), (c))
3. For slide content: Use numbers (1., 2., 3.)

Document Structure:
1. Use # for main title
2. Use ## for grade and topic
3. Use ### for main sections
4. Use #### for slides
5. Use **text** for emphasis (but never at start of line)

Ensure all content:
1. Covers content from ALL listed chapters
2. Is visually engaging
3. Follows logical progression
4. Includes clear examples
5. Is age-appropriate
6. Aligns with NCERT guidelines`;

  const content = await ContentGenerationService.generate(prompt, {
    systemPrompt,
    maxTokens: 2000,
    temperature: 0.7
  });

  return content + DISCLAIMER;
}