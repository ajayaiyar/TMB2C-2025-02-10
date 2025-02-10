import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { SUBJECTS, GRADES } from '../../utils/constants';
import type { Subject, Grade } from '../../utils/constants';

interface AssessmentTypeFormProps {
  onNext: (data: {
    assessmentType: 'pre-assessment' | 'post-assessment' | 'test-paper';
    isFullSyllabus: boolean;
    subject: Subject;
    grade: Grade;
  }) => void;
}

export function AssessmentTypeForm({ onNext }: AssessmentTypeFormProps) {
  const [assessmentType, setAssessmentType] = useState<'pre-assessment' | 'post-assessment' | 'test-paper'>('test-paper');
  const [isFullSyllabus, setIsFullSyllabus] = useState(true);
  const [subject, setSubject] = useState<Subject>(SUBJECTS[0]);
  const [grade, setGrade] = useState<Grade>(GRADES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ assessmentType, isFullSyllabus, subject, grade });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value as Subject)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grade
          </label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value as Grade)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          >
            {GRADES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Assessment Type
        </label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'pre-assessment', label: 'Pre Assessment' },
            { id: 'post-assessment', label: 'Post Assessment' },
            { id: 'test-paper', label: 'Test Paper' }
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setAssessmentType(type.id as typeof assessmentType)}
              className={`flex-1 py-2 px-4 rounded-md ${
                assessmentType === type.id
                  ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Select whether you want to create an assessment for the complete syllabus or specific chapters
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={() => setIsFullSyllabus(true)}
          className={`flex-1 py-2 px-4 rounded-md ${
            isFullSyllabus
              ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
              : 'bg-gray-100 text-gray-700 border border-gray-300'
          }`}
        >
          Full Syllabus
        </button>
        <button
          type="button"
          onClick={() => setIsFullSyllabus(false)}
          className={`flex-1 py-2 px-4 rounded-md ${
            !isFullSyllabus
              ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
              : 'bg-gray-100 text-gray-700 border border-gray-300'
          }`}
        >
          Selected Chapter
        </button>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Next
      </button>
    </form>
  );
}