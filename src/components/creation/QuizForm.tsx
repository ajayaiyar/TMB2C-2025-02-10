import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { DIFFICULTY_LEVELS, TAXONOMY_TYPES, BLOOMS_LEVELS, DOK_LEVELS } from '../../utils/constants';
import { AdditionalInstructions } from './AdditionalInstructions';
import { CurriculumContext } from './CurriculumContext';
import type { Grade, Subject } from '../../utils/constants';
import type { Chapter } from '../../utils/ncertData';

export interface QuizFormData {
  questionCount: number;
  difficultyLevel: string;
  taxonomyType: string;
  taxonomyLevels: string[];
  additionalInstructions: string;
}

interface QuizFormProps {
  onSubmit: (data: QuizFormData) => Promise<void>;
  curriculumContext: {
    grade: Grade;
    subject: Subject;
    textbook: string;
    section?: string;
    chapters: Chapter[];
  };
}

export function QuizForm({ onSubmit, curriculumContext }: QuizFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<QuizFormData>({
    questionCount: 10,
    difficultyLevel: DIFFICULTY_LEVELS[0],
    taxonomyType: TAXONOMY_TYPES[0],
    taxonomyLevels: [],
    additionalInstructions: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.taxonomyLevels.length === 0) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const availableLevels = formData.taxonomyType === 'Bloom\'s Taxonomy' ? BLOOMS_LEVELS : DOK_LEVELS;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CurriculumContext {...curriculumContext} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Questions
        </label>
        <input
          type="number"
          min={5}
          max={20}
          value={formData.questionCount}
          onChange={(e) => setFormData(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
        />
      </div>

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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Taxonomy Type
        </label>
        <select
          value={formData.taxonomyType}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            taxonomyType: e.target.value,
            taxonomyLevels: [] // Reset levels when type changes
          }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
        >
          {TAXONOMY_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Taxonomy Levels
        </label>
        <div className="grid grid-cols-2 gap-2">
          {availableLevels.map((level) => (
            <label key={level} className="flex items-center p-2 border rounded-md hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.taxonomyLevels.includes(level)}
                onChange={() => {
                  setFormData(prev => ({
                    ...prev,
                    taxonomyLevels: prev.taxonomyLevels.includes(level)
                      ? prev.taxonomyLevels.filter(l => l !== level)
                      : [...prev.taxonomyLevels, level]
                  }));
                }}
                className="mr-2"
              />
              {level}
            </label>
          ))}
        </div>
      </div>

      <AdditionalInstructions onInstructionsChange={(instructions) => 
        setFormData(prev => ({ ...prev, additionalInstructions: instructions }))
      } />

      <button
        type="submit"
        disabled={loading || formData.taxonomyLevels.length === 0}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Generating Quiz...
          </>
        ) : (
          'Generate Quiz'
        )}
      </button>
    </form>
  );
}