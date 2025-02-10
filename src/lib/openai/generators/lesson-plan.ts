import { ContentGenerationService } from '../../services/content-generation/service';
import { searchEducationalVideo } from '../../services/content-generation/video-search';
import type { Chapter } from '../../../utils/ncertData';

const DISCLAIMER = "\n\n---\n\n*Note: This content is generated using AI. Please review before use.*";

export async function generateLessonPlan(data: {
  topic: string;
  subject: string;
  grade: string;
  chapters: Chapter[];
  textbook?: string;
  section?: string;
  numberOfClasses: number;
  duration: string;
  learningStyles: string[];
  additionalInstructions?: string;
}): Promise<string> {
  // Debug logging
  console.log('Lesson Plan Generation Data:', {
    subject: data.subject,
    grade: data.grade,
    chapters: data.chapters,
    textbook: data.textbook,
    section: data.section,
    topic: data.topic,
    numberOfClasses: data.numberOfClasses,
    duration: data.duration
  });

  // Search for relevant educational videos
  const searchQuery = `${data.subject} ${data.grade} ${data.topic} NCERT`;
  const videosSection = await searchEducationalVideo(searchQuery);

  const prompt = `Generate a detailed ${data.numberOfClasses > 1 ? `set of ${data.numberOfClasses} lesson plans` : 'lesson plan'} in Markdown format:

# ${data.subject} ${data.numberOfClasses > 1 ? 'Lesson Plans' : 'Lesson Plan'}
## Topic: ${data.topic}
## Subject: ${data.subject}
## Grade: ${data.grade}
## Chapter${data.chapters.length > 1 ? 's' : ''}: ${data.chapters.map((ch, index) => `${index + 1}. ${ch.title}`).join('\n')}
## Textbook: ${data.textbook || data.subject}
${data.section ? `## Section: ${data.section} (for guidance)` : ''}

${data.numberOfClasses > 1 ? `### Overview
1. Total Number of Periods: ${data.numberOfClasses}
2. Duration: ${data.duration} per period
3. Learning Styles: ${data.learningStyles.join(', ')}

${Array.from({ length: data.numberOfClasses }, (_, i) => `
### Period ${i + 1} (${data.duration})

#### Learning Objectives
1. Knowledge and Understanding
2. Skills and Applications
3. Values and Attitudes

#### Required Materials
1. Teaching aids
2. Digital resources
3. Handouts/worksheets

#### Lesson Structure

##### 1. Introduction/Hook [${Math.round(parseInt(data.duration) * 0.15)} minutes]
1. Recap of previous period (${i > 0 ? 'required' : 'not applicable'})
2. Engagement activity
3. Learning objectives presentation

##### 2. Main Content [${Math.round(parseInt(data.duration) * 0.65)} minutes]
1. Key concepts explanation
2. Interactive activities
3. Guided practice

##### 3. Assessment/Closure [${Math.round(parseInt(data.duration) * 0.20)} minutes]
1. Learning check
2. Summary of key points
3. Preview of next period${i < data.numberOfClasses - 1 ? ' content' : ' (final review)'}`).join('\n')}` :
`### Basic Information
1. Duration: ${data.duration}
2. Learning Styles: ${data.learningStyles.join(', ')}

### Learning Objectives
1. Knowledge and Understanding
2. Skills and Applications
3. Values and Attitudes

### Required Materials
1. Teaching aids
2. Digital resources
3. Handouts/worksheets

### Lesson Structure

#### 1. Introduction/Hook [${Math.round(parseInt(data.duration) * 0.15)} minutes]
1. Engagement activity
2. Prior knowledge activation
3. Learning objectives presentation

#### 2. Main Content [${Math.round(parseInt(data.duration) * 0.65)} minutes]
1. Key concepts explanation
2. Interactive activities
3. Guided practice

#### 3. Assessment/Closure [${Math.round(parseInt(data.duration) * 0.20)} minutes]
1. Learning check
2. Summary of key points
3. Assignment briefing`}

### Additional Resources
1. Digital Content:
${videosSection || '   No videos found'}
2. Reference Materials
3. Extension Activities

${data.additionalInstructions ? `### Additional Instructions\n${data.additionalInstructions}` : ''}`;

  const systemPrompt = `You are an expert teacher who creates detailed lesson plans following NCERT guidelines and NCF 2023 framework.

${data.numberOfClasses > 1 ? `CRITICAL PERIOD-WISE PLANNING RULES:
1. Break down the chapter content logically across ${data.numberOfClasses} periods
2. Ensure progressive flow of concepts from one period to next
3. Each period should have clear start and end points
4. Include recaps of previous periods where relevant
5. Distribute activities and assessments appropriately across periods

` : ''}CRITICAL FORMATTING RULES:
1. NEVER start any line with special characters
2. NO dashes (-) at the start of any line
3. NO asterisks (*) at the start of any line
4. NO bullet points (•) at the start of any line

ALWAYS use these formats:
1. For sequential lists: Use numbers followed by period (1., 2., 3.)
2. For sub-points: Use letters in parentheses ((a), (b), (c))
3. For activity steps: Use numbers (1., 2., 3.)

Document Structure:
1. Use # for main title
2. Use ## for grade and topic
3. Use ### for main sections
4. Use #### for subsections
5. Use **text** for emphasis (but never at start of line)

CRITICAL CONTENT RULES:
1. This lesson plan covers multiple chapters - ensure content addresses ALL chapters listed
2. Provide specific activities and examples for each chapter
3. Create clear transitions between chapters
4. Balance time allocation across all chapters
5. Include chapter-specific assessment strategies

Ensure all activities are:
1. Age-appropriate
2. Aligned with NCERT guidelines
3. Engaging and interactive
4. Time-appropriate
5. Resource-conscious

Learning Styles Integration:
1. Visual Learning: Include diagrams, charts, videos, and visual demonstrations
2. Auditory Learning: Include discussions, presentations, and verbal explanations
3. Kinesthetic Learning: Include hands-on activities, experiments, and physical movement`;

  const content = await ContentGenerationService.generate(prompt, {
    systemPrompt,
    maxTokens: 2000,
    temperature: 0.7
  });

  return content + DISCLAIMER;
}