import React from 'react';
import StatCard from '@/components/StatCard';
import WelcomeBanner from '@/components/WelcomeBanner';
import StatisticsChart from '@/components/StatisticsChart';
import FeeSummaryCard from '@/components/FeeSummaryCard';
import SMSGatewayCard from '@/components/SMSGatewayCard';

// Import icons from react-icons
import {
	FaUsers,
	FaUserGraduate,
	FaMoneyBillWave,
	FaChartLine,
} from 'react-icons/fa';

const DashboardGrid: React.FC = () => {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5'>
			{/* Stat Cards Row */}
			<StatCard
				title='Total Staff'
				value='0'
				subTitle='This Month'
				subValue='0'
				bgColor='bg-indigo-600'
				textColor='text-white'
				icon={<FaUsers className='h-8 w-8' />}
			/>
			<StatCard
				title='Total Students'
				value='0'
				subTitle='This Month'
				subValue='0'
				bgColor='bg-indigo-400'
				textColor='text-white'
				icon={<FaUserGraduate className='h-8 w-8' />}
			/>
			<StatCard
				title='Revenue'
				value='0'
				subTitle='This Month'
				subValue='$ 0'
				bgColor='bg-red-400'
				textColor='text-white'
				icon={<FaMoneyBillWave className='h-8 w-8' />}
			/>
			<StatCard
				title='Total Profit'
				value='0'
				subTitle='This Month'
				subValue='$ 0'
				bgColor='bg-blue-500'
				textColor='text-white'
				icon={<FaChartLine className='h-8 w-8' />}
			/>

			{/* Welcome Banner - Full Width */}
			<div className='md:col-span-2 lg:col-span-3'>
				<WelcomeBanner isVerified={false} />
			</div>

			{/* Fee Summary Card - Right Column */}
			<div className='md:col-span-2 lg:col-span-1'>
				<FeeSummaryCard />
			</div>

			{/* Statistics Chart - Full Width or Left Wide Column */}
			<div className='md:col-span-2 lg:col-span-3'>
				<StatisticsChart />
			</div>

			{/* SMS Gateway Card - Right Column */}
			<div className='md:col-span-2 lg:col-span-1'></div>
			<SMSGatewayCard />
		</div>
	);
};

export default DashboardGrid;
