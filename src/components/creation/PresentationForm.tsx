import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AdditionalInstructions } from './AdditionalInstructions';
import { CurriculumContext } from './CurriculumContext';
import type { Grade, Subject } from '../../utils/constants';
import type { Chapter } from '../../utils/ncertData';

export interface PresentationFormData {
  slideCount: number;
  visualPreference: string;
  includeActivities: boolean;
  includeAssessment: boolean;
  additionalInstructions: string;
}

interface PresentationFormProps {
  onSubmit: (data: PresentationFormData) => Promise<void>;
  curriculumContext: {
    grade: Grade;
    subject: Subject;
    textbook: string;
    section?: string;
    chapters: Chapter[];
  };
}

const VISUAL_PREFERENCES = [
  'Minimalist',
  'Colorful',
  'Infographic',
  'Traditional'
];

export function PresentationForm({ onSubmit, curriculumContext }: PresentationFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PresentationFormData>({
    slideCount: 10,
    visualPreference: VISUAL_PREFERENCES[0],
    includeActivities: true,
    includeAssessment: true,
    additionalInstructions: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CurriculumContext {...curriculumContext} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Slides
        </label>
        <input
          type="number"
          min={5}
          max={30}
          value={formData.slideCount}
          onChange={(e) => setFormData(prev => ({ ...prev, slideCount: parseInt(e.target.value) }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visual Style
        </label>
        <select
          value={formData.visualPreference}
          onChange={(e) => setFormData(prev => ({ ...prev, visualPreference: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
        >
          {VISUAL_PREFERENCES.map((style) => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.includeActivities}
            onChange={(e) => setFormData(prev => ({ ...prev, includeActivities: e.target.checked }))}
            className="mr-2"
          />
          Include Interactive Activities
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.includeAssessment}
            onChange={(e) => setFormData(prev => ({ ...prev, includeAssessment: e.target.checked }))}
            className="mr-2"
          />
          Include Assessment Questions
        </label>
      </div>

      <AdditionalInstructions onInstructionsChange={(instructions) => 
        setFormData(prev => ({ ...prev, additionalInstructions: instructions }))
      } />

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Generating Presentation...
          </>
        ) : (
          'Generate Presentation'
        )}
      </button>
    </form>
  );
}