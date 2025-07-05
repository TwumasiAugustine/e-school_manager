'use client';

import React from 'react';
import SchoolForm from './components/SchoolForm';
import { SchoolService } from '../list/services/SchoolService';
import { useRouter } from 'next/navigation';

const AddSchool = () => {
	const router = useRouter();
	const [loading, setLoading] = React.useState(false);

const handleSubmit = async (form: Record<string, string>) => {
	setLoading(true);
	try {
		await SchoolService.createSchool({
			name: form.name,
			logo: form.logo,
			email: form.email,
			phone: form.phone,
			tagline: form.tagline,
			address: form.address,
			plan: 'Basic', // or from form if needed
			isEmailVerified: false,
			adminName: '',
			adminEmail: ''
		});
		router.push('/super_admin/school/list');
	} finally {
		setLoading(false);
	}
};

	return (
		<div className='py-8 px-2 md:px-0'>
			<SchoolForm
				onSubmit={handleSubmit}
				loading={loading}
			/>
		</div>
	);
};

export default AddSchool;
