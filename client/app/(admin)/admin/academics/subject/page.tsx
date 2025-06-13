'use client';

import React, { useState } from 'react';
import HeadingWithBadge from '@/components/HeadingWithBadge';
import CreateSubject from './components/CreateSubject';
import ListSubjects from './components/ListSubjects';
import { Subject } from '@/types/subject';
import { showToast } from '@/components/ToastContainer';
import ConfirmDialog from '@/components/ConfirmDialog';

const initialSubjects: Subject[] = [
	{
		id: 1,
		name: 'Strategic Management',
		code: 'SM',
		type: 'Theory',
		bgColor: '#bcd6ac',
		image: '/subject1.png',
	},
	{
		id: 2,
		name: 'Social Welfare Administration',
		code: 'SWA',
		type: 'Theory',
		bgColor: '#ebab94',
		image: '/subject2.png',
	},
];

const SubjectPage = () => {
	const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

	const handleAdd = (subject: Subject) => {
		setSubjects([subject, ...subjects]);
		showToast('Subject created successfully!', 'success');
	};

	const handleDelete = (id: number) => {
		setSubjects((prev) =>
			prev.map((s) => (s.id === id ? { ...s, trashed: true } : s)),
		);
		showToast('Subject deleted.', 'success');
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
