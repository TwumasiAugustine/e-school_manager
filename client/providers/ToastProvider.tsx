'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Toast from '@/components/Toast';
import { showToast } from '@/components/ToastContainer';

export type ToastType = {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info';
	duration?: number;
};

interface ToastProviderProps {
	children: React.ReactNode;
	position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const ToastContext = React.createContext<{
	showToast: (message: string, type: 'success' | 'error' | 'info', duration?: number) => void;
} | undefined>(undefined);

export const ToastProvider: React.FC<ToastProviderProps> = ({
	children,
	position = 'top-right',
}) => {
	const [toasts, setToasts] = useState<ToastType[]>([]);

	const removeToast = useCallback((id: string) => {
		setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
	}, []);

	const contextValue = useMemo(() => ({ showToast }), [showToast]);

	const positionClasses = {
		'top-right': 'top-4 right-4',
		'top-left': 'top-4 left-4',
		'bottom-right': 'bottom-4 right-4',
		'bottom-left': 'bottom-4 left-4',
	};

	return (
		<ToastContext.Provider value={contextValue}>
			{children}
			<div
				className={`fixed ${positionClasses[position]} z-50`}
				style={{ maxWidth: '320px' }}
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
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const context = React.useContext(ToastContext);
	if (context === undefined) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
};
