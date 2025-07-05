'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import { usePathname } from 'next/navigation';
import {
	FiMenu,
	FiX,
	FiBell,
	FiUser,
	FiLogOut,
	FiHome,
	FiUsers,
	FiBriefcase,
	FiPlusCircle,
	FiMonitor,
	FiPackage,
	FiGrid,
	FiBook,
	FiDollarSign,
	FiSettings,
	FiChevronDown,
	FiChevronUp,
} from 'react-icons/fi';

const navLinks = [
	{
		id: 'dashboard',
		href: '/dashboard',
		icon: FiHome,
		label: 'Dashboard',
		hasSubmenu: false,
	},
	{
		id: 'school',
		href: '#',
		icon: FiGrid,
		label: 'Schools',
		hasSubmenu: true,
		submenu: [
			{
				id: 'school-list',
				href: '/school/list',
				label: 'School List',
			},
			{
				id: 'school-inquiries',
				href: '/school/inquiries',
				label: 'School Inquiries',
			},
			{
				id: 'add-school',
				href: '/school/add',
				label: 'Add School',
			},
			{
				id: 'assign-school',
				href: '/school/assign',
				label: 'Assign School',
			},
		],
	},
	{
		id: 'admin',
		href: '#',
		icon: FiUsers,
		label: 'Admins',
		hasSubmenu: true,
		submenu: [
			{
				id: 'admin-list',
				href: '/admin/list',
				label: 'Admin List',
			},
			{
				id: 'add-admin',
				href: '/admin/add',
				label: 'Add Admin',
			},
			{
				id: 'manage-admins',
				href: '/admin/manage',
				label: 'Manage Admins',
			},
		],
	},
	{
		id: 'student',
		href: '/student',
		icon: FiUsers,
		label: 'Student',
		hasSubmenu: true,
		submenu: [
			{
				id: 'student-admission',
				href: '/student/add',
				label: 'Student Admission',
			},
			{
				id: 'student-list',
				href: '/student/list',
				label: 'Student List',
			},
			{
				id: 'student-manage',
				href: '/student/manage',
				label: 'Students Management',
			},
		],
	},
	{
		id: 'staff',
		href: '/staff',
		icon: FiBriefcase,
		label: 'Staff',
		hasSubmenu: true,
		submenu: [
			{
				id: 'staff-admission',
				href: '/staff/add',
				label: 'Add Staff',
			},
			{
				id: 'staff-manage',
				href: '/staff/list',
				label: 'Staff List',
			},
			{
				id: 'list-staff',
				href: '/staff/manage',
				label: 'Staff Management',
			},
		],
	},
	{
		id: 'parent',
		href: '/parent',
		icon: FiUsers,
		label: 'Parent',
		hasSubmenu: true,
		submenu: [
			{
				id: 'parent-admission',
				href: '/parent/add',
				label: 'Add Parent',
			},
			{
				id: 'list-parent',
				href: '/parent/list',
				label: 'Parent List',
			},
			{
				id: 'manage-parent',
				href: '/parent/manage',
				label: 'Parents Management',
			},
		],
	},
	{
		id: 'academics',
		href: '#',
		icon: FiBook,
		label: 'Academics',
		hasSubmenu: true,
		submenu: [
			{ id: 'medium', href: '/academics/medium', label: 'Medium' },
			{ id: 'section', href: '/academics/section', label: 'Section' },
			{ id: 'subject', href: '/academics/subject', label: 'Subject' },
			{ id: 'semester', href: '/academics/semester', label: 'Semester' },
			{ id: 'stream', href: '/academics/stream', label: 'Stream' },
			{ id: 'shift', href: '/academics/shift', label: 'Shift' },
			{ id: 'class', href: '/academics/class', label: 'Class' },
			{
				id: 'class-subject',
				href: '/academics/class-subject',
				label: 'Class Subject',
			},
			{
				id: 'class-group',
				href: '/academics/class-group',
				label: 'Class Group',
			},
			{
				id: 'class-section-teachers',
				href: '/academics/class-section-teachers',
				label: 'Class Section & Teachers',
			},
			{
				id: 'transfer-promote',
				href: '/academics/transfer-promote',
				label: 'Transfer & Promote Students',
			},
		],
	},
	{
		id: 'package',
		href: '#',
		icon: FiPackage,
		label: 'Package',
		hasSubmenu: false,
	},
	{
		id: 'addons',
		href: '#',
		icon: FiPlusCircle,
		label: 'Addons',
		hasSubmenu: false,
	},
	{
		id: 'features',
		href: '#',
		icon: FiMonitor,
		label: 'Features',
		hasSubmenu: false,
	},
	{
		id: 'subscription',
		href: '#',
		icon: FiDollarSign,
		label: 'Subscription',
		hasSubmenu: true,
		submenu: [
			{
				id: 'sub-plans',
				href: '/subscription/plans',
				label: 'Subscription Plans',
			},
			{
				id: 'sub-transactions',
				href: '/subscription/transactions',
				label: 'Transactions',
			},
		],
	},
	{
		id: 'profile',
		href: '/profile',
		icon: FiUser,
		label: 'Profile',
		hasSubmenu: false,
	},
	{
		id: 'settings',
		href: '/settings',
		icon: FiSettings,
		label: 'Settings',
		hasSubmenu: false,
	},
];

