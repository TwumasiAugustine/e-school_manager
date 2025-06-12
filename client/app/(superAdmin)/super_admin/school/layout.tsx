'use client';

import React from 'react';

interface LayoutProps {
	children: React.ReactNode;
}

const SchoolLayout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className='bg-gray-50 min-h-screen w-full'>
			<div className='container mx-auto  py-6'>
				<div className='mb-6'>
					<h1 className='text-2xl font-bold text-gray-800'>
						School Management
					</h1>
					<p className='text-gray-600'>
						Manage all registered schools in the system
					</p>
				</div>
				{children}
			</div>
		</div>
	);
};

export default SchoolLayout;
