import React, { useState } from 'react';
import { PageLayout } from '../components/ui/PageLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { ContentCreationForm } from '../components/creation/ContentCreationForm';
import { PresentationForm } from '../components/creation/PresentationForm';
import { ResultDisplay } from '../components/creation/ResultDisplay';
import { generatePresentation } from '../lib/openai/generators/presentation';
import type { Grade, Subject } from '../utils/constants';
import type { Chapter } from '../utils/ncertData';
import type { PresentationFormData } from '../components/creation/PresentationForm';

interface CurriculumData {
  subject: Subject;
  grade: Grade;
  chapters: Chapter[];
  textbook: string;
}

export default function CreatePresentation() {
  const [step, setStep] = useState<'curriculum' | 'details'>('curriculum');
  const [curriculumData, setCurriculumData] = useState<CurriculumData | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCurriculumSelect = (data: CurriculumData) => {
    setCurriculumData(data);
    setStep('details');
  };

  const handleContentSubmit = async (formData: PresentationFormData) => {
    if (!curriculumData) return;
    
    setError(null);
    try {
      const response = await generatePresentation({
        ...formData,
        topic: curriculumData.chapters.map(ch => ch.title).join(', '),
        subject: curriculumData.subject,
        grade: curriculumData.grade,
        textbook: curriculumData.textbook,
        chapters: curriculumData.chapters
      });

      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate presentation');
      console.error('Presentation generation error:', err);
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Create Presentation" 
        description="Design comprehensive presentations based on NCERT curriculum"
      />
      <div className="mt-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {step === 'curriculum' ? (
            <ContentCreationForm onNext={handleCurriculumSelect} />
          ) : curriculumData && (
            <PresentationForm 
              onSubmit={handleContentSubmit}
              curriculumContext={{
                grade: curriculumData.grade,
                subject: curriculumData.subject,
                textbook: curriculumData.textbook,
                chapters: curriculumData.chapters
              }}
            />
          )}
          <ResultDisplay 
            content={result} 
            type="presentation"
            curriculumData={curriculumData}
          />
        </div>
      </div>
    </PageLayout>
  );
}