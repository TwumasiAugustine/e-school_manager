'use client';
import React, { useState, useEffect } from 'react';
import type { Semester } from '@/types/semester';
import MultiSelect from '@/components/MultiSelect';

interface AcademicYearFormProps {
	onSubmit: (semester: { name: string; startMonth: string; endMonth: string, system: 'semester' | 'term' }) => void;
	onCancel?: () => void;
	semester?: Semester | null;
	mode?: 'create' | 'edit';
}

const AcademicYearForm: React.FC<AcademicYearFormProps> = ({
	onSubmit,
	onCancel,
	semester,
	mode = 'create',
}) => {
	const [name, setName] = useState('');
	const [baseName, setBaseName] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [system, setSystem] = useState<'semester' | 'term'>('semester');

	const termOptions = ['First Term', 'Second Term', 'Third Term'];
	const semesterOptions = ['First Semester', 'Second Semester'];
	const systemOptions = ['semester', 'term'];

	useEffect(() => {
		if (semester && mode === 'edit') {
			// When editing, we need to deconstruct the name
			const nameParts = semester.name.split(',');
			setBaseName(nameParts[0]?.trim() || '');
			setName(semester.name || '');
			setStartDate(semester.startMonth || '');
			setEndDate(semester.endMonth || '');
			setSystem(semester.system || 'semester');
		} else {
			handleReset();
		}
	}, [semester, mode]);

	useEffect(() => {
		if (baseName && startDate && endDate) {
			const startYear = new Date(startDate).getFullYear();
			const endYear = new Date(endDate).getFullYear();
			if (!isNaN(startYear) && !isNaN(endYear)) {
				setName(`${baseName}, ${startYear}-${endYear}`);
			} else {
				setName('');
			}
		} else {
			setName('');
		}
	}, [baseName, startDate, endDate]);

	const handleReset = () => {
		setName('');
		setBaseName('');
		setStartDate('');
		setEndDate('');
		setSystem('semester');
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !startDate || !endDate) return;
		onSubmit({
			name: name.trim(),
			startMonth: startDate,
			endMonth: endDate,
			system,
		});
		if (mode === 'create') handleReset();
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='space-y-6 flex flex-col'>
			<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
				<div className='flex flex-col gap-1.5'>
					<MultiSelect
						label='System'
						options={systemOptions}
						onChange={(selected) => {
							setSystem((selected[0] as 'semester' | 'term') || 'semester');
							setBaseName(''); // Reset baseName when system changes
						}}
						maxSelected={1}
						required
						value={system ? [system] : []}
					/>
				</div>
				<div className='flex flex-col gap-1.5'>
					<MultiSelect
						label='Name'
						options={system === 'term' ? termOptions : semesterOptions}
						onChange={(selected) => setBaseName(selected[0] || '')}
						maxSelected={1}
						required
						value={baseName ? [baseName] : []}
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

			{name && (
				<div className='mt-4 p-3 bg-gray-100 rounded-md'>
					<p className='text-sm text-gray-600'>
						<span className='font-semibold'>Preview:</span> {name}
					</p>
				</div>
			)}

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
					{mode === 'edit' ? 'Update' : 'Create'} {system === 'term' ? 'Term' : 'Semester'}
				</button>
			</div>
		</form>
	);
};

export default AcademicYearForm;
