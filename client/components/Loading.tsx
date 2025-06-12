import React from 'react';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  size = 'medium' 
}) => {
  const spinnerSize = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  const textSize = {
    small: 'text-xs',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="flex flex-col justify-center items-center py-8 w-full">
      <div className={`animate-spin rounded-full ${spinnerSize[size]} border-t-2 border-b-2 border-emerald-500`}></div>
      <span className={`mt-4 text-gray-600 ${textSize[size]}`}>{message}</span>
    </div>
  );
};

export default Loading;
