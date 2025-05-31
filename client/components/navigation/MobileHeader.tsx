"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiBell, FiUser, FiLogOut, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import ImgPlaceholder from '@/public/placeholder-avatar.png';
import { getDashboardPathForRole } from '@/utils/navigationUtils'; // Import the shared function

const navLinks = [
	{ href: "/dashboard", label: "Dashboard" },
	{ href: "/student", label: "Student" },
	{ href: "/staff", label: "staff" },
	{ href: "/parent", label: "Parent" },
	{ href: "/class", label: "Class" },
	{ href: "/profile", label: "Profile" },
	{
		label: "School",
		submenu: [
			{ href: "/school", label: "School List" },
			{ href: "/school/register", label: "School Register" },
			{ href: "/school/inquiries", label: "School Inquiries" },
			{ href: "/school/manage", label: "Manage School" },
		],
    },
    { href: "/subscription", label: "Subscription" },
    { href: "/settings", label: "Settings" },
];

// Add user profile props to MobileHeader component
interface MobileHeaderProps {
	userName?: string;
	userEmail?: string;
	userRole?: string;
	userImage?: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
	userName = 'Admin User',
	userEmail = 'admin@eschool.com',
	userRole = 'super_admin',
	userImage = ImgPlaceholder,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
	const mobileMenuRef = useRef<HTMLDivElement>(null);
	const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
	const pathname = usePathname();
	const [hasNotifications] = useState(true);  // Removed unused setter function

	// Placeholder logout function
	const handleLogout = () => {
		console.log("Logout clicked from Mobile Header");
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

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
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

	// Filter navigation links based on user role
	const processedNavLinks = navLinks.map(link => {
		// Remove special case for dashboard, treat like all others
		if (link.submenu) {
			return {
				...link,
				submenu: link.submenu.map(sub => ({
					...sub,
					href: prefixHrefWithRole(sub.href, userRole),
				})),
			};
		}
		if (link.href && link.href !== '#') {
			return { ...link, href: prefixHrefWithRole(link.href, userRole) };
		}
		return link;
	});

	const filteredNavLinks = processedNavLinks.filter((link) => {
		const roleKey = (userRole?.toLowerCase() || "") as keyof typeof roleBasedNavLinks;
		const allowedLinks = roleBasedNavLinks[roleKey] || [];
		// Convert link.label to lowercase for case-insensitive comparison
		const isAllowed = allowedLinks.includes(link.label.toLowerCase());
		return isAllowed;
	});
	return (
		<header className="bg-white border-b border-gray-200 shadow-sm py-3 px-4 md:hidden">
			<div className="flex justify-between items-center">
				<Link href="/" className="flex items-center space-x-2">
					<Image src="/next.svg" alt="eSchool Logo" width={28} height={28} />
					<span className="text-lg font-bold text-gray-800">eSchool</span>
				</Link>
				
				<div className="flex items-center space-x-2">
					{/* Notifications */}
					<button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
						<FiBell size={20} />
						{hasNotifications && (
							<span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500" />
						)}
					</button>
					
					{/* User Avatar */}
					<Link href="/profile" className="relative">
						<div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-500">
							<FiUser size={16} className="text-emerald-700" />
						</div>
					</Link>
					
					{/* Mobile Menu Button */}
					<button 
						type="button" 
						onClick={() => setIsOpen(!isOpen)} 
						ref={mobileMenuButtonRef}
						className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
					>
						<span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
						{isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
					</button>
				</div>
			</div>
			
			{/* Mobile Menu */}
			{isOpen && (
				<div className="mt-4 shadow-lg rounded-md border border-gray-200 bg-white" ref={mobileMenuRef}>
					{/* Admin Profile Info */}
					<div className="p-4 border-b border-gray-200">
						<div className="flex items-center space-x-3">
							<div className="relative">
								<Image
									src={userImage}
									alt={userName}
									width={40}
									height={40}
									className="rounded-full border-2 border-emerald-500"
								/>
								{hasNotifications && (
									<span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
								)}
							</div>
							<div className="flex-1 min-w-0">
								<h2 className="text-sm font-medium text-gray-800 truncate">
									{userName}
								</h2>
								<p className="text-xs text-gray-500 truncate">
									{userEmail}
								</p>
								<span className="inline-block mt-1 text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
									{userRole}
								</span>
							</div>
						</div>
					</div>

					<div className="py-2">
						{filteredNavLinks.map((link) => {
							if (link.submenu) {
								const isSubmenuOpen = openSubmenu === link.label;
								const isAnySubmenuItemActive = link.submenu.some(subLink => pathname === subLink.href);
								return (
									<div key={link.label}>
										<button
											onClick={() => setOpenSubmenu(isSubmenuOpen ? null : link.label)}
											className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium hover:bg-gray-50 ${
												isAnySubmenuItemActive ? "bg-emerald-50 text-emerald-600" : "text-gray-600"
											}`}>
											<span>{link.label}</span>
											{isSubmenuOpen ? (
												<FiChevronUp className={`transition-colors ${isAnySubmenuItemActive ? "text-emerald-600" : "text-gray-500"}`} size={16} />
											) : (
												<FiChevronDown className={`transition-colors ${isAnySubmenuItemActive ? "text-emerald-600" : "text-gray-500"}`} size={16} />
											)}
										</button>
										{isSubmenuOpen && (
											<div className="pl-4 border-l-2 border-emerald-200 bg-white"> 
												{/* Optional: bg-gray-50 if preferred for submenu background */}
												{link.submenu.map((subLink) => {
													const isSubActive = pathname === subLink.href;
													return (
														<Link
															key={subLink.href}
															href={subLink.href}
															className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
																isSubActive ? "bg-emerald-50 text-emerald-600 font-medium" : "text-gray-600"
															}`}
															onClick={() => setIsOpen(false)}>
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
											isActive ? "bg-emerald-50 text-emerald-600 font-medium" : "text-gray-600"
										}`}
										onClick={() => setIsOpen(false)}>
										{link.label}
									</Link>
								);
							}
							return null; // Should not be reached if navLinks are structured correctly
						})}
					</div>
					<div className="border-t border-gray-200 py-2">
						<button
							onClick={() => {
								handleLogout();
								setIsOpen(false);
							}}
							className="block w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50">
							<div className="flex items-center">
								<FiLogOut size={16} className="mr-2" />
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
