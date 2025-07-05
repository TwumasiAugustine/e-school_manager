/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState } from 'react';
import { Class, Teacher } from '@/types/class';
import ClassActionsBar from './ClassActionsBar';
import HeadingWithBadge from '@/components/HeadingWithBadge';
import EmptyState from '@/components/EmptyState';
import Loading from '@/components/Loading';
import { FiEdit2, FiTrash2, FiSearch, FiX as FiXIcon } from 'react-icons/fi';


interface ListClassProps {
	classes: Class[];
	teachers: Teacher[];
	onEdit?: (cls: Class) => void;
	onRequestDelete?: (cls: Class) => void;
}

const ListClass: React.FC<ListClassProps> = ({
	classes,
	teachers,
	onEdit,
	onRequestDelete,
}) => {
	const [search, setSearch] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [loading, setLoading] = useState(false); // Filtering
	const filtered = classes.filter(
		(cls) =>
			!search ||
			cls.name.toLowerCase().includes(search.toLowerCase()) ||
			teachers
				.find((t) => t.id === cls.classTeacher)
				?.name.toLowerCase()
				.includes(search.toLowerCase()),
	);
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const paginatedClasses = filtered.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filtered.length / itemsPerPage);

	// Action bar handlers
	const handleRefresh = () => {
		setLoading(true);
		setSearch('');
		setCurrentPage(1);
		setTimeout(() => setLoading(false), 1000);
	};
	const handleExport = () => {
		const headers = ['No.', 'Name', 'Teacher', 'Tuition Fee'];
		const rows = filtered.map((cls, idx) => [
			(idx + 1).toString(),
			cls.name,
			teachers.find((t) => t.id === cls.classTeacher)?.name || '-',
			(cls.tuitionFee || 0).toString(),
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
		a.download = 'classes.csv';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};
	const handleViewChange = (v: 'grid' | 'list') => {};

	return (
		<div className='bg-white rounded-lg shadow p-6'>
			<div className='flex items-center justify-between mb-4'>
				<HeadingWithBadge
					title='List Class'
					count={filtered.length}
					level='h3'
				/>
			</div>
			<ClassActionsBar
				onRefresh={handleRefresh}
				onExport={handleExport}
				onViewChange={handleViewChange}
			/>
			<div className='relative mb-3 flex flex-col md:flex-row md:items-center md:space-x-3 gap-2'>
				<div className='relative flex-1 max-w-full md:max-w-[400px] w-full'>
					<span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'>
						<FiSearch />
					</span>
					<input
						type='text'
						placeholder='Search classes by name or teacher...'
						className='w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 transition-all shadow-sm placeholder-gray-400'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						aria-label='Search classes'
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
			</div>
			{/* Table container with scroll, but pagination outside */}
			<div className='relative max-h-96 min-h-[200px] overflow-x-auto overflow-y-auto rounded-lg border border-gray-100 mb-4'>
				{loading ? (
					<div className='absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70 rounded-md'>
						<Loading
							message='Refreshing classes...'
							size='medium'
						/>
					</div>
				) : filtered.length === 0 ? (
					<EmptyState
						title='No classes found'
						message='There are no classes to display. Create a new class to get started.'
					/>
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
									Teacher
								</th>
								<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
									Tuition Fee
								</th>
								<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{' '}
							{paginatedClasses.map((cls, idx) => {
								const teacher = teachers.find(
									(t) => t.id === cls.classTeacher,
								);
								return (
									<tr
										key={cls.id}
										className='border-t border-gray-100 hover:bg-emerald-50 transition-colors'>
										<td className='px-4 py-2'>
											{indexOfFirstItem + idx + 1}
										</td>
										<td className='px-4 py-2'>
											{cls.name}
										</td>
										<td className='px-4 py-2'>
											{teacher ? teacher.name : '-'}
										</td>
										<td className='px-4 py-2'>
											{(
												cls.tuitionFee || 0
											).toLocaleString(undefined, {
												style: 'currency',
												currency: 'USD',
											})}
										</td>
										<td className='px-4 py-2 flex space-x-2'>
											<button
												className='bg-purple-300 hover:bg-purple-400 text-white p-2 rounded-full transition-colors duration-150'
												title='Edit'
												onClick={() =>
													onEdit && onEdit(cls)
												}>
												<FiEdit2 />
											</button>
											<button
												className='bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors duration-150'
												title='Delete'
												onClick={() =>
													onRequestDelete &&
													onRequestDelete(cls)
												}>
												<FiTrash2 />
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>
			{/* Pagination Controls (outside scroll) */}
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
						Showing {filtered.length > 0 ? indexOfFirstItem + 1 : 0}
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
								onClick={() => setCurrentPage(pageNum)}>
								{pageNum}
							</button>
						);
					})}
					<button
						className='px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50'
						disabled={
							currentPage === totalPages || totalPages === 0
						}
						onClick={() => setCurrentPage(currentPage + 1)}>
						Next
					</button>
				</div>
			</div>
		</div>
	);
};

export default ListClass;
