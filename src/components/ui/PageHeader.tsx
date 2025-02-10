import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mt-8">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p 
        className="mt-2 text-gray-600"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}