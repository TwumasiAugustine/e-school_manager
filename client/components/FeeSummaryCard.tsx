import React from 'react';

interface FeeSummaryCardProps {
  title?: string;
  estimation?: string | number;
  collections?: string | number;
  remainings?: string | number;
}

const FeeSummaryCard: React.FC<FeeSummaryCardProps> = ({
  title = 'Estimated Fee This Month',
  estimation = '$ 0',
  collections = '$ 0',
  remainings = '$ 0',
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg text-gray-800 font-medium mb-4">{title}</h3>
      
      <div className="flex flex-col items-center mb-6">
        <div className="text-sm text-red-400 mb-1">
          <span className="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Estimation
          </span>
        </div>
        <div className="text-3xl font-bold text-red-400">
          {estimation}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 border rounded-lg flex flex-col items-center">
          <div className="text-sm text-cyan-500 mb-1">
            <span className="inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              Collections
            </span>
          </div>
          <div className="text-xl font-bold text-gray-700">
            {collections}
          </div>
        </div>
        <div className="p-3 border rounded-lg flex flex-col items-center">
          <div className="text-sm text-red-400 mb-1">
            <span className="inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              Remainings
            </span>
          </div>
          <div className="text-xl font-bold text-gray-700">
            {remainings}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeSummaryCard;
