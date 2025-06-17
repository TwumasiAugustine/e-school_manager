import React from 'react';
import AdmissionForm from './AdmissionForm';
import { AdmissionFormData } from '@/types/admission';

interface CreateStudentProps {
	onAdd: (data: AdmissionFormData) => void;
}

const CreateStudent: React.FC<CreateStudentProps> = ({ onAdd }) => {
	return (
		<div className='bg-white rounded-lg shadow p-6'>
			<AdmissionForm onSubmit={onAdd} />
		</div>
	);
};

export default CreateStudent;
