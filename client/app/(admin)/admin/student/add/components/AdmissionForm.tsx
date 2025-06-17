import React, { useState } from 'react';
import MultiSelect from '@/components/MultiSelect';
import ToastContainer, { showToast } from '@/components/ToastContainer';
import { AdmissionFormData } from '@/types/admission';

interface AdmissionFormProps {
	onSubmit: (data: AdmissionFormData) => void;
	onCancel?: () => void;
	title?: string;
}

const classSections = ['A', 'B', 'C']; // Example, replace with real data
const sessionYears = ['2024-2025', '2025-2026'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const AdmissionForm: React.FC<AdmissionFormProps> = ({
	onSubmit,
	onCancel,
	title = 'Admission Form',
}) => {
	const [form, setForm] = useState<AdmissionFormData>({
		grNumber: '',
		classSection: '',
		sessionYear: '',
		admissionDate: '',
		status: 'active',
		firstName: '',
		lastName: '',
		dob: '',
		gender: '',
		address: '',
		bloodGroup: '',
		guardianEmail: '',
		guardianFirstName: '',
		guardianLastName: '',
		guardianMobile: '',
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleMultiSelect = (field: string, values: string[]) => {
		setForm({ ...form, [field]: values[0] || '' });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			showToast('Student admitted successfully!', 'success');
			onSubmit(form);
		}, 1000);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='space-y-6 flex flex-col max-w-7xl'>
			<h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
			{/* Student Info Section */}
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-emerald-900 mb-2 border-b border-emerald-100 pb-1">
					Student Information
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							GR Number <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							name="grNumber"
							className="w-full border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 outline-none transition-all px-3 py-2 bg-gray-100 text-gray-700"
							value={form.grNumber}
							onChange={handleChange}
							required
							disabled
							placeholder="Auto-generated"
							title="GR Number"
						/>
					</div>
					<div>
						<MultiSelect
							label="Class Section"
							options={classSections}
							placeholder="Select Class Section"
							onChange={(vals) => handleMultiSelect('classSection', vals)}
							maxSelected={1}
							required
						/>
					</div>
					<div>
						<MultiSelect
							label="Session Year"
							options={sessionYears}
							placeholder="Select Session Year"
							onChange={(vals) => handleMultiSelect('sessionYear', vals)}
							maxSelected={1}
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Admission Date <span className="text-red-500">*</span>
						</label>
						<input
							type="date"
							name="admissionDate"
							className="w-full border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 outline-none transition-all px-3 py-2 text-gray-700 bg-white"
							value={form.admissionDate}
							onChange={handleChange}
							required
							placeholder="Admission Date"
							title="Admission Date"
						/>
					</div>
				</div>
				<div className="flex items-center gap-6 mt-4">
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Status <span className="text-red-500">*</span>
					</label>
					<div className="flex items-center gap-4">
						<label className="flex items-center gap-1">
							<input
								type="radio"
								name="status"
								value="active"
								checked={form.status === 'active'}
								onChange={handleChange}
								className="accent-purple-500"
							/>
							<span>Active</span>
						</label>
						<label className="flex items-center gap-1">
							<input
								type="radio"
								name="status"
								value="inactive"
								checked={form.status === 'inactive'}
								onChange={handleChange}
								className="accent-purple-500"
							/>
							<span>Inactive</span>
						</label>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							First Name <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							name="firstName"
							className="w-full border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 outline-none transition-all px-3 py-2 text-gray-700 bg-white"
							value={form.firstName}
							onChange={handleChange}
							required
							placeholder="First Name"
							title="First Name"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Last Name <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							name="lastName"
							className="w-full border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 outline-none transition-all px-3 py-2 text-gray-700 bg-white"
							value={form.lastName}
							onChange={handleChange}
							required
							placeholder="Last Name"
							title="Last Name"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Date of Birth <span className="text-red-500">*</span>
						</label>
						<input
							type="date"
							name="dob"
							className="w-full border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 outline-none transition-all px-3 py-2 text-gray-700 bg-white"
							value={form.dob}
							onChange={handleChange}
							required
							placeholder="Date of Birth"
							title="Date of Birth"
						/>
					</div>
				</div>
				<div className="flex items-center gap-6 mt-4">
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Gender <span className="text-red-500">*</span>
					</label>
					<div className="flex items-center gap-4">
						<label className="flex items-center gap-1">
							<input
								type="radio"
								name="gender"
								value="male"
								checked={form.gender === 'male'}
								onChange={handleChange}
								className="accent-purple-500"
							/>
							<span>Male</span>
						</label>
						<label className="flex items-center gap-1">
							<input
								type="radio"
								name="gender"
								value="female"
								checked={form.gender === 'female'}
								onChange={handleChange}
								className="accent-purple-500"
							/>
							<span>Female</span>
						</label>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Current Address <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							name="address"
							className="w-full border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 outline-none transition-all px-3 py-2 text-gray-700 bg-white"
							value={form.address}
							onChange={handleChange}
							required
							placeholder="Current Address"
							title="Current Address"
						/>
					</div>
					<div>
						<MultiSelect
							label="Blood group"
							options={bloodGroups}
							placeholder="Select Blood group"
							onChange={(vals) => handleMultiSelect('bloodGroup', vals)}
							maxSelected={1}
						/>
					</div>
				</div>
			</div>
			{/* Guardian Info Section */}
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-emerald-900 mb-2 border-b border-emerald-100 pb-1">
					Guardian Information
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Guardian Email <span className="text-red-500">*</span>
						</label>
						<input
							type="email"
							name="guardianEmail"
							className="w-full border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 outline-none transition-all px-3 py-2 text-gray-700 bg-white"
							value={form.guardianEmail}
							onChange={handleChange}
							required
							placeholder="Guardian Email"
							title="Guardian Email"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Guardian First Name <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							name="guardianFirstName"
							className="w-full border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 outline-none transition-all px-3 py-2 text-gray-700 bg-white"
							value={form.guardianFirstName}
							onChange={handleChange}
							required
							placeholder="Guardian First Name"
							title="Guardian First Name"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Guardian Last Name <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							name="guardianLastName"
							className="w-full border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 outline-none transition-all px-3 py-2 text-gray-700 bg-white"
							value={form.guardianLastName}
							onChange={handleChange}
							required
							placeholder="Guardian Last Name"
							title="Guardian Last Name"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Guardian Mobile <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							name="guardianMobile"
							className="w-full border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 outline-none transition-all px-3 py-2 text-gray-700 bg-white"
							value={form.guardianMobile}
							onChange={handleChange}
							required
							placeholder="Guardian Mobile"
							title="Guardian Mobile"
						/>
					</div>
				</div>
			</div>
			<div className='flex gap-2 mt-4 justify-end'>
				{onCancel && (
					<button
						type='button'
						className='bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-gray-400'
						onClick={onCancel}>
						Cancel
					</button>
				)}
				<button
					type='submit'
					className='bg-emerald-900 hover:bg-emerald-800 text-white font-semibold px-6 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-emerald-500'
					disabled={loading}>
					{loading ? 'Submitting...' : 'Submit'}
				</button>
			</div>
			<ToastContainer />
		</form>
	);
};

export default AdmissionForm;
