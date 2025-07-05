'use client';
import React, { useEffect, useState } from 'react';
import SchoolAdminList from './components/SchoolAdminList';
import Modal from '@/components/Modal';
import ConfirmDialog from '@/components/ConfirmDialog';
import {
	fetchSchoolsWithAdmins,
	fetchAvailableAdmins,
	assignSchoolToAdmin,
	unassignSchoolFromAdmin,
	School,
	Admin,
} from './services/schoolAssignmentService';
import { showToast } from '@/components/ToastContainer';

const AssignSchoolToAdminPage = () => {
	const [data, setData] = useState<
		{ school: School; admin: Admin | null; assignedAt?: string }[]
	>([]);
	const [loading, setLoading] = useState(true);
	const [assignModalOpen, setAssignModalOpen] = useState(false);
	const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
	const [availableAdmins, setAvailableAdmins] = useState<Admin[]>([]);
	const [assignLoading, setAssignLoading] = useState(false);
	const [confirmUnassignOpen, setConfirmUnassignOpen] = useState(false);
	const [unassignLoading, setUnassignLoading] = useState(false);
	const [selectedAdminId, setSelectedAdminId] = useState<string>('');

	const loadData = async () => {
		setLoading(true);
		const schools = await fetchSchoolsWithAdmins();
		setData(schools);
		setLoading(false);
	};

	useEffect(() => {
		loadData();
	}, []);

	const handleAssign = async (school: School) => {
		setSelectedSchool(school);
		setAssignModalOpen(true);
		setAssignLoading(true);
		const admins = await fetchAvailableAdmins();
		setAvailableAdmins(admins);
		setAssignLoading(false);
		setSelectedAdminId('');
	};

	const handleAssignConfirm = async () => {
		if (!selectedSchool || !selectedAdminId) return;
		setAssignLoading(true);
		await assignSchoolToAdmin(selectedSchool.id, selectedAdminId);
		setAssignModalOpen(false);
		setSelectedSchool(null);
		showToast('School assigned to admin successfully!', 'success');
		await loadData();
		setAssignLoading(false);
	};

	const handleUnassign = (school: School) => {
		setSelectedSchool(school);
		setConfirmUnassignOpen(true);
	};

	const handleUnassignConfirm = async () => {
		if (!selectedSchool) return;
		setUnassignLoading(true);
		await unassignSchoolFromAdmin(selectedSchool.id);
		setConfirmUnassignOpen(false);
		setSelectedSchool(null);
		showToast('Admin unassigned from school.', 'info');
		await loadData();
		setUnassignLoading(false);
	};

	return (
		<div className='container mx-auto p-4 md:p-8'>
			<SchoolAdminList
				data={data}
				onAssign={handleAssign}
				onUnassign={handleUnassign}
				loading={loading}
			/>

			{/* Assign Modal using shared Modal */}
			<Modal
				isOpen={assignModalOpen}
				onClose={() => setAssignModalOpen(false)}
				title={
					selectedSchool
						? `Assign Admin to ${selectedSchool.name}`
						: 'Assign Admin'
				}
				size='md'
				footer={
					<div className='flex justify-end gap-2'>
						<button
							className='px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300'
							onClick={() => setAssignModalOpen(false)}
							disabled={assignLoading}>
							Cancel
						</button>
						<button
							className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
							onClick={handleAssignConfirm}
							disabled={assignLoading || !selectedAdminId}>
							{assignLoading ? 'Assigning...' : 'Assign'}
						</button>
					</div>
				}>
				{assignLoading && availableAdmins.length === 0 ? (
					<div className='py-8 text-center text-gray-500'>
						Loading admins...
					</div>
				) : (
					<div>
						<label htmlFor='admin-select' className='block mb-2 font-medium'>
							Select Admin
						</label>
						<select
							id='admin-select'
							className='w-full border rounded px-3 py-2'
							value={selectedAdminId}
							onChange={(e) => setSelectedAdminId(e.target.value)}
							disabled={assignLoading}>
							<option value=''>-- Select Admin --</option>
							{availableAdmins.map((admin) => (
								<option
									key={admin.id}
									value={admin.id}>
									{admin.name} ({admin.email})
								</option>
							))}
						</select>
					</div>
				)}
			</Modal>

			{/* Confirm Unassign Dialog using shared ConfirmDialog */}
			<ConfirmDialog
				open={confirmUnassignOpen}
				title='Unassign Admin'
				description={`Are you sure you want to unassign the admin from "${
					selectedSchool?.name || ''
				}"?`}
				onConfirm={handleUnassignConfirm}
				onCancel={() => setConfirmUnassignOpen(false)}
				loading={unassignLoading}
				confirmText='Unassign'
				cancelText='Cancel'
			/>
		</div>
	);
};

export default AssignSchoolToAdminPage;
