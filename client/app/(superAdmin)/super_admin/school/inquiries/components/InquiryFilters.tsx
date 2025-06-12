import React from 'react';

interface InquiryFiltersProps {
    onStatusChange: (status: string) => void;
    onDateChange: (date: string) => void;
    onSearch: (searchTerm: string) => void;
}

const InquiryFilters: React.FC<InquiryFiltersProps> = ({
    onStatusChange,
    onDateChange,
    onSearch,
}) => {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6 w-full">
            <div className="flex flex-col gap-4 sm:flex-row w-full md:w-auto">
                {/* Status Filter */}
                <div className="w-full sm:w-40">
                    <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Status
                    </label>
                    <select
                        id="status"
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg transition"
                        onChange={(e) => onStatusChange(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                {/* Date Filter */}
                <div className="w-full sm:w-40">
                    <label
                        htmlFor="date"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        className="block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 rounded-lg transition"
                        onChange={(e) => onDateChange(e.target.value)}
                    />
                </div>
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-64">
                <label htmlFor="search" className="sr-only">
                    Search
                </label>
                <div className="relative">
                    <input
                        id="search"
                        type="text"
                        placeholder="Search"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-400">
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default InquiryFilters;
