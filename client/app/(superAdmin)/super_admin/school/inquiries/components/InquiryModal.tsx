import React from 'react';
import { FiX } from 'react-icons/fi';
import { SchoolInquiry } from '../types';
import Modal from '@/components/Modal';

interface InquiryModalProps {
	inquiry: SchoolInquiry | null;
	isOpen: boolean;
	onClose: () => void;
	onApprove: (id: number) => void;
	onReject: (id: number) => void;
}

const InquiryModal: React.FC<InquiryModalProps> = ({
	inquiry,
	isOpen,
	onClose,
	onApprove,
	onReject,
}) => {
	if (!isOpen || !inquiry) return null;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='lg'
			header={
				<div className='flex justify-between items-center'>
					<h3 className='text-lg font-semibold text-gray-900'>
						School Inquiry Details
					</h3>
					<button
						type='button'
						title='Close'
						onClick={onClose}
						className='text-gray-400 hover:text-gray-500'>
						<FiX size={20} />
					</button>
				</div>
			}
			footer={
				<div className='sm:flex sm:flex-row-reverse'>
					<button
						type='button'
						className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm'
						onClick={() => onApprove(inquiry.id)}>
						Approve
					</button>
					<button
						type='button'
						className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
						onClick={() => onReject(inquiry.id)}>
						Reject
					</button>
					<button
						type='button'
						className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm'
						onClick={onClose}>
						Cancel
					</button>
				</div>
			}>
			<div className='space-y-4'>
				<div>
					<h4 className='text-sm font-medium text-gray-500'>School Name</h4>
					<p className='mt-1 text-sm text-gray-900'>{inquiry.schoolName}</p>
				</div>

				<div>
					<h4 className='text-sm font-medium text-gray-500'>
						Contact Information
					</h4>
					<p className='mt-1 text-sm text-gray-900'>Phone: {inquiry.mobile}</p>
					<p className='mt-1 text-sm text-gray-900'>
						Email: {inquiry.schoolEmail}
					</p>
				</div>

				{inquiry.address && (
					<div>
						<h4 className='text-sm font-medium text-gray-500'>Address</h4>
						<p className='mt-1 text-sm text-gray-900'>{inquiry.address}</p>
					</div>
				)}

				{inquiry.contactPerson && (
					<div>
						<h4 className='text-sm font-medium text-gray-500'>
							Contact Person
						</h4>
						<p className='mt-1 text-sm text-gray-900'>
							{inquiry.contactPerson}
						</p>
					</div>
				)}

				{inquiry.inquiryDate && (
					<div>
						<h4 className='text-sm font-medium text-gray-500'>Inquiry Date</h4>
						<p className='mt-1 text-sm text-gray-900'>
							{inquiry.inquiryDate}
						</p>
					</div>
				)}

				{inquiry.message && (
					<div>
						<h4 className='text-sm font-medium text-gray-500'>Message</h4>
						<p className='mt-1 text-sm text-gray-900'>{inquiry.message}</p>
					</div>
				)}

				<div>
					<h4 className='text-sm font-medium text-gray-500'>Current Status</h4>
					<span
						className={`mt-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                ${
					inquiry.status === 'Pending'
						? 'bg-yellow-100 text-yellow-800'
						: inquiry.status === 'Approved'
						? 'bg-green-100 text-green-800'
						: 'bg-red-100 text-red-800'
				}`}>
						{inquiry.status}
					</span>
				</div>
			</div>
		</Modal>
	);
};

export default InquiryModal;