// Add user profile props to MobileHeader component
interface MobileHeaderProps {
	userName?: string;
	userEmail?: string;
	userRole?: string;
	userImage?: string | StaticImageData;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
	userName,
	userEmail,
	userRole,
	userImage,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
	const mobileMenuRef = useRef<HTMLDivElement>(null);
	const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
	const pathname = usePathname();
	const [hasNotifications] = useState(true); // Removed unused setter function

	// Placeholder logout function
	const handleLogout = () => {
		console.log('Logout clicked from Mobile Header');
	};

	// Effect to handle clicks outside of the mobile menu
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				isOpen &&
				mobileMenuRef.current &&
				!mobileMenuRef.current.contains(event.target as Node) &&
				mobileMenuButtonRef.current &&
				!mobileMenuButtonRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	// Helper to prefix href with userRole if not already present
	const prefixHrefWithRole = (href: string, userRole: string) => {
		if (!href || href === '#' || href.startsWith('http')) return href;
		const rolePrefix = `/${userRole?.toLowerCase()}`;
		if (href.startsWith(rolePrefix)) return href;
		if (href.startsWith('/')) return rolePrefix + href;
		return href;
	};
	// Define role-based access for navigation links
	const roleBasedNavLinks = {
		super_admin: [
			'dashboard',
			'school',
			'admin',
			'subscription',
			'settings',
			'profile',
		],
		admin: [
			'dashboard',
			'academics',
			'student',
			'staff',
			'parent',
			'subscription',
			'settings',
			'profile',
		],
		staff: [
			'dashboard',
			'academics',
			'student',
			'class',
			'profile',
			'settings',
		],
		parent: ['dashboard', 'academics', 'student', 'profile', 'settings'],
		student: ['dashboard', 'academics', 'class', 'profile', 'settings'],
	};
	// Process navItems to update hrefs with userRole prefix
	const processedNavLinks = navLinks.map((item) => {
		if (item.hasSubmenu && item.submenu) {
			return {
				...item,
				submenu: item.submenu.map((sub) => ({
					...sub,
					href: prefixHrefWithRole(sub.href, userRole || ''),
				})),
			};
		}
		if (item.href && item.href !== '#') {
			return {
				...item,
				href: prefixHrefWithRole(item.href, userRole || ''),
			};
		}
		return item;
	});

