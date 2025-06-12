import React from 'react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	size?: 'sm' | 'md' | 'lg';
	header?: React.ReactNode;
	footer?: React.ReactNode;
	children?: React.ReactNode; // body
}

const sizeClasses = {
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg',
};

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	size = 'lg',
	header,
	footer,
	children,
}) => {
	if (!isOpen) return null;
	return (
		<div
			className="fixed inset-0 bg-gray-200 backdrop-blur-lg bg-opacity-50 transition-opacity overflow-y-auto h-full w-full z-50 flex justify-center items-center"
			
		>
			<div
				className={`bg-white rounded-lg shadow-lg w-full ${sizeClasses[size]} mx-4 relative`}
				
			>
				{header ? (
					<div className="px-6 pt-5 pb-2 border-b border-gray-300">
						{header}
					</div>
				) : title ? (
					<div className="px-6 pt-5 pb-2 text-lg font-semibold text-gray-800">
						{title}
					</div>
				) : null}
				<div className="px-6 py-4">{children}</div>
				{footer && (
					<div className="bg-gray-50 px-6 py-3 rounded-b-lg">
						{footer}
					</div>
				)}
			</div>
		</div>
	);
};

export default Modal;
