import React, { useState } from 'react';
import { PageLayout } from '../components/ui/PageLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { ContentCreationForm } from '../components/creation/ContentCreationForm';
import { QuizForm } from '../components/creation/QuizForm';
import { ResultDisplay } from '../components/creation/ResultDisplay';
import { generateQuiz } from '../lib/openai/generators/quiz';
import type { QuizFormData, StandardFormData } from '../types/forms';
import type { Chapter } from '../utils/ncertData';
import type { Grade, Subject } from '../utils/constants';

interface CurriculumData {
  subject: Subject;
  grade: Grade;
  chapters: Chapter[];
  textbook: string;
}

export default function CreateQuiz() {
  const [step, setStep] = useState<'curriculum' | 'details'>('curriculum');
  const [curriculumData, setCurriculumData] = useState<CurriculumData | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleCurriculumNext = async (data: StandardFormData) => {
    if (!data.chapters || !data.textbook) return;
    
    setCurriculumData({
      subject: data.subject,
      grade: data.grade,
      chapters: data.chapters,
      textbook: data.textbook
    });
    setStep('details');
  };

  const handleSubmit = async (data: QuizFormData) => {
    if (!curriculumData || curriculumData.chapters.length === 0) return;
    
    const content = await generateQuiz({
      ...data,
      topic: curriculumData.chapters.map(ch => ch.title).join(', '),
      subject: curriculumData.subject,
      grade: curriculumData.grade,
      textbook: curriculumData.textbook,
      chapter: curriculumData.chapters[0]
    });

    setResult(content || '');
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Create Quiz" 
        description="Design interactive quizzes based on NCERT curriculum"
      />
      <div className="mt-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {step === 'curriculum' ? (
            <ContentCreationForm
              onSubmit={handleCurriculumNext}
              contentType="standard"
            />
          ) : (
            <QuizForm 
              onSubmit={handleSubmit} 
              curriculumContext={{
                grade: curriculumData!.grade,
                subject: curriculumData!.subject,
                textbook: curriculumData!.textbook || curriculumData!.subject,
                chapters: curriculumData!.chapters
              }}
            />
          )}
          <ResultDisplay 
            content={result} 
            contentType="quiz"
            curriculumData={curriculumData}
          />
        </div>
      </div>
    </PageLayout>
  );
}