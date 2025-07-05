import React, { useState } from 'react';

interface CreateSectionProps {
	onAdd: (name: string) => Promise<void>;
}

const CreateSection: React.FC<CreateSectionProps> = ({ onAdd }) => {
	const [name, setName] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || isLoading) return;

		setIsLoading(true);
		try {
			await onAdd(name.trim());
			setName('');
		} catch (error) {
			console.error('Error creating section:', error);
		}
		setIsLoading(false);
	};

	return (
		<div className='bg-white rounded-lg shadow p-6'>
			<h3 className='text-lg font-semibold mb-4 text-gray-800'>
				Create Section
			</h3>
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
						placeholder='Name'
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>{' '}
				<button
					type='submit'
					disabled={isLoading}
					className='bg-emerald-900 hover:bg-emerald-800 disabled:bg-gray-400 text-white font-semibold px-6 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-emerald-500'>
					{isLoading ? 'Creating...' : 'Submit'}
				</button>
			</form>
		</div>
	);
};

export default CreateSection;
