import React from 'react';
import Image from 'next/image';
import { FiX } from 'react-icons/fi';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Modal from '@/components/Modal';

interface School {
	id: number;
	name: string;
	logo: string;
	email: string;
	phone: string;
	isEmailVerified: boolean;
	address: string;
	adminName: string;
	adminEmail: string;
	plan: string;
}

interface SchoolModalProps {
	school: School | null;
	isOpen: boolean;
	onClose: () => void;
	onEdit: (school: School) => void;
}

const SchoolModal: React.FC<SchoolModalProps> = ({
	school,
	isOpen,
	onClose,
	onEdit,
}) => {
	if (!isOpen || !school) return null;

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='lg'
			header={
				<div className='flex justify-between items-center'>
					<h3 className='text-lg font-semibold text-gray-900'>
						School Details
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
						className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-600 text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm'
						onClick={() => {
							onEdit(school);
							onClose();
						}}>
						Edit
					</button>
					<button
						type='button'
						className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm'
						onClick={onClose}>
						Close
					</button>
				</div>
			}>
			<div className='flex flex-col md:flex-row gap-6'>
				{/* School Logo */}
				<div className='flex flex-col items-center'>
					<div className='h-24 w-24 relative mb-3'>
						<Image
							src={school.logo}
							alt={`${school.name} logo`}
							fill
							className='rounded-full object-cover border border-gray-200'
						/>
					</div>
					<div className='text-center'>
						{school.isEmailVerified ? (
							<span className='flex items-center gap-1 px-2 py-1 text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800'>
								<FaCheckCircle className='text-emerald-500' />{' '}
								Verified
							</span>
						) : (
							<span className='flex items-center gap-1 px-2 py-1 text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'>
								<FaTimesCircle className='text-red-500' />{' '}
								Not Verified
							</span>
						)}
					</div>
				</div>
				{/* School Information */}
				<div className='flex-1 space-y-4'>
					<div>
						<h4 className='text-sm font-medium text-gray-500'>
							School Name
						</h4>
						<p className='mt-1 text-sm text-gray-900 font-medium'>
							{school.name}
						</p>
					</div>
					<div>
						<h4 className='text-sm font-medium text-gray-500'>
							Contact Information
						</h4>
						<p className='mt-1 text-sm text-gray-900'>
							Phone: {school.phone}
						</p>
						<p className='mt-1 text-sm text-gray-900'>
							Email: {school.email}
						</p>
					</div>
					<div>
						<h4 className='text-sm font-medium text-gray-500'>
							Address
						</h4>
						<p className='mt-1 text-sm text-gray-900'>
							{school.address}
						</p>
					</div>
					<div>
						<h4 className='text-sm font-medium text-gray-500'>
							School Admin
						</h4>
						<p className='mt-1 text-sm text-gray-900 font-medium'>
							{school.adminName}
						</p>
						<p className='mt-1 text-sm text-gray-500'>
							{school.adminEmail}
						</p>
					</div>
					<div>
						<h4 className='text-sm font-medium text-gray-500'>
							Subscription Plan
						</h4>
						<p className='mt-1'>
							{school.plan === 'Pro' ? (
								<span className='inline-flex px-2 py-1 text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'>
									Pro
								</span>
							) : (
								<span className='text-sm text-gray-900'>
									{school.plan}
								</span>
							)}
						</p>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default SchoolModal;
