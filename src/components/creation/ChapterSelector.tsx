import { Check } from 'lucide-react';
import { MULTI_GRADE_CHAPTERS, NCERT_CURRICULUM, SECTION_HEADERS } from '../../utils/ncertData';
import type { Chapter, MultiBookGrade } from '../../utils/ncertData';
import type { Grade, Subject } from '../../utils/constants';
import { isMultiBookGrade, hasMultipleTextbooks } from '../../utils/ncertData';
import { useEffect } from 'react';

interface ChapterSelectorProps {
  subject: Subject;
  grade: Grade;
  selectedChapters: Chapter[];
  onChapterSelect: (chapters: Chapter[]) => void;
  textbook?: string;
  onTextbookChange?: (textbook: string) => void;
}

const isSectionHeader = (chapterTitle: string, subject: Subject, grade: Grade): boolean => {
  return SECTION_HEADERS[grade]?.[subject]?.includes(chapterTitle) || false;
};

const formatChapterTitle = (title: string): JSX.Element => {
  // Split by underscore pairs to handle italics
  const parts = title.split(/(_.*?_)/);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('_') && part.endsWith('_')) {
          // Remove underscores and apply italic style
          return <i key={index} className="font-italic">{part.slice(1, -1)}</i>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};

export function ChapterSelector({ 
  subject, 
  grade, 
  selectedChapters = [], 
  onChapterSelect,
  textbook = '',
  onTextbookChange
}: ChapterSelectorProps) {
  // If no textbook is specified and the subject doesn't have multiple textbooks,
  // use the subject name as the textbook
  const effectiveTextbook = (!textbook && !hasMultipleTextbooks(grade, subject)) ? subject : textbook;

  const handleChapterSelect = (chapterTitle: string) => {
    const chapter: Chapter = {
      title: chapterTitle,
      number: selectedChapters.length + 1,
      textbook: effectiveTextbook
    };

    if (selectedChapters.some(ch => ch.title === chapter.title)) {
      onChapterSelect(selectedChapters.filter(ch => ch.title !== chapter.title));
    } else {
      onChapterSelect([...selectedChapters, chapter]);
    }
  };

  const handleSelectAll = () => {
    if (!isMultiBookGrade(grade)) return;

    const gradeBooks = MULTI_GRADE_CHAPTERS[grade];
    if (!gradeBooks) return;

    type ValidSubjects = keyof typeof gradeBooks;
    const subjectBooks = gradeBooks[subject as ValidSubjects];
    if (!subjectBooks) return;

    const chapters = Object.entries(subjectBooks)
      .filter(([book]) => !effectiveTextbook || book === effectiveTextbook)
      .flatMap(([book, chapterTitles]) =>
        (Array.isArray(chapterTitles) ? chapterTitles : [])
          .filter(title => !isSectionHeader(title, subject, grade))
          .map((title, index) => ({
            title,
            number: index + 1,
            textbook: book
          }))
      );

    onChapterSelect(chapters);
  };

  const renderChapters = () => {
    if (!grade || !subject) return null;

    let chapterList: string[] = [];
    
    if (hasMultipleTextbooks(grade, subject)) {
      if (!textbook) {
        return (
          <div className="p-4 text-sm text-gray-600 bg-gray-50 rounded-lg">
            Please select a textbook to view chapters.
          </div>
        );
      }
      
      const gradeBooks = MULTI_GRADE_CHAPTERS[grade as MultiBookGrade];
      if (!gradeBooks) return null;

      const subjectBooks = gradeBooks[subject as keyof typeof gradeBooks];
      if (!subjectBooks) return null;

      // Special handling for Grade 8 Social Science Our Pasts III
      if (grade === '8th' && subject === 'Social Science' && textbook === 'Our Pasts III') {
        const socialScienceBooks = subjectBooks as typeof MULTI_GRADE_CHAPTERS['8th']['Social Science'];
        const part1Chapters = socialScienceBooks['Our Pasts III Part 1'];
        const part2Chapters = socialScienceBooks['Our Pasts III Part 2'];
        chapterList = [...(part1Chapters || []), ...(part2Chapters || [])];
      } else {
        const textbookChapters = subjectBooks[textbook as keyof typeof subjectBooks];
        if (Array.isArray(textbookChapters)) {
          chapterList = textbookChapters;
        }
      }
    } else {
      // Handle subjects with single textbook
      const subjectData = NCERT_CURRICULUM[subject];
      if (!subjectData) return null;

      const gradeData = subjectData[grade];
      if (!gradeData) return null;

      if (Array.isArray(gradeData)) {
        chapterList = gradeData;
      }
    }

    return (
      <div className="mt-4">
        <div className="space-y-2">
          {chapterList.map((chapterTitle: string) => {
            const isHeader = isSectionHeader(chapterTitle, subject, grade);
            return isHeader ? (
              <div key={chapterTitle} className="pt-4 pb-2">
                <h4 className="text-sm font-semibold text-gray-900">{formatChapterTitle(chapterTitle)}</h4>
              </div>
            ) : (
              <div
                key={chapterTitle}
                onClick={() => handleChapterSelect(chapterTitle)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedChapters.some(ch => ch.title === chapterTitle)
                    ? 'bg-indigo-50 border-2 border-indigo-500'
                    : 'bg-white border border-gray-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedChapters.some(ch => ch.title === chapterTitle)}
                    onChange={() => handleChapterSelect(chapterTitle)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="flex-grow text-sm text-gray-900">
                    {formatChapterTitle(chapterTitle)}
                  </span>
                  {selectedChapters.some(ch => ch.title === chapterTitle) && (
                    <Check className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Call onTextbookChange when textbook changes
  useEffect(() => {
    if (onTextbookChange) {
      onTextbookChange(effectiveTextbook);
    }
  }, [effectiveTextbook, onTextbookChange]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700">Select Chapters</h3>
        <button
          type="button"
          onClick={handleSelectAll}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Select All
        </button>
      </div>

      {renderChapters()}
    </div>
  );
}