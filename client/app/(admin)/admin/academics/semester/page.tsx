'use client';
import React, { useState, useEffect, useCallback } from 'react';
import CreateAcademicYear from './components/CreateAcademicYear';
import ListAcademicYear from './components/ListAcademicYear';
import ConfirmDialog from '@/components/ConfirmDialog';
import { showToast } from '@/components/ToastContainer';
import type { Semester } from '@/types/semester';
import {
	fetchAcademicYearsAPI,
	createAcademicYearAPI,
	updateAcademicYearAPI,
	deleteAcademicYearAPI,
	setCurrentAcademicYearAPI,
} from '@/lib/services/academicYearService';

const AcademicYearPage = () => {
	const [semesters, setSemesters] = useState<Semester[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentView, setCurrentView] = useState<'list' | 'grid'>('list');
	const [currentFilter] = useState<'all' | 'trashed'>('all');
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [semesterToDelete, setSemesterToDelete] = useState<Semester | null>(
		null,
	);
	const [isSmallScreen, setIsSmallScreen] = useState(false);

	const loadSemesters = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await fetchAcademicYearsAPI(currentFilter);
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

	useEffect(() => {
		const checkScreen = () => setIsSmallScreen(window.innerWidth < 768);
		checkScreen();
		window.addEventListener('resize', checkScreen);
		return () => window.removeEventListener('resize', checkScreen);
	}, []);

	const handleViewChange = () => {
		// Toggle between grid and list, but always grid on small screens
		if (isSmallScreen) {
			setCurrentView('grid');
		} else {
			setCurrentView((prev) => (prev === 'list' ? 'grid' : 'list'));
		}
	};

	const handleCreateAcademicYear = async (
		newSemesterData: Omit<
			Semester,
			'id' | 'isCurrent' | 'status' | 'createdAt' | 'updatedAt'
		>,
	) => {
		setIsLoading(true);
		try {
			const createdSemester = await createAcademicYearAPI(
				newSemesterData,
			);
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
			await updateAcademicYearAPI(semesterToUpdate);
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
			await deleteAcademicYearAPI(id);
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
			await setCurrentAcademicYearAPI(id);
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
			<CreateAcademicYear onCreate={handleCreateAcademicYear} />
			<ListAcademicYear
				semesters={filteredSemesters}
				isLoading={isLoading}
				onEdit={handleEditSemester}
				onDelete={(_id) => {
					const semester = filteredSemesters.find(
						(s) => s.id === _id,
					);
					if (semester) handleRequestDelete(semester);
				}}
				onSetCurrent={handleSetCurrentSemester}
				currentView={isSmallScreen ? 'grid' : currentView}
				currentFilter={currentFilter}
				onViewChange={handleViewChange}
				onRefresh={handleRefresh}
				onExport={handleExport}
				isSmallScreen={isSmallScreen}
			/>
			<ConfirmDialog
				confirmText='Delete'
				isOpen={confirmOpen}
				type='danger'
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				message={
					semesterToDelete
						? `Are you sure you want to delete "${semesterToDelete.name}"?`
						: 'Are you sure you want to delete this semester?'
				}
				title='Confirm Deletion'
			/>
		</div>
	);
};

export default AcademicYearPage;
