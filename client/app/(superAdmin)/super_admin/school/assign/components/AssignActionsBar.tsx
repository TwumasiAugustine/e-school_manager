import React from 'react';
import {
	FiRefreshCw,
	FiGrid,
	FiList,
	FiSearch,
	FiDownload,
} from 'react-icons/fi';

interface AssignActionsBarProps {
	onRefresh: () => void;
	onViewChange: (view: 'grid' | 'list') => void;
	searchTerm: string;
	onSearchChange: (value: string) => void;
	view: 'grid' | 'list';
	onExport: (type: string) => void;
}

const AssignActionsBar: React.FC<AssignActionsBarProps> = ({
	onRefresh,
	onViewChange,
	searchTerm,
	onSearchChange,
	view,
	onExport,
}) => {
	return (
		<div className='w-full px-2 sm:px-4 mb-4'>
			<div className='flex flex-col sm:flex-row justify-between sm:items-center gap-4 w-full'>
				<div className='flex items-center space-x-2 shadow-sm shadow-gray-200 p-1 rounded-md'>
					<button
						className='flex items-center gap-2 p-3 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-300'
						title='Refresh'
						aria-label='Refresh'
						onClick={onRefresh}>
						<FiRefreshCw size={20} />
						<span className='hidden sm:inline text-sm font-medium'>
							Refresh
						</span>
					</button>
					<button
						type='button'
						className='flex items-center gap-2 p-3 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-300'
						title='Grid/List View'
						aria-label='Toggle view mode'
						onClick={() =>
							onViewChange(view === 'grid' ? 'list' : 'grid')
						}>
						{view === 'grid' ? (
							<>
								<FiList size={20} />
								<span className='hidden sm:inline text-sm font-medium'>
									List
								</span>
							</>
						) : (
							<>
								<FiGrid size={20} />
								<span className='hidden sm:inline text-sm font-medium'>
									Grid
								</span>
							</>
						)}
					</button>
					<button
						type='button'
						className='flex items-center gap-2 p-3 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-300'
						title='Export CSV'
						aria-label='Export CSV'
                        onClick={() => onExport('csv')}>
                        <FiDownload size={20}/>
						<span className='text-sm font-medium'>Export</span>
					</button>
				</div>
				<div className='w-full sm:w-1/3'>
					<div className='relative'>
						<input
							type='text'
							className='w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500'
							placeholder='Search schools or admins...'
							value={searchTerm}
							onChange={(e) => onSearchChange(e.target.value)}
						/>
						<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
							<FiSearch className='h-5 w-5 text-emerald-400' />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AssignActionsBar;
