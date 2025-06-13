'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import SchoolForm from '../../add/components/SchoolForm';
import { showToast } from '@/components/ToastContainer';
import { School } from '@/types/school';
import Loading from '@/components/Loading';
import { SchoolService } from '../../list/services/SchoolService';
import EmptyState from '@/components/EmptyState';

const fetchSchool = async (id: string): Promise<School | null> => {
	// Use the mock SchoolService for fetching
	return SchoolService.getSchoolById(Number(id));
};

const updateSchool = async (id: string, data: Record<string, string>) => {
	const res = await fetch(`/super_admin/schools/edit/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});
	if (!res.ok) throw new Error('Failed to update school');
};

const EditSchoolPage: React.FC = () => {
	const router = useRouter();
	const params = useParams();
	const id = params?.id as string;
	const [loading, setLoading] = useState(false);
	const [initialData, setInitialData] = useState<School | null>(null);

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		fetchSchool(id)
			.then((data) => setInitialData(data))
			.finally(() => setLoading(false));
	}, [id]);

	const handleSubmit = async (data: Record<string, string>) => {
		setLoading(true);
		try {
			await updateSchool(id, data);
			showToast('School updated successfully!', 'success');
			router.push('/super_admin/school/list');
		} catch {
			showToast('Failed to update school.', 'error');
		} finally {
			setLoading(false);
		}
	};

	if (loading && !initialData)
		return <Loading message='School is loading...' />;
	if (!initialData) return <EmptyState title="School not found" message="The school you are trying to edit does not exist or could not be loaded." buttonText="Go Back" buttonAction={() => router.push('/super_admin/school/list')} />;

	return (
		<SchoolForm
			onSubmit={handleSubmit}
			loading={loading}
			initialData={initialData}
		/>
	);
};

export default EditSchoolPage;
