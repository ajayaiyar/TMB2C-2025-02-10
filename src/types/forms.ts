import type { Grade, Subject } from '../utils/constants';
import type { Chapter } from '../utils/ncertData';

export interface StandardFormData {
  subject: Subject;
  grade: Grade;
  chapters?: Chapter[];
  textbook?: string;
  topic?: string;
}

export interface PedagogyFormData {
  subject: Subject;
  grade: Grade;
  topic: string;
  approach: string;
}

export interface LessonPlanFormData {
  duration: string;
  learningStyles: string[];
  objectives: string;
  additionalInstructions: string;
}

export interface QuizFormData {
  questionCount: number;
  difficultyLevel: string;
  taxonomyType: string;
  taxonomyLevels: string[];
  additionalInstructions: string;
}

export interface WorksheetFormData {
  questionTypes: string[];
  difficultyLevel: string;
  includeAnswerKey: boolean;
  additionalInstructions: string;
}

export interface PresentationFormData {
  slideCount: number;
  visualPreference: string;
  includeActivities: boolean;
  includeAssessment: boolean;
  additionalInstructions: string;
}

export interface AssessmentFormData {
  assessmentType: 'pre-assessment' | 'post-assessment' | 'test-paper';
  duration: string;
  totalMarks: number;
  sectionTypes: string[];
  includeRubric: boolean;
  includeSolutions: boolean;
  additionalInstructions: string;
}