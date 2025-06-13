'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SchoolTable from './components/SchoolTable';
import SchoolGrid from './components/SchoolGrid';
import ActionsBar from './components/ActionsBar';
import SchoolFilters from './components/SchoolFilters';
import SchoolModal from './components/SchoolModal';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import HeadingWithBadge from '@/components/HeadingWithBadge';
import { useToast } from '@/providers/ToastProvider';
import { SchoolService } from './services/SchoolService';
import { School } from '@/types/school';

const SchoolListPage = () => {
	const [schools, setSchools] = useState<School[]>([]);
	const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [planFilter, setPlanFilter] = useState<string>('');
	const [verificationFilter, setVerificationFilter] = useState<string>('');
	const [viewType, setViewType] = useState<'grid' | 'list'>('list');
	const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
	const [schoolToDelete, setSchoolToDelete] = useState<number | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);

	const router = useRouter();
	const { showToast: toast } = useToast();

	// Fetch schools on component mount
	useEffect(() => {
		const fetchSchools = async () => {
			setLoading(true);
			try {
				const data = await SchoolService.getSchools();
				setSchools(data);
				setFilteredSchools(data);
			} catch (error) {
				console.error('Failed to fetch schools:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchSchools();
	}, []);

	// Apply filters when filter criteria change
	useEffect(() => {
		let filtered = schools;

		// Apply search filter
		if (searchTerm) {
			filtered = filtered.filter(
				(school) =>
					school.name
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					school.email
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					school.adminName
						.toLowerCase()
						.includes(searchTerm.toLowerCase()),
			);
		}

		// Apply plan filter
		if (planFilter) {
			filtered = filtered.filter((school) => school.plan === planFilter);
		}

		// Apply verification filter
		if (verificationFilter) {
			const isVerified = verificationFilter === 'verified';
			filtered = filtered.filter(
				(school) => school.isEmailVerified === isVerified,
			);
		}

		setFilteredSchools(filtered);
		setCurrentPage(1); // Reset to first page on filter change
	}, [searchTerm, planFilter, verificationFilter, schools]);

	// Handlers
	const handleViewSchool = async (id: number) => {
		try {
			const school = await SchoolService.getSchoolById(id);
			if (school) {
				setSelectedSchool(school);
				setIsModalOpen(true);
			}
		} catch (error) {
			console.error('Failed to fetch school details:', error);
			toast('Failed to load school details.', 'error');
		}
	};

	const handleEditSchool = (school: School) => {
		// Navigate to edit page with the school id
		router.push(`/super_admin/school/edit/${school.id}`);
	};

	const handleDeleteSchool = (id: number) => {
		setSchoolToDelete(id);
		setDeleteConfirmOpen(true);
	};

	const confirmDeleteSchool = async () => {
		if (schoolToDelete === null) return;

		try {
			const success = await SchoolService.deleteSchool(schoolToDelete);
			if (success) {
				setSchools((prevSchools) =>
					prevSchools.filter(
						(school) => school.id !== schoolToDelete,
					),
				);
				setFilteredSchools((prevFiltered) =>
					prevFiltered.filter(
						(school) => school.id !== schoolToDelete,
					),
				);
				toast('School deleted successfully.', 'success');
			}
		} catch (error) {
			console.error('Failed to delete school:', error);
			toast('Failed to delete school.', 'error');
		} finally {
			setDeleteConfirmOpen(false);
			setSchoolToDelete(null);
		}
	};

	const handleRefresh = async () => {
		setLoading(true);
		try {
			const data = await SchoolService.getSchools();
			setSchools(data);
			setFilteredSchools(data);
			toast('Schools refreshed successfully.', 'success');
		} catch (error) {
			console.error('Failed to refresh schools:', error);
			toast('Failed to refresh schools.', 'error');
		} finally {
			setLoading(false);
		}
	};

	const handleExport = async (type: string) => {
		try {
			await SchoolService.exportSchools(type);
			toast(`Exporting data as ${type}...`, 'success');
		} catch (error) {
			console.error('Failed to export schools:', error);
			toast('Failed to export schools.', 'error');
		}
	};

	const handleItemsPerPageChange = (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		setItemsPerPage(Number(e.target.value));
		setCurrentPage(1); // Reset to first page when changing items per page
	};

	// const handleCreateSchool = async (schoolData: Omit<School, 'id'>) => {
	// 	try {
	// 		const newSchool = await SchoolService.createSchool(schoolData);
	// 		setSchools((prev) => [...prev, newSchool]);
	// 		setFilteredSchools((prev) => [...prev, newSchool]);
	// 		toast('School created successfully.', 'success');
	// 	} catch (error) {
	// 		toast('Failed to create school.', 'error');
	// 	}
	// };

	// const handleUpdateSchool = async (id: number, schoolData: Partial<School>) => {
	// 	try {
	// 		const updatedSchool = await SchoolService.updateSchool(id, schoolData);
	// 		if (updatedSchool) {
	// 			setSchools((prev) => prev.map((s) => (s.id === id ? updatedSchool : s)));
	// 			setFilteredSchools((prev) => prev.map((s) => (s.id === id ? updatedSchool : s)));
	// 			toast('School updated successfully.', 'success');
	// 		}
	// 	} catch (error) {
	// 		toast('Failed to update school.', 'error');
	// 	}
	// };

	// Calculate pagination
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredSchools.slice(
		indexOfFirstItem,
		indexOfLastItem,
	);

	if (loading) {
		return <Loading />;
	}

	if (schools.length === 0) {
		return (
			<EmptyState
				title='No Schools Found'
				message='There are no schools registered in the system yet.'
				buttonText='Add School'
				buttonAction={() => router.push('/super_admin/school/add')}
			/>
		);
	}

	return (
		<div>
			<div className='bg-white rounded-lg shadow-md p-6 mb-6'>
				<div className='flex justify-between items-center mb-6'>
					<HeadingWithBadge
						title='Schools'
						count={schools.length}
						level='h2'
					/>
					<button
						onClick={() => router.push('/super_admin/school/add')}
						className='px-4 py-2 text-sm md:text-base bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'>
						Add New School
					</button>
				</div>

				<SchoolFilters
					onPlanChange={setPlanFilter}
					onVerificationChange={setVerificationFilter}
					onSearch={setSearchTerm}
				/>

				<div className='mb-6'>
					<ActionsBar
						onRefresh={handleRefresh}
						onExport={handleExport}
						onViewChange={setViewType}
						searchTerm={searchTerm}
						onSearchChange={setSearchTerm}
					/>
				</div>

				{filteredSchools.length === 0 ? (
					<div className='bg-white p-6 rounded-lg border border-gray-200 text-center'>
						<p className='text-gray-500'>
							No schools matching your search criteria.
						</p>
					</div>
				) : viewType === 'list' ? (
					<SchoolTable
						schools={currentItems}
						currentPage={currentPage}
						itemsPerPage={itemsPerPage}
						totalSchools={filteredSchools.length}
						onPageChange={setCurrentPage}
						onItemsPerPageChange={handleItemsPerPageChange}
						onView={handleViewSchool}
						onEdit={handleEditSchool}
						onDelete={handleDeleteSchool}
					/>
				) : (
					<SchoolGrid
						schools={currentItems}
						onView={handleViewSchool}
						onEdit={handleEditSchool}
						onDelete={handleDeleteSchool}
					/>
				)}

				{filteredSchools.length > 0 && (
					<div className='mt-4 text-right text-sm text-gray-500'>
						Showing {currentItems.length} of{' '}
						{filteredSchools.length} total schools
					</div>
				)}
			</div>

			{/* School Details Modal */}
			<SchoolModal
				school={selectedSchool}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onEdit={handleEditSchool}
			/>

			{/* Delete Confirmation Dialog */}
			<ConfirmDialog
				isOpen={deleteConfirmOpen}
				title='Delete School'
				message='Are you sure you want to delete this school? This action cannot be undone.'
				confirmText='Delete School'
				cancelText='Cancel'
				onConfirm={confirmDeleteSchool}
				onCancel={() => setDeleteConfirmOpen(false)}
				type='danger'
			/>
		</div>
	);
};

export default SchoolListPage;
