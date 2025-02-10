export * from './subjects';
export * from './chapters';
export * from './textbooks';

export interface CurriculumContext {
  grade: Grade;
  subject: Subject;
  textbook?: string;
  chapters?: Chapter[];
  topic?: string;
  section?: string;
}

export interface CurriculumValidation {
  isValidGrade: boolean;
  isValidSubject: boolean;
  isValidTextbook: boolean;
  isValidChapter: boolean;
  errors: string[];
}

export type CurriculumType = 
  | 'lesson-plan'
  | 'quiz'
  | 'worksheet'
  | 'presentation'
  | 'assessment'
  | 'pedagogy'; 