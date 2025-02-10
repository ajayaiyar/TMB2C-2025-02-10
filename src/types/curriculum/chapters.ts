import { Grade, Subject } from './subjects';

export interface Chapter {
  id: string;
  name: string;
  number: number;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  sections: Section[];
}

export interface Section {
  id: string;
  name: string;
  content?: string;
}

export interface ChapterMetadata {
  subject: Subject;
  grade: Grade;
  textbook: string;
  chapters: Chapter[];
}

export interface ChapterValidation {
  isValid: boolean;
  errors: string[];
}

export const validateChapter = (chapter: Partial<Chapter>): ChapterValidation => {
  const errors: string[] = [];
  
  if (!chapter.name?.trim()) {
    errors.push('Chapter name is required');
  }
  
  if (typeof chapter.number !== 'number' || chapter.number < 1) {
    errors.push('Chapter number must be a positive number');
  }
  
  if (!Array.isArray(chapter.topics)) {
    errors.push('Topics must be an array');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export type ChaptersByGrade = {
  [G in Grade]?: {
    [S in Subject]?: {
      [textbook: string]: Chapter[];
    };
  };
};

export interface SectionHeader {
  title: string;
  grade: Grade;
  subject: Subject;
  textbook?: string;
} 