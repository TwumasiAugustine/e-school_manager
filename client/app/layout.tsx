'use client';
import { usePathname } from 'next/navigation';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/globals.css';
import Sidebar from '@/components/navigation/Sidebar';
import MobileHeader from '@/components/navigation/MobileHeader';
import ImgPlaceholder from '@/public/placeholder-avatar.png';
import { Suspense, useState, useEffect, useRef } from 'react';
import Loader from './loading';
import ToastContainer from '@/components/ToastContainer';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const sidebarContainerRef = useRef<HTMLElement>(null);
	const pathname = usePathname();

	// Construct className string for body
	const bodyClassNames = [
		geistSans.variable,
		geistMono.variable,
		'antialiased',
	].join(' ');

	// Effect to handle clicks outside of the sidebar
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				!isSidebarCollapsed && // Sidebar is open
				sidebarContainerRef.current && // Sidebar container ref exists
				!sidebarContainerRef.current.contains(event.target as Node) // Click is outside sidebar container
			) {
				setIsSidebarCollapsed(true); // Collapse sidebar
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isSidebarCollapsed, setIsSidebarCollapsed]);

	// Array of paths where navbar and sidebar should be hidden
	const hiddenNavPaths = [
		'/',
		'/auth/login',
		'/auth/register',
		'/auth/forgot-password',
		'/auth/reset-password',
	];
	const showNavAndSidebar = !hiddenNavPaths.includes(pathname);
	return (
		<html lang='en'>
			<body className={`${bodyClassNames} flex flex-col min-h-screen`}>
				<div className='flex flex-col md:flex-row flex-1'>
					{/* Mobile-only Header - only visible on mobile devices */}
					{showNavAndSidebar && (
						<MobileHeader
							userName='Admin User'
							userEmail='admin@eschool.com'
							userRole='admin'
							userImage={ImgPlaceholder}
						/>
					)}
					<div className='flex flex-1'>
						{showNavAndSidebar && (
							<aside
								ref={sidebarContainerRef}
								className='md:flex flex-shrink-0'>
								<Sidebar
									isCollapsed={isSidebarCollapsed}
									setIsCollapsed={setIsSidebarCollapsed}
									userName='Admin User'
									userEmail='admin@eschool.com'
									userRole='admin'
									userImage={ImgPlaceholder}
								/>
							</aside>
						)}
						<div
							className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
								showNavAndSidebar
									? isSidebarCollapsed
										? 'md:ml-16'
										: 'md:ml-64'
									: ''
							}`}>
							<main className='flex-1 p-4'>
								<Suspense fallback={<Loader />}>
									{children}
								</Suspense>
							</main>
							{/* <Footer isCollapsed={isSidebarCollapsed} /> */}
						</div>
					</div>
				</div>
				<ToastContainer position='top-right' />
			</body>
		</html>
	);
}
