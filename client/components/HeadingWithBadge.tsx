import React from 'react';

interface HeadingWithBadgeProps {
  title: string;
  count?: number;
  level?: 'h1' | 'h2' | 'h3' | 'h4';
  className?: string;
}

const HeadingWithBadge: React.FC<HeadingWithBadgeProps> = ({
  title,
  count,
  level = 'h2',
  className = ''
}) => {
  const Tag = level;
  
  const baseClasses = {
    h1: 'text-2xl font-bold',
    h2: 'text-xl font-semibold',
    h3: 'text-lg font-semibold',
    h4: 'text-base font-medium'
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      <Tag className={`${baseClasses[level]} text-gray-800`}>
        {title}
      </Tag>
      
      {count !== undefined && (
        <span className="ml-2 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
          {count}
        </span>
      )}
    </div>
  );
};

export default HeadingWithBadge;
