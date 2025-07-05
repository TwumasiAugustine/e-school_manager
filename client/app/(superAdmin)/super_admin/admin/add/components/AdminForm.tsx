import React, { useState, useEffect } from 'react';

export interface AdminFormData {
	name: string;
	email: string;
	phone: string;
	password: string;
}

interface AdminFormProps {
	onSubmit: (data: AdminFormData) => Promise<void>;
	loading?: boolean;
	initialData?: Partial<AdminFormData>;
	title?: string;
}

const initialState: AdminFormData = {
	name: '',
	email: '',
	phone: '',
	password: '',
};

const AdminForm: React.FC<AdminFormProps> = ({
	onSubmit,
	loading,
	initialData,
	title,
}) => {
	const [form, setForm] = useState(
		initialData ? { ...initialState, ...initialData } : initialState,
	);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!form.name || !form.email || !form.phone || !form.password) {
			alert('Please fill all required fields.');
			return;
		}
		await onSubmit(form);
	};

	useEffect(() => {
		if (initialData) {
			setForm({ ...initialState, ...initialData });
		}
	}, [initialData]);

	return (
		<form
			className='bg-white rounded-lg shadow-md p-4 max-w-xl mx-auto'
			onSubmit={handleSubmit}>
			<h2 className='text-xl font-semibold mb-6 text-gray-800'>
				{title || (initialData ? 'Edit Admin' : 'Create Admin')}
			</h2>
			<div className='grid grid-cols-1 gap-6'>
				<div>
					<label className='block mb-1 font-medium text-gray-700'>
						Name <span className='text-red-500'>*</span>
					</label>
					<input
						name='name'
						value={form.name}
						onChange={handleChange}
						className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition'
						placeholder='Admin Name'
						required
					/>
				</div>
				<div>
					<label className='block mb-1 font-medium text-gray-700'>
						Email <span className='text-red-500'>*</span>
					</label>
					<input
						type='email'
						name='email'
						value={form.email}
						onChange={handleChange}
						className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition'
						placeholder='admin@email.com'
						required
					/>
				</div>
				<div>
					<label className='block mb-1 font-medium text-gray-700'>
						Phone <span className='text-red-500'>*</span>
					</label>
					<input
						name='phone'
						value={form.phone}
						onChange={handleChange}
						className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition'
						placeholder='+1 555-987-6543'
						required
					/>
				</div>
				<div>
					<label className='block mb-1 font-medium text-gray-700'>
						Password <span className='text-red-500'>*</span>
					</label>
					<input
						type='password'
						name='password'
						value={form.password}
						onChange={handleChange}
						className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 transition'
						placeholder='Password'
						required
					/>
				</div>
			</div>
			<div className='flex justify-end gap-4 mt-8'>
				<button
					type='reset'
					className='px-4 py-2 rounded font-semibold transition focus:outline-none bg-gray-300 text-gray-700 hover:bg-gray-400'
					onClick={() => setForm(initialState)}
					disabled={loading}>
					Reset
				</button>
				<button
					type='submit'
					className='px-4 py-2 rounded font-semibold transition focus:outline-none bg-emerald-600 text-white hover:bg-emerald-700'
					disabled={loading}>
					{loading ? 'Submitting...' : 'Submit'}
				</button>
			</div>
		</form>
	);
};

export default AdminForm;
