import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { Chapter } from '../../utils/ncertData';
import type { Grade, Subject } from '../../utils/constants';

export interface WorksheetFormData {
  questionTypes: string[];
  difficultyLevel: string;
  includeAnswerKey: boolean;
  additionalInstructions: string;
}

interface WorksheetFormProps {
  onSubmit: (data: WorksheetFormData) => Promise<void>;
  curriculumContext: {
    grade: Grade;
    subject: Subject;
    textbook: string;
    chapters: Chapter[];
  };
}

const QUESTION_TYPES = [
  'Multiple Choice',
  'Fill in the Blanks',
  'Short Answer',
  'Long Answer',
  'True/False',
  'Match the Following',
  'Problem Solving',
  'HOTS (Higher Order Thinking Skills)'
];

const DIFFICULTY_LEVELS = [
  'Basic',
  'Intermediate',
  'Advanced',
  'Mixed'
];

export function WorksheetForm({ onSubmit, curriculumContext }: WorksheetFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<WorksheetFormData>({
    questionTypes: [],
    difficultyLevel: DIFFICULTY_LEVELS[0],
    includeAnswerKey: true,
    additionalInstructions: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.questionTypes.length === 0) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selected Curriculum Context Display */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Content</h3>
        <div className="text-sm text-gray-600">
          <p>Grade: {curriculumContext.grade}</p>
          <p>Subject: {curriculumContext.subject}</p>
          <p>Textbook: {curriculumContext.textbook}</p>
          <p>Chapters: {curriculumContext.chapters.map(ch => ch.title).join(', ')}</p>
        </div>
      </div>

      {/* Question Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Types
        </label>
        <div className="grid grid-cols-2 gap-2">
          {QUESTION_TYPES.map((type) => (
            <label key={type} className="flex items-center p-2 border rounded-md hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.questionTypes.includes(type)}
                onChange={() => {
                  setFormData(prev => ({
                    ...prev,
                    questionTypes: prev.questionTypes.includes(type)
                      ? prev.questionTypes.filter(t => t !== type)
                      : [...prev.questionTypes, type]
                  }));
                }}
                className="mr-2"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Difficulty Level
        </label>
        <select
          value={formData.difficultyLevel}
          onChange={(e) => setFormData(prev => ({ ...prev, difficultyLevel: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
        >
          {DIFFICULTY_LEVELS.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      {/* Additional Options */}
      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.includeAnswerKey}
            onChange={(e) => setFormData(prev => ({ ...prev, includeAnswerKey: e.target.checked }))}
            className="mr-2"
          />
          Include Answer Key
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
        disabled={loading || formData.questionTypes.length === 0}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Generating Worksheet...
          </>
        ) : (
          'Generate Worksheet'
        )}
      </button>
    </form>
  );
}