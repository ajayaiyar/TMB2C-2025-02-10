import React, { useState } from 'react';
import { PageLayout } from '../components/ui/PageLayout';
import { ContentCreationForm } from '../components/creation/ContentCreationForm';
import { ResultDisplay } from '../components/creation/ResultDisplay';
import { ContentGenerationService } from '../services/content-generation/service';
import type { Grade, Subject } from '../utils/constants';
import type { StandardFormData } from '../types/forms';

interface CurriculumData {
  grade: Grade;
  subject: Subject;
  topic: string;
  approach: string;
}

interface PedagogyFormData {
  subject: Subject;
  grade: Grade;
  topic: string;
  approach: string;
}

interface ContentCreationFormProps {
  onSubmit: (data: PedagogyFormData | StandardFormData) => Promise<void>;
  contentType: 'pedagogy' | 'standard';
  error?: string;
  isLoading?: boolean;
}

function CreatePedagogy() {
  const [curriculumData, setCurriculumData] = useState<CurriculumData | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: PedagogyFormData | StandardFormData): Promise<void> => {
    if ('approach' in data) {
      if (!data.topic) {
        setError('Please enter a topic');
        return;
      }
      
      setError(undefined);
      setIsLoading(true);
      
      try {
        const content = await ContentGenerationService.generatePedagogy({
          grade: data.grade,
          subject: data.subject,
          topic: data.topic,
          approach: data.approach
        });
        
        setCurriculumData(data);
        setGeneratedContent(content);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
        console.error('Pedagogy generation error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-8">
          <h1 className="text-2xl font-bold text-gray-900">Creative Pedagogy Ideas</h1>
          <p className="mt-2 text-gray-600">
            Generate innovative teaching activities using different pedagogical approaches. Choose from multiple teaching strategies or use analogies to make concepts more relatable.
          </p>

          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {generatedContent ? (
              <ResultDisplay
                content={generatedContent}
                curriculumData={curriculumData}
                contentType="pedagogy"
                onBack={() => {
                  setGeneratedContent(null);
                  setCurriculumData(null);
                  setError(undefined);
                }}
                onNew={() => {
                  setGeneratedContent(null);
                  setCurriculumData(null);
                  setError(undefined);
                }}
              />
            ) : (
              <ContentCreationForm
                onSubmit={handleSubmit}
                contentType="pedagogy"
                error={error}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default CreatePedagogy; 