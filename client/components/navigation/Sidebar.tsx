'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ImgPlaceholder from '@/public/placeholder-avatar.png';
import { getDashboardPathForRole } from '@/utils/navigationUtils';
import {
	FiHome,
	FiUsers,
	FiBookOpen,
	FiBriefcase,
	FiSettings,
	FiChevronsLeft,
	FiChevronsRight,
	FiLogOut,
	FiGrid,
	FiDollarSign,
	FiPackage,
	FiPlusCircle,
	FiBell,
	FiMonitor,
	FiUser,
	FiHelpCircle,
	FiMail,
	FiSun,
	FiMoon,
} from 'react-icons/fi';

// Navigation items with potential nested items
const navItems = [
	{
		id: 'dashboard',
		href: '/dashboard', // Default href, will be overridden
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
			{ id: 'school-list', href: '/school', label: 'School List' },
			{
				id: 'school-register',
				href: '/school/register',
				label: 'School Register',
			},
			{
				id: 'school-inquiries',
				href: '/school/inquiries',
				label: 'School Inquiries',
			},
			{
				id: 'manage-school',
				href: '/school/manage',
				label: 'Manage Schools',
			},
		],
	},
	{
		id: 'student',
		href: '/student',
		icon: FiUsers,
		label: 'Student',
		hasSubmenu: false,
	},
	{
		id: 'staff',
		href: '/staff',
		icon: FiBriefcase,
		label: 'staff',
		hasSubmenu: false,
	},
	{
		id: 'parent',
		href: '/parent',
		icon: FiUsers,
		label: 'Parent',
		hasSubmenu: false,
	},
	{
		id: 'class',
		href: '/class',
		icon: FiBookOpen,
		label: 'class',
		hasSubmenu: false,
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
const roleBasedNavItems = {
	super_admin: ['dashboard', 'school', 'subscription', 'settings'],
	admin: [
		'dashboard',
		'school',
		'student',
		'staff',
		'parent',
		'class',
		'subscription',
		'settings',
	],
	staff: ['dashboard', 'student', 'class', 'profile', 'settings'],
	parent: ['dashboard', 'student', 'profile', 'settings'],
	student: ['dashboard', 'class', 'profile', 'settings'],
};

interface SidebarProps {
	isCollapsed: boolean;
	setIsCollapsed: (isCollapsed: boolean) => void;
	userName?: string;
	userEmail?: string;
	userRole?: 'admin' | 'super_admin' | 'staff' | 'parent' | 'student';
	userImage?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
	isCollapsed,
	setIsCollapsed,
	userName = 'John Doe',
	userEmail = 'john.doe@eschool.com',
	userRole = 'super_admin', // Default userRole is 'super_admin'. Ensure this prop is correctly passed if overridden.
	userImage = ImgPlaceholder,
}) => {
	const pathname = usePathname();
	const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [hasNotifications] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [showNotification, setShowNotification] = useState(true);

	const handleLogout = () => {
		console.log('Logout clicked from Sidebar');
	};

	const toggleSubmenu = (itemId: string) => {
		setOpenSubmenu(openSubmenu === itemId ? null : itemId);
	};

	const toggleDarkMode = () => {
		setIsDarkMode(!isDarkMode);
		// Here you would actually implement the theme switching logic
	};

	// Helper to prefix href with userRole if not already present
	const prefixHrefWithRole = (href: string, userRole: string) => {
		if (!href || href === '#' || href.startsWith('http')) return href;
		const rolePrefix = `/${userRole.toLowerCase()}`;
		if (href.startsWith(rolePrefix)) return href;
		if (href.startsWith('/')) return rolePrefix + href;
		return href;
	};

	// Process navItems to update dashboard href and prefix all hrefs with userRole
	const processedNavItems = navItems.map((item) => {
		const newItem = { ...item };
		// Remove special case for dashboard, treat like all others
		if (item.hasSubmenu && item.submenu) {
			newItem.submenu = item.submenu.map((sub) => ({
				...sub,
				href: prefixHrefWithRole(sub.href, userRole),
			}));
		}
		if (item.href && item.href !== '#') {
			newItem.href = prefixHrefWithRole(item.href, userRole);
		}
		return newItem;
	});

	// Filter navigation items based on user role (using processedNavItems)
	const itemsAllowedByRole = processedNavItems.filter((item) => {
		const roleKey = (userRole?.toLowerCase() ||
			'') as keyof typeof roleBasedNavItems;
		const allowedForRole = roleBasedNavItems[roleKey] || [];
		return allowedForRole.includes(item.id);
	});

	const filteredNavItems = searchQuery
		? itemsAllowedByRole.filter((item) => {
				const searchTerm = searchQuery.toLowerCase();
				if (item.label.toLowerCase().includes(searchTerm)) {
					return true;
				}
				if (item.hasSubmenu && item.submenu) {
					return item.submenu.some((subItem) =>
						subItem.label.toLowerCase().includes(searchTerm),
					);
				}
				return false;
		  })
		: itemsAllowedByRole;

	// --- Debugging Check ---
	// If /superAdmin/dashboard is not working, check the console output below.
	// 1. 'userRole' should be 'super_admin' (or the role you expect).
	// 2. 'dashboardPath' should be '/superAdmin/dashboard' (or the correct path for the role).
	// 3. 'final filteredNavItems' should contain an item with id: 'dashboard' and the correct href.
	// If these are correct, the Sidebar is generating the link correctly.
	// The issue is likely that the page for this route (e.g., app/superAdmin/dashboard/page.tsx) is missing or has errors.
	console.log(
		'Sidebar Debug: userRole:',
		userRole,
		'searchQuery:',
		searchQuery,
		'final filteredNavItems:',
		filteredNavItems,
	);

	return (
		<aside
			className={`fixed h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out z-50 hidden md:flex flex-col ${
				isCollapsed ? 'w-16' : 'w-64'
			}`}>
			{/* Logo and School Name */}
			<div
				className={`flex items-center p-4 ${
					isCollapsed ? 'justify-center' : 'justify-between'
				} border-b border-gray-200 min-h-[68px]`}>
				<Link
					href='/'
					className='flex items-center'>
					<Image
						src='/next.svg'
						alt='eSchool Logo'
						width={isCollapsed ? 32 : 28}
						height={isCollapsed ? 32 : 28}
						className='transition-all duration-300 ease-in-out'
					/>
					{!isCollapsed && (
						<span className='text-lg font-bold ml-2 text-gray-800 transition-opacity duration-300 ease-in-out opacity-100'>
							eSchool
						</span>
					)}
				</Link>

				{!isCollapsed && (
					<span className='bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded'>
						SAAS
					</span>
				)}
			</div>{' '}
			{/* Integrated Header - User Profile and Quick Actions */}
			{!isCollapsed ? (
				<>
					<div className='p-4 border-b border-gray-200'>
						<div className='flex items-center space-x-3'>
							<div className='relative'>
								<Image
									src={userImage}
									alt={userName}
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
								<span className='inline-block mt-1 text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded capitalize'>
									{userRole}
								</span>
							</div>
						</div>

						{/* Quick Action Buttons */}
						<div className='mt-4 grid grid-cols-5 gap-1'>
							<Link
								href='/profile'
								className='p-2 rounded-md hover:bg-gray-100 text-gray-600 flex flex-col items-center'
								title='Profile'>
								<FiUser size={18} />
								<span className='text-xs mt-1'>Profile</span>
							</Link>
							<button
								className='p-2 rounded-md hover:bg-gray-100 text-gray-600 relative flex flex-col items-center'
								title='Notifications'>
								<div className='relative'>
									<FiBell size={18} />
									{hasNotifications && (
										<span className='absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500' />
									)}
								</div>
								<span className='text-xs mt-1'>Alerts</span>
							</button>
							<Link
								href='/messages'
								className='p-2 rounded-md hover:bg-gray-100 text-gray-600 flex flex-col items-center'
								title='Messages'>
								<FiMail size={18} />
								<span className='text-xs mt-1'>Messages</span>
							</Link>
							<Link
								href='/help'
								className='p-2 rounded-md hover:bg-gray-100 text-gray-600 flex flex-col items-center'
								title='Help'>
								<FiHelpCircle size={18} />
								<span className='text-xs mt-1'>Help</span>
							</Link>
							<button
								onClick={toggleDarkMode}
								className='p-2 rounded-md hover:bg-gray-100 text-gray-600 flex flex-col items-center'
								title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
								{isDarkMode ? (
									<>
										<FiSun size={18} />
										<span className='text-xs mt-1'>
											Light
										</span>
									</>
								) : (
									<>
										<FiMoon size={18} />
										<span className='text-xs mt-1'>
											Dark
										</span>
									</>
								)}
							</button>
						</div>
					</div>

					{/* Welcome Banner */}
					{showNotification && (
						<div className='mx-4 my-3 p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200'>
							<h3 className='text-sm font-medium text-emerald-800'>
								Welcome back!
							</h3>
							<p className='text-xs text-emerald-700 mt-1'>
								You have 3 notifications pending
							</p>
							<div className='mt-2 flex justify-between'>
								<Link
									href='/notifications'
									className='text-xs py-1 px-2 bg-white text-emerald-700 border border-emerald-300 rounded hover:bg-emerald-50 inline-block'>
									View all
								</Link>
								<button
									onClick={() => setShowNotification(false)}
									className='text-xs py-1 px-2 text-emerald-700 hover:text-emerald-800'>
									Dismiss
								</button>
							</div>
						</div>
					)}
				</>
			) : (
				<div className='py-3 flex flex-col items-center border-b border-gray-200 space-y-2'>
					<div className='relative'>
						<Image
							src={userImage}
							alt={userName}
							width={32}
							height={32}
							className='rounded-full border-2 border-emerald-500'
						/>
						{hasNotifications && (
							<span className='absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-1 ring-white' />
						)}
					</div>
					<Link
						href='/profile'
						className='p-1 rounded-md hover:bg-gray-100 text-gray-600'
						title='Profile'>
						<FiUser size={16} />
					</Link>
					<button
						className='p-1 rounded-md hover:bg-gray-100 text-gray-600 relative'
						title='Notifications'>
						<FiBell size={16} />
						{hasNotifications && (
							<span className='absolute top-0 right-0 block h-1.5 w-1.5 rounded-full bg-red-500' />
						)}
					</button>
				</div>
			)}{' '}
			{/* Toggle Button */}
			<button
				type='button'
				onClick={() => setIsCollapsed(!isCollapsed)}
				title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
				className={`p-2 hover:bg-gray-100 rounded text-gray-500 ${
					isCollapsed
						? 'self-center mt-2'
						: 'self-end -mt-10 mr-2 z-10'
				}`}
				aria-label={
					isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
				}>
				{isCollapsed ? (
					<FiChevronsRight size={20} />
				) : (
					<FiChevronsLeft size={20} />
				)}
			</button>
			{/* Search box - Only visible when not collapsed */}
			{!isCollapsed ? (
				<div className='px-4 my-3'>
					<div className='relative'>
						<input
							type='text'
							placeholder='Search menu, student, class...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='w-full px-3 py-2 pl-9 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500'
						/>
						<svg
							className='absolute left-3 top-2.5 text-gray-400'
							width='16'
							height='16'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'>
							<circle
								cx='11'
								cy='11'
								r='8'></circle>
							<line
								x1='21'
								y1='21'
								x2='16.65'
								y2='16.65'></line>
						</svg>
					</div>
				</div>
			) : (
				<div className='flex justify-center mt-2 mb-3'>
					<button
						type='button'
						className='p-2 rounded-full hover:bg-gray-100 text-gray-500'
						title='Search'
						onClick={() => setIsCollapsed(false)}>
						<svg
							width='16'
							height='16'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'>
							<circle
								cx='11'
								cy='11'
								r='8'></circle>
							<line
								x1='21'
								y1='21'
								x2='16.65'
								y2='16.65'></line>
						</svg>
					</button>
				</div>
			)}
			{/* Main Navigation */}
			<nav className='flex-grow px-4 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50'>
				<ul className='space-y-1.5'>
					{filteredNavItems.map((item) => {
						const isActive =
							pathname === item.href ||
							(item.hasSubmenu &&
								item.submenu?.some(
									(subItem) => pathname === subItem.href,
								));
						const isSubmenuOpen = openSubmenu === item.id;

						return (
							<li
								key={item.id}
								className='relative'>
								{item.hasSubmenu ? (
									<>
										<button
											type='button'
											onClick={() =>
												toggleSubmenu(item.id)
											}
											className={`flex items-center w-full py-2 px-3 rounded-md transition-colors ${
												isCollapsed
													? 'justify-center'
													: 'justify-between'
											} ${
												isActive
													? 'bg-emerald-50 text-emerald-600'
													: 'text-gray-600 hover:bg-gray-100'
											}`}
											title={
												isCollapsed
													? item.label
													: undefined
											}>
											<div className='flex items-center'>
												<item.icon
													size={20}
													className={
														isActive
															? 'text-emerald-500'
															: 'text-gray-500'
													}
												/>
												{!isCollapsed && (
													<span
														className={`ml-3 text-sm font-medium`}>
														{item.label}
													</span>
												)}
											</div>

											{!isCollapsed && (
												<svg
													className={`w-4 h-4 transition-transform ${
														isSubmenuOpen
															? 'transform rotate-180'
															: ''
													}`}
													fill='none'
													viewBox='0 0 24 24'
													stroke='currentColor'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M19 9l-7 7-7-7'
													/>
												</svg>
											)}
										</button>

										{/* Submenu */}
										{!isCollapsed &&
											isSubmenuOpen &&
											item.submenu && (
												<ul className='mt-1 pl-8 space-y-1'>
													{item.submenu.map(
														(subItem) => {
															const isSubActive =
																pathname ===
																subItem.href;
															return (
																<li
																	key={
																		subItem.id
																	}>
																	<Link
																		href={
																			subItem.href
																		}
																		className={`block py-2 px-3 text-sm rounded-md ${
																			isSubActive
																				? 'bg-emerald-50 text-emerald-600 font-medium'
																				: 'text-gray-600 hover:bg-gray-100'
																		}`}>
																		{
																			subItem.label
																		}
																	</Link>
																</li>
															);
														},
													)}
												</ul>
											)}
									</>
								) : (
									<Link
										href={item.href}
										className={`flex items-center py-2 px-3 rounded-md transition-colors ${
											isCollapsed ? 'justify-center' : ''
										} ${
											isActive
												? 'bg-emerald-50 text-emerald-600'
												: 'text-gray-600 hover:bg-gray-100'
										}`}
										title={
											isCollapsed ? item.label : undefined
										}>
										<item.icon
											size={20}
											className={
												isActive
													? 'text-emerald-500'
													: 'text-gray-500'
											}
										/>
										{!isCollapsed && (
											<span
												className={`ml-3 text-sm font-medium`}>
												{item.label}
											</span>
										)}
									</Link>
								)}
							</li>
						);
					})}
				</ul>
			</nav>{' '}
			{/* Logout Button */}
			<div
				className={`p-4 border-t border-gray-200 ${
					isCollapsed ? 'flex justify-center' : ''
				}`}>
				<button
					type='button'
					onClick={handleLogout}
					className={`flex items-center py-2 px-3 rounded-md w-full transition-colors ${
						isCollapsed ? 'justify-center' : ''
					} text-red-500 hover:bg-red-50`}
					title={isCollapsed ? 'Logout' : undefined}>
					<FiLogOut size={isCollapsed ? 20 : 18} />
					{!isCollapsed && (
						<span className='ml-3 text-sm font-medium'>Logout</span>
					)}
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;
