import { useState } from 'react';
import { exportContent } from '../../utils/export';
import { ClipboardIcon, ArrowDownTrayIcon, DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';

interface ExportMenuProps {
  content: string;
  type: string;
  onNew?: () => void;
}

export function ExportMenu({ content, type, onNew }: ExportMenuProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleExportPPTX = async () => {
    try {
      await exportContent({
        content,
        type,
        format: 'pptx'
      });
    } catch (error) {
      console.error('Error exporting to PPTX:', error);
    }
  };

  const handleExportRTF = async () => {
    try {
      await exportContent({
        content,
        type,
        format: 'rtf'
      });
    } catch (error) {
      console.error('Error exporting to RTF:', error);
    }
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (error) {
      console.error('Error copying content:', error);
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  return (
    <div className="flex space-x-4">
      {type === 'presentation' && (
        <button
          onClick={handleExportPPTX}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
          Export to Presentation
        </button>
      )}

      <button
        onClick={handleExportRTF}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <DocumentTextIcon className="mr-2 h-5 w-5" />
        Export to RTF
      </button>

      <button
        onClick={handleCopyContent}
        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <ClipboardIcon className="mr-2 h-5 w-5" />
        {copyStatus === 'copied' ? 'Copied!' : copyStatus === 'error' ? 'Error!' : 'Copy Content'}
      </button>

      {onNew && (
        <button
          onClick={onNew}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          Create New
        </button>
      )}
    </div>
  );
}