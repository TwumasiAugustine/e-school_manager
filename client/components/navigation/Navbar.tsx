"use client";

import Link from "next/link";
import Image from "next/image"; // Import Image component
import { useState, useEffect, useRef } from "react"; // Import useEffect and useRef
import { usePathname } from 'next/navigation'; // Import usePathname

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null); // Ref for the mobile menu
    const mobileMenuButtonRef = useRef<HTMLButtonElement>(null); // Ref for the mobile menu button
    const pathname = usePathname(); // Get current pathname

    const navLinks = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/students", label: "Students" },
        { href: "/teachers", label: "Teachers" },
        { href: "/classes", label: "Classes" },
        { href: "/profile", label: "Profile" },
    ];

    // Placeholder logout function
    const handleLogout = () => {
        console.log("Logout clicked from Navbar");
        alert('Logout clicked from Nav')
        // Actual logout logic will go here (e.g., call an API, clear session, redirect)
    };

    // Effect to handle clicks outside of the mobile menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && 
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
    }, [isOpen, setIsOpen]); 

    return (
        <nav className="bg-gray-800 text-white p-4 md:hidden">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2 text-xl font-bold">
                    <Image src="/next.svg" alt="School Logo" width={28} height={28} className="dark:invert" />
                    <span>SchoolName</span>
                </Link>
                {/* Desktop Menu - This part is hidden on md screens due to nav's md:hidden, but structure is for larger screens if that class is removed */}
                <div className="hidden md:flex space-x-4 items-center">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.href} href={link.href} className={`hover:text-gray-300 ${isActive ? 'text-sky-400 font-semibold' : ''}`}>
                                {link.label}
                            </Link>
                        );
                    })}
                    <button onClick={handleLogout} className="hover:text-gray-300 bg-red-500 hover:bg-red-600 px-3 py-1 rounded">
                        Logout
                    </button>
                </div>
                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button type="button" onClick={() => setIsOpen(!isOpen)} ref={mobileMenuButtonRef}>
                        <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>
            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden mt-2" ref={mobileMenuRef}> {/* Attach ref to mobile menu container */}
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-4 py-2 hover:bg-gray-700 ${isActive ? 'bg-gray-700 font-semibold' : ''}`}
                                onClick={() => setIsOpen(false)} 
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                    <button 
                        onClick={() => {
                            handleLogout();
                            setIsOpen(false); // Close menu on logout click
                        }}
                        className="block w-full text-left px-4 py-2 bg-red-500 hover:bg-red-600 mt-1 rounded text-white"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
