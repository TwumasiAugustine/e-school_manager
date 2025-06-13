'use client';
import React, { useState, useEffect } from 'react';
import { FiUpload } from 'react-icons/fi';
import type { Subject } from '@/types/subject';

const TYPES = ['Theory', 'Practical'];

interface SubjectFormProps {
	onSubmit: (subject: Subject) => void;
	onCancel?: () => void;
	subject?: Subject | null;
	mode?: 'create' | 'edit';
}

const SubjectForm: React.FC<SubjectFormProps> = ({
	onSubmit,
	onCancel,
	subject,
	mode = 'create',
}) => {
	const [name, setName] = useState('');
	const [type, setType] = useState('');
	const [code, setCode] = useState('');
	const [bgColor, setBgColor] = useState('');
	const [image, setImage] = useState('');
	const [imageFile, setImageFile] = useState<File | null>(null);

	useEffect(() => {
		if (subject) {
			setName(subject.name || '');
			setType(subject.type || '');
			setCode(subject.code || '');
			setBgColor(subject.bgColor || '');
			setImage(subject.image || '');
			setImageFile(null);
		} else {
			handleReset();
		}
		 
	}, [subject]);

	const handleReset = () => {
		setName('');
		setType('');
		setCode('');
		setBgColor('');
		setImage('');
		setImageFile(null);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name || !type || !bgColor || !image) return;
		onSubmit({
			id: subject?.id || Date.now(),
			name,
			code,
			type,
			bgColor,
			image,
		});
		if (mode === 'create') handleReset();
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			setImage(URL.createObjectURL(file));
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='space-y-4 flex flex-col'>
			<div className='text-sm text-pink-500 mb-2'>
				Note : Subject Name, Code & Type should be Unique
			</div>
			<div className='flex flex-col md:flex-row gap-4'>
				<div className='flex-1 flex flex-col gap-2'>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Type <span className='text-red-500'>*</span>
					</label>
					<div className='flex gap-6'>
						{TYPES.map((t) => (
							<label
								key={t}
								className='flex items-center cursor-pointer gap-1.5 text-base text-gray-700'>
								<input
									type='radio'
									name='type'
									value={t}
									checked={type === t}
									onChange={() => setType(t)}
									className='accent-purple-400 w-4 h-4'
									required
								/>
								{t}
							</label>
						))}
					</div>
				</div>
			</div>
			<div className='flex flex-col md:flex-row gap-4'>
				<div className='flex-1 flex flex-col gap-2'>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Name <span className='text-red-500'>*</span>
					</label>
					<input
						type='text'
						className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700'
						placeholder='Name'
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className='flex-1 flex flex-col gap-2'>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Subject Code
					</label>
					<input
						type='text'
						className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700'
						placeholder='Subject Code'
						value={code}
						onChange={(e) => setCode(e.target.value)}
					/>
				</div>
			</div>
			<div className='flex flex-col md:flex-row gap-4'>
				<div className='flex-1 flex flex-col gap-2'>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Background Color <span className='text-red-500'>*</span>
					</label>
					<div className='flex items-center gap-2'>
						<input
							type='text'
							className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700'
							placeholder='Background Color'
							value={bgColor}
							onChange={(e) => setBgColor(e.target.value)}
							required
						/>
						<input
							type='color'
							className='w-10 h-10 border border-gray-300 rounded'
							value={bgColor || '#000000'}
							onChange={(e) => setBgColor(e.target.value)}
							title='Pick a background color'
						/>
					</div>
				</div>
				<div className='flex-1 flex flex-col gap-2'>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Image <span className='text-red-500'>*</span>
					</label>
					<div className='flex gap-2'>
						<input
							type='text'
							className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700'
							placeholder='Image'
							value={image}
							onChange={(e) => setImage(e.target.value)}
							required
							readOnly={!!imageFile}
						/>
						<label className='inline-flex items-center'>
							<input
								type='file'
								accept='image/*'
								className='hidden'
								onChange={handleImageUpload}
							/>
							<span className='bg-emerald-900 hover:bg-emerald-800 text-white font-semibold px-6 py-2 rounded-md shadow cursor-pointer flex items-center'>
								<FiUpload className='mr-2' /> Upload
							</span>
						</label>
					</div>
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

export default SubjectForm;
