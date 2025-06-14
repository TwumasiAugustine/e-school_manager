'use client';
import React, { useState, useEffect, useCallback } from 'react';
import CreateSemester from './components/CreateSemester';
import ListSemesters from './components/ListSemesters';
import HeadingWithBadge from '@/components/HeadingWithBadge';
import SemesterActionsBar from './components/SemesterActionsBar';
import { FiCalendar } from 'react-icons/fi';
import ConfirmDialog from '@/components/ConfirmDialog';
import { showToast } from '@/components/ToastContainer'; // Changed toast import
import type { Semester } from '@/types/semester';

// Mock API call functions (replace with actual API calls)
const fetchSemestersAPI = async (
	filter: 'all' | 'trashed' = 'all',
): Promise<Semester[]> => {
	console.log(`Fetching semesters with filter: ${filter}`);
	await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
	// Simulate fetching based on filter
	const allSemesters: Semester[] = [
		{
			id: 'sem1',
			name: 'First Semester 2024',
			startMonth: 'January',
			endMonth: 'May',
			isCurrent: true,
			status: 'active',
		},
		{
			id: 'sem2',
			name: 'Second Semester 2024',
			startMonth: 'August',
			endMonth: 'December',
			status: 'active',
		},
		{
			id: 'sem3',
			name: 'Summer Break 2024',
			startMonth: 'June',
			endMonth: 'July',
			status: 'trashed',
		},
		{
			id: 'sem4',
			name: 'First Semester 2025',
			startMonth: 'January',
			endMonth: 'May',
			status: 'active',
		},
	];
	if (filter === 'trashed') {
		return allSemesters.filter((s) => s.status === 'trashed');
	}
	return allSemesters.filter((s) => s.status !== 'trashed');
};

const createSemesterAPI = async (
	data: Omit<Semester, 'id' | 'isCurrent' | 'status'>,
): Promise<Semester> => {
	console.log('Creating semester:', data);
	await new Promise((resolve) => setTimeout(resolve, 500));
	return {
		...data,
		id: `sem-${Date.now()}`,
		isCurrent: false,
		status: 'active',
	};
};

const updateSemesterAPI = async (semester: Semester): Promise<Semester> => {
	console.log('Updating semester:', semester);
	await new Promise((resolve) => setTimeout(resolve, 500));
	return semester;
};

const deleteSemesterAPI = async (id: string | number): Promise<void> => {
	console.log('Deleting semester:', id);
	await new Promise((resolve) => setTimeout(resolve, 500));
};

const setCurrentSemesterAPI = async (
	id: string | number,
): Promise<Semester> => {
	console.log('Setting current semester:', id);
	await new Promise((resolve) => setTimeout(resolve, 500));
	// In a real app, this would update the backend and then fetch the updated list
	// For mock, we'll just return a modified semester object
	return {
		id,
		name: 'Updated Semester',
		startMonth: 'Jan',
		endMonth: 'May',
		isCurrent: true,
		status: 'active',
	};
};




const SemesterPage = () => {
	const [semesters, setSemesters] = useState<Semester[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentView, setCurrentView] = useState<'list' | 'grid'>('list');
	const [currentFilter, setCurrentFilter] = useState<'all' | 'trashed'>(
		'all',
	);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [semesterToDelete, setSemesterToDelete] = useState<Semester | null>(
		null,
	);

	const loadSemesters = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await fetchSemestersAPI(currentFilter);
			setSemesters(data);
		} catch (error) {
			showToast('Failed to load semesters', 'error');
			console.error('Error loading semesters:', error);
		}
		setIsLoading(false);
	}, [currentFilter]);

	useEffect(() => {
		loadSemesters();
	}, [loadSemesters]);

	const handleCreateSemester = async (
		newSemesterData: Omit<Semester, 'id' | 'isCurrent' | 'status'>,
	) => {
		setIsLoading(true);
		try {
			const createdSemester = await createSemesterAPI(newSemesterData);
			setSemesters((prev) => [createdSemester, ...prev]);
			showToast('Semester created successfully!', 'success');
			loadSemesters(); // Refresh list
		} catch (error) {
			showToast('Failed to create semester', 'error');
			console.error('Error creating semester:', error);
		}
		setIsLoading(false);
	};

	const handleEditSemester = async (semesterToUpdate: Semester) => {
		setIsLoading(true);
		try {
			await updateSemesterAPI(semesterToUpdate);
			showToast('Semester updated successfully!', 'success');
			loadSemesters(); // Refresh list
		} catch (error) {
			showToast('Failed to update semester', 'error');
			console.error('Error updating semester:', error);
		}
		setIsLoading(false);
	};

	const handleDeleteSemester = async (id: string | number) => {
		setIsLoading(true);
		try {
			await deleteSemesterAPI(id);
			showToast('Semester deleted successfully!', 'success');
			loadSemesters(); // Refresh list
		} catch (error) {
			showToast('Failed to delete semester', 'error');
			console.error('Error deleting semester:', error);
		}
		setIsLoading(false);
	};

	const handleSetCurrentSemester = async (id: string | number) => {
		setIsLoading(true);
		try {
			await setCurrentSemesterAPI(id);
			showToast('Semester set to current successfully!', 'success');
			loadSemesters(); // Refresh the list to reflect the change
		} catch (error) {
			showToast('Failed to set current semester', 'error');
			console.error('Error setting current semester:', error);
		}
		setIsLoading(false);
	};

	const handleRefresh = () => {
		showToast('Refreshing semester data...', 'info');
		loadSemesters();
	};

	const handleExport = () => {
		showToast('Exporting data... (Not implemented)', 'info');
		console.log('Export data clicked');
		// Implement export logic here
	};

	const handleRequestDelete = (semester: Semester) => {
		setSemesterToDelete(semester);
		setConfirmOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (semesterToDelete) {
			await handleDeleteSemester(semesterToDelete.id);
		}
		setConfirmOpen(false);
		setSemesterToDelete(null);
	};

	const handleCancelDelete = () => {
		setConfirmOpen(false);
		setSemesterToDelete(null);
	};

	const filteredSemesters = semesters.filter((semester) =>
		semester.name.toLowerCase().includes(''),
	);

	return (
		<div className='container mx-auto p-4 md:p-6 lg:p-8'>
			<CreateSemester
				onCreate={handleCreateSemester}
				isLoading={isLoading}
			/>
			<div className='mt-8 bg-white p-6 rounded-lg shadow-md'>
				<HeadingWithBadge
					title='List Semesters'
					badgeText={`${filteredSemesters.length}`}
					icon={FiCalendar}
					level='h2' // Explicitly set level
					iconColor='text-slate-700' // Example color, adjust as needed
                />
                
				<ListSemesters
					semesters={filteredSemesters}
					isLoading={isLoading}
					onEdit={handleEditSemester}
					onDelete={(_id) => {
						// Use the correct delete handler for the ConfirmDialog
						const semester = filteredSemesters.find(
							(s) => s.id === _id,
						);
						if (semester) handleRequestDelete(semester);
					}}
					onSetCurrent={handleSetCurrentSemester}
					currentView={currentView}
					currentFilter={currentFilter}
				/>
			</div>
			
			<ConfirmDialog
				isOpen={confirmOpen}
				title='Delete Semester'
				message={`Are you sure you want to delete the semester "${semesterToDelete?.name}"? This action cannot be undone.`}
				confirmText='Delete'
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				type='danger'
			/>
		</div>
	);
};

export default SemesterPage;
