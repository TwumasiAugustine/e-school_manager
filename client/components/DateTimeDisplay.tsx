'use client';

import React, { useState, useEffect } from 'react';

const DateTimeDisplay: React.FC = () => {
	const [currentDateTime, setCurrentDateTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentDateTime(new Date());
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const formatDate = (date: Date): string => {
		const options: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		};
		return date.toLocaleDateString('en-US', options);
	};

	const formatTime = (date: Date): string => {
		const options: Intl.DateTimeFormatOptions = {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: true,
		};
		return date.toLocaleTimeString('en-US', options);
	};

	return (
		<div className='flex items-center justify-end mb-6 text-emerald-700'>
			<div className='flex items-center mr-6'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-6 w-6 mr-2'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
					/>
				</svg>
				<span className='font-medium'>
					{formatDate(currentDateTime)}
				</span>
			</div>

			<div className='flex items-center'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-6 w-6 mr-2'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
					/>
				</svg>
				<span className='font-medium'>
					{formatTime(currentDateTime)}
				</span>
			</div>
		</div>
	);
};

export default DateTimeDisplay;
