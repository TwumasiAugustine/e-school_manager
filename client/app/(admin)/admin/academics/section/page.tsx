/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';

import HeadingWithBadge from '@/components/HeadingWithBadge';
import { showToast } from '@/components/ToastContainer';
import ConfirmDialog from '@/components/ConfirmDialog';
import CreateSection from './components/CreateSection';
import ListSections from './components/ListSections';

interface Section {
	id: number;
	name: string;
	trashed?: boolean;
}

const initialSections: Section[] = [
	{ id: 1, name: 'C' },
	{ id: 2, name: 'B' },
	{ id: 3, name: 'A' },
];

const SectionPage: React.FC = () => {
	const [sections, setSections] = useState<Section[]>(initialSections);
	const [search, setSearch] = useState('');
	const [tab, setTab] = useState<'all' | 'trashed'>('all');
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editName, setEditName] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [loading, setLoading] = useState(false);
	const [view, setView] = useState<'list' | 'grid'>('list');
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogType, setDialogType] = useState<'delete' | 'restore' | null>(null);
	const [dialogSection, setDialogSection] = useState<Section | null>(null);

	const handleAdd = (name: string) => {
		setSections([{ id: Date.now(), name }, ...sections]);
		showToast('Section created successfully!', 'success');
	};
	const handleEdit = (id: number, currentName: string) => {
		setEditingId(id);
		setEditName(currentName);
	};
	const handleEditChange = (name: string) => setEditName(name);
	const handleEditSubmit = (id: number) => {
		setSections((prev) => prev.map((s) => (s.id === id ? { ...s, name: editName } : s)));
		setEditingId(null);
		setEditName('');
		showToast('Section updated successfully!', 'success');
	};
	const requestDelete = (id: number) => {
		const section = sections.find((s) => s.id === id);
		setDialogSection(section || null);
		setDialogType('delete');
		setDialogOpen(true);
	};
	const requestRestore = (id: number) => {
		const section = sections.find((s) => s.id === id);
		setDialogSection(section || null);
		setDialogType('restore');
		setDialogOpen(true);
	};
	const handleDialogConfirm = () => {
		if (dialogType === 'delete' && dialogSection) {
			setSections((prev) => prev.map((s) => (s.id === dialogSection.id ? { ...s, trashed: true } : s)));
			showToast('Section deleted.', 'info');
		}
		if (dialogType === 'restore' && dialogSection) {
			setSections((prev) => prev.map((s) => (s.id === dialogSection.id ? { ...s, trashed: false } : s)));
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
			(s) => (tab === 'all' ? !s.trashed : s.trashed) && (!search || s.name.toLowerCase().includes(search.toLowerCase()))
		);
		const rows = filteredSections.map((s, idx) => [
			(idx + 1).toString(),
			s.name,
		]);
		const csvContent = [headers, ...rows].map(r => r.map(field => `"${field.replace(/"/g, '""')}`).join(',')).join('\n');
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
				title={dialogType === 'delete' ? 'Delete Section' : 'Restore Section'}
				message={dialogType === 'delete' ? `Are you sure you want to delete section "${dialogSection?.name}"?` : `Restore section "${dialogSection?.name}"?`}
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
