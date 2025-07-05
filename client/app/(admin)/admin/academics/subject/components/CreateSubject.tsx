'use client';
import React from 'react';
import HeadingWithBadge from '@/components/HeadingWithBadge';
import SubjectForm from './SubjectForm';
import { Subject } from '@/types/subject';


interface CreateSubjectProps {
	onAdd: (subject: Omit<Subject, 'id'>) => Promise<void>;
}

const CreateSubject: React.FC<CreateSubjectProps> = ({ onAdd }) => {
	return (
		<div className='bg-white rounded-lg shadow p-6 mb-6'>
			<HeadingWithBadge
				title='Create Subject'
				level='h3'
				className='mb-4'
			/>
			<SubjectForm onSubmit={onAdd} mode='create' />
		</div>
	);
};

export default CreateSubject;
