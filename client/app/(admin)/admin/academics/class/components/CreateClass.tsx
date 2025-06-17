import React from 'react';
import { Class, Teacher } from '@/types/class';
import HeadingWithBadge from '@/components/HeadingWithBadge';
import { FiPlusCircle } from 'react-icons/fi';
import ClassForm from './ClassForm';

interface CreateClassProps {
	teachers: Teacher[];
	onAdd: (newClass: Class) => void;
}

const CreateClass: React.FC<CreateClassProps> = ({ teachers, onAdd }) => {
	return (
		<div className='bg-white rounded-lg shadow p-6'>
			<HeadingWithBadge
				title='Create Class'
				icon={FiPlusCircle}
				iconColor='text-emerald-500'
				level='h3'
				className='mb-4'
			/>
			<ClassForm
				onSubmit={onAdd}
				teachers={teachers}
				mode='create'
			/>
		</div>
	);
};

export default CreateClass;
