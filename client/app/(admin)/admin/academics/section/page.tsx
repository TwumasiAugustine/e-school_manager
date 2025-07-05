/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';

import HeadingWithBadge from '@/components/HeadingWithBadge';
import { showToast } from '@/components/ToastContainer';
import ConfirmDialog from '@/components/ConfirmDialog';
import Loading from '@/components/Loading'
import CreateSection from './components/CreateSection';
import ListSections from './components/ListSections';
import {
	Section,
	fetchSectionsAPI,
	createSectionAPI,
	updateSectionAPI,
	deleteSectionAPI,
} from '@/lib/services/sectionService';

const SectionPage: React.FC = () => {
	const [sections, setSections] = useState<Section[]>([]);
	const [search, setSearch] = useState('');
	const [tab, setTab] = useState<'all' | 'trashed'>('all');
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editName, setEditName] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [loading, setLoading] = useState(false);
	const [view, setView] = useState<'list' | 'grid'>('list');
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogType, setDialogType] = useState<'delete' | 'restore' | null>(
		null,
	);
	const [dialogSection, setDialogSection] = useState<Section | null>(null);

	useEffect(() => {
		loadSections();
	}, []);

	const loadSections = async () => {
		setLoading(true);
		try {
			const data = await fetchSectionsAPI();
			setSections(data);
		} catch (error) {
			showToast('Failed to load sections', 'error');
			console.error('Error loading sections:', error);
		}
		setLoading(false);
	};

	const handleAdd = async (name: string) => {
		setLoading(true);
		try {
			const newSection = await createSectionAPI({ name });
			setSections([newSection, ...sections]);
			showToast('Section created successfully!', 'success');
		} catch (error) {
			showToast('Failed to create section', 'error');
			console.error('Error creating section:', error);
		}
		setLoading(false);
	};
	const handleEdit = (id: string, currentName: string) => {
		setEditingId(id);
		setEditName(currentName);
	};
	const handleEditChange = (name: string) => setEditName(name);
	const handleEditSubmit = async (id: string) => {
		setLoading(true);
		try {
			const updatedSection = await updateSectionAPI({
				id,
				name: editName,
			});
			setSections((prev) =>
				prev.map((s) => (s.id === id ? updatedSection : s)),
			);
			setEditingId(null);
			setEditName('');
			showToast('Section updated successfully!', 'success');
		} catch (error) {
			showToast('Failed to update section', 'error');
			console.error('Error updating section:', error);
		}
		setLoading(false);
	};
	const requestDelete = (id: string) => {
		const section = sections.find((s) => s.id === id);
		setDialogSection(section || null);
		setDialogType('delete');
		setDialogOpen(true);
	};
	const requestRestore = (id: string) => {
		const section = sections.find((s) => s.id === id);
		setDialogSection(section || null);
		setDialogType('restore');
		setDialogOpen(true);
	};
	const handleDialogConfirm = async () => {
		if (dialogType === 'delete' && dialogSection) {
			setLoading(true);
			try {
				await deleteSectionAPI(dialogSection.id);
				setSections((prev) =>
					prev.map((s) =>
						s.id === dialogSection.id ? { ...s, trashed: true } : s,
					),
				);
				showToast('Section deleted.', 'info');
			} catch (error) {
				showToast('Failed to delete section', 'error');
				console.error('Error deleting section:', error);
			}
			setLoading(false);
		}
		if (dialogType === 'restore' && dialogSection) {
			setSections((prev) =>
				prev.map((s) =>
					s.id === dialogSection.id ? { ...s, trashed: false } : s,
				),
			);
			showToast('Section restored.', 'success');
		}
		setDialogOpen(false);
		setDialogSection(null);
		setDialogType(null);
	};
	const handleDialogCancel = () => {
		setDialogOpen(false);
		setDialogSection(null);
		setDialogType(null);
	};
	const handleTabChange = (tab: 'all' | 'trashed') => setTab(tab);
	const handleSearchChange = (val: string) => setSearch(val);
	const handlePageChange = (page: number) => setCurrentPage(page);
	const handleItemsPerPageChange = (n: number) => setItemsPerPage(n);
	const handleRefresh = () => {
		setLoading(true);
		setSearch('');
		setCurrentPage(1);
		setTimeout(() => setLoading(false), 1000);
	};
	const handleExport = () => {
		const headers = ['No.', 'Name'];
		const filteredSections = sections.filter(
			(s) =>
				(tab === 'all' ? !s.trashed : s.trashed) &&
				(!search ||
					s.name.toLowerCase().includes(search.toLowerCase())),
		);
		const rows = filteredSections.map((s, idx) => [
			(idx + 1).toString(),
			s.name,
		]);
		const csvContent = [headers, ...rows]
			.map((r) =>
				r.map((field) => `"${field.replace(/"/g, '""')}`).join(','),
			)
			.join('\n');
		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'sections.csv';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};
	const handleViewChange = (v: 'grid' | 'list') => {
		setView(v);
		// Optionally, implement grid view rendering
	};

	return (
		<div className='min-h-screen bg-gray-50 py-8 px-4 md:px-8'>
			<ConfirmDialog
				isOpen={dialogOpen}
				title={
					dialogType === 'delete'
						? 'Delete Section'
						: 'Restore Section'
				}
				message={
					dialogType === 'delete'
						? `Are you sure you want to delete section "${dialogSection?.name}"?`
						: `Restore section "${dialogSection?.name}"?`
				}
				confirmText={dialogType === 'delete' ? 'Delete' : 'Restore'}
				cancelText='Cancel'
				onConfirm={handleDialogConfirm}
				onCancel={handleDialogCancel}
				type={dialogType === 'delete' ? 'danger' : 'info'}
			/>
			<div className='max-w-6xl mx-auto'>
				<HeadingWithBadge
					title='Manage Section'
					level='h2'
					className='mb-6'
				/>
				{loading && (
					<div className='absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-80 rounded-lg'>
						<Loading
							message='Loading section page...'
							size='large'
						/>
					</div>
				)}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<CreateSection onAdd={handleAdd} />
					<div>
						<ListSections
							sections={sections}
							tab={tab}
							search={search}
							currentPage={currentPage}
							itemsPerPage={itemsPerPage}
							editingId={editingId}
							editName={editName}
							onEdit={handleEdit}
							onEditChange={handleEditChange}
							onEditSubmit={handleEditSubmit}
							onDelete={requestDelete}
							onRestore={requestRestore}
							onTabChange={setTab}
							onSearchChange={setSearch}
							onPageChange={setCurrentPage}
							onItemsPerPageChange={setItemsPerPage}
							loading={loading}
							onRefresh={handleRefresh}
							onExport={handleExport}
							onViewChange={setView}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SectionPage;
