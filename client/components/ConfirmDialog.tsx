import React from 'react';
import Modal from '@/components/Modal';
import { FiAlertTriangle, FiInfo, FiAlertCircle } from 'react-icons/fi';

interface ConfirmDialogProps {
	// Modal-style props
	open?: boolean; // alias for isOpen
	isOpen?: boolean;
	title?: string;
	description?: string; // alias for message
	message?: string;
	confirmText?: string;
	cancelText?: string;
	loading?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	open,
	isOpen,
	title = 'Are you sure?',
	description,
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	loading = false,
	onConfirm,
	onCancel,
	type = 'danger',
}) => {
	// Support both open and isOpen for compatibility
	const visible = typeof isOpen === 'boolean' ? isOpen : !!open;

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
		danger: (
			<FiAlertCircle
				size={28}
				className={colorClasses.danger.icon}
			/>
		),
		warning: (
			<FiAlertTriangle
				size={28}
				className={colorClasses.warning.icon}
			/>
		),
		info: (
			<FiInfo
				size={28}
				className={colorClasses.info.icon}
			/>
		),
	};

	return (
		<Modal
			isOpen={visible}
			onClose={onCancel}
			title={title}
			size='sm'
			header={
				<div className='flex items-center gap-3'>
					<span>{iconMap[type]}</span>
					<span>{title}</span>
				</div>
			}
			footer={
				<div className='flex justify-end gap-2'>
					<button
						className='px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300'
						onClick={onCancel}
						disabled={loading}>
						{cancelText}
					</button>
					<button
						className={`px-4 py-2 rounded text-white disabled:opacity-50 ${colorClasses[type].button}`}
						onClick={onConfirm}
						disabled={loading}>
						{loading ? 'Processing...' : confirmText}
					</button>
				</div>
			}>
			<div className='flex items-center gap-2'>
				{type !== 'danger' && iconMap[type]}
				<span className='text-gray-700'>{description || message}</span>
			</div>
		</Modal>
	);
};

export default ConfirmDialog;
