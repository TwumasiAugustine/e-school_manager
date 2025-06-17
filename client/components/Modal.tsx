import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

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
			className="fixed max-w-8xl inset-0 bg-gray-200 backdrop-blur-lg bg-opacity-50 transition-opacity overflow-y-auto h-full w-full z-50 flex justify-center items-center"
		>
			<div
				className={`bg-white rounded-lg shadow-lg w-full ${sizeClasses[size]} mx-4 relative`}
			>
				<div className="absolute right-0 top-0 pt-4 pr-4">
					<button
						type="button"
						className="text-gray-400 hover:text-gray-500 transition-colors"
						onClick={onClose}
					>
						<span className="sr-only">Close</span>
						<AiOutlineClose className="h-6 w-6" />
					</button>
				</div>
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
