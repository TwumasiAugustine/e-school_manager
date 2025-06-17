import React from 'react';
import { AdmissionFormData } from '@/types/admission';
import { FiEdit3, FiEye, FiTrash2 } from 'react-icons/fi';
import EmptyState from '@/components/EmptyState';

interface StudentCardProps {
	student: AdmissionFormData;
	onEdit: (student: AdmissionFormData) => void;
	onView: (student: AdmissionFormData) => void;
	onDelete: (student: AdmissionFormData) => void;
	index?: number;
	selected: boolean;
	onSelect: (checked: boolean) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({
	student,
	onEdit,
	onView,
	onDelete,
	index,
	selected,
	onSelect,
}) => {
	if (!student) {
		return (
			<div className='flex items-center justify-center min-h-[300px] w-full'>
				<EmptyState
					title='No students found'
					message='There are no students to display. Add a new student to get started.'
					buttonText='Add Student'
					buttonAction={() =>
						window.location.assign('/admin/student/add')
					}
				/>
			</div>
		);
	}
	return (
		<div className='border rounded-lg p-4 flex flex-col bg-gray-50 shadow-sm relative'>
			<input
				type='checkbox'
				className='absolute top-2 left-2 z-10 accent-emerald-500'
				checked={selected}
				onChange={(e) => onSelect(e.target.checked)}
				aria-label={`Select student ${student.firstName} ${student.lastName}`}
			/>
			<div className='flex justify-between items-center mb-2'>
				<span className='text-xs text-gray-500'>
					{typeof index === 'number' ? `No. ${index + 1}` : null}
				</span>
				{student.status === 'active' ? (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						Active
					</span>
				) : (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700'>
						Inactive
					</span>
				)}
			</div>
			<div className='font-semibold text-base mb-1 break-words truncate'>
				{student.firstName} {student.lastName}
			</div>
			<div className='flex flex-col gap-1 text-xs text-gray-700 mb-2'>
				<div className='flex gap-2 flex-wrap'>
					<span className='font-medium text-gray-800'>GR:</span>{' '}
					<span>{student.grNumber}</span>
					<span className='font-medium text-gray-800 ml-4'>
						Class:
					</span>{' '}
					<span>{student.classSection}</span>
				</div>
				<div className='flex gap-2 flex-wrap'>
					<span className='font-medium text-gray-800'>Session:</span>{' '}
					<span>{student.sessionYear}</span>
					<span className='font-medium text-gray-800 ml-4'>
						DOB:
					</span>{' '}
					<span>{student.dob}</span>
				</div>
				<div className='flex gap-2 flex-wrap'>
					<span className='font-medium text-gray-800'>Gender:</span>{' '}
					<span>{student.gender}</span>
					<span className='font-medium text-gray-800 ml-4'>
						Blood Group:
					</span>{' '}
					<span>{student.bloodGroup}</span>
				</div>
				<div className='flex gap-2 flex-wrap'>
					<span className='font-medium text-gray-800'>Guardian:</span>{' '}
					<span>
						{student.guardianFirstName} {student.guardianLastName}
					</span>
				</div>
				<div className='flex gap-2 flex-wrap'>
					<span className='font-medium text-gray-800'>Mobile:</span>{' '}
					<span>{student.guardianMobile}</span>
				</div>
			</div>
			<div className='flex gap-2 mt-auto'>
				<button
					className='bg-purple-300 hover:bg-purple-400 text-white p-2 rounded-full transition-colors duration-150'
					title='Edit'
					onClick={() => onEdit(student)}>
					<FiEdit3 />
				</button>
				<button
					className='bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full transition-colors duration-150'
					title='View'
					onClick={() => onView(student)}>
					<FiEye />
				</button>
				<button
					className='bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors duration-150'
					title='Delete'
					onClick={() => onDelete(student)}>
					<FiTrash2 />
				</button>
			</div>
		</div>
	);
};

export default StudentCard;
