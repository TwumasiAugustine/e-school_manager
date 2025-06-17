'use client';

import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const StudentLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className='bg-gray-50 min-h-screen w-full'>
            <div className=' max-w-7xl px-4 py-6'>
                <div className='mb-6'>
                    <h1 className='text-2xl font-bold text-gray-800'>
                        Manage Students
                    </h1>
                    <p className='text-gray-600'>
                        Manage students&apos; profile information, enrollments, and academic records.
                    </p>
                </div>
                {children}
            </div>
        </div>
    );
};

export default StudentLayout;
