import React, { useState } from 'react';

interface AdditionalInstructionsProps {
  onInstructionsChange: (instructions: string) => void;
}

export function AdditionalInstructions({ onInstructionsChange }: AdditionalInstructionsProps) {
  const [instructions, setInstructions] = useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInstructions(e.target.value);
    onInstructionsChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Additional Instructions
      </label>
      
      <div className="relative">
        <textarea
          value={instructions}
          onChange={handleTextChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          rows={4}
          placeholder="Add any specific instructions or requirements..."
        />
      </div>
    </div>
  );
}