	// Filter navigation links based on user role
	const filteredNavLinks = processedNavLinks.filter((link) => {
		const roleKey = (userRole?.toLowerCase() ||
			'') as keyof typeof roleBasedNavLinks;
		const allowedLinks = roleBasedNavLinks[roleKey] || [];
		// Use link.id instead of link.label for consistent comparison
		return allowedLinks.includes(link.id);
	});
	return (
		<header className='bg-white border-b border-gray-200 shadow-sm py-3 px-4 md:hidden'>
			<div className='flex justify-between items-center'>
				<Link
					href='/'
					className='flex items-center space-x-2'>
					<Image
						src='/next.svg'
						alt='eSchool Logo'
						width={28}
						height={28}
					/>
					<span className='text-lg font-bold text-gray-800'>
						eSchool
					</span>
				</Link>

				<div className='flex items-center space-x-2'>
					{/* Notifications */}
					<button className='p-2 rounded-full text-gray-500 hover:bg-gray-100 relative'>
						<FiBell size={20} />
						{hasNotifications && (
							<span className='absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500' />
						)}
					</button>

					{/* User Avatar */}
					<Link
						href='/profile'
						className='relative'>
						<div className='h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-500'>
							<FiUser
								size={16}
								className='text-emerald-700'
							/>
						</div>
					</Link>

					{/* Mobile Menu Button */}
					<button
						type='button'
						onClick={() => setIsOpen(!isOpen)}
						ref={mobileMenuButtonRef}
						className='p-2 rounded-md text-gray-500 hover:bg-gray-100'>
						<span className='sr-only'>
							{isOpen ? 'Close menu' : 'Open menu'}
						</span>
						{isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			{isOpen && (
				<div
					className='mt-4 shadow-lg rounded-md border border-gray-200 bg-white'
					ref={mobileMenuRef}>
					{/* Admin Profile Info */}
					<div className='p-4 border-b border-gray-200'>
						<div className='flex items-center space-x-3'>
							{' '}
							<div className='relative'>
								<Image
									src={userImage || '/placeholder-avatar.png'}
									alt={userName || 'user profile'}
									width={40}
									height={40}
									className='rounded-full border-2 border-emerald-500'
								/>
								{hasNotifications && (
									<span className='absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white' />
								)}
							</div>
							<div className='flex-1 min-w-0'>
								<h2 className='text-sm font-medium text-gray-800 truncate'>
									{userName}
								</h2>
								<p className='text-xs text-gray-500 truncate'>
									{userEmail}
								</p>
								<span className='inline-block mt-1 text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded'>
									{userRole}
								</span>
							</div>
						</div>
					</div>

					<div className='py-2'>
						{filteredNavLinks.map((link) => {
							if (link.submenu) {
								const isSubmenuOpen =
									openSubmenu === link.label;
								const isAnySubmenuItemActive =
									link.submenu.some(
										(subLink) => pathname === subLink.href,
									);
								return (
									<div key={link.label}>
										<button
											onClick={() =>
												setOpenSubmenu(
													isSubmenuOpen
														? null
														: link.label,
												)
											}
											className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium hover:bg-gray-50 ${
												isAnySubmenuItemActive
													? 'bg-emerald-50 text-emerald-600'
													: 'text-gray-600'
											}`}>
											<span>{link.label}</span>
											{isSubmenuOpen ? (
												<FiChevronUp
													className={`transition-colors ${
														isAnySubmenuItemActive
															? 'text-emerald-600'
															: 'text-gray-500'
													}`}
													size={16}
												/>
											) : (
												<FiChevronDown
													className={`transition-colors ${
														isAnySubmenuItemActive
															? 'text-emerald-600'
															: 'text-gray-500'
													}`}
													size={16}
												/>
											)}
										</button>
										{isSubmenuOpen && (
											<div className='pl-4 border-l-2 border-emerald-200 bg-white'>
												{/* Optional: bg-gray-50 if preferred for submenu background */}
												{link.submenu.map((subLink) => {
													const isSubActive =
														pathname ===
														subLink.href;
													return (
														<Link
															key={subLink.href}
															href={subLink.href}
															className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
																isSubActive
																	? 'bg-emerald-50 text-emerald-600 font-medium'
																	: 'text-gray-600'
															}`}
															onClick={() =>
																setIsOpen(false)
															}>
															{subLink.label}
														</Link>
													);
												})}
											</div>
										)}
									</div>
								);
							}
							// Direct link (ensure link.href exists)
							if (link.href) {
								const isActive = pathname === link.href;
								return (
									<Link
										key={link.href}
										href={link.href}
										className={`block px-4 py-3 text-sm hover:bg-gray-50 ${
											isActive
												? 'bg-emerald-50 text-emerald-600 font-medium'
												: 'text-gray-600'
										}`}
										onClick={() => setIsOpen(false)}>
										{link.label}
									</Link>
								);
							}
							return null; // Should not be reached if navLinks are structured correctly
						})}
					</div>
					<div className='border-t border-gray-200 py-2'>
						<button
							onClick={() => {
								handleLogout();
								setIsOpen(false);
							}}
							className='block w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50'>
							<div className='flex items-center'>
								<FiLogOut
									size={16}
									className='mr-2'
								/>
								<span>Logout</span>
							</div>
						</button>
					</div>
				</div>
			)}
		</header>
	);
};

export default MobileHeader;
