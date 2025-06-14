'use client';
import React, { useState, useEffect } from 'react';
import type { Class, Teacher } from '@/types/class';

interface ClassFormProps {
	onSubmit: (cls: Class) => void;
	onCancel?: () => void;
	teachers: Teacher[];
	classObj?: Class | null;
	mode?: 'create' | 'edit';
}

const ClassForm: React.FC<ClassFormProps> = ({
	onSubmit,
	onCancel,
	teachers,
	classObj,
	mode = 'create',
}) => {
	const [name, setName] = useState('');
	const [teacherId, setTeacherId] = useState('');
	const [tuitionFee, setTuitionFee] = useState('');

	useEffect(() => {
		if (classObj) {
			setName(classObj.name || '');
			setTeacherId(classObj.teacherId || '');
			setTuitionFee(classObj.tuitionFee?.toString() || '');
		} else {
			handleReset();
		}
	}, [classObj]);

	const handleReset = () => {
		setName('');
		setTeacherId('');
		setTuitionFee('');
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !teacherId || !tuitionFee) return;
		onSubmit({
			id: classObj?.id || Date.now(),
			name: name.trim(),
			teacherId,
			tuitionFee: parseFloat(tuitionFee),
		});
		if (mode === 'create') handleReset();
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='space-y-4 flex flex-col'>
			<div className='flex flex-col md:flex-row gap-4'>
				<div className='flex-1 flex flex-col gap-2'>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Name <span className='text-red-500'>*</span>
					</label>
					<input
						type='text'
						className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700'
						placeholder='Class Name'
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className='flex-1 flex flex-col gap-2'>
					<label
						htmlFor='teacher-select'
						className='block text-sm font-medium text-gray-700 mb-1'>
						Teacher <span className='text-red-500'>*</span>
					</label>
					<select
						id='teacher-select'
						className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700 bg-white'
						value={teacherId}
						onChange={(e) => setTeacherId(e.target.value)}
						required>
						<option value=''>Select a teacher</option>
						{teachers.map((teacher) => (
							<option
								key={teacher.id}
								value={teacher.id}>
								{teacher.name}
							</option>
						))}
					</select>
				</div>
				<div className='flex-1 flex flex-col gap-2'>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Tuition Fee <span className='text-red-500'>*</span>
					</label>
					<input
						type='number'
						min='0'
						step='0.01'
						className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700'
						placeholder='Tuition Fee'
						value={tuitionFee}
						onChange={(e) => setTuitionFee(e.target.value)}
						required
					/>
				</div>
			</div>
			<div className='flex gap-2 mt-4'>
				{onCancel && (
					<button
						type='button'
						className='bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-gray-400'
						onClick={() => {
							handleReset();
							onCancel();
						}}>
						Cancel
					</button>
				)}
				<button
					type='button'
					className='bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-gray-400'
					onClick={handleReset}>
					Reset
				</button>
				<button
					type='submit'
					className='bg-emerald-900 hover:bg-emerald-800 text-white font-semibold px-6 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-emerald-500'>
					{mode === 'edit' ? 'Update' : 'Submit'}
				</button>
			</div>
		</form>
	);
};

export default ClassForm;
