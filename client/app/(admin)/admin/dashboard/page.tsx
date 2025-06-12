import React from 'react';
import DashboardGrid from './components/DashboardGrid';
import DateTimeDisplay from '@/components/DateTimeDisplay';

const AdminDashboard = () => {
	return (
		<div className='p-2 sm:p-4 max-w-full'>
			<div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4 md:mb-6'>
				<h1 className='text-lg sm:text-xl md:text-2xl font-bold'>
					 Admin Dashboard
				</h1>
				<DateTimeDisplay />
			</div>
			<div className='w-full overflow-x-auto'>
				<DashboardGrid />
			</div>
		</div>
	);
};

export default AdminDashboard;
