export type Grade = 
  | '6th'
  | '7th'
  | '8th'
  | '9th'
  | '10th'
  | '11th'
  | '12th';

export type Subject =
  | 'Biology'
  | 'Chemistry'
  | 'Physics'
  | 'Mathematics'
  | 'Computer Science'
  | 'English'
  | 'History'
  | 'Geography'
  | 'Science';

export type SubjectsByGrade = Record<Grade, Subject[]>;

export interface SubjectMetadata {
  name: Subject;
  hasMultipleTextbooks: boolean;
  applicableGrades: Grade[];
}

export const SUBJECTS_BY_GRADE: SubjectsByGrade = {
  '6th': ['Mathematics', 'Science', 'English', 'History', 'Geography'],
  '7th': ['Mathematics', 'Science', 'English', 'History', 'Geography'],
  '8th': ['Mathematics', 'Science', 'English', 'History', 'Geography'],
  '9th': ['Mathematics', 'Biology', 'Chemistry', 'Physics', 'English', 'History', 'Geography'],
  '10th': ['Mathematics', 'Biology', 'Chemistry', 'Physics', 'English', 'History', 'Geography'],
  '11th': ['Mathematics', 'Biology', 'Chemistry', 'Physics', 'Computer Science', 'English'],
  '12th': ['Mathematics', 'Biology', 'Chemistry', 'Physics', 'Computer Science', 'English']
} as const;

export const SUBJECT_METADATA: SubjectMetadata[] = [
  {
    name: 'Biology',
    hasMultipleTextbooks: true,
    applicableGrades: ['9th', '10th', '11th', '12th']
  },
  {
    name: 'Chemistry',
    hasMultipleTextbooks: true,
    applicableGrades: ['9th', '10th', '11th', '12th']
  },
  {
    name: 'Physics',
    hasMultipleTextbooks: true,
    applicableGrades: ['9th', '10th', '11th', '12th']
  },
  {
    name: 'Mathematics',
    hasMultipleTextbooks: true,
    applicableGrades: ['6th', '7th', '8th', '9th', '10th', '11th', '12th']
  },
  {
    name: 'Computer Science',
    hasMultipleTextbooks: false,
    applicableGrades: ['11th', '12th']
  },
  {
    name: 'English',
    hasMultipleTextbooks: false,
    applicableGrades: ['6th', '7th', '8th', '9th', '10th', '11th', '12th']
  },
  {
    name: 'History',
    hasMultipleTextbooks: false,
    applicableGrades: ['6th', '7th', '8th', '9th', '10th']
  },
  {
    name: 'Geography',
    hasMultipleTextbooks: false,
    applicableGrades: ['6th', '7th', '8th', '9th', '10th']
  }
] as const; 