import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { GRADES, TEXTBOOKS, type Grade, type Subject } from '../../utils/constants';
import { GRADE_SUBJECTS } from '../../utils/constants';
import { CBSE_GUIDELINES, ASSESSMENT_DURATIONS } from '../../lib/assessment/constants';
import { ChapterSelector } from './ChapterSelector';
import type { Chapter } from '../../utils/ncertData';

interface UnifiedAssessmentFormData {
  subject: Subject;
  grade: Grade;
  assessmentType: 'pre-assessment' | 'post-assessment' | 'test-paper';
  isFullSyllabus: boolean;
  chapters: Chapter[];
  duration: string;
  totalMarks: number;
  sectionTypes: string[];
  includeRubric: boolean;
  includeSolutions: boolean;
  additionalInstructions: string;
  textbook: string;
}

interface UnifiedAssessmentFormProps {
  onSubmit: (data: UnifiedAssessmentFormData) => Promise<void>;
}

const getAvailableTextbooks = (grade: Grade, subject: Subject): readonly string[] => {
  const textbooks = TEXTBOOKS[grade]?.[subject];
  return Array.isArray(textbooks) ? textbooks : [subject];
};

export function UnifiedAssessmentForm({ onSubmit }: UnifiedAssessmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UnifiedAssessmentFormData>({
    subject: GRADE_SUBJECTS[GRADES[0]][0],
    grade: GRADES[0],
    assessmentType: 'test-paper',
    isFullSyllabus: true,
    chapters: [],
    duration: ASSESSMENT_DURATIONS[1],
    totalMarks: 80,
    sectionTypes: [],
    includeRubric: true,
    includeSolutions: false,
    additionalInstructions: '',
    textbook: getAvailableTextbooks(GRADES[0], GRADE_SUBJECTS[GRADES[0]][0])[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.sectionTypes.length === 0) return;
    if (!formData.isFullSyllabus && formData.chapters.length === 0) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-10 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grade
          </label>
          <select
            value={formData.grade}
            onChange={(e) => {
              const newGrade = e.target.value as Grade;
              const availableSubjects = GRADE_SUBJECTS[newGrade];
              setFormData(prev => ({
                ...prev,
                grade: newGrade,
                subject: availableSubjects[0],
                textbook: getAvailableTextbooks(newGrade, availableSubjects[0])[0]
              }));
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          >
            {GRADES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <select
            value={formData.subject}
            onChange={(e) => {
              const newSubject = e.target.value as Subject;
              setFormData(prev => ({
                ...prev,
                subject: newSubject,
                textbook: getAvailableTextbooks(formData.grade, newSubject)[0]
              }));
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          >
            {GRADE_SUBJECTS[formData.grade].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text Book
          </label>
          <select
            value={formData.textbook}
            onChange={(e) => setFormData(prev => ({ ...prev, textbook: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          >
            {getAvailableTextbooks(formData.grade, formData.subject).map((book) => (
              <option key={book} value={book}>{book}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Assessment Type */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Assessment Type
        </label>
        <div className="flex items-center space-x-6">
          {[
            { id: 'pre-assessment', label: 'Pre Assessment' },
            { id: 'post-assessment', label: 'Post Assessment' },
            { id: 'test-paper', label: 'Test Paper' }
          ].map((type) => (
            <label key={type.id} className="inline-flex items-center">
              <input
                type="radio"
                checked={formData.assessmentType === type.id}
                onChange={() => setFormData(prev => ({ 
                  ...prev, 
                  assessmentType: type.id as UnifiedAssessmentFormData['assessmentType']
                }))}
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="ml-2">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Syllabus Scope */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Syllabus Scope
        </label>
        <div className="flex items-center space-x-6">
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={formData.isFullSyllabus}
              onChange={() => setFormData(prev => ({ ...prev, isFullSyllabus: true }))}
              className="form-radio h-4 w-4 text-indigo-600"
            />
            <span className="ml-2">Full Syllabus</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={!formData.isFullSyllabus}
              onChange={() => setFormData(prev => ({ ...prev, isFullSyllabus: false }))}
              className="form-radio h-4 w-4 text-indigo-600"
            />
            <span className="ml-2">Selected Chapter</span>
          </label>
        </div>
      </div>

      {/* Chapter Selection */}
      {!formData.isFullSyllabus && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <ChapterSelector
            subject={formData.subject}
            grade={formData.grade}
            selectedChapters={formData.chapters}
            onChapterSelect={(chapters) => setFormData(prev => ({ 
              ...prev, 
              chapters: chapters
            }))}
            textbook={formData.textbook}
          />
        </div>
      )}

      {/* Assessment Details */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <select
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          >
            {ASSESSMENT_DURATIONS.map((duration) => (
              <option key={duration} value={duration}>{duration}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Marks
          </label>
          <input
            type="number"
            min="20"
            max="100"
            value={formData.totalMarks}
            onChange={(e) => setFormData(prev => ({ ...prev, totalMarks: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          />
        </div>
      </div>

      {/* Question Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Types
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CBSE_GUIDELINES.questionTypes.map((type) => (
            <label key={type} className="flex items-center p-2 border rounded-md hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.sectionTypes.includes(type)}
                onChange={() => {
                  setFormData(prev => ({
                    ...prev,
                    sectionTypes: prev.sectionTypes.includes(type)
                      ? prev.sectionTypes.filter(t => t !== type)
                      : [...prev.sectionTypes, type]
                  }));
                }}
                className="mr-2"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.includeRubric}
            onChange={(e) => setFormData(prev => ({ ...prev, includeRubric: e.target.checked }))}
            className="mr-2"
          />
          Include Detailed Rubrics
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.includeSolutions}
            onChange={(e) => setFormData(prev => ({ ...prev, includeSolutions: e.target.checked }))}
            className="mr-2"
          />
          Include Solutions
        </label>
      </div>

      {/* Additional Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Instructions
        </label>
        <textarea
          value={formData.additionalInstructions}
          onChange={(e) => setFormData(prev => ({ ...prev, additionalInstructions: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          rows={4}
          placeholder="Any specific instructions or requirements..."
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || formData.sectionTypes.length === 0 || (!formData.isFullSyllabus && formData.chapters.length === 0)}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Generating Assessment...
          </>
        ) : (
          'Generate Assessment'
        )}
      </button>
    </form>
  );
}