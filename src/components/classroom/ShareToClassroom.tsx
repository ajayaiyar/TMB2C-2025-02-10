import React, { useState, useEffect } from 'react';
import { Loader2, Share2 } from 'lucide-react';
import { classroomService } from '../../lib/google/classroom';

interface ShareToClassroomProps {
  content: string;
  title: string;
  type: 'quiz' | 'worksheet';
}

export function ShareToClassroom({ content, title, type }: ShareToClassroomProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const courseList = await classroomService.getCourses();
      setCourses(courseList);
    } catch (err) {
      setError('Failed to load courses. Please ensure you have granted necessary permissions.');
    }
  };

  const handleShare = async () => {
    if (!selectedCourse) {
      setError('Please select a course');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await classroomService.createAssignment(
        selectedCourse,
        title,
        `${type.charAt(0).toUpperCase() + type.slice(1)} created with TeacherMate`,
        [{ driveFile: { driveFile: { title, content } } }]
      );
      setSuccess(true);
    } catch (err) {
      setError('Failed to share to Google Classroom. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
          Successfully shared to Google Classroom!
        </div>
      )}

      <div className="flex items-center space-x-4">
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          disabled={loading}
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleShare}
          disabled={loading || !selectedCourse}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Sharing...
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 mr-2" />
              Share to Classroom
            </>
          )}
        </button>
      </div>
    </div>
  );
}