import React, { useState } from 'react';
import { Class, Teacher } from '@/types/class';
import HeadingWithBadge from '@/components/HeadingWithBadge'; // Added import
import { FiPlusCircle } from 'react-icons/fi'; // Added import for icon

interface CreateClassProps {
	teachers: Teacher[];
	onAdd: (newClass: Class) => void;
}

const CreateClass: React.FC<CreateClassProps> = ({ teachers, onAdd }) => {
	const [name, setName] = useState('');
	const [teacherId, setTeacherId] = useState('');
	const [tuitionFee, setTuitionFee] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !teacherId || !tuitionFee) return;
		onAdd({
			id: Date.now(),
			name: name.trim(),
			teacherId,
			tuitionFee: parseFloat(tuitionFee),
		});
		setName('');
		setTeacherId('');
		setTuitionFee('');
	};

	return (
		<div className='bg-white rounded-lg shadow p-6'>
			<HeadingWithBadge 
				title="Create Class"
				icon={FiPlusCircle}
				iconColor="text-emerald-500"
				level='h3' // or 'h2' based on desired styling/semantics
				className="mb-4" // Added margin bottom to match original h3
			/>
			<form
				onSubmit={handleSubmit}
				className='space-y-4'>
				<div>
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
				<div>
					<label htmlFor='teacher-select' className='block text-sm font-medium text-gray-700 mb-1'>
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
				<div>
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
				<button
					type='submit'
					className='bg-emerald-900 hover:bg-emerald-800 text-white font-semibold px-6 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-emerald-500'
					disabled={teachers.length === 0}>
					Submit
				</button>
			</form>
		</div>
	);
};

export default CreateClass;
