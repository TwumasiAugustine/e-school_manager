import React, { useState } from 'react';
import { FiRefreshCw, FiGrid, FiDownload, FiList } from 'react-icons/fi';

interface ActionsBarProps {
    onRefresh: () => void;
    onExport: (type: string) => void;
    onViewChange: (view: 'grid' | 'list') => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

const ActionsBar: React.FC<ActionsBarProps> = ({
    onRefresh,
    onExport,
    onViewChange,
    searchTerm,
    onSearchChange,
}) => {
    const [activeTab, setActiveTab] = useState<'all' | 'trashed'>('all');
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [packageFilter, setPackageFilter] = useState('all');

    const handleExport = (type: string) => {
        onExport(type);
    };

    const handleViewChange = () => {
        const newView = view === 'grid' ? 'list' : 'grid';
        setView(newView);
        onViewChange(newView);
    };    return (
        <div className="w-full px-2 sm:px-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 w-full mb-4">
                <div className="flex items-center space-x-2">
                    <button
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${
                            activeTab === 'all'
                                ? 'bg-emerald-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab('all')}>
                        All
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${
                            activeTab === 'trashed'
                                ? 'bg-emerald-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab('trashed')}>
                        Trashed
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 bg-white shadow-md rounded-xl p-2 sm:p-3">
                    <button
                        onClick={onRefresh}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        title="Refresh"
                        aria-label="Refresh">
                        <FiRefreshCw size={20} />
                        <span className="hidden sm:inline text-sm font-medium">Refresh</span>
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        title="Grid/List View"
                        aria-label="Toggle view mode"
                        onClick={handleViewChange}>
                        {view === 'grid' ? (
                            <>
                                <FiList size={20} />
                                <span className="hidden sm:inline text-sm font-medium">List</span>
                            </>
                        ) : (
                            <>
                                <FiGrid size={20} />
                                <span className="hidden sm:inline text-sm font-medium">Grid</span>
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        title="Export Options"
                        aria-label="Export data"
                        onClick={() => handleExport('csv')}>
                        <FiDownload size={20} />
                        <span className="hidden sm:inline text-sm font-medium">Export</span>
                    </button>
                </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
                <div className="w-full md:w-1/4">
                    <div className="relative bg-white shadow-sm rounded-lg overflow-hidden">
                        <label htmlFor="package-filter" className="sr-only">
                            Filter by package
                        </label>
                        <select
                            id="package-filter"
                            className="w-full px-4 py-2.5 focus:outline-none border-0 focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer pr-10"
                            value={packageFilter}
                            aria-label="Filter by package"
                            onChange={(e) => setPackageFilter(e.target.value)}>
                            <option value="all">All Packages</option>
                            <option value="basic">Basic Package</option>
                            <option value="pro">Pro Package</option>
                            <option value="premium">Premium Package</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-2/4">
                    <div className="relative">
                        <label htmlFor="search" className="sr-only">Search</label>
                        <input
                            type="text"
                            id="search"
                            className="w-full pl-10 pr-4 py-2.5 bg-white border-0 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Search schools..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                className="h-5 w-5 text-emerald-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionsBar;
