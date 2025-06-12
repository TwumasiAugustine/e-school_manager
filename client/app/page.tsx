'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import RegisterModal from '@/components/RegisterModal';
import { SchoolFormData } from '@/types/school';

const navLinks = [
	{ href: '/', label: 'Home' },
	{ href: '/features', label: 'Features' },
	{ href: '/about', label: 'About Us' },
	{ href: '/pricing', label: 'Pricing' },
	{ href: '/faqs', label: 'FAQs' },
	{ href: '/contact', label: 'Contact' },
];

export default function Home() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [showRegisterModal, setShowRegisterModal] = useState(false);

	// Handler for form submission
	const handleRegisterSubmit = (formData: SchoolFormData) => {
		console.log('Form submitted:', formData);
		// Here you would typically send the data to your API
		// After successful submission:
		// setShowRegisterModal(false);
		// Maybe show a success message or redirect
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-white'>
			{/* Navigation */}
			<header className='py-4 px-6 md:px-10 lg:px-20'>
				<nav className='flex justify-between items-center'>
					{/* Logo */}
					<div className='flex items-center gap-2'>
						<div className='relative w-10 h-10'>
							<Image
								src='/next.svg'
								alt='eSchool Logo'
								width={40}
								height={40}
								className='object-contain'
							/>
						</div>
						<div>
							<span className='font-bold text-xl text-gray-800'>
								eSchool
							</span>
						</div>
					</div>

					{/* Desktop Navigation */}
					<div className='hidden md:flex items-center gap-8'>
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className='font-medium text-gray-800 hover:text-emerald-500 transition'>
								{link.label}
							</Link>
						))}

						<div className='relative group'>
							<button className='font-medium text-gray-800 hover:text-emerald-500 transition flex items-center gap-1'>
								Guidance
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='16'
									height='16'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='feather feather-chevron-down'>
									<polyline points='6 9 12 15 18 9'></polyline>
								</svg>
							</button>
							<div className='absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10'>
								<Link
									href='/guidance/students'
									className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
									For Students
								</Link>
								<Link
									href='/guidance/teachers'
									className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
									For Teachers
								</Link>
								<Link
									href='/guidance/parents'
									className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
									For Parents
								</Link>
							</div>
						</div>

						<div className='relative group'>
							<button
								type='button'
								className='font-medium text-gray-800 hover:text-emerald-500 transition flex items-center gap-1'>
								Language
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='16'
									height='16'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='feather feather-chevron-down'>
									<polyline points='6 9 12 15 18 9'></polyline>
								</svg>
							</button>
							<div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10'>
								<button className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
									English
								</button>
								<button className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
									Français
								</button>
								<button className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
									Español
								</button>
							</div>
						</div>
					</div>

					{/* Mobile Menu Button */}
					<div className='md:hidden'>
						<button
							type='button'
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className='text-gray-700'>
							{isMenuOpen ? (
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
							) : (
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
										x1='3'
										y1='12'
										x2='21'
										y2='12'></line>
									<line
										x1='3'
										y1='6'
										x2='21'
										y2='6'></line>
									<line
										x1='3'
										y1='18'
										x2='21'
										y2='18'></line>
								</svg>
							)}
						</button>
					</div>

					{/* Login/Trial Buttons - Desktop */}
					<div className='hidden md:flex items-center gap-4'>
						<Link
							href='/auth/login'
							className='font-medium py-2 px-5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition'>
							Login
						</Link>
						<Link
							href='/trial'
							className='font-medium py-2 px-5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition'>
							Start Trial
						</Link>
					</div>
				</nav>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className='md:hidden pt-4 pb-2'>
						<div className='flex flex-col space-y-3'>
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className='font-medium text-gray-800 hover:text-emerald-500 transition'>
									{link.label}
								</Link>
							))}
							<div className='py-2'>
								<Link
									href='/auth/login'
									className='block w-full text-center mb-2 font-medium py-2 px-5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition'>
									Login
								</Link>
								<Link
									href='/trial'
									className='block w-full text-center font-medium py-2 px-5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition'>
									Start Trial
								</Link>
							</div>
						</div>
					</div>
				)}
			</header>

			{/* Hero Section */}
			<main className='container mx-auto px-6 py-12 md:py-20'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
					{/* Left Content */}
					<div>
						<p className='text-emerald-600 font-medium mb-4'>
							Transform School Management With eSchool SaaS
						</p>
						<h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
							Transform School Management With eSchool SaaS
						</h1>
						<p className='text-gray-600 text-lg mb-8'>
							Experience the future of education with our eSchool
							SaaS platform. Streamline attendance, assignments,
							exams, and more. Elevate your school&apos;s
							efficiency and engagement.
						</p>
						<div className='flex flex-wrap gap-4'>
							<button
								type='button'
								onClick={() => setShowRegisterModal(true)}
								className='font-medium py-3 px-8 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition'>
								Register your school
							</button>
							<Link
								href='/super_admin/dashboard'
								className='font-medium py-3 px-8 rounded-full border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-50 transition'>
								Request Demo
							</Link>
						</div>
					</div>

					{/* Right Image and Content */}
					<div className='relative'>
						<div className='absolute -top-10 -right-6 left-10 bottom-10 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-full opacity-50'></div>
						<div className='absolute top-0 left-0 w-full h-full'>
							<div className='grid grid-cols-8 grid-rows-8 gap-2 h-full'>
								{[...Array(64)].map((_, i) => (
									<div
										key={i}
										className='w-1 h-1 rounded-full bg-emerald-200 opacity-30'></div>
								))}
							</div>
						</div>

						<div className='relative z-10'>
							<div className='relative animate-float'>
								{' '}
								{/* Added animation class */}
								<Image
									width={120}
									height={100}
									src='/next.svg'
									alt='Student using eSchool platform'
									className='w-full h-auto'
								/>
								<div className='absolute top-10 right-10 bg-white bg-opacity-95 p-4 rounded-lg shadow-lg'>
									<div className='mb-2'>
										<div className='flex gap-1 mb-1'>
											{[...Array(3)].map((_, i) => (
												<svg
													key={i}
													xmlns='http://www.w3.org/2000/svg'
													width='20'
													height='20'
													viewBox='0 0 24 24'
													fill='#FFD700'
													stroke='#FFD700'
													strokeWidth='2'
													className='feather feather-star'>
													<polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'></polygon>
												</svg>
											))}
										</div>
										<div className='bg-orange-500 h-1 w-12 rounded-full'></div>
									</div>
									<p className='text-gray-700 text-sm'>
										Opt for eSchool Saas 14+ robust features
										for an enhanced educational experience.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
			{showRegisterModal && (
				<RegisterModal
					isOpen={showRegisterModal}
					onClose={() => setShowRegisterModal(false)}
					onSubmit={handleRegisterSubmit}
					initialStep={1}
				/>
			)}
		</div>
	);
}
