import React from 'react';
import { AdmissionFormData } from '@/types/admission';
import { FiEdit3, FiEye, FiTrash2 } from 'react-icons/fi';
import EmptyState from '@/components/EmptyState';

interface StudentTableProps {
	students: AdmissionFormData[];
	onEdit: (student: AdmissionFormData) => void;
	onView: (student: AdmissionFormData) => void;
	onDelete: (student: AdmissionFormData) => void;
	indexOfFirstItem: number;
	selected: Set<string>;
	onSelectAll: (checked: boolean) => void;
	onSelectOne: (grNumber: string, checked: boolean) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({
	students,
	onEdit,
	onView,
	onDelete,
	indexOfFirstItem,
	selected,
	onSelectAll,
	onSelectOne,
}) => (
	<>
		{students.length === 0 ? (
			<div className='flex flex-col items-center justify-center min-h-[300px] w-full'>
				<EmptyState
					title='No students found'
					message='There are no students to display. Add a new student to get started.'
					buttonText='Add Student'
					buttonAction={() =>
						window.location.assign('/admin/student/add')
					}
				/>
			</div>
		) : (
			<div className='w-full overflow-x-auto'>
				<table className='min-w-full bg-white'>
					<thead className='sticky top-0 z-10 bg-gray-50 border-b border-gray-200'>
						<tr>
							<th className='px-4 py-2'>
								<input
									type='checkbox'
									checked={
										students.length > 0 &&
										students.every((s) =>
											selected.has(s.grNumber),
										)
									}
									onChange={(e) =>
										onSelectAll(e.target.checked)
									}
									className='accent-emerald-500'
									aria-label='Select all students'
									title='Select all students'
								/>
							</th>
							<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
								No.
							</th>
							<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
								GR Number
							</th>
							<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
								Name
							</th>
							<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
								DOB
							</th>
							<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
								Class
							</th>
							<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
								Session
							</th>
							<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
								Admission Date
							</th>
							<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
								Status
							</th>
							<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
								Gender
							</th>
							<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
								Address
							</th>
							<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
								Blood Group
							</th>
							<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
								Guardian Email
							</th>
							<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
								Guardian Name
							</th>
							<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
								Guardian Mobile
							</th>
							<th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{students.map((student, idx) => (
							<tr
								key={student.grNumber}
								className='border-t border-gray-100 hover:bg-emerald-50'>
								<td className='px-4 py-2'>
									<input
										type='checkbox'
										checked={selected.has(student.grNumber)}
										onChange={(e) =>
											onSelectOne(
												student.grNumber,
												e.target.checked,
											)
										}
										className='accent-emerald-500'
										aria-label={`Select student ${student.firstName} ${student.lastName}`}
									/>
								</td>
								<td className='px-4 py-2'>
									{indexOfFirstItem + idx + 1}
								</td>
								<td className='px-4 py-2'>
									{student.grNumber}
								</td>
								<td className='px-4 py-2'>
									{student.firstName} {student.lastName}
								</td>
								<td className='px-4 py-2'>{student.dob}</td>
								<td className='px-4 py-2'>
									{student.classSection}
								</td>
								<td className='px-4 py-2'>
									{student.sessionYear}
								</td>
								<td className='px-4 py-2'>
									{student.admissionDate}
								</td>
								<td className='px-4 py-2'>
									{student.status === 'active' ? (
										<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
											Active
										</span>
									) : (
										<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700'>
											Inactive
										</span>
									)}
								</td>
								<td className='px-4 py-2'>{student.gender}</td>
								<td className='px-4 py-2'>{student.address}</td>
								<td className='px-4 py-2'>
									{student.bloodGroup}
								</td>
								<td className='px-4 py-2'>
									{student.guardianEmail}
								</td>
								<td className='px-4 py-2'>
									{student.guardianFirstName}{' '}
									{student.guardianLastName}
								</td>
								<td className='px-4 py-2'>
									{student.guardianMobile}
								</td>
								<td className='px-4 py-2 flex space-x-2'>
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
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		)}
	</>
);

export default StudentTable;
