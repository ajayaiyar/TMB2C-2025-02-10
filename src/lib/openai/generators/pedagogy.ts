import { ContentGenerationService } from '../../services/content-generation/service';
import type { Grade, Subject } from '../../../utils/constants';
import { NCERT_CURRICULUM } from '../../../utils/ncertData';

const DISCLAIMER = "\n\n---\n\n*Note: This content is generated using AI. Please review before use.*";

export interface PedagogyFormData {
  subject: Subject;
  grade: Grade;
  topic: string;
  approach: string;
}

interface TopicValidation {
  isValid: boolean;
  correctGrade?: Grade;
  correctSubject?: Subject;
  section?: string;
  chapter?: string;
}

// Helper function to check if a topic exists in a chapter array
function topicExistsInChapters(topic: string, chapters: readonly string[]): boolean {
  return chapters.some(chapter => 
    chapter.toLowerCase().includes(topic.toLowerCase()) ||
    topic.toLowerCase().includes(chapter.toLowerCase())
  );
}

// Function to find the correct grade and subject for a topic
export function validateTopic(topic: string, grade: Grade, subject: Subject): TopicValidation {
  // First check in the specified subject and grade
  const subjectCurriculum = NCERT_CURRICULUM[subject];
  if (subjectCurriculum?.[grade]) {
    const gradeContent = subjectCurriculum[grade];
    
    if (Array.isArray(gradeContent)) {
      if (topicExistsInChapters(topic, gradeContent)) {
        const chapter = gradeContent.find(ch => 
          ch.toLowerCase().includes(topic.toLowerCase()) ||
          topic.toLowerCase().includes(ch.toLowerCase())
        );
        return { 
          isValid: true,
          chapter 
        };
      }
    } else if (typeof gradeContent === 'object') {
      for (const [section, chapters] of Object.entries(gradeContent)) {
        if (topicExistsInChapters(topic, chapters as string[])) {
          const chapter = (chapters as string[]).find(ch => 
            ch.toLowerCase().includes(topic.toLowerCase()) ||
            topic.toLowerCase().includes(ch.toLowerCase())
          );
          return { 
            isValid: true,
            section,
            chapter 
          };
        }
      }
    }
  }

  // If not found in specified grade and subject, check other grades for same subject
  for (const [currGrade, content] of Object.entries(subjectCurriculum || {})) {
    if (currGrade === grade) continue;
    
    if (Array.isArray(content)) {
      if (topicExistsInChapters(topic, content)) {
        return { 
          isValid: false,
          correctGrade: currGrade as Grade,
          chapter: content.find(ch => ch.toLowerCase().includes(topic.toLowerCase()))
        };
      }
    } else if (typeof content === 'object') {
      for (const [section, chapters] of Object.entries(content)) {
        if (topicExistsInChapters(topic, chapters as string[])) {
          return { 
            isValid: false,
            correctGrade: currGrade as Grade,
            section,
            chapter: (chapters as string[]).find(ch => ch.toLowerCase().includes(topic.toLowerCase()))
          };
        }
      }
    }
  }

  // If not found in specified subject, check other subjects
  for (const [currSubject, grades] of Object.entries(NCERT_CURRICULUM)) {
    if (currSubject === subject) continue;
    
    for (const [currGrade, content] of Object.entries(grades)) {
      if (Array.isArray(content)) {
        if (topicExistsInChapters(topic, content)) {
          return { 
            isValid: false,
            correctSubject: currSubject as Subject,
            correctGrade: currGrade as Grade,
            chapter: content.find(ch => ch.toLowerCase().includes(topic.toLowerCase()))
          };
        }
      } else if (typeof content === 'object') {
        for (const [section, chapters] of Object.entries(content)) {
          if (topicExistsInChapters(topic, chapters as string[])) {
            return { 
              isValid: false,
              correctSubject: currSubject as Subject,
              correctGrade: currGrade as Grade,
              section,
              chapter: (chapters as string[]).find(ch => ch.toLowerCase().includes(topic.toLowerCase()))
            };
          }
        }
      }
    }
  }

  return { isValid: false };
}

