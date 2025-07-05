'use client';

import React, { useState, useEffect } from 'react';
import HeadingWithBadge from '@/components/HeadingWithBadge';
import CreateSubject from './components/CreateSubject';
import ListSubjects from './components/ListSubjects';
import { Subject } from '@/types/subject';
import { showToast } from '@/components/ToastContainer';
import ConfirmDialog from '@/components/ConfirmDialog';
import Loading from '@/components/Loading';
import {
	fetchSubjectsAPI,
	createSubjectAPI,
	deleteSubjectAPI,
} from '@/lib/services/subjectService';

const SubjectPage = () => {
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		loadSubjects();
	}, []);

	const loadSubjects = async () => {
		setIsLoading(true);
		try {
			const data = await fetchSubjectsAPI();
			setSubjects(data);
		} catch (error) {
			showToast('Failed to load subjects', 'error');
			console.error('Error loading subjects:', error);
		}
		setIsLoading(false);
	};

	const handleAdd = async (subject: Omit<Subject, 'id'>) => {
		setIsLoading(true);
		try {
			const newSubject = await createSubjectAPI(subject);
			setSubjects([newSubject, ...subjects]);
			showToast('Subject created successfully!', 'success');
		} catch (error) {
			showToast('Failed to create subject', 'error');
			console.error('Error creating subject:', error);
		}
		setIsLoading(false);
	};

	const handleDelete = async (id: number) => {
		setIsLoading(true);
		try {
			await deleteSubjectAPI(id);
			setSubjects((prev) =>
				prev.map((s) => (s.id === id ? { ...s, trashed: true } : s)),
			);
			showToast('Subject deleted.', 'success');
		} catch (error) {
			showToast('Failed to delete subject', 'error');
			console.error('Error deleting subject:', error);
		}
		setIsLoading(false);
	};

	const handleRequestDelete = (subject: Subject) => {
		setSubjectToDelete(subject);
		setConfirmOpen(true);
	};

	const handleConfirmDelete = () => {
		if (subjectToDelete) {
			handleDelete(subjectToDelete.id);
		}
		setConfirmOpen(false);
		setSubjectToDelete(null);
	};

	const handleCancelDelete = () => {
		setConfirmOpen(false);
		setSubjectToDelete(null);
	};

	return (
		<div className='min-h-screen bg-gray-50 py-8 px-4 md:px-8'>
			<div className='max-w-6xl mx-auto'>
				<HeadingWithBadge
					title='Manage Subject'
					level='h2'
					className='mb-6'
				/>
				{isLoading && (
					<div className='absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-80 rounded-lg'>
						<Loading
							message='Loading subject page...'
							size='large'
						/>
					</div>
				)}
				<div className='grid grid-cols-1  gap-6'>
					<CreateSubject onAdd={handleAdd} />
					<ListSubjects
						subjects={subjects}
						onEdit={() => {}}
						onRequestDelete={handleRequestDelete}
					/>
				</div>
			</div>
			<ConfirmDialog
				isOpen={confirmOpen}
				title='Delete Subject'
				message={`Are you sure you want to delete the subject "${subjectToDelete?.name}"? This action cannot be undone.`}
				confirmText='Delete'
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				type='danger'
			/>
		</div>
	);
};

export default SubjectPage;
