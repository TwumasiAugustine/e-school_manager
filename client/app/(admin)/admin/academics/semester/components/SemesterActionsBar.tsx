'use client';
import React from 'react';
import { FiRefreshCw, FiGrid, FiDownload } from 'react-icons/fi';

interface SemesterActionsBarProps {
	onRefresh?: () => void;
	onExport?: () => void;
	onViewChange?: (view: 'grid' | 'list') => void;
	currentView?: 'grid' | 'list';
	onSearch?: (query: string) => void;
	searchQuery?: string;
	onFilterChange?: (filter: 'all' | 'trashed') => void;
	currentFilter?: 'all' | 'trashed';
}

const SemesterActionsBar: React.FC<SemesterActionsBarProps> = ({
	onRefresh,
	onExport,
	onViewChange,
	currentView = 'list',
	onFilterChange,
	currentFilter = 'all',
}) => {
	return (
		<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 px-2 sm:px-4'>
			<div className='flex flex-wrap gap-2 bg-white shadow-md rounded-xl p-2 sm:p-3'>
				<button
					onClick={onRefresh}
					className='flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-300'
					aria-label='Refresh'
					type='button'
				>
					<FiRefreshCw size={20} />
					<span className='hidden sm:inline text-sm font-medium'>
						Refresh
					</span>
				</button>
				<button
					onClick={() =>
						onViewChange &&
						onViewChange(currentView === 'list' ? 'grid' : 'list')
					}
					className='flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-300'
					aria-label='Toggle view'
					type='button'
					disabled={!onViewChange}
				>
					<FiGrid size={20} />
					<span className='hidden sm:inline text-sm font-medium'>
						{currentView === 'list' ? 'Grid' : 'List'}
					</span>
				</button>
				<button
					onClick={onExport}
					className='flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-300'
					aria-label='Export data'
					type='button'
				>
					<FiDownload size={20} />
					<span className='hidden sm:inline text-sm font-medium'>
						Export
					</span>
				</button>
				{onFilterChange && (
					<div className='flex items-center text-sm font-medium'>
						<button
							onClick={() => onFilterChange('all')}
							className={`px-3 py-2 rounded-l-md transition-colors ${
								currentFilter === 'all'
									? 'bg-slate-700 text-white'
									: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
							}`}
						>
							All
						</button>
						<button
							onClick={() => onFilterChange('trashed')}
							className={`px-3 py-2 rounded-r-md transition-colors ${
								currentFilter === 'trashed'
									? 'bg-slate-700 text-white'
									: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
							}`}
						>
							Trashed
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default SemesterActionsBar;