export async function generatePedagogy(data: PedagogyFormData): Promise<string> {
  // Validate topic
  const validation = validateTopic(data.topic, data.grade, data.subject);
  
  if (!validation.isValid) {
    if (validation.correctSubject && validation.correctSubject !== data.subject) {
      throw new Error(
        `The topic "${data.topic}" belongs to ${validation.correctSubject} curriculum, not ${data.subject}. ` +
        `Please select the correct subject or choose a relevant topic for ${data.subject}.`
      );
    }
    
    if (validation.correctGrade && validation.correctGrade !== data.grade) {
      console.warn(
        `Note: The topic "${data.topic}" is typically covered in Grade ${validation.correctGrade}. ` +
        `Adapting content for Grade ${data.grade}.`
      );
      // Continue with generation but use this information to adapt content
    }
  }

  const prompt = `Generate creative teaching activities and approaches in Markdown format:

# Creative Teaching Activities: ${data.topic}
## Grade ${data.grade} • ${data.subject}
${validation.section ? `## Section: ${validation.section}` : ''}
${validation.chapter ? `## Chapter: ${validation.chapter}` : ''}

### Overview
1. Topic: ${data.topic}
2. Grade Level: ${data.grade}${validation.correctGrade ? ` (Adapted from Grade ${validation.correctGrade})` : ''}
3. Subject: ${data.subject}
4. Teaching Approach: ${data.approach}

### Learning Objectives
1. Knowledge and Understanding
   (a) Key concepts students will learn (grade-appropriate)
   (b) Core principles to be mastered (aligned with ${data.grade} curriculum)
   (c) Essential vocabulary (age-appropriate terminology)

2. Skills Development
   (a) Subject-specific skills (matching ${data.grade} level expectations)
   (b) Cross-curricular competencies
   (c) 21st-century skills

### Activity Design

#### 1. Pre-Activity Setup
1. Required Materials (age-appropriate and safe for ${data.grade} students)
2. Classroom Arrangement
3. Technology Requirements (suitable for ${data.grade} level)
4. Time Allocation (considering attention span of ${data.grade} students)

#### 2. Main Activities
1. Opening/Hook (engaging for ${data.grade} students)
   (a) Age-appropriate engagement strategy
   (b) Prior knowledge activation${validation.correctGrade ? ` (considering Grade ${validation.correctGrade} content)` : ''}
   (c) Clear learning objective presentation

2. Core Learning Activities
   (a) Activity 1: [Specific to ${data.approach} and grade level]
   (b) Activity 2: [Specific to ${data.approach} and grade level]
   (c) Activity 3: [Specific to ${data.approach} and grade level]

3. Student Engagement Strategies
   (a) Individual work components (grade-appropriate difficulty)
   (b) Group work elements (suitable for age group)
   (c) Class discussion points (matching cognitive level)

#### 3. Assessment and Reflection
1. Formative Assessment Techniques (grade-appropriate)
2. Student Self-Reflection Prompts (age-appropriate language)
3. Success Indicators (aligned with ${data.grade} standards)

### Implementation Guide
1. Step-by-Step Instructions (clear for ${data.grade} level)
2. Potential Modifications (for different ability levels within grade)
3. Extension Activities (for advanced ${data.grade} students)

### Teaching Tips
1. Common Student Misconceptions at ${data.grade} level
2. Differentiation Strategies for ${data.grade} class
3. Age-appropriate Classroom Management Suggestions

### Additional Resources
1. Digital Tools and Apps (suitable for ${data.grade} students)
2. Reference Materials (grade-appropriate)
3. Related Activities (aligned with ${data.grade} curriculum)`;

  const systemPrompt = `You are an expert teacher who creates innovative and engaging teaching activities following NCERT guidelines and NCF 2023 framework.

CRITICAL FORMATTING RULES:
1. NEVER start any line with special characters
2. NO dashes (-) at the start of any line
3. NO asterisks (*) at the start of any line
4. NO bullet points (•) at the start of any line

ALWAYS use these formats:
1. For sequential items: Use numbers followed by period (1., 2., 3.)
2. For sub-points: Use letters in parentheses ((a), (b), (c))
3. For activity steps: Use numbers (1., 2., 3.)

Document Structure:
1. Use # for main title
2. Use ## for grade and subject
3. Use ### for main sections
4. Use #### for subsections
5. Use **text** for emphasis (but never at start of line)

GRADE-LEVEL APPROPRIATENESS GUIDELINES:
${validation.correctGrade ? `Note: This content is being adapted from Grade ${validation.correctGrade} to Grade ${data.grade}. Ensure appropriate scaffolding and modifications.` : ''}

For Grade 6-8:
1. Use concrete examples and hands-on activities
2. Include visual aids and demonstrations
3. Keep instructions simple and clear
4. Focus on foundational concepts
5. Use age-appropriate vocabulary

For Grade 9-10:
1. Introduce abstract concepts gradually
2. Include more analytical activities
3. Encourage critical thinking
4. Use real-world applications
5. Balance individual and group work

For Grade 11-12:
1. Focus on advanced concepts
2. Include research-based activities
3. Promote independent learning
4. Use complex problem-solving
5. Prepare for higher education`;

  const content = await ContentGenerationService.generate(prompt, {
    systemPrompt,
    maxTokens: 2000,
    temperature: 0.7
  });

  return content + DISCLAIMER;
} 