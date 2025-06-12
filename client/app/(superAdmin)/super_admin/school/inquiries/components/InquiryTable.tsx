import React, { useState } from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { SchoolInquiry } from '../types';
import InquiryGrid from './InquiryGrid';

interface InquiryTableProps {
	inquiries: SchoolInquiry[];
	onViewInquiry: (id: number) => void;
	onDeleteInquiry: (id: number) => void;
	isLoading?: boolean;
}

const InquiryTable: React.FC<InquiryTableProps> = ({
	inquiries,
	onViewInquiry,
	onDeleteInquiry,
}) => {
	// Pagination state
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);

	// Calculate pagination
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = inquiries.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(inquiries.length / itemsPerPage);

	// Pagination handlers
	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setItemsPerPage(Number(e.target.value));
		setCurrentPage(1); // Reset to first page when changing items per page
	};

	return (
		<div className='space-y-4'>
			{/* Table for md+ screens only */}
			<div className='overflow-x-auto rounded-lg border border-gray-200 shadow-sm hidden md:block'>
				<table className='min-w-full bg-white'>
					<thead className='bg-gray-50'>
						<tr>
							<th className='py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Id
							</th>
							<th className='py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								No.
							</th>
							<th className='py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								School Name
							</th>
							<th className='py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Mobile
							</th>
							<th className='py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								School Email
							</th>
							<th className='py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Application Status
							</th>
							<th className='py-3 px-4 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Action
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200'>
						{currentItems.length > 0 ? (
							currentItems.map((inquiry) => (
								<tr
									key={inquiry.id}
									className='hover:bg-gray-50'>
									<td className='py-4 px-4 whitespace-nowrap text-sm text-gray-500'>
										{inquiry.id}
									</td>
									<td className='py-4 px-4 whitespace-nowrap text-sm text-gray-500'>
										{inquiry.no}
									</td>
									<td className='py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900'>
										{inquiry.schoolName}
									</td>
									<td className='py-4 px-4 whitespace-nowrap text-sm text-gray-500'>
										{inquiry.mobile}
									</td>
									<td className='py-4 px-4 whitespace-nowrap text-sm text-gray-500'>
										{inquiry.schoolEmail}
									</td>
									<td className='py-4 px-4 whitespace-nowrap'>
										<span
											className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
											${
												inquiry.status === 'Pending'
													? 'bg-yellow-100 text-yellow-800'
													: inquiry.status === 'Approved'
													? 'bg-green-100 text-green-800'
													: 'bg-red-100 text-red-800'
											}`}>
											{inquiry.status}
										</span>
									</td>
									<td className='py-4 px-4 whitespace-nowrap text-sm font-medium'>
										<div className='flex space-x-2'>
											<button
												type='button'
												title='View Inquiry'
												onClick={() => onViewInquiry(inquiry.id)}
												className='text-white bg-emerald-600 hover:bg-emerald-700 p-2 rounded-full'>
												<FiEye size={16} />
											</button>
											<button
												type='button'
												title='Delete Inquiry'
												onClick={() => onDeleteInquiry(inquiry.id)}
												className='text-white bg-gray-500 hover:bg-gray-600 p-2 rounded-full'>
												<FiTrash2 size={16} />
											</button>
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={7} className='px-4 py-4 text-center text-sm text-gray-500'>
									No inquiries found
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			{/* Grid view for small screens only */}
			<div className="block md:hidden">
				<InquiryGrid
					inquiries={currentItems}
					onViewInquiry={onViewInquiry}
					onDeleteInquiry={onDeleteInquiry}
				/>
			</div>
			{/* Pagination */}
			<div className='mt-4 flex flex-col md:flex-row justify-between items-center gap-2'>
				<div className='flex items-center mb-2 md:mb-0'>
					<span className='text-sm text-gray-700 mr-2'>Rows per page:</span>
					<select 
						className='border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500' 
						value={itemsPerPage} 
						onChange={handleItemsPerPageChange}
						title='Select rows per page'
					>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={25}>25</option>
						<option value={50}>50</option>
					</select>
					<span className='ml-4 text-sm text-gray-700'>
						Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, inquiries.length)} of {inquiries.length}
					</span>
				</div>
				<div className='flex items-center space-x-1'>
					<button 
						className='px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50' 
						disabled={currentPage === 1} 
						onClick={() => handlePageChange(currentPage - 1)}
					>
						Previous
					</button>
					{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
						let pageNum;
						if (totalPages <= 5) {
							pageNum = i + 1;
						} else if (currentPage <= 3) {
							pageNum = i + 1;
						} else if (currentPage >= totalPages - 2) {
							pageNum = totalPages - 4 + i;
						} else {
							pageNum = currentPage - 2 + i;
						}
						return (
							<button 
								key={i} 
								className={`px-3 py-1 rounded-md ${pageNum === currentPage ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} 
								onClick={() => handlePageChange(pageNum)}
							>
								{pageNum}
							</button>
						);
					})}
					<button 
						className='px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50' 
						disabled={currentPage === totalPages || totalPages === 0} 
						onClick={() => handlePageChange(currentPage + 1)}
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
};

export default InquiryTable;
