import React, { useState } from 'react';

interface RegisterModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (formData: SchoolFormData) => void;
	initialStep?: number;
}

interface SchoolFormData {
	schoolName: string;
	schoolEmail: string;
	mobile: string;
	address: string;
	tagline: string;
	emergencyContact?: string;
}

const RegisterModal: React.FC<RegisterModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	initialStep = 1,
}) => {
	const [step, setStep] = useState(initialStep);
	const [formData, setFormData] = useState<SchoolFormData>({
		schoolName: '',
		schoolEmail: '',
		mobile: '',
		address: '',
		tagline: '',
		emergencyContact: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[id]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	if (!isOpen) return null;

	return (
		<>
			<div
				className='fixed inset-0 bg-transparent bg-opacity-10 backdrop-blur-lg z-40 transition-opacity'
				onClick={onClose}></div>
			<div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
				<div
					className='bg-white rounded-lg shadow-xl max-w-md md:max-w-2xl w-full mx-auto animate-fade-in-up'
					onClick={(e) => e.stopPropagation()}>
					{/* Modal Header */}
					<div className='flex justify-between items-center p-6 border-gray-300 border-b'>
						<h2 className='text-2xl font-bold text-gray-800'>
							Registration Form
						</h2>
						<button
							type='button'
							onClick={onClose}
							className='text-gray-500 hover:text-gray-700 focus:outline-none'>
							<span className='sr-only'>Close Modal</span>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'>
								<line
									x1='18'
									y1='6'
									x2='6'
									y2='18'></line>
								<line
									x1='6'
									y1='6'
									x2='18'
									y2='18'></line>
							</svg>
						</button>
					</div>

					{/* Modal Content */}
					<div className='p-6'>
						<div className='mb-6'>
							<div className='relative'>
								<div className='h-1 bg-gray-200 w-full rounded-full'>
									<div
										className={`h-1 bg-emerald-500 rounded-full ${
											step === 1 ? 'w-1/2' : 'w-full'
										}`}></div>
								</div>
								<div className='flex justify-between mt-4'>
									<div className='flex flex-col items-center'>
										<div
											className={`w-6 h-6 rounded-full flex items-center justify-center ${
												step >= 1
													? 'bg-emerald-500 text-white'
													: 'bg-gray-200 text-gray-600'
											}`}>
											1
										</div>
										<span
											className={`text-xs mt-1 ${
												step === 1
													? 'text-emerald-600 font-medium'
													: 'text-gray-500'
											}`}>
											Details
										</span>
									</div>
									<div className='flex flex-col items-center'>
										<div
											className={`w-6 h-6 rounded-full flex items-center justify-center ${
												step >= 2
													? 'bg-emerald-500 text-white'
													: 'bg-gray-200 text-gray-600'
											}`}>
											2
										</div>
										<span
											className={`text-xs mt-1 ${
												step === 2
													? 'text-emerald-600 font-medium'
													: 'text-gray-500'
											}`}>
											Preview
										</span>
									</div>
								</div>
							</div>
						</div>

						<form onSubmit={handleSubmit}>
							{step === 1 && (
								<>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
										<div>
											<label
												htmlFor='schoolName'
												className='block text-sm font-medium text-gray-700 mb-1'>
												Name{' '}
												<span className='text-red-500'>
													*
												</span>
											</label>
											<input
												type='text'
												id='schoolName'
												placeholder='Enter Your School Name'
												className='w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500  focus:border-emerald-500'
												required
												value={formData.schoolName}
												onChange={handleChange}
											/>
										</div>
										<div>
											<label
												htmlFor='schoolEmail'
												className='block text-sm font-medium text-gray-700 mb-1'>
												Email{' '}
												<span className='text-red-500'>
													*
												</span>
											</label>
											<input
												type='email'
												id='schoolEmail'
												placeholder='Enter Your School Email'
												className='w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
												required
												value={formData.schoolEmail}
												onChange={handleChange}
											/>
										</div>
									</div>

									<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
										<div>
											<label
												htmlFor='mobile'
												className='block text-sm font-medium text-gray-700 mb-1'>
												Mobile{' '}
												<span className='text-red-500'>
													*
												</span>
											</label>
											<input
												type='tel'
												id='mobile'
												placeholder='Enter Your School Mobile Number'
												className='w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
												required
												value={formData.mobile}
												onChange={handleChange}
											/>
										</div>
										<div>
											<label
												htmlFor='address'
												className='block text-sm font-medium text-gray-700 mb-1'>
												Address{' '}
												<span className='text-red-500'>
													*
												</span>
											</label>
											<input
												type='text'
												id='address'
												placeholder='Enter Your School Address'
												className='w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
												required
												value={formData.address}
												onChange={handleChange}
											/>
										</div>
									</div>

									<div className='mb-4'>
										<label
											htmlFor='tagline'
											className='block text-sm font-medium text-gray-700 mb-1'>
											Tagline{' '}
											<span className='text-red-500'>
												*
											</span>
										</label>
										<input
											type='text'
											id='tagline'
											placeholder='Tagline'
											className='w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
											required
											value={formData.tagline}
											onChange={handleChange}
										/>
									</div>

									<div className='mb-6'>
										<label
											htmlFor='emergencyContact'
											className='block text-sm font-medium text-gray-700 mb-1'>
											Emergency Contact
										</label>
										<input
											type='text'
											id='emergencyContact'
											placeholder='Emergency Contact'
											className='w-full px-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
											value={formData.emergencyContact}
											onChange={handleChange}
										/>
									</div>
								</>
							)}

							{step === 2 && (
								<div className='p-4 bg-gray-50 rounded-lg mb-6'>
									<h3 className='text-lg font-medium mb-4'>
										Confirm Your Information
									</h3>
									<div className='space-y-3'>
										<div>
											<p className='text-sm font-medium text-gray-500'>
												School Name
											</p>
											<p className='text-gray-800 text-xs'>
												{formData.schoolName}
											</p>
										</div>
										<div>
											<p className='text-sm font-medium text-gray-500'>
												Email
											</p>
											<p className='text-gray-800 text-xs'>
												{formData.schoolEmail}
											</p>
										</div>
										<div>
											<p className='text-sm font-medium text-gray-500'>
												Mobile
											</p>
											<p className='text-gray-800 text-xs'>
												{formData.mobile}
											</p>
										</div>
										<div>
											<p className='text-sm font-medium text-gray-500'>
												Address
											</p>
											<p className='text-gray-800 text-xs'>
												{formData.address}
											</p>
										</div>
										<div>
											<p className='text-sm font-medium text-gray-500'>
												Tagline
											</p>
											<p className='text-gray-800 text-xs'>
												{formData.tagline}
											</p>
										</div>
										{formData.emergencyContact && (
											<div>
												<p className='text-sm font-medium text-gray-500'>
													Emergency Contact
												</p>
												<p className='text-gray-800 text-xs'>
													{formData.emergencyContact}
												</p>
											</div>
										)}
									</div>
								</div>
							)}

							<div className='flex justify-between'>
								{step > 1 && (
									<button
										type='button'
										className='py-3 px-5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition focus:outline-none'
										onClick={() =>
											setStep((prev) =>
												Math.max(1, prev - 1),
											)
										}>
										Previous
									</button>
								)}

								{step < 2 ? (
									<button
										type='button'
										className='ml-auto py-3 px-5 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition focus:outline-none'
										onClick={() =>
											setStep((prev) =>
												Math.min(2, prev + 1),
											)
										}>
										Preview
									</button>
								) : (
									<button
										type='submit'
										className='ml-auto py-3 px-5 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition focus:outline-none'>
										Submit
									</button>
								)}
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default RegisterModal;
