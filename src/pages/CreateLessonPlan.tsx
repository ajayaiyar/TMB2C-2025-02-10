import { useState } from 'react';
import { PageLayout } from '../components/ui/PageLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { ContentCreationForm } from '../components/creation/ContentCreationForm';
import { LessonPlanForm } from '../components/creation/LessonPlanForm';
import { ResultDisplay } from '../components/creation/ResultDisplay';
import { generateLessonPlan } from '../lib/openai/generators/lesson-plan';
import type { Grade, Subject } from '../utils/constants';
import type { Chapter } from '../utils/ncertData';
import type { LessonPlanFormData } from '../components/creation/LessonPlanForm';

interface CurriculumData {
  subject: Subject;
  grade: Grade;
  chapters: Chapter[];
  textbook?: string;
  section?: string;
}

export default function CreateLessonPlan() {
  const [step, setStep] = useState<'curriculum' | 'details'>('curriculum');
  const [curriculumData, setCurriculumData] = useState<CurriculumData | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCurriculumSelect = (data: {
    subject: Subject;
    grade: Grade;
    chapters?: Chapter[];
    textbook?: string;
  }) => {
    setCurriculumData({
      subject: data.subject,
      grade: data.grade,
      chapters: data.chapters || [],
      textbook: data.textbook
    });
    setStep('details');
  };

  const handleContentSubmit = async (formData: LessonPlanFormData) => {
    if (!curriculumData) return;
    
    // Debug logging
    console.log('Creating Lesson Plan with:', {
      curriculumData,
      formData
    });

    setError(null);
    try {
      const response = await generateLessonPlan({
        ...formData,
        topic: curriculumData.chapters.map(ch => ch.title).join(', '),
        subject: curriculumData.subject,
        grade: curriculumData.grade,
        chapters: curriculumData.chapters,
        textbook: curriculumData.textbook,
        section: curriculumData.section
      });

      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate lesson plan');
      console.error('Lesson plan generation error:', err);
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Create Lesson Plan" 
        description="Design comprehensive lesson plans based on NCERT curriculum"
      />
      <div className="mt-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {step === 'curriculum' ? (
            <ContentCreationForm
              onSubmit={handleCurriculumSelect}
              contentType="lesson-plan"
            />
          ) : curriculumData ? (
            <LessonPlanForm 
              onSubmit={handleContentSubmit} 
              curriculumContext={{
                grade: curriculumData.grade,
                subject: curriculumData.subject,
                textbook: curriculumData.textbook || curriculumData.subject,
                section: curriculumData.section,
                chapters: curriculumData.chapters
              }}
            />
          ) : null}
          <ResultDisplay 
            content={result} 
            contentType="lesson-plan"
            curriculumData={curriculumData}
          />
        </div>
      </div>
    </PageLayout>
  );
}