'use client';

import React, { useState, FormEvent } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { FiEye, FiEyeOff, FiMail, FiLock, FiKey } from 'react-icons/fi';

type UserRole = 'admin' | 'staff' | 'parent' | 'superAdmin';

interface RoleOption {
	id: UserRole;
	label: string;
}

const roles: RoleOption[] = [
	{ id: 'admin', label: 'Admin' },
	{ id: 'staff', label: 'Staff' },
	{ id: 'parent', label: 'Parent' },
	{ id: 'superAdmin', label: 'Super Admin' },
];

const LoginPage: React.FC = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [schoolCode, setSchoolCode] = useState<string>('');
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	const handleSubmit = async (
		e: FormEvent<HTMLFormElement>,
	): Promise<void> => {
		e.preventDefault();
		setError('');

		if (
			!email ||
			!password ||
			(!selectedRole.includes('super') && !schoolCode)
		) {
			setError('Please fill in all required fields');
			return;
		}

		setLoading(true);

		try {
			// Here you would integrate with your authentication API
			console.log('Logging in with:', {
				email,
				role: selectedRole,
				schoolCode,
			});

			// Simulating API call
			await new Promise<void>((resolve) =>
				setTimeout(() => resolve(), 1000),
			);

			// Redirect based on role after successful login
		} catch (err) {
			setError('Login failed. Please check your credentials.');
			console.error('Login error:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center p-4'>
			<div className='relative w-full max-w-md'>
				{/* Card with shadow and subtle animation */}
				<div className='bg-white rounded-2xl shadow-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]'>
					<div className='p-8'>
						{/* Error Alert */}
						{error && (
							<div className='mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fade-in'>
								<p className='text-red-700 text-sm'>{error}</p>
							</div>
						)}

						{/* Logo */}
						<div className='flex justify-center mb-8'>
							<div className='flex items-center gap-3'>
								<div className='bg-emerald-500 bg-opacity-10 p-3 rounded-xl'>
									<div className='relative w-10 h-10'>
										<Image
											src='/next.svg'
											alt='eSchool Logo'
											width={40}
											height={40}
											className='object-contain'
										/>
									</div>
								</div>
								<div>
									<span className='font-bold text-2xl text-gray-800'>
										eSchool
									</span>
									<span className='ml-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs px-2 py-1 rounded-full'>
										SAAS
									</span>
								</div>
							</div>
						</div>

						<h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>
							Welcome Back
						</h2>

						<form
							onSubmit={handleSubmit}
							className='space-y-5'>
							{/* Role Selection Pills */}
							<div className='bg-gray-50 p-2 rounded-xl'>
								<div className='grid grid-cols-2 gap-2'>
									{roles.map((role) => (
										<button
											key={role.id}
											type='button'
											className={`py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
												selectedRole === role.id
													? 'bg-emerald-500 text-white shadow-md'
													: 'bg-white text-gray-700 hover:bg-gray-100'
											}`}
											onClick={() =>
												setSelectedRole(role.id)
											}>
											{role.label}
										</button>
									))}
								</div>
							</div>

							{/* Email Field */}
							<div className='space-y-2'>
								<label
									htmlFor='email'
									className='block text-sm font-medium text-gray-700'>
									Email
								</label>
								<div className='relative'>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
										<FiMail />
									</div>
									<input
										id='email'
										type='text'
										placeholder='name@company.com'
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all'
										required
									/>
								</div>
							</div>

							{/* Password Field */}
							<div className='space-y-2'>
								<label
									htmlFor='password'
									className='block text-sm font-medium text-gray-700'>
									Password
								</label>
								<div className='relative'>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
										<FiLock />
									</div>
									<input
										id='password'
										type={
											showPassword ? 'text' : 'password'
										}
										placeholder='••••••••'
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										className='w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all'
										required
									/>
									<button
										type='button'
										className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
										onClick={() =>
											setShowPassword(!showPassword)
										}
										tabIndex={-1}>
										{showPassword ? (
											<FiEyeOff size={18} />
										) : (
											<FiEye size={18} />
										)}
									</button>
								</div>
							</div>

							{/* School Code (only for non-super admin) */}
							{!selectedRole.includes('super') && (
								<div className='space-y-2'>
									<label
										htmlFor='schoolCode'
										className='block text-sm font-medium text-gray-700'>
										School Code
									</label>
									<div className='relative'>
										<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
											<FiKey />
										</div>
										<input
											id='schoolCode'
											type='text'
											placeholder='Enter school code'
											value={schoolCode}
											onChange={(e) =>
												setSchoolCode(e.target.value)
											}
											className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all'
											required
										/>
									</div>
								</div>
							)}

							{/* Forgot Password */}
							<div className='flex justify-end'>
								<Link
									href='/auth/forgot-password'
									className='text-sm text-gray-600 hover:text-emerald-600 transition-colors'>
									Forgot your password?
								</Link>
							</div>

							{/* Login Button */}
							<button
								type='submit'
								className={`w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all ${
									loading
										? 'opacity-80 cursor-not-allowed'
										: ''
								}`}
								disabled={loading}>
								{loading ? (
									<div className='flex items-center justify-center'>
										<svg
											className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'>
											<circle
												className='opacity-25'
												cx='12'
												cy='12'
												r='10'
												stroke='currentColor'
												strokeWidth='4'></circle>
											<path
												className='opacity-75'
												fill='currentColor'
												d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
										</svg>
										Logging in...
									</div>
								) : (
									'Log in to your account'
								)}
							</button>
						</form>

						{/* Register Link */}
						<div className='mt-8 text-center'>
							<p className='text-sm text-gray-600'>
								Don&apos;t have an account?{' '}
								<Link
									href='/'
									className='text-emerald-600 hover:text-emerald-800 font-medium transition-colors'>
									Go to home page
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
