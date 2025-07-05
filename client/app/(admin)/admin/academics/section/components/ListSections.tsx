import React from 'react';
import { FiEdit2, FiTrash2, FiSearch, FiX as FiXIcon } from 'react-icons/fi';
import EmptyState from '@/components/EmptyState';
import SectionsActionsBar from './SectionsActionsBar';
import HeadingWithBadge from '@/components/HeadingWithBadge';
import Loading from '@/components/Loading';


interface Section {
	id: string;
	name: string;
	trashed?: boolean;
}

interface ListSectionsProps {
	sections: Section[];
	tab: 'all' | 'trashed';
	search: string;
	currentPage: number;
	itemsPerPage: number;
	editingId: string | null;
	editName: string;
	onEdit: (id: string, name: string) => void;
	onEditChange: (name: string) => void;
	onEditSubmit: (id: string) => void;
	onDelete: (id: string) => void;
	onRestore: (id: string) => void;
	onTabChange: (tab: 'all' | 'trashed') => void;
	onSearchChange: (search: string) => void;
	onPageChange: (page: number) => void;
	onItemsPerPageChange: (n: number) => void;
	loading?: boolean;
	onRefresh?: () => void;
	onExport?: () => void;
	onViewChange?: (view: 'grid' | 'list') => void;
}

const ListSections: React.FC<ListSectionsProps> = ({
	sections,
	tab,
	search,
	currentPage,
	itemsPerPage,
	editingId,
	editName,
	onEdit,
	onEditChange,
	onEditSubmit,
	onDelete,
	onRestore,
	onTabChange,
	onSearchChange,
	onPageChange,
	onItemsPerPageChange,
	loading = false,
	onRefresh,
	onExport,
	onViewChange,
}) => {
	const filteredSections = sections.filter(
		(s) =>
			(tab === 'all' ? !s.trashed : s.trashed) &&
			(!search || s.name.toLowerCase().includes(search.toLowerCase())),
	);
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const paginatedSections = filteredSections.slice(
		indexOfFirstItem,
		indexOfLastItem,
	);
	const totalPages = Math.ceil(filteredSections.length / itemsPerPage);
	// Show toast helpers
	const handleEditSubmitWithToast = (id: string) => {
		onEditSubmit(id);
	};
	const handleDeleteWithToast = (id: string) => {
		onDelete(id);
	};
	const handleRestoreWithToast = (id: string) => {
		onRestore(id);
	};

	return (
		<div className='bg-white rounded-lg shadow p-6 relative'>
			<div className='flex items-center justify-between mb-4'>
				<HeadingWithBadge
					title='List Section'
					count={filteredSections.length}
					level='h3'
				/>
			</div>
			<SectionsActionsBar
				onRefresh={onRefresh}
				onExport={onExport}
				onViewChange={onViewChange}
			/>
			<div className='mb-3 flex flex-col md:flex-row md:items-center md:space-x-3 gap-2'>
				<div className='relative flex-1 max-w-full md:max-w-[400px] w-full'>
					<span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'>
						<FiSearch />
					</span>
					<input
						type='text'
						placeholder='Search sections by name...'
						className='w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 transition-all shadow-sm placeholder-gray-400'
						value={search}
						onChange={(e) => onSearchChange(e.target.value)}
						aria-label='Search sections'
					/>
					{search && (
						<button
							type='button'
							className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none'
							onClick={() => onSearchChange('')}
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
							onTabChange(e.target.value as 'all' | 'trashed')
						}
						aria-label='Filter by status'>
						<option value='all'>All</option>
						<option value='trashed'>Trashed</option>
					</select>
				</div>
			</div>
			<div className='overflow-x-auto relative'>
				{loading && (
					<div className='absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70 rounded-md'>
						<Loading
							message='Refreshing sections...'
							size='medium'
						/>
					</div>
				)}
				{filteredSections.length === 0 ? (
					<EmptyState
						title='No sections found'
						message='There are no sections to display. Create a new section to get started.'
					/>
				) : (
					<>
						<table className='min-w-full border border-gray-200 rounded-md'>
							<thead>
								<tr className='bg-gray-50'>
									<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
										No.
									</th>
									<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
										Name
									</th>
									<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{paginatedSections.map((section, idx) => (
									<tr
										key={section.id}
										className='border-t border-gray-100 hover:bg-emerald-50 transition-colors'>
										<td className='px-4 py-2'>
											{indexOfFirstItem + idx + 1}
										</td>
										<td className='px-4 py-2'>
											{editingId === section.id ? (
												<input
													type='text'
													className='border border-gray-300 rounded px-2 py-1 text-sm focus:ring-emerald-500 focus:border-emerald-500'
													value={editName}
													onChange={(e) =>
														onEditChange(
															e.target.value,
														)
													}
													onBlur={() =>
														handleEditSubmitWithToast(
															section.id,
														)
													}
													onKeyDown={(e) => {
														if (e.key === 'Enter')
															handleEditSubmitWithToast(
																section.id,
															);
													}}
													autoFocus
													placeholder='Section name'
													aria-label='Edit section name'
												/>
											) : (
												section.name
											)}
										</td>
										<td className='px-4 py-2 flex space-x-2'>
											{tab === 'trashed' ? (
												<button
													className='bg-emerald-400 hover:bg-emerald-500 text-white p-2 rounded-full'
													title='Restore'
													onClick={() =>
														handleRestoreWithToast(
															section.id,
														)
													}>
													Restore
												</button>
											) : (
												<>
													<button
														className='bg-purple-300 hover:bg-purple-400 text-white p-2 rounded-full'
														title='Edit'
														onClick={() =>
															onEdit(
																section.id,
																section.name,
															)
														}>
														<FiEdit2 />
													</button>
													<button
														className='bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full'
														title='Delete'
														onClick={() =>
															handleDeleteWithToast(
																section.id,
															)
														}>
														<FiTrash2 />
													</button>
												</>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{/* Pagination Controls */}
						<div className='mt-4 flex flex-col md:flex-row justify-between items-center gap-2'>
							<div className='flex items-center mb-2 md:mb-0'>
								<span className='text-sm text-gray-700 mr-2'>
									Rows per page:
								</span>
								<select
									className='border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500'
									value={itemsPerPage}
									onChange={(e) =>
										onItemsPerPageChange(
											Number(e.target.value),
										)
									}
									title='Select rows per page'>
									<option value={5}>5</option>
									<option value={10}>10</option>
									<option value={25}>25</option>
									<option value={50}>50</option>
								</select>
								<span className='ml-4 text-sm text-gray-700'>
									Showing{' '}
									{filteredSections.length > 0
										? indexOfFirstItem + 1
										: 0}
									-
									{Math.min(
										indexOfLastItem,
										filteredSections.length,
									)}{' '}
									of {filteredSections.length}
								</span>
							</div>
							<div className='flex items-center space-x-1'>
								<button
									className='px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50'
									disabled={currentPage === 1}
									onClick={() =>
										onPageChange(currentPage - 1)
									}>
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
										} else if (
											currentPage >=
											totalPages - 2
										) {
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
													onPageChange(pageNum)
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
									onClick={() =>
										onPageChange(currentPage + 1)
									}>
									Next
								</button>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default ListSections;
