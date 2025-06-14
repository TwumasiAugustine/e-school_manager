'use client';
import React, { useState, useEffect } from 'react';
import type { Semester } from '@/types/semester';

interface SemesterFormProps {
	onSubmit: (semester: { name: string; startMonth: string; endMonth: string }) => void;
	onCancel?: () => void;
	semester?: Semester | null;
	mode?: 'create' | 'edit';
}

const SemesterForm: React.FC<SemesterFormProps> = ({
	onSubmit,
	onCancel,
	semester,
	mode = 'create',
}) => {
	const [name, setName] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');

	useEffect(() => {
		if (semester && mode === 'edit') {
			setName(semester.name || '');
			setStartDate(semester.startMonth || '');
			setEndDate(semester.endMonth || '');
		} else {
			handleReset();
		}
	}, [semester, mode]);

	const handleReset = () => {
		setName('');
		setStartDate('');
		setEndDate('');
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !startDate || !endDate) return;
		onSubmit({
			name: name.trim(),
			startMonth: startDate,
			endMonth: endDate,
		});
		if (mode === 'create') handleReset();
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='space-y-6 flex flex-col'>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<div className='flex flex-col gap-1.5'>
					<label
						htmlFor='name'
						className='block text-sm font-medium text-gray-700'>
						Name <span className='text-red-500'>*</span>
					</label>
					<input
						id='name'
						type='text'
						className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700'
						placeholder='E.g., First Semester, Spring 2025'
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className='flex flex-col gap-1.5'>
					<label
						htmlFor='startDate'
						className='block text-sm font-medium text-gray-700'>
						Start Date <span className='text-red-500'>*</span>
					</label>
					<input
						id='startDate'
						type='date'
						className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700 bg-white'
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						required
					/>
				</div>
				<div className='flex flex-col gap-1.5'>
					<label
						htmlFor='endDate'
						className='block text-sm font-medium text-gray-700'>
						End Date <span className='text-red-500'>*</span>
					</label>
					<input
						id='endDate'
						type='date'
						className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700 bg-white'
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						required
					/>
				</div>
			</div>
			<div className='flex justify-end gap-3 mt-6'>
				{onCancel && (
					<button
						type='button'
						className='bg-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors'
						onClick={() => {
							handleReset();
							onCancel();
						}}>
						Cancel
					</button>
				)}
				<button
					type='button'
					className='bg-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors'
					onClick={handleReset}>
					Reset
				</button>
				<button
					type='submit'
					className='bg-emerald-900 hover:bg-emerald-800 text-white font-semibold px-6 py-2.5 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors'>
					{mode === 'edit' ? 'Update Semester' : 'Create Semester'}
				</button>
			</div>
		</form>
	);
};

export default SemesterForm;
