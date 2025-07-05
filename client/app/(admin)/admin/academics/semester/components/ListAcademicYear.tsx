/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState } from 'react';
import HeadingWithBadge from '@/components/HeadingWithBadge';
import EmptyState from '@/components/EmptyState';
import {
	FiEdit3,
	FiTrash2,
	FiCheckCircle,
	FiSearch,
	FiX as FiXIcon,
} from 'react-icons/fi';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import AcademicYearForm from './AcademicYearForm';
import AcademicYearActionsBar from './AcademicYearActionsBar';
import type { Semester } from '@/types/semester';

interface ListAcademicYearProps {
	semesters: Semester[];
	isLoading: boolean;
	isSmallScreen: boolean;
	onEdit: (semester: Semester) => void;
	onDelete: (id: string | number) => void;
	onExport: () => void;
	onRefresh: () => void;
	onSetCurrent: (id: string | number) => void;
	onViewChange?: (semester: Semester) => void;
	currentView: 'grid' | 'list';
	currentFilter: 'all' | 'trashed';
}

const ListAcademicYear: React.FC<ListAcademicYearProps> = ({
	semesters,
	isLoading,
	isSmallScreen,
	onEdit,
	onDelete,
	onSetCurrent,
	onViewChange,
	currentView,
	currentFilter,
}) => {
	const [tab, setTab] = useState<'all' | 'trashed'>(currentFilter);
	const [search, setSearch] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [view, setView] = useState<'list' | 'grid'>(currentView);
	const [loading, setLoading] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [editingSemester, setEditingSemester] = useState<Semester | null>(
		null,
	);

	const filtered = semesters.filter(
		(s) =>
			(tab === 'all' ? s.status !== 'trashed' : s.status === 'trashed') &&
			(!search || s.name.toLowerCase().includes(search.toLowerCase())),
	);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const paginatedSemesters = filtered.slice(
		indexOfFirstItem,
		indexOfLastItem,
	);
	const totalPages = Math.ceil(filtered.length / itemsPerPage);

	// Export semesters to CSV
	const handleExport = () => {
		const headers = ['No.', 'Name', 'Start Month', 'End Month', 'Current'];
		const rows = filtered.map((s, idx) => [
			(idx + 1).toString(),
			s.name,
			s.startMonth,
			s.endMonth,
			s.isCurrent ? 'Yes' : 'No',
		]);
		const csvContent = [headers, ...rows]
			.map((r) =>
				r.map((field) => `"${field.replace(/"/g, '""')}`).join(','),
			)
			.join('\n');
		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'semesters.csv';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	// Refresh resets search and pagination
	const handleRefresh = () => {
		setLoading(true);
		setSearch('');
		setCurrentPage(1);
		setTimeout(() => {
			setLoading(false);
		}, 1000);
	};

	// View change toggles view state
	const handleViewChange = (v: 'grid' | 'list') => {
		setView(v);
	};

	const handleEdit = (semester: Semester) => {
		setEditingSemester(semester);
		setEditModalOpen(true);
	};

	const handleUpdate = (updated: {
		name: string;
		startMonth: string;
		endMonth: string;
	}) => {
		if (editingSemester) {
			const merged = { ...editingSemester, ...updated };
			if (typeof window !== 'undefined') {
				if (typeof onEdit === 'function') onEdit(merged);
			}
		}
		setEditModalOpen(false);
		setEditingSemester(null);
	};

	const handleEditCancel = () => {
		setEditModalOpen(false);
		setEditingSemester(null);
	};

	return (
		<>
			<div className='mb-2 flex flex-col md:flex-row md:items-center md:justify-between'>
				<HeadingWithBadge
					title='List Academic Years'
					badgeText={`${filtered.length}`}
					level='h3'
				/>
				<div className='mt-4 md:mt-0 md:ml-auto'>
					<AcademicYearActionsBar
						onRefresh={handleRefresh}
						onExport={handleExport}
						onViewChange={handleViewChange}
						currentView={view}
					/>
				</div>
			</div>
			<Modal
				isOpen={editModalOpen}
				onClose={handleEditCancel}
				title='Edit Academic Year'
				size='lg'>
				<AcademicYearForm
					semester={editingSemester}
					mode='edit'
					onSubmit={handleUpdate}
					onCancel={handleEditCancel}
				/>
			</Modal>
			<div className='relative mb-3 flex flex-col md:flex-row md:items-center md:space-x-3 gap-2'>
				<div className='relative flex-1 max-w-full md:max-w-[400px] w-full'>
					<span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'>
						<FiSearch />
					</span>
					<input
						type='text'
						placeholder='Search semesters by name...'
						className='w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 transition-all shadow-sm placeholder-gray-400'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						aria-label='Search semesters'
					/>
					{search && (
						<button
							type='button'
							className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none'
							onClick={() => setSearch('')}
							tabIndex={0}
							aria-label='Clear search'>
							<FiXIcon />
						</button>
					)}
				</div>
				<div className='flex-shrink-0'>
					<select
						className='border border-gray-200 rounded-md py-2 px-3 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm min-w-[120px]'
						value={tab}
						onChange={(e) =>
							setTab(e.target.value as 'all' | 'trashed')
						}
						aria-label='Filter by status'>
						<option value='all'>All</option>
						<option value='trashed'>Trashed</option>
					</select>
				</div>
			</div>
			<div className='relative'>
				{(loading || isLoading) && (
					<div className='absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-80 rounded-lg'>
						<Loading
							message='Refreshing academic years...'
							size='medium'
						/>
					</div>
				)}
				{view === 'grid' || isSmallScreen ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
						{paginatedSemesters.length === 0 ? (
							<div className='col-span-full flex justify-center items-center min-h-[180px]'>
								<EmptyState
									title='No semesters found'
									message='There are no semesters to display. Create a new semester to get started.'
								/>
							</div>
						) : (
							paginatedSemesters.map((semester, idx) => (
								<div
									key={semester.id}
									className='border rounded-lg p-4 flex flex-col bg-gray-50 shadow-sm'>
									<div className='flex justify-between items-center mb-2'>
										<span className='text-xs text-gray-500'>
											No. {indexOfFirstItem + idx + 1}
										</span>
										{semester.isCurrent && (
											<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
												<FiCheckCircle className='mr-1.5 h-4 w-4' />{' '}
												Current
											</span>
										)}
									</div>
									<div className='font-semibold text-base mb-1 break-words truncate'>
										{semester.name}
									</div>
									<div className='flex flex-col gap-1 text-xs text-gray-700 mb-2'>
										<div>Start: {semester.startMonth}</div>
										<div>End: {semester.endMonth}</div>
									</div>
									<div className='flex gap-2 mt-auto'>
										<button
											className='bg-purple-300 hover:bg-purple-400 text-white p-2 rounded-full transition-colors duration-150'
											title='Edit'
											onClick={() =>
												handleEdit(semester)
											}>
											<FiEdit3 />
										</button>
										<button
											className='bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors duration-150'
											title='Delete'
											onClick={() =>
												onDelete(semester.id)
											}>
											<FiTrash2 />
										</button>
										{!semester.isCurrent && (
											<button
												className='text-blue-600 hover:text-blue-800 font-medium transition-colors tooltipped'
												data-tooltip='Set as Current'
												onClick={() =>
													onSetCurrent(semester.id)
												}>
												Set Current
											</button>
										)}
									</div>
								</div>
							))
						)}
					</div>
				) : (
					<div className='overflow-x-auto max-h-96 container mx-auto rounded-lg border border-gray-100'>
						{filtered.length === 0 ? (
							<div className='flex justify-center items-center min-h-[180px]'>
								<EmptyState
									title='No semesters found'
									message='There are no semesters to display. Create a new semester to get started.'
								/>
							</div>
						) : (
							<table className='min-w-full bg-white'>
								<thead className='sticky top-0 z-10 bg-gray-50 border-b border-gray-200'>
									<tr>
										<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
											No.
										</th>
										<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
											Name
										</th>
										<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
											Start Month
										</th>
										<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
											End Month
										</th>
										<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
											Current
										</th>
										<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
											Action
										</th>
									</tr>
								</thead>
								<tbody>
									{paginatedSemesters.map((semester, idx) => (
										<tr
											key={semester.id}
											className='border-t border-gray-100 hover:bg-emerald-50 transition-colors'>
											<td className='px-4 py-2'>
												{indexOfFirstItem + idx + 1}
											</td>
											<td className='px-4 py-2 break-words max-w-[120px] md:max-w-[200px] truncate'>
												{semester.name}
											</td>
											<td className='px-4 py-2 break-words max-w-[100px] truncate'>
												{semester.startMonth}
											</td>
											<td className='px-4 py-2 break-words max-w-[100px] truncate'>
												{semester.endMonth}
											</td>
											<td className='px-4 py-2'>
												{semester.isCurrent ? (
													<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
														<FiCheckCircle className='mr-1.5 h-4 w-4' />{' '}
														Current
													</span>
												) : (
													<button
														onClick={() =>
															onSetCurrent(
																semester.id,
															)
														}
														className='text-blue-600 hover:text-blue-800 font-medium transition-colors tooltipped'
														data-tooltip='Set as Current'>
														Set Current
													</button>
												)}
											</td>
											<td className='px-4 py-2 flex space-x-2'>
												<button
													className='bg-purple-300 hover:bg-purple-400 text-white p-2 rounded-full transition-colors duration-150'
													title='Edit'
													onClick={() =>
														handleEdit(semester)
													}>
													<FiEdit3 />
												</button>
												<button
													className='bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors duration-150'
													title='Delete'
													onClick={() =>
														onDelete(semester.id)
													}>
													<FiTrash2 />
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
				)}
				{/* Pagination Controls */}
				{filtered.length > 0 && (
					<div className='mt-4 flex flex-col md:flex-row justify-between items-center gap-2'>
						<div className='flex items-center mb-2 md:mb-0'>
							<span className='text-sm text-gray-700 mr-2'>
								Rows per page:
							</span>
							<select
								className='border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500'
								value={itemsPerPage}
								onChange={(e) => {
									setItemsPerPage(Number(e.target.value));
									setCurrentPage(1);
								}}
								title='Select rows per page'>
								<option value={5}>5</option>
								<option value={10}>10</option>
								<option value={25}>25</option>
								<option value={50}>50</option>
							</select>
							<span className='ml-4 text-sm text-gray-700'>
								Showing{' '}
								{filtered.length > 0 ? indexOfFirstItem + 1 : 0}
								-{Math.min(indexOfLastItem, filtered.length)} of{' '}
								{filtered.length}
							</span>
						</div>
						<div className='flex items-center space-x-1'>
							<button
								className='px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50'
								disabled={currentPage === 1}
								onClick={() => setCurrentPage(currentPage - 1)}>
								Previous
							</button>
							{Array.from(
								{ length: Math.min(5, totalPages) },
								(_, i) => {
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
											onClick={() =>
												setCurrentPage(pageNum)
											}>
											{pageNum}
										</button>
									);
								},
							)}
							<button
								className='px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50'
								disabled={
									currentPage === totalPages ||
									totalPages === 0
								}
								onClick={() => setCurrentPage(currentPage + 1)}>
								Next
							</button>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default ListAcademicYear;
