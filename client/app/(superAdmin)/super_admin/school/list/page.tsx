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
import { showToast } from '@/components/ToastContainer';
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
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
	const [schoolToDelete, setSchoolToDelete] = useState<number | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [itemsPerPage, setItemsPerPage] = useState<number>(10);

	const router = useRouter();

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
			showToast('Failed to load school details.', 'error');
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
				showToast('School deleted successfully.', 'success');
			}
		} catch (error) {
			console.error('Failed to delete school:', error);
			showToast('Failed to delete school.', 'error');
		} finally {
			setDeleteConfirmOpen(false);
			setSchoolToDelete(null);
		}
	};

	const handleRefresh = async () => {
		setRefreshing(true);
		try {
			const data = await SchoolService.getSchools();
			setSchools(data);
			setFilteredSchools(data);
			showToast('Schools refreshed successfully.', 'success');
		} catch (error) {
			console.error('Failed to refresh schools:', error);
			showToast('Failed to refresh schools.', 'error');
		} finally {
			setRefreshing(false);
		}
	};

	const handleExport = async (type: string) => {
		try {
			await SchoolService.exportSchools(type);
			showToast(`Exporting data as ${type}...`, 'success');
		} catch (error) {
			console.error('Failed to export schools:', error);
			showToast('Failed to export schools.', 'error');
		}
	};

	const handleItemsPerPageChange = (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		setItemsPerPage(Number(e.target.value));
		setCurrentPage(1); // Reset to first page when changing items per page
	};

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
				) : (
					<div className='relative'>
						{refreshing && (
							<Loading
								message='Refreshing schools...'
								size='medium'
							/>
						)}
						{viewType === 'list' ? (
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
					</div>
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
				message={(() => {
					const school = schools.find((s) => s.id === schoolToDelete);
					return school
						? `Are you sure you want to delete ${school.name}? This action cannot be undone.`
						: 'Are you sure you want to delete this school? This action cannot be undone.';
				})()}
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
