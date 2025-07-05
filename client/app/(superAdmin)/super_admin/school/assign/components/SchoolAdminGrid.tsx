import React from 'react';
import type { School, Admin } from '../services/schoolAssignmentService';
import { FiUser, FiMail, FiMapPin } from 'react-icons/fi';

interface SchoolAdminGridProps {
  data: { school: School; admin: Admin | null; assignedAt?: string }[];
  onAssign: (school: School) => void;
  onUnassign: (school: School) => void;
  loading: boolean;
}

const SchoolAdminGrid: React.FC<SchoolAdminGridProps> = ({ data, onAssign, onUnassign, }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.length > 0 ? (
        data.map(({ school, admin, assignedAt }) => (
          <div
            key={school.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <div className="mb-2">
                <h3 className="font-semibold text-lg text-gray-800 truncate flex items-center gap-2">
                  {school.name}
                </h3>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <FiMapPin className="text-gray-400" />
                  {school.address || 'No address'}
                </div>
              </div>
              <div className="mb-2">
                <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiUser className="text-emerald-500" />
                  {admin ? admin.name : <span className="text-gray-400">Unassigned</span>}
                </div>
                {admin && (
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <FiMail className="text-gray-400" />
                    {admin.email}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400 mb-3">
                Assigned: {assignedAt ? new Date(assignedAt).toLocaleString() : '-'}
              </div>
              <div className="flex gap-2">
                {admin && (
                  <button
                    className="text-red-600 hover:text-red-900 text-xs font-semibold"
                    onClick={() => onUnassign(school)}
                  >Unassign</button>
                )}
                <button
                  className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold"
                  onClick={() => onAssign(school)}
                >{admin ? 'Reassign' : 'Assign'}</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-10 text-gray-500">No schools found</div>
      )}
    </div>
  );
};

export default SchoolAdminGrid;
