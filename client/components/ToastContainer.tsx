"use client";
import React, { useState, useCallback } from 'react';
import Toast from './Toast';

export type ToastType = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
};

interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

// Add this function to allow showing toasts from outside
export function showToast(
  message: string,
  type: 'success' | 'error' | 'info',
  duration = 5000
) {
  // This is a workaround for global toast usage
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('show-toast', {
      detail: { message, type, duration },
    });
    window.dispatchEvent(event);
  }
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
}) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  React.useEffect(() => {
    function handleShowToast(
      e: CustomEvent<{
        message: string;
        type: 'success' | 'error' | 'info';
        duration?: number;
      }>
    ) {
      const { message, type, duration } = e.detail;
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, message, type, duration }]);
    }
    window.addEventListener('show-toast', handleShowToast as EventListener);
    return () =>
      window.removeEventListener('show-toast', handleShowToast as EventListener);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 max-w-[320px] w-full flex flex-col gap-2`}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
