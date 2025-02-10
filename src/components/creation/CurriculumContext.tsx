import type { Grade, Subject } from '../../utils/constants';
import type { Chapter } from '../../utils/ncertData';

export interface CurriculumContextProps {
  grade: Grade;
  subject: Subject;
  textbook?: string;
  chapters?: Chapter[];
  topic?: string;
  section?: string;
}

export function CurriculumContext({ grade, subject, textbook, chapters, topic, section }: CurriculumContextProps) {
  return (
    <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
      <div className="text-sm text-gray-500">
        <span className="font-medium">Grade:</span> {grade}
      </div>
      <div className="text-sm text-gray-500">
        <span className="font-medium">Subject:</span> {subject}
      </div>
      {textbook && (
        <div className="text-sm text-gray-500">
          <span className="font-medium">Textbook:</span> {textbook}
        </div>
      )}
      {chapters && chapters.length > 0 && (
        <div className="text-sm text-gray-500">
          <span className="font-medium">Chapter{chapters.length > 1 ? 's' : ''}:</span>{' '}
          {chapters.map((ch, index) => (
            <span key={ch.title}>
              {index > 0 ? ', ' : ''}{ch.title}
            </span>
          ))}
        </div>
      )}
      {section && (
        <div className="text-sm text-gray-500">
          <span className="font-medium">Section:</span> {section}
        </div>
      )}
      {topic && (
        <div className="text-sm text-gray-500">
          <span className="font-medium">Topic:</span> {topic}
        </div>
      )}
    </div>
  );
} 