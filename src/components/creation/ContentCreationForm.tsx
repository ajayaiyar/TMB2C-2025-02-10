import React, { useState } from 'react';
import { type Grade, type Subject, GRADE_SUBJECTS } from '../../utils/constants';
import { ChapterSelector } from './ChapterSelector';
import type { Chapter } from '../../utils/ncertData';
import { TEXTBOOKS } from '../../utils/constants';
import { validateTopic } from '../../lib/openai/generators/pedagogy';
import { Loader2 } from 'lucide-react';

const PEDAGOGICAL_APPROACHES = [
  'Competency-Based Learning',
  'Inquiry-Based Learning',
  'Project-Based Learning',
  'Experiential Learning',
  'Play-Based Learning',
  'Arts-Integrated Learning',
  'Sports-Integrated Learning',
  'Technology-Enabled Learning',
  'Flipped Classroom',
  'Collaborative Learning',
  'Analogies'
] as const;

type PedagogyFormData = {
  subject: Subject;
  grade: Grade;
  topic: string;
  approach: string;
};

type StandardFormData = {
  subject: Subject;
  grade: Grade;
  chapters?: Chapter[];
  textbook?: string;
  topic?: string;
};

interface Props {
  onSubmit: (data: PedagogyFormData | StandardFormData) => Promise<void>;
  contentType: 'pedagogy' | 'standard';
  error?: string;
  isLoading?: boolean;
}

export function ContentCreationForm({ onSubmit, contentType, error: externalError, isLoading = false }: Props) {
  const [grade, setGrade] = useState<Grade>('6th');
  const [subject, setSubject] = useState<Subject>('Mathematics');
  const [selectedChapters, setSelectedChapters] = useState<Chapter[]>([]);
  const [textbook, setTextbook] = useState<string>('');
  const [topic, setTopic] = useState('');
  const [approach, setApproach] = useState('');
  const [internalError, setInternalError] = useState<string | null>(null);

  // Get available subjects based on grade
  const availableSubjects = GRADE_SUBJECTS[grade] || [];

  // Get available textbooks based on grade and subject
  const availableTextbooks = grade && subject && contentType !== 'pedagogy' ? TEXTBOOKS[grade]?.[subject] || [] : [];

  // Display either external or internal error
  const errorMessage = externalError || internalError;

  // Set default textbook when subject changes or on initial load
  React.useEffect(() => {
    if (grade && subject && contentType !== 'pedagogy') {
      if (availableTextbooks.length > 0) {
        if (availableTextbooks.length === 1) {
          setTextbook(availableTextbooks[0]);
        } else if (!availableTextbooks.includes(textbook)) {
          setTextbook(availableTextbooks[0]);
        }
      } else {
        setTextbook(subject);
      }
    }
  }, [grade, subject, availableTextbooks]);

  const handleGradeChange = (newGrade: Grade) => {
    setGrade(newGrade);
    const newAvailableSubjects = GRADE_SUBJECTS[newGrade] || [];
    if (!newAvailableSubjects.includes(subject)) {
      setSubject(newAvailableSubjects[0]);
    }
    setSelectedChapters([]);
  };

  const handleSubjectChange = (newSubject: Subject) => {
    setSubject(newSubject);
    setSelectedChapters([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !grade) return;

    // Clear any previous errors
    setInternalError(null);

    if (contentType === 'pedagogy') {
      if (!topic.trim()) {
        setInternalError('Please enter a topic');
        return;
      }

      if (!approach) {
        setInternalError('Please select a pedagogical approach');
        return;
      }

      // Validate topic against curriculum
      const validation = validateTopic(topic, grade, subject);
      if (!validation.isValid) {
        if (validation.correctSubject && validation.correctSubject !== subject) {
          setInternalError(`Topic "${topic}" belongs to ${validation.correctSubject} curriculum, not ${subject}. Please select the correct subject or choose a relevant topic for ${subject}.`);
          return;
        }
      }

      try {
        await onSubmit({
          subject,
          grade,
          topic,
          approach
        });
      } catch (err) {
        console.error('Form submission error:', err);
        setInternalError(err instanceof Error ? err.message : 'An unexpected error occurred');
      }
    } else {
      if (selectedChapters.length === 0) {
        setInternalError('Please select at least one chapter');
        return;
      }

      try {
        await onSubmit({
          subject,
          grade,
          chapters: selectedChapters,
          textbook,
          topic
        });
      } catch (err) {
        console.error('Form submission error:', err);
        setInternalError(err instanceof Error ? err.message : 'An unexpected error occurred');
      }
    }
  };

  if (contentType === 'pedagogy') {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade
            </label>
            <select
              value={grade}
              onChange={(e) => handleGradeChange(e.target.value as Grade)}
              className="block w-full bg-white p-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="6th">6th</option>
              <option value="7th">7th</option>
              <option value="8th">8th</option>
              <option value="9th">9th</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="block w-full bg-white p-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {availableSubjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter the topic you want to teach"
            className="block w-full bg-white p-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <p className="mt-1 text-sm text-gray-500">
            Example: Photosynthesis, Fractions, Newton's Laws
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Pedagogical Approach
          </label>
          <div className="grid grid-cols-2 gap-4">
            {PEDAGOGICAL_APPROACHES.map((approachOption) => (
              <button
                key={approachOption}
                type="button"
                onClick={() => setApproach(approachOption)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  approach === approachOption
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                {approachOption}
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
            <p className="text-red-700">{errorMessage}</p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !topic.trim() || (contentType === 'pedagogy' && !approach)}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isLoading || !topic.trim() || (contentType === 'pedagogy' && !approach)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Generating...
              </>
            ) : (
              'Generate Ideas'
            )}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-8 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grade
          </label>
          <select
            value={grade}
            onChange={(e) => handleGradeChange(e.target.value as Grade)}
            className="block w-full bg-white p-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="6th">6th</option>
            <option value="7th">7th</option>
            <option value="8th">8th</option>
            <option value="9th">9th</option>
            <option value="10th">10th</option>
            <option value="11th">11th</option>
            <option value="12th">12th</option>
          </select>
        </div>

        <div className="col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <select
            value={subject}
            onChange={(e) => handleSubjectChange(e.target.value as Subject)}
            className="block w-full bg-white p-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {availableSubjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>

        {availableTextbooks.length > 0 && (
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Textbook
            </label>
            <select
              value={textbook}
              onChange={(e) => {
                setTextbook(e.target.value);
                setSelectedChapters([]);
              }}
              className="block w-full bg-white p-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {availableTextbooks.map((book) => (
                <option key={book} value={book}>
                  {book}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <ChapterSelector
        subject={subject}
        grade={grade}
        selectedChapters={selectedChapters}
        onChapterSelect={setSelectedChapters}
        textbook={textbook}
        onTextbookChange={setTextbook}
      />

      {errorMessage && (
        <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
          <p className="text-red-700">{errorMessage}</p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading || selectedChapters.length === 0}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            isLoading || selectedChapters.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Generating...
            </>
          ) : (
            'Generate Content'
          )}
        </button>
      </div>
    </form>
  );
}