'use client';
import React, { useState, useEffect } from 'react';
import CreateClass from './components/CreateClass';
import ListClass from './components/ListClass';
import { Class, Teacher } from '@/types/class';
import HeadingWithBadge from '@/components/HeadingWithBadge';
import Modal from '@/components/Modal';
import Loading from '@/components/Loading';
import ClassForm from './components/ClassForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import { showToast } from '@/components/ToastContainer';
import {
	fetchClassesAPI,
	createClassAPI,
	updateClassAPI,
	deleteClassAPI,
} from '@/lib/services/classService';

// Example teacher data (replace with real data or fetch from API)
const initialTeachers: Teacher[] = [
	{ id: 't1', name: 'John Doe' },
	{ id: 't2', name: 'Jane Smith' },
	{ id: 't3', name: 'Bob Johnson' },
	{ id: 't4', name: 'Alice Brown' },
	{ id: 't5', name: 'Charlie Davis' },
];

const ClassPage: React.FC = () => {
	const [classes, setClasses] = useState<Class[]>([]);
	const [teachers] = useState<Teacher[]>(initialTeachers);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [editingClass, setEditingClass] = useState<Class | null>(null);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [confirmClass, setConfirmClass] = useState<Class | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		loadClasses();
	}, []);

	const loadClasses = async () => {
		setIsLoading(true);
		try {
			const data = await fetchClassesAPI();
			setClasses(data);
		} catch (error) {
			showToast('Failed to load classes', 'error');
			console.error('Error loading classes:', error);
		}
		setIsLoading(false);
	};

	const handleAddClass = async (
		newClass: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>,
	) => {
		setIsLoading(true);
		try {
			const createdClass = await createClassAPI(newClass);
			setClasses([createdClass, ...classes]);
			showToast('Class created successfully!', 'success');
		} catch (error) {
			showToast('Failed to create class', 'error');
			console.error('Error creating class:', error);
		}
		setIsLoading(false);
	};
	const handleEdit = (cls: Class) => {
		setEditingClass(cls);
		setEditModalOpen(true);
	};

	const handleUpdate = async (updated: Class) => {
		setIsLoading(true);
		try {
			const updatedClass = await updateClassAPI(updated);
			setClasses((prev) =>
				prev.map((c) => (c.id === updatedClass.id ? updatedClass : c)),
			);
			setEditModalOpen(false);
			setEditingClass(null);
			showToast('Class updated successfully!', 'success');
		} catch (error) {
			showToast('Failed to update class', 'error');
			console.error('Error updating class:', error);
		}
		setIsLoading(false);
	};

	const handleEditCancel = () => {
		setEditModalOpen(false);
		setEditingClass(null);
	};

	const handleRequestDelete = (cls: Class) => {
		setConfirmClass(cls);
		setConfirmOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (confirmClass) {
			setIsLoading(true);
			try {
				await deleteClassAPI(confirmClass.id);
				setClasses((prev) =>
					prev.filter((c) => c.id !== confirmClass.id),
				);
				showToast('Class deleted.', 'info');
			} catch (error) {
				showToast('Failed to delete class', 'error');
				console.error('Error deleting class:', error);
			}
			setIsLoading(false);
		}
		setConfirmOpen(false);
		setConfirmClass(null);
	};

	const handleConfirmCancel = () => {
		setConfirmOpen(false);
		setConfirmClass(null);
	};

	return (
		<div className='min-h-screen bg-gray-50 py-8 px-4 md:px-8'>
			{' '}
			<div className='max-w-6xl mx-auto'>
				<HeadingWithBadge
					title='Manage Class'
					level='h2'
					className='mb-6'
				/>
				{isLoading && (
					<div className='absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-80 rounded-lg'>
						<Loading
							message='Loading class page..'
							size='large'
						/>
					</div>
				)}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<CreateClass
						teachers={teachers}
						onAdd={handleAddClass}
					/>
					<ListClass
						classes={classes}
						teachers={teachers}
						onEdit={handleEdit}
						onRequestDelete={handleRequestDelete}
					/>
				</div>
				<Modal
					isOpen={editModalOpen}
					onClose={handleEditCancel}
					title='Edit Class'
					size='lg'>
					<ClassForm
						classObj={editingClass}
						teachers={teachers}
						mode='edit'
						onSubmit={handleUpdate}
						onCancel={handleEditCancel}
					/>
				</Modal>
				<ConfirmDialog
					isOpen={confirmOpen}
					title='Delete Class'
					message={`Are you sure you want to delete class "${confirmClass?.name}"?`}
					confirmText='Delete'
					cancelText='Cancel'
					onConfirm={handleConfirmDelete}
					onCancel={handleConfirmCancel}
					type='danger'
				/>
			</div>
		</div>
	);
};

export default ClassPage;
