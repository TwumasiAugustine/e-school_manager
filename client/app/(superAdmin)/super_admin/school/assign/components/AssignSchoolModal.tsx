'use client';
import React, { useState } from 'react';
import type { School, Admin } from '../services/schoolAssignmentService';

interface AssignSchoolModalProps {
	open: boolean;
	school: School | null;
	admins: Admin[];
	onAssign: (adminId: string) => void;
	onClose: () => void;
	loading: boolean;
}

const AssignSchoolModal: React.FC<AssignSchoolModalProps> = ({
	open,
	school,
	admins,
	onAssign,
	onClose,
	loading,
}) => {
	const [selectedAdmin, setSelectedAdmin] = useState<string>('');

	React.useEffect(() => {
		setSelectedAdmin('');
	}, [school, open]);

	if (!open || !school) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30'>
			<div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'>
				<h3 className='text-lg font-semibold mb-4'>
					Assign Admin to {school.name}
				</h3>
				<div className='mb-4'>
					<label
						htmlFor='selectAdmin'
						className='block text-sm font-medium mb-1'>
						Select Admin
					</label>
					<select
						id='selectAdmin'
						className='w-full border border-gray-300 rounded px-3 py-2'
						value={selectedAdmin}
						onChange={(e) => setSelectedAdmin(e.target.value)}
						disabled={loading}>
						<option value=''>-- Select Admin --</option>
						{admins.map((admin) => (
							<option
								key={admin.id}
								value={admin.id}>
								{admin.name} ({admin.email})
							</option>
						))}
					</select>
				</div>
				<div className='flex justify-end gap-2'>
					<button
						className='px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300'
						onClick={onClose}
						disabled={loading}>
						Cancel
					</button>
					<button
						className='px-4 py-2 rounded bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50'
						onClick={() => selectedAdmin && onAssign(selectedAdmin)}
						disabled={!selectedAdmin || loading}>
						Assign
					</button>
				</div>
			</div>
		</div>
	);
};

export default AssignSchoolModal;
