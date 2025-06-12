import React from 'react';
import { FiPhone, FiMail, FiEye, FiTrash2 } from 'react-icons/fi';
import { SchoolInquiry } from '../types';

interface InquiryGridProps {
	inquiries: SchoolInquiry[];
	onViewInquiry: (id: number) => void;
	onDeleteInquiry: (id: number) => void;
}

const InquiryGrid: React.FC<InquiryGridProps> = ({
	inquiries,
	onViewInquiry,
	onDeleteInquiry,
}) => {
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
			{inquiries.map((inquiry) => (
				<div
					key={inquiry.id}
					className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow'>
					<div className='p-4'>
						<h3 className='font-semibold text-lg text-gray-800 mb-2'>
							{inquiry.schoolName}
						</h3>						<div className='flex items-center text-gray-600 mb-2'>
							<FiPhone
								size={16}
								className='mr-2'
							/>
							<span>{inquiry.mobile}</span>
						</div>

						<div className='flex items-center text-gray-600 mb-3'>
							<FiMail
								size={16}
								className='mr-2'
							/>
							<span className='truncate'>
								{inquiry.schoolEmail}
							</span>
						</div>

						<div className='flex justify-between items-center'>
							<span
								className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${
					inquiry.status === 'Pending'
						? 'bg-yellow-100 text-yellow-800'
						: inquiry.status === 'Approved'
						? 'bg-green-100 text-green-800'
						: 'bg-red-100 text-red-800'
				}`}>
								{inquiry.status}
							</span>

							<div className='flex space-x-2'>
                                <button
                                    title="View Inquiry"
									onClick={() => onViewInquiry(inquiry.id)}
									className='text-white bg-purple-500 hover:bg-purple-600 p-2 rounded-full'>
									<FiEye size={16} />
								</button>
								<button
                                    title="Delete Inquiry"                                  
									onClick={() => onDeleteInquiry(inquiry.id)}
									className='text-white bg-gray-500 hover:bg-gray-600 p-2 rounded-full'>
									<FiTrash2 size={16} />
								</button>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default InquiryGrid;
