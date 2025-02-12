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
${data.chapters.map((ch, index) => `${index + 1}) ${ch.title}`).join('\n')}

### Presentation Information
1. Number of Slides: ${data.slideCount}
2. Visual Style: ${data.visualPreference}
3. Include Activities: ${data.includeActivities ? 'Yes' : 'No'}
4. Include Assessment: ${data.includeAssessment ? 'Yes' : 'No'}

### Slide Structure

#### Slide 1: Title
1. Title: ${data.subject} - ${data.topic}
2. Subtitle: Grade ${data.grade}
3. Brief Overview of Topics
4. Visual Element: Subject-related imagery or diagram

#### Slide 2: Learning Objectives
1. Knowledge Objectives
   (a) Key concepts to be mastered
   (b) Fundamental principles
2. Skill Objectives
   (a) Practical applications
   (b) Problem-solving abilities
3. Application Objectives
   (a) Real-world connections
   (b) Cross-disciplinary links

#### Slide 3: Introduction
1. Chapter Overview
2. Key Terms Introduction
3. Prior Knowledge Activation
4. Visual Element: Concept Map

#### Slide 4: Prior Knowledge
1. Review of Prerequisites
2. Connection to Previous Topics
3. Quick Review Questions
4. Visual Element: Knowledge Bridge Diagram

${Array.from({ length: data.slideCount - 6 }, (_, i) => `
#### Slide ${i + 5}: Main Content
1. Topic: [Chapter-specific content]
2. Key Concepts
   (a) Detailed explanation
   (b) Examples
   (c) Illustrations
3. Practice Elements
   (a) Quick check
   (b) Discussion point
4. Visual Element: [Topic-specific visualization]`).join('\n')}

#### Slide ${data.slideCount - 1}: Summary
1. Key Points Review
2. Learning Outcomes Achieved
3. Connection to Next Topics
4. Visual Element: Summary Infographic

#### Slide ${data.slideCount}: Assessment
1. Review Questions
2. Practice Problems
3. Discussion Topics
4. Visual Element: Assessment Framework

${data.includeActivities ? `
### Learning Activities (Integrated into relevant content slides)
1. Individual Activities
   (a) Practice exercises with solutions
   (b) Concept mapping activities
   (c) Self-assessment questions

2. Group Activities
   (a) Peer discussions with prompts
   (b) Collaborative problem-solving
   (c) Group presentation topics` : ''}

${data.includeAssessment ? `
### Assessment Components (Integrated into relevant slides)
1. Formative Assessment
   (a) Quick concept checks
   (b) Understanding probes
   (c) Exit ticket questions

2. Summative Assessment
   (a) Chapter-end problems
   (b) Application scenarios
   (c) Project guidelines` : ''}

### Visual Elements Guide
1. Suggested Diagrams
   (a) Concept maps
   (b) Process flows
   (c) Comparison charts
2. Chart Types
   (a) Data visualizations
   (b) Relationship diagrams
   (c) Timeline progressions
3. Illustration Ideas
   (a) Real-world examples
   (b) Step-by-step processes
   (c) Visual analogies

${data.additionalInstructions ? `### Additional Instructions\n${data.additionalInstructions}` : ''}`;

const systemPrompt = `You are an expert teacher who creates engaging and educational presentation outlines following NCERT guidelines.

CRITICAL FORMATTING RULES:
1. NEVER start any line with special characters
2. NO dashes (-) at the start of any line
3. NO asterisks (*) at the start of any line
4. NO bullet points (•) at the start of any line
5. Each slide should be self-contained with complete content
6. Use descriptive titles for each slide
7. Include specific visual elements for each slide

MATHEMATICAL AND SCIENTIFIC NOTATION:
1. Use LaTeX for complex mathematical expressions:
   (a) Wrap in $...$ for inline math
   (b) Wrap in $$...$$ for display math
   (c) Example: $\\frac{dx}{dt}$ for derivatives
   (d) Example: $$\\int_0^\\infty e^{-x^2} dx$$ for equations
2. Use Unicode for simple symbols:
   (a) Use × (U+00D7) for multiplication
   (b) Use ÷ (U+00F7) for division
   (c) Use ° (U+00B0) for degrees
   (d) Use ² (U+00B2) for squared
   (e) Use ³ (U+00B3) for cubed
   (f) Use μ (U+03BC) for micro

ALWAYS use these formats:
1. For sequential items: Use numbers followed by period (1., 2., 3.)
2. For sub-points: Use letters in parentheses ((a), (b), (c))
3. For slide content: Use numbers (1., 2., 3.)
4. Include visual element description for each slide

Document Structure:
1. Use # for main title
2. Use ## for grade and topic
3. Use ### for main sections
4. Use #### for slides
5. Use **text** for emphasis (but never at start of line)

Content Guidelines:
1. Each slide should have clear, specific content
2. Include relevant examples and illustrations
3. Maintain logical flow between slides
4. Balance text and visual elements
5. Incorporate interactive elements where appropriate
6. Align with age-appropriate learning objectives
7. Follow NCERT curriculum guidelines
8. Include specific chapter references
9. Provide clear learning outcomes
10. Include practical applications`;

const content = await ContentGenerationService.generate(prompt, {
  systemPrompt,
  maxTokens: 2000,
  temperature: 0.7
});

return content + DISCLAIMER;
}