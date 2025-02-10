import { useEffect, useState } from 'react';
import { useContentStore } from '../../store/contentStore';
import { ExportMenu } from '../ui/ExportMenu';
import { Alert } from '../ui/Alert';
import { ShareToClassroom } from '../classroom/ShareToClassroom';
import type { Grade, Subject } from '../../utils/constants';
import type { Chapter } from '../../utils/ncertData';
import type { ContentInsert } from '../../lib/supabase/services/content/types';

interface CurriculumData {
  grade: Grade;
  subject: Subject;
  topic?: string;
  textbook?: string;
  chapters?: Chapter[];
}

export interface ResultDisplayProps {
  content: string | null;
  curriculumData: CurriculumData | null;
  contentType: 'pedagogy' | 'lesson-plan' | 'quiz' | 'worksheet' | 'presentation' | 'assessment';
  onBack?: () => void;
  onNew?: () => void;
}

export function ResultDisplay({ 
  content, 
  curriculumData, 
  contentType,
  onBack,
  onNew 
}: ResultDisplayProps) {
  const { saveContent, error } = useContentStore();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const title = curriculumData ? (
    contentType === 'pedagogy'
      ? `Creative Pedagogy for ${curriculumData.topic || 'Topic'}`
      : `${contentType === 'lesson-plan' ? 'Lesson Plan' : contentType.charAt(0).toUpperCase() + contentType.slice(1)} for ${curriculumData.chapters?.map(ch => ch.title).join(', ') || 'Selected Chapters'}`
  ) : '';

  useEffect(() => {
    const saveGeneratedContent = async () => {
      if (!content || !curriculumData) return;

      try {
        setSaveStatus('saving');
        const contentData: Omit<ContentInsert, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
          type: contentType,
          content,
          subject: curriculumData.subject,
          grade: curriculumData.grade,
          chapter: contentType === 'pedagogy' 
            ? curriculumData.topic || ''
            : curriculumData.chapters?.map(ch => ch.title).join(', ') || '',
          metadata: {
            timestamp: new Date().toISOString(),
            version: '1.0',
            ...(contentType === 'pedagogy' 
              ? { topic: curriculumData.topic }
              : {
                  textbook: curriculumData.textbook,
                  chapters: curriculumData.chapters?.map(ch => ({
                    title: ch.title,
                    number: ch.number,
                    textbook: ch.textbook
                  }))
                }
            )
          }
        };
        await saveContent(contentData);
        setSaveStatus('saved');
        setRetryCount(0);
      } catch (err) {
        console.error('Error saving content:', err);
        setSaveStatus('error');
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            saveGeneratedContent();
          }, Math.pow(2, retryCount) * 1000);
        }
      }
    };

    if (content && curriculumData) {
      saveGeneratedContent();
    }
  }, [content, curriculumData, contentType, saveContent, retryCount, maxRetries]);

  const handleRetrySave = () => {
    setRetryCount(0);
    setSaveStatus('idle');
  };

  if (!content) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {title && (
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
            )}
            {onNew && (
              <button
                onClick={onNew}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                Create New
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="prose max-w-none whitespace-pre-wrap">
          {content}
        </div>
      </div>

      {saveStatus === 'saving' && (
        <Alert variant="info" className="mt-4">
          Saving content...
        </Alert>
      )}
      
      {saveStatus === 'saved' && (
        <Alert variant="success" className="mt-4">
          Content saved successfully!
        </Alert>
      )}
      
      {saveStatus === 'error' && (
        <Alert variant="error" className="mt-4">
          Failed to save content: {error}
          {retryCount < maxRetries && (
            <button
              onClick={handleRetrySave}
              className="ml-4 text-sm underline hover:text-red-800"
            >
              Retry
            </button>
          )}
        </Alert>
      )}

      <div className="mt-8 flex justify-between items-center">
        <ExportMenu content={content} type={contentType} />
        {(contentType === 'quiz' || contentType === 'worksheet') && curriculumData && (
          <ShareToClassroom 
            content={content} 
            title={title}
            type={contentType}
          />
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500 italic">
        Note: This content is generated using AI. While every effort is made to ensure accuracy, AI can make errors. Please review and verify the content before use.
      </div>
    </div>
  );
}