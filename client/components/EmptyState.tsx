import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

interface EmptyStateProps {
  title: string;
  message?: string;
  buttonText?: string;
  buttonAction?: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  buttonText,
  buttonAction,
  icon = <FiAlertCircle size={40} className="text-gray-400" />
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
      {message && <p className="text-gray-500 max-w-md mb-6">{message}</p>}
      {buttonText && buttonAction && (
        <button
          onClick={buttonAction}
          className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
