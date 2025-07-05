import React from 'react';

interface ConfirmUnassignDialogProps {
  open: boolean;
  schoolName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

const ConfirmUnassignDialog: React.FC<ConfirmUnassignDialogProps> = ({ open, schoolName, onConfirm, onCancel, loading }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4 text-red-700">Unassign Admin</h3>
        <p className="mb-6">Are you sure you want to unassign the admin from <span className="font-semibold">{schoolName}</span>?</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={onCancel}
            disabled={loading}
          >Cancel</button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            onClick={onConfirm}
            disabled={loading}
          >Unassign</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmUnassignDialog;
