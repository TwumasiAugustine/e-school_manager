'use client';

import Link from 'next/link';
import Image from 'next/image'; 
import { usePathname } from 'next/navigation'; 

import {
	FiHome,
	FiUsers,
	FiBookOpen,
	FiBriefcase,
	FiSettings,
	FiChevronsLeft,
	FiChevronsRight,
	FiLogOut, // Added FiLogOut icon
} from 'react-icons/fi';

const navItems = [
	{ href: '/dashboard', icon: FiHome, label: 'Dashboard' },
	{ href: '/students', icon: FiUsers, label: 'Students' },
	{ href: '/teachers', icon: FiBriefcase, label: 'Teachers' },
	{ href: '/classes', icon: FiBookOpen, label: 'Classes' },
	{ href: '/settings', icon: FiSettings, label: 'Settings' },
];

const Sidebar = ({
	isCollapsed,
	setIsCollapsed,
}: {
	isCollapsed: boolean;
	setIsCollapsed: (isCollapsed: boolean) => void;
}) => {
	const pathname = usePathname(); // Get current pathname

	// Placeholder logout function
	const handleLogout = () => {
		console.log("Logout clicked from Sidebar");
		// Actual logout logic will go here
	};

	return (
		<aside
			className={`fixed h-screen bg-gray-800 text-white transition-all duration-300 ease-in-out hidden md:flex flex-col ${
				isCollapsed ? 'w-16' : 'w-64'
			}`}>
			{/* Logo and School Name */}
			<div className={`flex items-center p-4 ${isCollapsed ? 'justify-center' : 'space-x-2'} border-b border-gray-600 min-h-[68px]`}> {/* Added min-h for consistent height */}
				<Link href="/" className="flex items-center">
					<Image src="/next.svg" alt="School Logo" width={isCollapsed ? 32 : 28} height={isCollapsed ? 32 : 28} className="dark:invert transition-all duration-300 ease-in-out" />
					{!isCollapsed && (
						<span className="text-xl font-bold ml-2 transition-opacity duration-300 ease-in-out opacity-100">
							SchoolName
						</span>
					)}
					{isCollapsed && (
						<span className="text-xl font-bold ml-2 transition-opacity duration-300 ease-in-out opacity-0 absolute">
							SchoolName
						</span>
					)}
				</Link>
			</div>

			<button
				type='button'
				onClick={() => setIsCollapsed(!isCollapsed)}
				className={`p-2 hover:bg-gray-600 rounded mb-2 ${isCollapsed ? 'self-center' : 'self-end'} mt-2`}
				aria-label={
					isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
				}>
				{isCollapsed ? (
					<FiChevronsRight size={20} />
				) : (
					<FiChevronsLeft size={20} />
				)}
			</button>
			<nav className='flex-grow p-4 space-y-2'>
				{navItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.label}
							href={item.href}
							className={`flex items-center py-2 px-3 hover:bg-gray-600 rounded transition-colors duration-200 ${
								isCollapsed ? 'justify-center' : ''
							} ${isActive ? 'bg-gray-600 font-semibold' : ''}`}
							title={isCollapsed ? item.label : undefined}>
							<item.icon size={isCollapsed ? 24 : 20} className="transition-all duration-300 ease-in-out" />
							{!isCollapsed && (
								<span className={`ml-3 transition-opacity duration-300 ease-in-out opacity-100`}>{item.label}</span>
							)}
							{isCollapsed && <span className="opacity-0 absolute">{item.label}</span>}
						</Link>
					);
				})}
			</nav>
			{/* Logout Button */}
			<div className="p-4 border-t border-gray-600">
				<button
					onClick={handleLogout}
					className={`flex items-center py-2 px-3 hover:bg-red-600 rounded w-full transition-colors duration-200 ${isCollapsed ? 'justify-center' : ''}`}
					title={isCollapsed ? 'Logout' : undefined}
				>
					<FiLogOut size={isCollapsed ? 24 : 20} className="transition-all duration-300 ease-in-out" />
					{!isCollapsed && <span className={`ml-3 transition-opacity duration-300 ease-in-out opacity-100`}>Logout</span>}
					{isCollapsed && <span className="opacity-0 absolute">Logout</span>}
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;
