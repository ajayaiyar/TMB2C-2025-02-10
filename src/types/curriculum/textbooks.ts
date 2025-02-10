import { Grade, Subject } from './subjects';
import { Chapter } from './chapters';

export interface Textbook {
  id: string;
  name: string;
  subject: Subject;
  grade: Grade;
  publisher?: string;
  edition?: string;
  chapters: Chapter[];
}

export interface TextbookMetadata {
  subject: Subject;
  grade: Grade;
  availableTextbooks: string[];
}

export interface TextbookValidation {
  isValid: boolean;
  errors: string[];
}

export const validateTextbook = (textbook: Partial<Textbook>): TextbookValidation => {
  const errors: string[] = [];
  
  if (!textbook.name?.trim()) {
    errors.push('Textbook name is required');
  }
  
  if (!textbook.subject) {
    errors.push('Subject is required');
  }
  
  if (!textbook.grade) {
    errors.push('Grade is required');
  }
  
  if (!Array.isArray(textbook.chapters)) {
    errors.push('Chapters must be an array');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Special textbook types for specific subjects
export type EnglishTextbook = 
  | 'Beehive' | 'Moments'             // 9th
  | 'First Flight' | 'Footprints Without Feet'  // 10th
  | 'Hornbill' | 'Snapshots' | 'The Woven Words'  // 11th
  | 'Kaleidoscope' | 'Flamingo' | 'Vistas';     // 12th

export type SocialScienceTextbook = 
  | 'Our Pasts III'
  | 'Resources and Development'
  | 'Social and Political Life III'
  | 'Contemporary India I'
  | 'Democratic Politics I'
  | 'India and the Contemporary World I'
  | 'Economics'; 