'use client';
import React, { useState } from 'react';
import AdminForm, { AdminFormData } from './components/AdminForm';
import { adminService } from './services/adminService';
import { useRouter } from 'next/navigation';
import HeadingWithBadge from '@/components/HeadingWithBadge';
import { showToast } from '@/components/ToastContainer';

const CreateAdminPage = () => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (form: AdminFormData) => {
		setLoading(true);
		try {
			const res = await adminService.createAdmin(form);
			if (res.success) {
				showToast('Admin created successfully!', 'success');
				router.push('/super_admin/admin/list');
			} else {
				showToast(res.message || 'Failed to create admin.', 'error');
			}
		} catch {
			showToast('An error occurred while creating admin.', 'error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='container mx-auto p-4 md:p-8'>
			<div className='mb-6'>
				<HeadingWithBadge
					title='Create Admin'
					level='h2'
				/>
			</div>
			<AdminForm
				onSubmit={handleSubmit}
				loading={loading}
			/>
		</div>
	);
};

export default CreateAdminPage;
