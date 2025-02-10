import { useState } from 'react';
import { PageLayout } from '../components/ui/PageLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { UnifiedAssessmentForm } from '../components/creation/UnifiedAssessmentForm';
import { ResultDisplay } from '../components/creation/ResultDisplay';
import { generateAssessment } from '../lib/openai/generators/assessment';
import type { Chapter } from '../utils/ncertData';
import type { Grade, Subject } from '../utils/constants';

interface CurriculumData {
  subject: Subject;
  grade: Grade;
  chapters: Chapter[];
}

export default function CreateAssessment() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [curriculumData, setCurriculumData] = useState<CurriculumData | null>(null);

  const handleSubmit = async (formData: any) => {
    setError(null);
    try {
      const response = await generateAssessment({
        ...formData,
        topic: formData.isFullSyllabus ? 'full_syllabus' : formData.chapters.map((ch: Chapter) => ch.title).join(', '),
        subject: formData.subject,
        grade: formData.grade,
        chapters: formData.chapters
      });

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to generate assessment');
      }

      setCurriculumData({
        subject: formData.subject,
        grade: formData.grade,
        chapters: formData.chapters
      });
      setResult(response.data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate assessment');
      console.error('Assessment generation error:', err);
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Create Assessment" 
        description="Design comprehensive assessments based on NCERT curriculum and CBSE guidelines"
      />
      <div className="mt-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <UnifiedAssessmentForm onSubmit={handleSubmit} />
          <ResultDisplay 
            content={result} 
            contentType="assessment" 
            curriculumData={curriculumData} 
          />
        </div>
      </div>
    </PageLayout>
  );
}