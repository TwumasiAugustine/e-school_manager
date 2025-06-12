import React from 'react';
import { FiRefreshCw, FiGrid, FiDownload } from 'react-icons/fi';

interface ActionsBarProps {
    onRefresh: () => void;
    onExport: () => void;
    onViewChange: (view: 'grid' | 'list') => void;
}

const ActionsBar: React.FC<ActionsBarProps> = ({
    onRefresh,
    onExport,
    onViewChange,
}) => {
    return (
        <div className="flex justify-end mb-4 px-2 sm:px-4">
            <div className="flex flex-wrap gap-2 bg-white shadow-md rounded-xl p-2 sm:p-3">
                <button
                    onClick={onRefresh}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Refresh"
                >
                    <FiRefreshCw size={20} />
                    <span className="hidden sm:inline text-sm font-medium">Refresh</span>
                </button>

                <button
                    onClick={() => onViewChange('grid')}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Grid view"
                >
                    <FiGrid size={20} />
                    <span className="hidden sm:inline text-sm font-medium">Grid</span>
                </button>

                <button
                    onClick={onExport}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Export data"
                >
                    <FiDownload size={20} />
                    <span className="hidden sm:inline text-sm font-medium">Export</span>
                </button>
            </div>
        </div>
    );
};

export default ActionsBar;
