import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { LESSON_DURATIONS, LEARNING_STYLES } from '../../utils/constants';
import { AdditionalInstructions } from './AdditionalInstructions';
import { CurriculumContext } from './CurriculumContext';
import type { Grade, Subject } from '../../utils/constants';
import type { Chapter } from '../../utils/ncertData';

export interface LessonPlanFormData {
  duration: string;
  learningStyles: string[];
  learningObjectives: string;
  additionalInstructions: string;
  numberOfClasses: number;
}

interface LessonPlanFormProps {
  onSubmit: (data: LessonPlanFormData) => Promise<void>;
  curriculumContext: {
    grade: Grade;
    subject: Subject;
    textbook: string;
    section?: string;
    chapters: Chapter[];
  };
}

export function LessonPlanForm({ onSubmit, curriculumContext }: LessonPlanFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LessonPlanFormData>({
    duration: '30 minutes',
    learningStyles: Object.values(LEARNING_STYLES),
    learningObjectives: '',
    additionalInstructions: '',
    numberOfClasses: 1
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

  const handleLearningStyleChange = (style: string, checked: boolean) => {
    setFormData(prev => {
      const styles = checked
        ? [...prev.learningStyles, style]
        : prev.learningStyles.filter(s => s !== style);
      return { ...prev, learningStyles: styles };
    });
  };

  const handleInstructionsChange = (instructions: string) => {
    setFormData(prev => ({ ...prev, additionalInstructions: instructions }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CurriculumContext 
        grade={curriculumContext.grade}
        subject={curriculumContext.subject}
        textbook={curriculumContext.textbook}
        chapters={curriculumContext.chapters}
        section={curriculumContext.section}
      />

      <div className="grid grid-cols-8 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lesson Duration
          </label>
          <select
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 hover:bg-gray-50"
          >
            <option value="">Select duration</option>
            {LESSON_DURATIONS.map((duration) => (
              <option key={duration} value={duration}>
                {duration}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Periods
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={formData.numberOfClasses}
            onChange={(e) => setFormData({ ...formData, numberOfClasses: Math.max(1, parseInt(e.target.value) || 1) })}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 hover:bg-gray-50"
          />
        </div>

        <div className="col-span-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Learning Styles (VAK)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(LEARNING_STYLES).map(([key, style]) => (
              <label key={key} className="flex items-center p-2 border rounded-md hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.learningStyles.includes(style)}
                  onChange={(e) => handleLearningStyleChange(style, e.target.checked)}
                  className="mr-2"
                />
                {style}
              </label>
            ))}
          </div>
        </div>
      </div>

      <AdditionalInstructions
        onInstructionsChange={(instructions) =>
          handleInstructionsChange(instructions)
        }
      />

      <div>
        <button
          type="submit"
          disabled={loading || formData.learningStyles.length === 0}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Generating Lesson Plan...
            </>
          ) : (
            'Generate Lesson Plan'
          )}
        </button>
      </div>
    </form>
  );
}