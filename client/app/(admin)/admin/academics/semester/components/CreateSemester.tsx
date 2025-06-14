/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React from 'react';
import SemesterForm from './SemesterForm';
import type { Semester } from '@/types/semester';
import HeadingWithBadge from '@/components/HeadingWithBadge';
import { FiPlusCircle } from 'react-icons/fi';

interface CreateSemesterProps {
	onCreate: (
		newSemester: Omit<Semester, 'id' | 'isCurrent' | 'status'>,
	) => void;
	isLoading?: boolean;
}

const CreateSemester: React.FC<CreateSemesterProps> = ({
	onCreate,
	isLoading,
}) => {
	return (
		<div className='bg-white p-6 rounded-lg shadow-md mb-8'>
			<HeadingWithBadge
				title='Create Semester'
				level='h3'
				icon={FiPlusCircle}
				iconColor='text-emerald-500'
				className='mb-4'
			/>
			<div className='mt-6'>
				<SemesterForm
					onSubmit={onCreate}
					mode='create'
				/>
			</div>
		</div>
	);
};

export default CreateSemester;
