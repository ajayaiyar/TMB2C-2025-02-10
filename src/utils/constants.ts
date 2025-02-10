// Define the base types first
export type Grade = '6th' | '7th' | '8th' | '9th' | '10th' | '11th' | '12th';
export type Subject = 
  | 'Arts' 
  | 'Biology'
  | 'Biotechnology'
  | 'Chemistry'
  | 'Computer Science'
  | 'English' 
  | 'Health and Physical Education' 
  | 'ICT'
  | 'Informatics Practices'
  | 'Mathematics' 
  | 'Physics'
  | 'Science' 
  | 'Social Science';

// Then define the constants with explicit typing
export const GRADES: readonly Grade[] = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];

export const SUBJECTS: readonly Subject[] = [
  'Arts',
  'Biology',
  'Biotechnology',
  'Chemistry',
  'Computer Science',
  'English',
  'Health and Physical Education',
  'ICT',
  'Informatics Practices',
  'Mathematics',
  'Physics',
  'Science',
  'Social Science'
] as const;

export const GRADE_SUBJECTS: Record<Grade, readonly Subject[]> = {
  '6th': ['Arts', 'English', 'Mathematics', 'Science', 'Social Science'],
  '7th': ['English', 'Mathematics', 'Science', 'Social Science'],
  '8th': ['English', 'Mathematics', 'Science', 'Social Science'],
  '9th': ['English', 'Health and Physical Education', 'ICT', 'Mathematics', 'Science', 'Social Science'],
  '10th': ['English', 'Health and Physical Education', 'Mathematics', 'Science', 'Social Science'],
  '11th': [
    'Biology',
    'Biotechnology',
    'Chemistry',
    'Computer Science',
    'English',
    'Health and Physical Education',
    'Informatics Practices',
    'Mathematics',
    'Physics'
  ],
  '12th': [
    'Biology',
    'Biotechnology',
    'Chemistry',
    'Computer Science',
    'English',
    'Informatics Practices',
    'Mathematics',
    'Physics'
  ]
} as const;

// Define textbook types
type TextbookMap = Record<Grade, Partial<Record<Subject, readonly string[]>>>;

export const TEXTBOOKS: TextbookMap = {
  '6th': {
    'Arts': ['Kriti I'],
    'English': ['Poorvi'],
    'Mathematics': ['Ganita Prakash'],
    'Science': ['Curiosity'],
    'Social Science': ['Exploring Society: India and Beyond']
  },
  '7th': {
    'English': ['Honeycomb', 'An Alien Hand'],
    'Mathematics': ['Mathematics'],
    'Science': ['Science'],
    'Social Science': ['Our Pasts II', 'Our Environment', 'Social and Political Life II']
  },
  '8th': {
    'English': ['Honeydew', 'It So Happened'],
    'Mathematics': ['Mathematics'],
    'Science': ['Science'],
    'Social Science': ['Our Pasts III', 'Resources and Development', 'Social and Political Life III']
  },
  '9th': {
    'English': ['Beehive', 'Moments'],
    'Mathematics': ['Mathematics'],
    'Science': ['Science'],
    'Social Science': [
      'Contemporary India I',
      'Democratic Politics I',
      'India and the Contemporary World I',
      'Economics'
    ],
    'Health and Physical Education': ['Health and Physical Education'],
    'ICT': ['ICT']
  },
  '10th': {
    'English': ['First Flight', 'Footprints Without Feet'],
    'Mathematics': ['Mathematics'],
    'Science': ['Science'],
    'Social Science': [
      'Contemporary India II',
      'Democratic Politics II',
      'India and the Contemporary World II',
      'Understanding Economic Development'
    ],
    'Health and Physical Education': ['Health and Physical Education']
  },
  '11th': {
    'English': ['Hornbill', 'Snapshots', 'The Woven Words'],
    'Physics': ['Part I', 'Part II'],
    'Chemistry': ['Part I', 'Part II'],
    'Mathematics': ['Part I', 'Part II'],
    'Science': ['Part I', 'Part II']
  },
  '12th': {
    'English': ['Kaleidoscope', 'Flamingo', 'Vistas'],
    'Physics': ['Part I', 'Part II'],
    'Chemistry': ['Part I', 'Part II'],
    'Mathematics': ['Part I', 'Part II'],
    'Science': ['Part I', 'Part II']
  }
} as const;

export const ROLES = ['Teacher', 'Principal', 'Administrator'] as const;

export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'] as const;

export const TAXONOMY_TYPES = ['Bloom\'s Taxonomy', 'Depth of Knowledge (DOK)'] as const;

export const BLOOMS_LEVELS = [
  'Remember',
  'Understand',
  'Apply',
  'Analyze',
  'Evaluate',
  'Create'
] as const;

export const DOK_LEVELS = [
  'Recall',
  'Skill/Concept',
  'Strategic Thinking',
  'Extended Thinking'
] as const;

export const LESSON_DURATIONS = [
  '30 minutes',
  '45 minutes',
  '60 minutes',
  '90 minutes'
] as const;

export const LEARNING_STYLES = {
  visual: 'Visual',
  auditory: 'Auditory',
  kinesthetic: 'Kinesthetic'
} as const;

// Derived types for other constants
export type Role = typeof ROLES[number];
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];
export type TaxonomyType = typeof TAXONOMY_TYPES[number];
export type BloomsLevel = typeof BLOOMS_LEVELS[number];
export type DOKLevel = typeof DOK_LEVELS[number];
export type LessonDuration = typeof LESSON_DURATIONS[number];
export type LearningStyle = typeof LEARNING_STYLES[keyof typeof LEARNING_STYLES];