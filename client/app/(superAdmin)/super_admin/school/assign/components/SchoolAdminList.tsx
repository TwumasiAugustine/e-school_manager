import React, { useState } from 'react';
import type { School, Admin } from '../services/schoolAssignmentService';
import HeadingWithBadge from '@/components/HeadingWithBadge';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import SchoolAdminGrid from './SchoolAdminGrid';
import AssignActionsBar from './AssignActionsBar';

interface SchoolAdminListProps {
	data: { school: School; admin: Admin | null; assignedAt?: string }[];
	onAssign: (school: School) => void;
	onUnassign: (school: School) => void;
	loading: boolean;
}

const SchoolAdminList: React.FC<SchoolAdminListProps> = ({
	data,
	onAssign,
	onUnassign,
	loading,
}) => {
	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [view, setView] = useState<'grid' | 'list'>('list');
	const [searchTerm, setSearchTerm] = useState('');

	const totalSchools = data.length;
	const totalPages = Math.ceil(totalSchools / itemsPerPage);
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const filteredData = data.filter(({ school, admin }) => {
		const term = searchTerm.toLowerCase();
		return (
			school.name.toLowerCase().includes(term) ||
			(admin && admin.name.toLowerCase().includes(term)) ||
			(admin && admin.email.toLowerCase().includes(term))
		);
	});
	const paginatedData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

	const handlePageChange = (page: number) => {
		if (page < 1 || page > totalPages) return;
		setCurrentPage(page);
	};

	const handleItemsPerPageChange = (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		setItemsPerPage(Number(e.target.value));
		setCurrentPage(1);
	};

	const handleViewChange = (newView: 'grid' | 'list') => {
		setView(newView);
	};

	// Always grid on small screens
	const isGrid =
		typeof window !== 'undefined' && window.innerWidth < 768
			? true
			: view === 'grid';

	return (
		<div className='bg-white rounded-lg shadow p-6'>
			<HeadingWithBadge
				title='Schools & Assigned Admins'
				count={filteredData.length}
				level='h3'
				className='mb-4'
			/>
			<AssignActionsBar
				onExport={() => window.location.reload()}
				onRefresh={() => window.location.reload()}
				onViewChange={handleViewChange}
				searchTerm={searchTerm}
				onSearchChange={setSearchTerm}
				view={view}
			/>
			{loading ? (
				<div className='relative min-h-[80px]'>
					<Loading
						message='Loading schools...'
						size='medium'
					/>
				</div>
			) : filteredData.length === 0 ? (
				<EmptyState
					title='No schools found'
					message='There are no schools to display. Please add a school or check your filters.'
				/>
			) : isGrid ? (
				<SchoolAdminGrid
					data={paginatedData}
					onAssign={onAssign}
					onUnassign={onUnassign}
					loading={loading}
				/>
			) : (
				<div className='overflow-x-auto rounded-lg border border-gray-200 shadow-sm'>
					<table className='min-w-full bg-white'>
						<thead className='bg-gray-50'>
							<tr>
								<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									No.
								</th>
								<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									School
								</th>
								<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Admin
								</th>
								<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Assigned At
								</th>
								<th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Action
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-200'>
							{paginatedData.map(
								({ school, admin, assignedAt }, idx) => (
									<tr
										key={school.id}
										className='hover:bg-gray-50'>
										<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
											{indexOfFirstItem + idx + 1}
										</td>
										<td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
											{school.name}
										</td>
										<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-700'>
											{admin ? (
												<div>
													<div className='font-medium text-gray-800'>
														{admin.name}
													</div>
													<div className='text-gray-500 text-xs'>
														{admin.email}
													</div>
												</div>
											) : (
												<span className='text-xs text-gray-400'>
													Unassigned
												</span>
											)}
										</td>
										<td className='px-4 py-4 whitespace-nowrap text-xs text-gray-500'>
											{assignedAt
												? new Date(
														assignedAt,
												  ).toLocaleString()
												: '-'}
										</td>
										<td className='px-4 py-4 whitespace-nowrap text-sm font-medium'>
											<div className='flex space-x-2'>
												{admin && (
													<button
														className='text-red-600 hover:text-red-900 text-xs font-semibold'
														onClick={() =>
															onUnassign(school)
														}>
														Unassign
													</button>
												)}
												<button
													className='text-emerald-700 hover:text-emerald-900 text-xs font-semibold'
													onClick={() =>
														onAssign(school)
													}>
													{admin
														? 'Reassign'
														: 'Assign'}
												</button>
											</div>
										</td>
									</tr>
								),
							)}
						</tbody>
					</table>
				</div>
			)}
			{/* Pagination Controls */}
			<div className='mt-4 flex flex-col md:flex-row justify-between items-center gap-2'>
				<div className='flex items-center mb-2 md:mb-0'>
					<span className='text-sm text-gray-700 mr-2'>
						Rows per page:
					</span>
					<select
						className='border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500'
						value={itemsPerPage}
						onChange={handleItemsPerPageChange}
						title='Select rows per page'>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={25}>25</option>
						<option value={50}>50</option>
					</select>
					<span className='ml-4 text-sm text-gray-700'>
						Showing{' '}
						{paginatedData.length > 0 ? indexOfFirstItem + 1 : 0}-
						{Math.min(indexOfLastItem, filteredData.length)} of{' '}
						{filteredData.length}
					</span>
				</div>
				<div className='flex items-center space-x-1'>
					<button
						className='px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50'
						disabled={currentPage === 1}
						onClick={() => handlePageChange(currentPage - 1)}>
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
								onClick={() => handlePageChange(pageNum)}>
								{pageNum}
							</button>
						);
					})}
					<button
						className='px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50'
						disabled={
							currentPage === totalPages || totalPages === 0
						}
						onClick={() => handlePageChange(currentPage + 1)}>
						Next
					</button>
				</div>
			</div>
		</div>
	);
};

export default SchoolAdminList;
