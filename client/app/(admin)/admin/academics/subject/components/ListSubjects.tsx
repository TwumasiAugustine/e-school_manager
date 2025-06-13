/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState} from 'react';
import HeadingWithBadge from '@/components/HeadingWithBadge';
import EmptyState from '@/components/EmptyState';
import {
	FiEdit2,
	FiTrash2,
	FiSearch,
} from 'react-icons/fi';
import Image from 'next/image';
import type { Subject } from '@/types/subject';
import { FiX as FiXIcon } from 'react-icons/fi';
import SubjectsActionsBar from './SubjectsActionsBar';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import SubjectForm from './SubjectForm';

interface ListSubjectsProps {
	subjects: Subject[];
	onEdit: (subject: Subject) => void;
	onRequestDelete: (subject: Subject) => void;
}

const ListSubjects: React.FC<ListSubjectsProps> = ({
	subjects,
	onEdit,
	onRequestDelete,
}) => {
	const [tab, setTab] = useState<'all' | 'trashed'>('all');
	const [search, setSearch] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [view, setView] = useState<'list' | 'grid'>('list');
	const [loading, setLoading] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

	const filtered = subjects.filter(
		(s) =>
			(tab === 'all' ? !s.trashed : s.trashed) &&
			(!search ||
				s.name.toLowerCase().includes(search.toLowerCase()) ||
				s.code.toLowerCase().includes(search.toLowerCase())),
	);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const paginatedSubjects = filtered.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filtered.length / itemsPerPage);

	// Export subjects to CSV
	const handleExport = () => {
		const headers = ['No.', 'Name', 'Code', 'Color', 'Type'];
		const rows = filtered.map((s, idx) => [
			(idx + 1).toString(),
			s.name,
			s.code,
			s.bgColor || '',
			s.type,
		]);
		const csvContent = [headers, ...rows]
			.map((r) =>
				r
					.map((field) => `"${field.replace(/"/g, '""')}`)
					.join(','),
			)
			.join('\n');
		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'subjects.csv';
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
		// Simulate async reload (replace with real API call if needed)
		setTimeout(() => {
			setLoading(false);
		}, 1000);
	};

	// View change toggles view state (stub for now)
	const handleViewChange = (v: 'grid' | 'list') => {
		setView(v);
		// Optionally, implement grid view rendering
	};

	const handleEdit = (subject: Subject) => {
		setEditingSubject(subject);
		setEditModalOpen(true);
	};

	const handleUpdate = (updated: Subject) => {
		// Update the subject in the list (parent should handle in real app)
		if (typeof window !== 'undefined') {
			// If this is a demo, update locally
			if (typeof onEdit === 'function') onEdit(updated);
		}
		setEditModalOpen(false);
		setEditingSubject(null);
	};

	const handleEditCancel = () => {
		setEditModalOpen(false);
		setEditingSubject(null);
	};

	return (
		<div className='bg-white rounded-lg shadow p-6'>
			<div className='mb-2'>
				<HeadingWithBadge
					title='List Subject'
					count={filtered.length}
					level='h3'
				/>
				<SubjectsActionsBar
					onRefresh={handleRefresh}
					onExport={handleExport}
					onViewChange={handleViewChange}
				/>
				<Modal isOpen={editModalOpen} onClose={handleEditCancel} title='Edit Subject' size='lg'>
					<SubjectForm
						subject={editingSubject}
						mode='edit'
						onSubmit={handleUpdate}
						onCancel={handleEditCancel}
					/>
				</Modal>
			</div>
			<div className='relative mb-3 flex flex-col md:flex-row md:items-center md:space-x-3 gap-2'>
                <div className='relative flex-1 max-w-full md:max-w-[400px] w-full'>
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'>
                        <FiSearch />
                    </span>
                    <input
                        type='text'
                        placeholder='Search subjects by name or code...'
                        className='w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 transition-all shadow-sm placeholder-gray-400'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label='Search subjects'
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
						onChange={(e) => setTab(e.target.value as 'all' | 'trashed')}
						aria-label='Filter by status'
					>
						<option value='all'>All</option>
						<option value='trashed'>Trashed</option>
					</select>
				</div>
			</div>
			<div className='relative'>
				{loading && (
					<div className='absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-80 rounded-lg'>
						<Loading message='Refreshing subjects...' size='medium' />
					</div>
				)}
				<div className='overflow-x-auto max-h-96 rounded-lg border border-gray-100'>
					{filtered.length === 0 ? (
						<EmptyState
							title='No subjects found'
							message='There are no subjects to display. Create a new subject to get started.'
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
										Subject Code
									</th>
									<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
										Color
									</th>
									<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
										Image
									</th>
									<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
										Type
									</th>
									<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{paginatedSubjects.map((subject, idx) => (
									<tr
										key={subject.id}
										className='border-t border-gray-100 hover:bg-emerald-50 transition-colors'>
										<td className='px-4 py-2'>
											{indexOfFirstItem + idx + 1}
										</td>
										<td className='px-4 py-2'>
											{subject.name}
										</td>
										<td className='px-4 py-2'>
											{subject.code}
										</td>
										<td className='px-4 py-2'>
											<div className='flex items-center gap-2'>
												{subject.bgColor ? (
													<span
														title={subject.bgColor}
														className='w-6 h-6 rounded-full border border-gray-200 shadow-sm'
														style={{
															backgroundColor:
																subject.bgColor,
														}}
													/>
												) : (
													<span className='w-6 h-6 rounded-full border border-gray-200 bg-gray-100' />
												)}
												<span className='text-xs text-gray-500 select-all'>
													{subject.bgColor || '-'}
												</span>
											</div>
										</td>
										<td className='px-4 py-2'>
											<span className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100'>
												<Image
													width={28}
													height={28}
													src={subject.image}
													alt={subject.name}
													className='w-7 h-7 object-contain'
												/>
											</span>
										</td>
										<td className='px-4 py-2'>
											{subject.type}
										</td>
										<td className='px-4 py-2 flex space-x-2'>
											<button
												className='bg-purple-300 hover:bg-purple-400 text-white p-2 rounded-full transition-colors duration-150'
												title='Edit'
												onClick={() => handleEdit(subject)}>
												<FiEdit2 />
											</button>
											<button
												className='bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors duration-150'
												title='Delete'
												onClick={() =>
													onRequestDelete(subject)
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
				{/* Pagination Controls */}
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
							{filtered.length > 0 ? indexOfFirstItem + 1 : 0}-
							{Math.min(indexOfLastItem, filtered.length)} of{' '}
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
										onClick={() => setCurrentPage(pageNum)}>
										{pageNum}
									</button>
								);
							},
						)}
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
		</div>
	);
};

export default ListSubjects;
