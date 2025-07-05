import React, { useEffect, useState } from 'react';
import { AdmissionFormData } from '@/types/admission';
import MultiSelect from '@/components/MultiSelect';
import HeadingWithBadge from '@/components/HeadingWithBadge';
import ActionsBar from './ActionsBar';
import { FiSearch } from 'react-icons/fi';
import EmptyState from '@/components/EmptyState';
import Loading from '@/components/Loading';
import { useRouter } from 'next/navigation';
import { StudentService } from '../services/StudentService';
import StudentTable from './StudentTable';
import StudentCard from './StudentCard';
import Modal from '@/components/Modal';
import AdmissionForm from '../../add/components/AdmissionForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import ToastContainer, { showToast } from '@/components/ToastContainer';

const classSections = ['6 A - English', '6 B - Science'];
const sessionYears = ['2024-2025', '2025-2026'];

const useIsSmallScreen = () => {
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    const check = () => setIsSmall(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isSmall;
};

const ListStudents: React.FC = () => {
  const router = useRouter();
  const [students, setStudents] = useState<AdmissionFormData[]>([]);
  const [tab, setTab] = useState<'active' | 'inactive'>('active');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedSection, setSelectedSection] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<AdmissionFormData | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<AdmissionFormData | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const isSmallScreen = useIsSmallScreen();

  useEffect(() => {
    setLoading(true);
    StudentService.getStudents().then((data) => {
      setStudents(data);
      setLoading(false);
    });
  }, []);

  const filtered = students.filter((s: AdmissionFormData) => {
    const matchesTab = tab === 'active' ? s.status === 'active' : s.status === 'inactive';
    const matchesSection = selectedSection.length === 0 || selectedSection.includes(s.classSection);
    const matchesSession = selectedSession.length === 0 || selectedSession.includes(s.sessionYear);
    const matchesSearch = !search ||
      s.firstName.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName.toLowerCase().includes(search.toLowerCase()) ||
      s.grNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.guardianEmail.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSection && matchesSession && matchesSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedStudents = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleRefresh = async () => {
    setLoading(true);
    setSearch('');
    setCurrentPage(1);
    const data = await StudentService.getStudents();
    setStudents(data);
    setLoading(false);
  };

  // Edit
  const handleEdit = (student: AdmissionFormData) => {
    setEditingStudent(student);
    setEditModalOpen(true);
  };
  const handleEditSubmit = (data: AdmissionFormData) => {
    if (!editingStudent) return;
    const merged = { ...editingStudent, ...data };
    StudentService.updateStudent(editingStudent.grNumber, merged).then((updatedStudent) => {
      if (updatedStudent) {
        setStudents((prev) =>
          prev.map((s) => (s.grNumber === updatedStudent.grNumber ? updatedStudent : s))
        );
      } else {
        showToast('Failed to update student.', 'error');
      }
    });
    showToast('Student updated successfully!', 'success');
    setEditModalOpen(false);
    setEditingStudent(null);
    handleRefresh();
  };
  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditingStudent(null);
  };
  // View
  const handleView = (student: AdmissionFormData) => {
    showToast(`Viewing ${student.firstName} ${student.lastName}`, 'info');
  };
  // Delete
  const handleDelete = (student: AdmissionFormData) => {
    setStudentToDelete(student);
    setConfirmDialogOpen(true);
  };
  const handleDeleteConfirm = () => {
    if (studentToDelete) {
      showToast('Student deleted successfully!', 'success');
      setConfirmDialogOpen(false);
      setStudentToDelete(null);
      handleRefresh();
    }
  };
  const handleDeleteCancel = () => {
    setConfirmDialogOpen(false);
    setStudentToDelete(null);
  };

	const handleExport = () => {
		if (filtered.length === 0) {
			showToast('No students to export.', 'error');
			return;
		}
		const headers = [
			'GR Number',
			'First Name',
			'Last Name',
			'Class Section',
			'Session Year',
			'Status',
			'Guardian Email'
		];
		const rows = filtered.map(s => [
			s.grNumber,
			s.firstName,
			s.lastName,
			s.classSection,
			s.sessionYear,
			s.status,
			s.guardianEmail
		]);
		const csvContent =
			[headers, ...rows]
				.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
				.join('\r\n');
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', 'students.csv');
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
		showToast('Exported students to CSV.', 'success');
	};

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(new Set(paginatedStudents.map((s) => s.grNumber)));
    } else {
      setSelectedStudents(new Set());
    }
  };
  const handleSelectOne = (grNumber: string, checked: boolean) => {
    setSelectedStudents((prev) => {
      const newSet = new Set(prev);
      if (checked) newSet.add(grNumber);
      else newSet.delete(grNumber);
      return newSet;
    });
  };

  // Batch status change
  const handleSetInactive = async () => {
    const grNumbers = Array.from(selectedStudents);
    await StudentService.setInactive(grNumbers);
    showToast('Selected students set to inactive.', 'success');
    setSelectedStudents(new Set());
    handleRefresh();
  };
  const handleSetActive = async () => {
    const grNumbers = Array.from(selectedStudents);
    await StudentService.restore(grNumbers);
    showToast('Selected students set to active.', 'success');
    setSelectedStudents(new Set());
    handleRefresh();
  };

  return (
		<div className='bg-white rounded-lg shadow p-6'>
			<HeadingWithBadge
				title='List Students'
				level='h3'
				className='mb-4'
			/>
			{/* Status Tabs */}
			<div className='flex items-center justify-between gap-2 mb-6'>
				<div className='inline-flex rounded-lg bg-gray-100 p-1 shadow-sm'>
					<button
						className={`px-5 py-2 rounded-md font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
							tab === 'active'
								? 'bg-emerald-600 text-white shadow'
								: 'text-gray-700 hover:bg-gray-200'
						}`}
						onClick={() => setTab('active')}
						aria-pressed={tab === 'active'}>
						Active
					</button>
					<button
						className={`px-5 py-2 rounded-md font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
							tab === 'inactive'
								? 'bg-gray-300 text-gray-700 shadow'
								: 'text-gray-700 hover:bg-gray-200'
						}`}
						onClick={() => setTab('inactive')}
						aria-pressed={tab === 'inactive'}>
						Inactive
					</button>
				</div>
				{tab === 'active' && (
					<button
						className='ml-4 px-4 py-2 rounded-md bg-gray-300 text-gray-700 font-semibold shadow hover:bg-gray-400 transition-colors disabled:opacity-50'
						onClick={handleSetInactive}
						disabled={selectedStudents.size === 0}>
						Set Inactive
					</button>
				)}
				{tab === 'inactive' && (
					<button
						className='ml-4 px-4 py-2 rounded-md bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition-colors disabled:opacity-50'
						onClick={handleSetActive}
						disabled={selectedStudents.size === 0}>
						Set Active
					</button>
				)}
				<div className='flex items-center gap-4'>
					<ActionsBar
						onRefresh={handleRefresh}
						onExport={handleExport}
						onViewChange={setView}
						view={view}
					/>
				</div>
			</div>
			<div className='flex flex-col md:flex-row md:items-center gap-4 mb-4'>
				<div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-4'>
					<MultiSelect
						label='Class Section'
						options={classSections}
						placeholder='Class Section'
						onChange={setSelectedSection}
						maxSelected={classSections.length}
						required
					/>
					<MultiSelect
						label='Session Year'
						options={sessionYears}
						placeholder='Session Year'
						onChange={setSelectedSession}
						maxSelected={sessionYears.length}
						required
					/>
				</div>
			</div>
			<div className='flex flex-col md:flex-row md:items-center gap-4 mb-4'>
				<div className='flex-1 max-w-full md:max-w-[300px] w-full relative'>
					<span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'>
						<FiSearch />
					</span>
					<input
						type='text'
						placeholder='Search by name, GR number, or guardian email...'
						className='w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 transition-all shadow-sm placeholder-gray-400'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						aria-label='Search students'
					/>
				</div>
			</div>
			<div className='relative'>
				{loading && (
					<Loading
						message='Refreshing students...'
						size='medium'
					/>
				)}
				{isSmallScreen || view === 'grid' ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
						{paginatedStudents.length === 0 ? (
							<div className='flex items-center justify-center min-h-[300px] w-full col-span-full'>
								<EmptyState
									title='No students found'
									message='There are no students to display. Add a new student to get started.'
									buttonText='Add Student'
									buttonAction={() =>
										router.push('/admin/student/add')
									}
								/>
							</div>
						) : (
							paginatedStudents.map((student, idx) => (
								<StudentCard
									key={student.grNumber}
									student={student}
									onEdit={handleEdit}
									onView={handleView}
									onDelete={handleDelete}
									index={indexOfFirstItem + idx}
									selected={selectedStudents.has(
										student.grNumber,
									)}
									onSelect={(checked) =>
										handleSelectOne(
											student.grNumber,
											checked,
										)
									}
								/>
							))
						)}
					</div>
				) : (
					<StudentTable
						students={paginatedStudents}
						onEdit={handleEdit}
						onView={handleView}
						onDelete={handleDelete}
						indexOfFirstItem={indexOfFirstItem}
						selected={selectedStudents}
						onSelectAll={handleSelectAll}
						onSelectOne={handleSelectOne}
					/>
				)}
				{/* Pagination Controls */}
				<div className='mt-4 flex flex-col md:flex-row justify-between items-center gap-2'>
					<div className='flex items-center mb-2 md:mb-0'>
						<span className='text-sm text-gray-700 mr-2'>
							Rows per page:
						</span>
						<select
							className='border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500'
							value={itemsPerPage}
							onChange={(e) => {
								setItemsPerPage(Number(e.target.value));
								setCurrentPage(1);
							}}
							title='Select rows per page'>
							<option value={5}>5</option>
							<option value={10}>10</option>
							<option value={25}>25</option>
							<option value={50}>50</option>
						</select>
						<span className='ml-4 text-sm text-gray-700'>
							Showing{' '}
							{filtered.length > 0 ? indexOfFirstItem + 1 : 0}-
							{Math.min(indexOfLastItem, filtered.length)} of{' '}
							{filtered.length}
						</span>
					</div>
					<div className='flex items-center space-x-1'>
						<button
							className='px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50'
							disabled={currentPage === 1}
							onClick={() => setCurrentPage(currentPage - 1)}>
							Previous
						</button>
						{Array.from(
							{ length: Math.min(5, totalPages) },
							(_, i) => {
								let pageNum;
								if (totalPages <= 5) {
									pageNum = i + 1;
								} else if (currentPage <= 3) {
									pageNum = i + 1;
								} else if (currentPage >= totalPages - 2) {
									pageNum = totalPages - 4 + i;
								} else {
									pageNum = currentPage - 2 + i;
								}
								return (
									<button
										key={i}
										className={`px-3 py-1 rounded-md ${
											pageNum === currentPage
												? 'bg-emerald-600 text-white'
												: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
										}`}
										onClick={() => setCurrentPage(pageNum)}>
										{pageNum}
									</button>
								);
							},
						)}
						<button
							className='px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50'
							disabled={
								currentPage === totalPages || totalPages === 0
							}
							onClick={() => setCurrentPage(currentPage + 1)}>
							Next
						</button>
					</div>
				</div>
			</div>
			<Modal
				isOpen={editModalOpen}
				onClose={handleEditCancel}
				title='Edit Student'
				size='xxl5'>
				<AdmissionForm
					onSubmit={handleEditSubmit}
					onCancel={handleEditCancel}
					title='Edit Student'
				/>
			</Modal>
			<ConfirmDialog
				isOpen={confirmDialogOpen}
				title='Delete Student'
				message={`Are you sure you want to delete ${studentToDelete?.firstName} ${studentToDelete?.lastName}?`}
				confirmText='Delete'
				onConfirm={handleDeleteConfirm}
				onCancel={handleDeleteCancel}
				type='danger'
			/>
			<ToastContainer />
		</div>
  );
};

export default ListStudents;
