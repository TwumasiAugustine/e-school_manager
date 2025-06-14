import React from 'react';
import { FiAlertTriangle, FiX, FiInfo, FiAlertCircle } from 'react-icons/fi';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning',
}) => {
  if (!isOpen) return null;

  const colorClasses = {
    danger: {
      icon: 'text-red-500',
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
    warning: {
      icon: 'text-yellow-500',
      button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    },
    info: {
      icon: 'text-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    },
  };

  const iconMap = {
    danger: <FiAlertCircle size={28} className={colorClasses.danger.icon} />,
    warning: <FiAlertTriangle size={28} className={colorClasses.warning.icon} />,
    info: <FiInfo size={28} className={colorClasses.info.icon} />,
  };

  return (
    <div className='fixed inset-0 bg-gray-200 backdrop-blur-lg bg-opacity-50 transition-opacity overflow-y-auto h-full w-full z-50 flex justify-center items-center'>
      <div className='relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 sm:mx-auto'>
        <div className='absolute right-0 top-0 pt-4 pr-4'>
          <button
            type='button'
            className='text-gray-400 hover:text-gray-500 transition-colors'
            onClick={onCancel}>
            <span className='sr-only'>Close</span>
            <FiX size={20} />
          </button>
        </div>
        <div className='p-6 sm:p-8'>
          <div className='flex items-center mb-5'>
            <div className='mr-4 flex-shrink-0'>{iconMap[type]}</div>
            <h3 className='text-lg font-medium text-gray-900 flex items-center'>{title}</h3>
          </div>
          <div className='mt-2 flex items-center gap-2'>
            <p className='text-sm text-gray-500'>{message}</p>
          </div>
          <div className='mt-6 sm:flex sm:flex-row-reverse gap-2'>
            <button
              type='button'
              className={`w-full inline-flex items-center justify-center gap-2 rounded-md border border-transparent shadow-sm px-4 py-2 ${colorClasses[type].button} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-colors`}
              onClick={onConfirm}
            >
              {type === 'danger' && <FiAlertCircle size={18} />}
              {type === 'warning' && <FiAlertTriangle size={18} />}
              {type === 'info' && <FiInfo size={18} />}
              {confirmText}
            </button>
            <button
              type='button'
              className='mt-3 w-full inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors'
              onClick={onCancel}
            >
              <FiX size={18} />
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
