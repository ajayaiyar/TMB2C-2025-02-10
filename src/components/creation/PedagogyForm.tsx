import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AdditionalInstructions } from './AdditionalInstructions';
import { CurriculumContext } from './CurriculumContext';
import type { Grade, Subject } from '../../utils/constants';

export const PEDAGOGICAL_APPROACHES = [
  'Competency-Based Learning',
  'Experiential Learning',
  'Inquiry-Based Learning',
  'Project-Based Learning',
  'Play-Based Learning',
  'Arts-Integrated Learning',
  'Sports-Integrated Learning',
  'Technology-Enabled Learning',
  'Flipped Classroom',
  'Collaborative Learning',
  'Analogies'
] as const;

export interface PedagogyFormData {
  approach: string;
  additionalInstructions: string;
}

interface PedagogyFormProps {
  onSubmit: (data: PedagogyFormData) => Promise<void>;
  curriculumContext: {
    grade: Grade;
    subject: Subject;
    topic: string;
  };
}

export function PedagogyForm({ onSubmit, curriculumContext }: PedagogyFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PedagogyFormData>({
    approach: '',
    additionalInstructions: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.approach) return;

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
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Pedagogical Approach
        </label>
        <div className="grid grid-cols-2 gap-4">
          {PEDAGOGICAL_APPROACHES.map((approach) => (
            <button
              key={approach}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, approach }))}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                formData.approach === approach
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-gray-200 hover:border-indigo-200'
              }`}
            >
              {approach}
            </button>
          ))}
        </div>
      </div>

      <AdditionalInstructions 
        onInstructionsChange={(instructions) => 
          setFormData(prev => ({ ...prev, additionalInstructions: instructions }))
        } 
      />

      <button
        type="submit"
        disabled={loading || !formData.approach}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          loading || !formData.approach
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
            Generating Ideas...
          </>
        ) : (
          'Generate Activity Ideas'
        )}
      </button>
    </form>
  );
} 