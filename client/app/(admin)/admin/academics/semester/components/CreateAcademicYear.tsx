'use client';
import React from 'react';
import AcademicYearForm from './AcademicYearForm';
import type { Semester } from '@/types/semester';
import HeadingWithBadge from '@/components/HeadingWithBadge';


interface CreateAcademicYearProps {
	onCreate: (
		data: Omit<Semester, 'id' | 'isCurrent' | 'status' | 'createdAt' | 'updatedAt'>,
	) => void;
}

const CreateAcademicYear: React.FC<CreateAcademicYearProps> = ({ onCreate }) => {
	return (
		<div className='bg-white p-6 rounded-lg shadow-md mb-8'>
			<HeadingWithBadge
				title='Create Academic Year'
				level='h3'
				iconColor='text-emerald-500'
				className='mb-4'
			/>
			<div className='mt-6'>
				<AcademicYearForm
					onSubmit={onCreate}
					mode='create'
				/>
			</div>
		</div>
	);
};

export default CreateAcademicYear;
