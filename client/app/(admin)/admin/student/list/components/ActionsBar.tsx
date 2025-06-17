import React from 'react';
import { FiRefreshCw, FiGrid, FiDownload, FiList } from 'react-icons/fi';

interface ActionsBarProps {
  onRefresh: () => void;
  onExport: () => void;
  onViewChange: (view: 'grid' | 'list') => void;
  view: 'grid' | 'list';
}

const ActionsBar: React.FC<ActionsBarProps> = ({ onRefresh, onExport, onViewChange, view }) => {
  return (
    <div className="flex gap-2 bg-white shadow-md rounded-xl p-2">
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        title="Refresh"
        aria-label="Refresh"
      >
        <FiRefreshCw size={20} />
      </button>
      <button
        type="button"
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        title="Grid/List View"
        aria-label="Toggle view mode"
        onClick={() => onViewChange(view === 'grid' ? 'list' : 'grid')}
      >
        {view === 'grid' ? <FiList size={20} /> : <FiGrid size={20} />}
      </button>
      <button
        type="button"
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        title="Export"
        aria-label="Export data"
        onClick={onExport}
      >
        <FiDownload size={20} />
      </button>
    </div>
  );
};

export default ActionsBar;
