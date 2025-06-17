'use client';
import React from 'react';
import CreateStudent from './components/CreateStudent';
import { AdmissionFormData } from '@/types/admission';
const AdmissionPage = () => {
	const handleSubmit = (data: AdmissionFormData) => {
		// You can handle the submitted data here (e.g., send to API)
		// For now, just log it
		console.log('Admission submitted:', data);
	};

	return (
		<div className='max-w-8xl mx-auto p-4 md:p-8'>
			<CreateStudent onAdd={handleSubmit} />
		</div>
	);
};

export default AdmissionPage;
