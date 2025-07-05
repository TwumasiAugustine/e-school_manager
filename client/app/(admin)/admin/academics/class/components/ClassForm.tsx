import React, { useState, useEffect } from 'react';
import type { Class, Teacher } from '@/types/class';
import MultiSelect from '@/components/MultiSelect';

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
	// Removed unused teacherId state
	const [tuitionFee, setTuitionFee] = useState('');
	const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
	useEffect(() => {
		if (classObj) {
			setName(classObj.name || '');
			setTuitionFee(classObj.tuitionFee?.toString() || '');
			setSelectedTeachers(
				classObj.classTeacher ? [classObj.classTeacher] : [],
			);
		} else {
			handleReset();
		}
	}, [classObj]);
	const handleReset = () => {
		setName('');
		setTuitionFee('');
		setSelectedTeachers([]);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!name.trim() || selectedTeachers.length === 0 || !tuitionFee)
			return;
		onSubmit({
			id: classObj?.id || `cls-${Date.now()}`,
			name: name.trim(),
			classTeacher: selectedTeachers[0],
			tuitionFee: parseFloat(tuitionFee),
			grade: '10', // Default or from form
			section: 'A', // Default or from form
			academicYear: '2024-2025', // Default or from form
			branch: 'main', // Default or from form
			students: [],
			capacity: 30, // Default or from form
			currentStrength: 0,
			status: 'active' as const,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});
		if (mode === 'create') handleReset();
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='space-y-6 flex flex-col'>
			<div className='flex flex-col gap-6'>
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Name <span className='text-red-500'>*</span>
					</label>
					<input
						type='text'
						className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700 bg-white'
						placeholder='Class Name'
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div>
					<MultiSelect
					required={true}
						label="Teacher"
						options={teachers.map((t) => t.name)}
						placeholder='Search and select teacher...'
						onChange={(selected) => {
							setSelectedTeachers(selected);
							// setTeacherId(
							// 	teachers.find((t) => t.name === selected[0])
							// 		?.id || '',
							// );
						}}
						maxSelected={1}
					/>
				</div>
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Tuition Fee <span className='text-red-500'>*</span>
					</label>
					<input
						type='number'
						min='0'
						step='0.01'
						className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700 bg-white'
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
