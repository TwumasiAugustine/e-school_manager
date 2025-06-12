'use client';

import React, { useState, useEffect } from 'react';
import InquiryTable from './components/InquiryTable';
import InquiryGrid from './components/InquiryGrid';
import InquiryFilters from './components/InquiryFilters';
import ActionsBar from './components/ActionsBar';
import InquiryModal from './components/InquiryModal';
import { SchoolInquiry } from './types';
import InquiryService from './services/InquiryService';
import Loading from '@/components/Loading';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import HeadingWithBadge from '@/components/HeadingWithBadge';
import { showToast } from '@/components/ToastContainer';

const SchoolInquiries = () => {
	const [inquiries, setInquiries] = useState<SchoolInquiry[]>([]);
	const [filteredInquiries, setFilteredInquiries] = useState<SchoolInquiry[]>(
		[],
	);
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [dateFilter, setDateFilter] = useState<string>('');
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [viewType, setViewType] = useState<'grid' | 'list'>('list');
	const [selectedInquiry, setSelectedInquiry] =
		useState<SchoolInquiry | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
	const [inquiryToDelete, setInquiryToDelete] = useState<number | null>(null);
	// Fetch inquiries on component mount
	useEffect(() => {
		const fetchInquiries = async () => {
			setLoading(true);
			try {
				const data = await InquiryService.getInquiries();
				setInquiries(data);
				setFilteredInquiries(data);
			} catch (error) {
				console.error('Failed to fetch inquiries:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchInquiries();
	}, []);

	// Handlers
	const handleViewInquiry = async (id: number) => {
		try {
			const inquiry = await InquiryService.getInquiryById(id);
			if (inquiry) {
				setSelectedInquiry(inquiry);
				setIsModalOpen(true);
			}
		} catch (error) {
			console.error('Failed to fetch inquiry details:', error);
		}
	};
	const handleDeleteInquiry = (id: number) => {
		// Set the inquiry ID to delete and open the confirmation dialog
		setInquiryToDelete(id);
		setDeleteConfirmOpen(true);
	};
	const confirmDeleteInquiry = async () => {
		if (inquiryToDelete === null) return;

		try {
			const success = await InquiryService.deleteInquiry(inquiryToDelete);
			if (success) {
				setInquiries((prevInquiries) =>
					prevInquiries.filter(
						(inquiry) => inquiry.id !== inquiryToDelete,
					),
				);
				showToast('School inquiry deleted successfully.', 'success');
			}
		} catch (error) {
			console.error('Failed to delete inquiry:', error);
			showToast('Failed to delete school inquiry.', 'error');
		} finally {
			// Close the dialog and reset the inquiry to delete
			setDeleteConfirmOpen(false);
			setInquiryToDelete(null);
		}
	};

	const handleRefresh = async () => {
		setLoading(true);
		try {
			const data = await InquiryService.getInquiries();
			setInquiries(data);
		} catch (error) {
			console.error('Failed to refresh inquiries:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleExport = () => {
		// In a real application, this would export data to CSV/Excel
		const csvData = filteredInquiries
			.map(
				(inquiry) =>
					`${inquiry.id},${inquiry.schoolName},${inquiry.mobile},${inquiry.schoolEmail},${inquiry.status}`,
			)
			.join('\n');

		const header = 'ID,School Name,Phone,Email,Status\n';
		const blob = new Blob([header + csvData], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.setAttribute('hidden', '');
		a.setAttribute('href', url);
		a.setAttribute('download', 'school_inquiries.csv');
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};
	const handleApproveInquiry = async (id: number) => {
		try {
			const updatedInquiry = await InquiryService.updateInquiryStatus(
				id,
				'Approved',
			);
			if (updatedInquiry) {
				setInquiries((prevInquiries) =>
					prevInquiries.map((inquiry) =>
						inquiry.id === id
							? { ...inquiry, status: 'Approved' }
							: inquiry,
					),
				);
				showToast('School inquiry approved successfully.', 'success');
			}
			setIsModalOpen(false);
		} catch (error) {
			console.error('Failed to approve inquiry:', error);
			showToast('Failed to approve school inquiry.', 'error');
		}
	};

	const handleRejectInquiry = async (id: number) => {
		try {
			const updatedInquiry = await InquiryService.updateInquiryStatus(
				id,
				'Rejected',
			);
			if (updatedInquiry) {
				setInquiries((prevInquiries) =>
					prevInquiries.map((inquiry) =>
						inquiry.id === id
							? { ...inquiry, status: 'Rejected' }
							: inquiry,
					),
				);
				showToast('School inquiry rejected.', 'info');
			}
			setIsModalOpen(false);
		} catch (error) {
			console.error('Failed to reject inquiry:', error);
			showToast('Failed to reject school inquiry.', 'error');
		}
	};

	// const handleCreateInquiry = async (inquiryData: Omit<SchoolInquiry, 'id'>) => {
	// 	try {
	// 		// Simulate API call
	// 		// In a real app, replace with InquiryService.createInquiry
	// 		const newInquiry = { ...inquiryData, id: Date.now() };
	// 		setInquiries((prev) => [...prev, newInquiry]);
	// 		showToast('School inquiry created successfully.', 'success');
	// 	} catch (error) {
	// 		showToast('Failed to create school inquiry.', 'error');
	// 	}
	// };

	// const handleUpdateInquiry = async (id: number, inquiryData: Partial<SchoolInquiry>) => {
	// 	try {
	// 		// Simulate API call
	// 		// In a real app, replace with InquiryService.updateInquiry
	// 		setInquiries((prev) => prev.map((inq) => inq.id === id ? { ...inq, ...inquiryData } : inq));
	// 		showToast('School inquiry updated successfully.', 'success');
	// 	} catch (error) {
	// 		showToast('Failed to update school inquiry.', 'error');
	// 	}
	// };

	// Apply filters whenever filter state changes
	useEffect(() => {
		let filtered = inquiries;

		// Apply status filter
		if (statusFilter) {
			filtered = filtered.filter(
				(inquiry) => inquiry.status === statusFilter,
			);
		}

		// Apply search term filter
		if (searchTerm) {
			const term = searchTerm.toLowerCase();			filtered = filtered.filter(
				(inquiry) =>
					inquiry.schoolName.toLowerCase().includes(term) ||
					inquiry.schoolEmail.toLowerCase().includes(term) ||
					inquiry.mobile.includes(term),
			);
		}

		// Apply date filter - would need to convert dates properly in a real implementation
		if (dateFilter) {
			filtered = filtered.filter(
				(inquiry) => inquiry.inquiryDate === dateFilter,
			);
		}

		setFilteredInquiries(filtered);
	}, [inquiries, statusFilter, dateFilter, searchTerm]);
	return (
		<div className='container  py-4 mx-auto'>
			<div className='bg-white rounded-lg shadow-md p-6'>
				<HeadingWithBadge
					title='List Schools Inquiry'
					count={filteredInquiries.length}
					level='h2'
					className='mb-4'
				/>

				<InquiryFilters
					onStatusChange={setStatusFilter}
					onDateChange={setDateFilter}
					onSearch={setSearchTerm}
				/>

				<ActionsBar
					onRefresh={handleRefresh}
					onExport={handleExport}
					onViewChange={setViewType}
				/>

				{loading ? (
					<div className='py-8'>
						<Loading message='Loading school inquiries...' />
					</div>
				) : filteredInquiries.length === 0 ? (
					<EmptyState
						title='No School Inquiries Found'
						message={
							searchTerm || statusFilter || dateFilter
								? 'No inquiries match your current filters. Try adjusting your search criteria.'
								: 'There are no school inquiries to display at this time.'
						}
						buttonText='Refresh Data'
						buttonAction={handleRefresh}
					/>
				) : (
					<>
						{/* Conditional rendering based on view type */}
						{viewType === 'list' ? (
							<InquiryTable
								inquiries={filteredInquiries}
								onViewInquiry={handleViewInquiry}
								onDeleteInquiry={handleDeleteInquiry}
							/>
						) : (
							<InquiryGrid
								inquiries={filteredInquiries}
								onViewInquiry={handleViewInquiry}
								onDeleteInquiry={handleDeleteInquiry}
							/>
						)}

						{filteredInquiries.length > 0 && (
							<div className='mt-4 text-right text-sm text-gray-500'>
								Showing {filteredInquiries.length} of{' '}
								{inquiries.length} total inquiries
							</div>
						)}
					</>
				)}
			</div>{' '}
			{/* Detail Modal */}
			<InquiryModal
				inquiry={selectedInquiry}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onApprove={handleApproveInquiry}
				onReject={handleRejectInquiry}
			/>
			{/* Delete Confirmation Dialog */}
			<ConfirmDialog
				isOpen={deleteConfirmOpen}
				title='Delete School Inquiry'
				message='Are you sure you want to delete this school inquiry? This action cannot be undone.'
				confirmText='Delete'
				onConfirm={confirmDeleteInquiry}
				onCancel={() => {
					setDeleteConfirmOpen(false);
					setInquiryToDelete(null);
				}}
				type='danger'
			/>
		</div>
	);
};

export default SchoolInquiries;
