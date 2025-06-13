import React from 'react';
import Image from 'next/image';
import {
	FaCheckCircle,
	FaTimesCircle,
	FaEye,
	FaEdit,
	FaTrash,
} from 'react-icons/fa';
import SchoolGrid from './SchoolGrid';
import { School } from '@/types/school';
interface SchoolTableProps {
	schools: School[];
	currentPage: number;
	itemsPerPage: number;
	totalSchools: number;
	onPageChange: (page: number) => void;
	onItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	onView: (id: number) => void;
	onEdit: (school: School) => void;
	onDelete: (id: number) => void;
}

const SchoolTable: React.FC<SchoolTableProps> = ({
	schools,
	currentPage,
	itemsPerPage,
	totalSchools,
	onPageChange,
	onItemsPerPageChange,
	onView,
	onEdit,
	onDelete,
}) => {
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const totalPages = Math.ceil(totalSchools / itemsPerPage);

	return (
		<div className='space-y-4'>
			{/* Table for md+ screens only */}
			<div className='overflow-x-auto rounded-lg border border-gray-200 shadow-sm hidden md:block'>
				<table className='min-w-full bg-white'>
					<thead className='bg-gray-50'>
						<tr>
							<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12'>
								No.
							</th>
							<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16'>
								Logo
							</th>
							<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Name
							</th>
							<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								School Email
							</th>
							<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								School Phone
							</th>
							<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Verify Email
							</th>
							<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Address
							</th>
							<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								School Admin
							</th>
							<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Active Plan
							</th>
							<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200'>
						{schools.length > 0 ? (
							schools.map((school, index) => (
								<tr
									key={school.id}
									className='hover:bg-gray-50'>
									<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
										{indexOfFirstItem + index + 1}
									</td>
									<td className='px-4 py-4 whitespace-nowrap'>
										<div className='h-10 w-10 relative'>
											<Image
												src={school.logo}
												alt={`${school.name} logo`}
												fill
												className='rounded-full object-cover'
											/>
										</div>
									</td>
									<td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
										{school.name}
									</td>
									<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
										{school.email}
									</td>
									<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
										{school.phone}
									</td>
									<td className='px-4 py-4 whitespace-nowrap'>
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
									</td>
									<td className='px-4 py-4 text-sm text-gray-500 max-w-xs truncate'>
										{school.address}
									</td>
									<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
										<div>
											<div className='font-medium text-gray-800'>
												{school.adminName}
											</div>
											<div className='text-gray-500 text-xs'>
												{school.adminEmail}
											</div>
										</div>
									</td>
									<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
										{school.plan === 'Pro' ? (
											<span className='px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'>
												Pro
											</span>
										) : (
											<span className='text-sm'>
												{school.plan}
											</span>
										)}
									</td>
									<td className='px-4 py-4 whitespace-nowrap text-sm font-medium'>
										<div className='flex space-x-2'>
											<button
												className='text-emerald-600 hover:text-emerald-900'
												onClick={() =>
													onView(school.id)
												}
												title='View'>
												<FaEye />
											</button>
											<button
												className='text-blue-600 hover:text-blue-900'
												title='Edit'
												onClick={() => onEdit(school)}>
												<FaEdit />
											</button>
											<button
												className='text-red-600 hover:text-red-900'
												title='Delete'
												onClick={() =>
													onDelete(school.id)
												}>
												<FaTrash />
											</button>
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={10}
									className='px-4 py-4 text-center text-sm text-gray-500'>
									No schools found
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			{/* Grid view for small screens only */}
			<div className="block md:hidden">
				<SchoolGrid
					schools={schools}
					onView={onView}
					onEdit={onEdit}
					onDelete={onDelete}
				/>
			</div>
			{/* Pagination */}
			<div className='mt-4 flex flex-col md:flex-row justify-between items-center gap-2'>
				<div className='flex items-center mb-2 md:mb-0'>
					<span className='text-sm text-gray-700 mr-2'>
						Rows per page:
					</span>
					<select
						className='border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500'
						value={itemsPerPage}
						onChange={onItemsPerPageChange}
						title='Select rows per page'>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={25}>25</option>
						<option value={50}>50</option>
					</select>
					<span className='ml-4 text-sm text-gray-700'>
						Showing {schools.length > 0 ? indexOfFirstItem + 1 : 0}-
						{Math.min(indexOfLastItem, totalSchools)} of{' '}
						{totalSchools}
					</span>
				</div>
				<div className='flex items-center space-x-1'>
					<button
						className='px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50'
						disabled={currentPage === 1}
						onClick={() => onPageChange(currentPage - 1)}>
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
								className={`px-3 py-1 rounded-md ${
									pageNum === currentPage
										? 'bg-emerald-600 text-white'
										: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
								}`}
								onClick={() => onPageChange(pageNum)}>
								{pageNum}
							</button>
						);
					})}
					<button
						className='px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50'
						disabled={
							currentPage === totalPages || totalPages === 0
						}
						onClick={() => onPageChange(currentPage + 1)}>
						Next
					</button>
				</div>
			</div>
		</div>
	);
};

export default SchoolTable;
