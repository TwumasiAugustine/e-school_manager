import React from 'react';
import Image from 'next/image';
import {
	FaCheckCircle,
	FaTimesCircle,
	FaEye,
	FaEdit,
	FaTrash,
	FaPhone,
	FaEnvelope,
	FaMapMarkerAlt,
} from 'react-icons/fa';
import { School } from '@/types/school';

interface SchoolGridProps {
	schools: School[];
	onView: (id: number) => void;
	onEdit: (school: School) => void;
	onDelete: (id: number) => void;
}

const SchoolGrid: React.FC<SchoolGridProps> = ({
	schools,
	onView,
	onEdit,
	onDelete,
}) => {
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
			{schools.length > 0 ? (
				schools.map((school) => (
					<div
						key={school.id}
						className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'>
						<div className='p-4'>
							<div className='flex items-center mb-4'>
								<div className='h-12 w-12 relative mr-3'>
									<Image
										src={school.logo}
										alt={`${school.name} logo`}
										fill
										className='rounded-full object-cover'
									/>
								</div>
								<div>
									<h3 className='font-semibold text-lg text-gray-800 truncate'>
										{school.name}
									</h3>
									<div>
										{school.isEmailVerified ? (
											<span className='inline-flex items-center gap-1 text-xs text-emerald-600'>
												<FaCheckCircle /> Verified
											</span>
										) : (
											<span className='inline-flex items-center gap-1 text-xs text-red-600'>
												<FaTimesCircle /> Not Verified
											</span>
										)}
									</div>
								</div>
							</div>

							<div className='space-y-2 mb-4'>
								<div className='flex items-center text-gray-600 text-sm'>
									<FaEnvelope className='mr-2 text-gray-400' />
									<span className='truncate'>
										{school.email}
									</span>
								</div>

								<div className='flex items-center text-gray-600 text-sm'>
									<FaPhone className='mr-2 text-gray-400' />
									<span>{school.phone}</span>
								</div>

								<div className='flex items-start text-gray-600 text-sm'>
									<FaMapMarkerAlt className='mr-2 mt-0.5 text-gray-400' />
									<span className='line-clamp-2'>
										{school.address}
									</span>
								</div>
							</div>

							<div className='flex items-center justify-between mb-3'>
								<div>
									<div className='text-sm font-medium'>
										Admin: {school.adminName}
									</div>
									<div className='text-xs text-gray-500'>
										{school.adminEmail}
									</div>
								</div>
								<div>
									{school.plan === 'Pro' ? (
										<span className='px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'>
											Pro
										</span>
									) : (
										<span className='px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'>
											{school.plan}
										</span>
									)}
								</div>
							</div>

							<div className='flex justify-between pt-3 border-t border-gray-100'>
								<button
									className='text-emerald-600 hover:text-emerald-900 p-2 rounded-full hover:bg-emerald-50'
									onClick={() => onView(school.id)}
									title='View'>
									<FaEye />
								</button>
								<button
									className='text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50'
									onClick={() => onEdit(school)}
									title='Edit'>
									<FaEdit />
								</button>
								<button
									className='text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50'
									onClick={() => onDelete(school.id)}
									title='Delete'>
									<FaTrash />
								</button>
							</div>
						</div>
					</div>
				))
			) : (
				<div className='col-span-full text-center py-10 text-gray-500'>
					No schools found
				</div>
			)}
		</div>
	);
};

export default SchoolGrid;
