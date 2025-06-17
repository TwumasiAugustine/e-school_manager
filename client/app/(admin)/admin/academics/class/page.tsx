/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState } from 'react';
import CreateClass from './components/CreateClass';
import ListClass from './components/ListClass';
import { Class, Teacher } from '@/types/class';
import HeadingWithBadge from '@/components/HeadingWithBadge';
import Modal from '@/components/Modal';
import ClassForm from './components/ClassForm';
import ConfirmDialog from '@/components/ConfirmDialog';
import { showToast } from '@/components/ToastContainer';

// Example teacher data (replace with real data or fetch from API)
const initialTeachers: Teacher[] = [
  { id: 't1', name: 'John Doe' },
  { id: 't2', name: 'Jane Smith' },
  { id: 't3', name: 'Bob Johnson' },
  { id: 't4', name: 'Alice Brown' },
  { id: 't5', name: 'Charlie Davis' },
];

const initialClasses: Class[] = [
  { id: 1, name: 'BS 5', teacherId: 't1', tuitionFee: 500 },
  { id: 2, name: 'BS 6', teacherId: 't2', tuitionFee: 600 },
  { id: 3, name: 'BS 7', teacherId: 't1', tuitionFee: 500 },
  { id: 4, name: 'BS 8', teacherId: 't2', tuitionFee: 600 },
  
];

const ClassPage: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [teachers] = useState<Teacher[]>(initialTeachers);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState<'delete' | 'update' | null>(null);
  const [confirmClass, setConfirmClass] = useState<Class | null>(null);

  const handleAddClass = (newClass: Class) => {
    setClasses([newClass, ...classes]);
    showToast('Class created successfully!', 'success');
  };

  const handleEdit = (cls: Class) => {
    setEditingClass(cls);
    setEditModalOpen(true);
  };
  const handleUpdate = (updated: Class) => {
    setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setEditModalOpen(false);
    setEditingClass(null);
    showToast('Class updated successfully!', 'success');
  };
  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditingClass(null);
  };
  const handleRequestDelete = (cls: Class) => {
    setConfirmClass(cls);
    setConfirmType('delete');
    setConfirmOpen(true);
  };
  const handleConfirmDelete = () => {
    if (confirmClass) {
      setClasses((prev) => prev.filter((c) => c.id !== confirmClass.id));
      showToast('Class deleted.', 'info');
    }
    setConfirmOpen(false);
    setConfirmClass(null);
    setConfirmType(null);
  };
  const handleConfirmCancel = () => {
    setConfirmOpen(false);
    setConfirmClass(null);
    setConfirmType(null);
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4 md:px-8'>
      <div className='max-w-6xl mx-auto'>
        <HeadingWithBadge title='Manage Class' level='h2' className='mb-6' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <CreateClass teachers={teachers} onAdd={handleAddClass} />
          <ListClass
            classes={classes}
            teachers={teachers}
            onEdit={handleEdit}
            onRequestDelete={handleRequestDelete}
          />
        </div>
        <Modal isOpen={editModalOpen} onClose={handleEditCancel} title='Edit Class' size='lg'>
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
