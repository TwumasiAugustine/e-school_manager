import React, { useState } from 'react';
import { showToast } from '@/components/ToastContainer';

interface CreateSectionProps {
  onAdd: (name: string) => void;
}

const CreateSection: React.FC<CreateSectionProps> = ({ onAdd }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim());
    showToast('Section created successfully!', 'success');
    setName('');
  };

  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <h3 className='text-lg font-semibold mb-4 text-gray-800'>Create Section</h3>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Name <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button
          type='submit'
          className='bg-emerald-900 hover:bg-emerald-800 text-white font-semibold px-6 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-emerald-500'
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateSection;
