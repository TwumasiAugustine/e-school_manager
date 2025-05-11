"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import { useState, useEffect, useRef } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata export is removed as it's not directly supported in client root layouts.
// Consider alternative ways to set metadata if needed (e.g. in page components or via a server component wrapper)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const sidebarContainerRef = useRef<HTMLElement>(null);

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarCollapsed, setIsSidebarCollapsed]);

  return (
    <html lang="en">
      <body className={bodyClassNames}>
        <div className="flex flex-col md:flex-row min-h-screen">
          <Navbar />
          <div className="flex flex-1">
            <aside ref={sidebarContainerRef} className="md:flex flex-shrink-0">
              <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
            </aside>
            <main className={`flex-1 p-4 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
