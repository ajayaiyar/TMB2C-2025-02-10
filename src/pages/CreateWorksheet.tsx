import { useState } from 'react';
import { PageLayout } from '../components/ui/PageLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { ContentCreationForm } from '../components/creation/ContentCreationForm';
import { WorksheetForm } from '../components/creation/WorksheetForm';
import { ResultDisplay } from '../components/creation/ResultDisplay';
import { generateWorksheet } from '../lib/openai/generators/worksheet';
import type { Grade, Subject } from '../utils/constants';
import type { Chapter } from '../utils/ncertData';
import type { WorksheetFormData } from '../components/creation/WorksheetForm';
import type { CurriculumType } from '../types/curriculum';
import { hasMultipleTextbooks } from '../utils/ncertData';

interface CurriculumData {
  subject: Subject;
  grade: Grade;
  chapters: Chapter[];
  textbook: string;
}

interface CurriculumFormData {
  subject: Subject;
  grade: Grade;
  chapters?: Chapter[];
  textbook?: string;
}

// Type guard for CurriculumFormData
function isValidCurriculumData(data: CurriculumFormData): data is Required<CurriculumFormData> {
  return (
    Boolean(data.subject) &&
    Boolean(data.grade) &&
    Array.isArray(data.chapters) &&
    data.chapters.length > 0
  );
}

export default function CreateWorksheet() {
  const [step, setStep] = useState<'curriculum' | 'details'>('curriculum');
  const [curriculumData, setCurriculumData] = useState<CurriculumData | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const contentType: CurriculumType = 'worksheet';

  const handleCurriculumSelect = (data: CurriculumFormData) => {
    try {
      if (!isValidCurriculumData(data)) {
        throw new Error('Please select all required curriculum information');
      }

      // If the subject doesn't have multiple textbooks, use the subject name as the textbook
      const effectiveTextbook = hasMultipleTextbooks(data.grade, data.subject) 
        ? data.textbook 
        : data.subject;

      if (!effectiveTextbook) {
        throw new Error('Textbook information is required');
      }

      setCurriculumData({
        subject: data.subject,
        grade: data.grade,
        chapters: data.chapters,
        textbook: effectiveTextbook
      });
      setStep('details');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid curriculum data');
      console.error('Curriculum selection error:', err);
    }
  };

  const validateWorksheetData = (
    formData: WorksheetFormData,
    curriculum: CurriculumData
  ): boolean => {
    if (!formData.questionTypes.length) {
      setError('Please select at least one question type');
      return false;
    }
    if (!formData.difficultyLevel) {
      setError('Please select a difficulty level');
      return false;
    }
    if (!curriculum.chapters.length) {
      setError('Please select at least one chapter');
      return false;
    }
    return true;
  };

  const handleContentSubmit = async (formData: WorksheetFormData) => {
    if (!curriculumData) {
      setError('Missing curriculum data');
      return;
    }

    if (!validateWorksheetData(formData, curriculumData)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await generateWorksheet({
        ...formData,
        topic: curriculumData.chapters.map(ch => ch.title).join(', '),
        subject: curriculumData.subject,
        grade: curriculumData.grade,
        textbook: curriculumData.textbook,
        chapters: curriculumData.chapters
      });

      if (!response) {
        throw new Error('Failed to generate worksheet content');
      }

      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate worksheet');
      console.error('Worksheet generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep('curriculum');
    setCurriculumData(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Create Worksheet" 
        description="Design comprehensive worksheets based on NCERT curriculum"
      />
      <div className="mt-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-md flex items-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating worksheet...
            </div>
          )}

          {step === 'curriculum' ? (
            <ContentCreationForm
              onSubmit={handleCurriculumSelect}
              contentType={contentType}
            />
          ) : curriculumData && (
            <WorksheetForm 
              onSubmit={handleContentSubmit}
              curriculumContext={{
                grade: curriculumData.grade,
                subject: curriculumData.subject,
                textbook: curriculumData.textbook,
                chapters: curriculumData.chapters
              }}
            />
          )}

          {result && (
            <>
              <ResultDisplay 
                content={result} 
                contentType={contentType}
                curriculumData={curriculumData}
              />
              <div className="mt-6">
                <button
                  onClick={handleReset}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Another Worksheet
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}