import React from 'react';

interface StatisticsChartProps {
  title?: string;
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({ title = 'Statistics' }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg text-gray-500 font-medium">{title}</h3>
        <button className="text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="sr-only">clos</span>
        </button>
      </div>
      
      <div className="h-64 w-full">
        {/* Chart Legend */}
        <div className="flex gap-4 mb-2 justify-center">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-400 rounded mr-1"></div>
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-400 rounded mr-1"></div>
            <span className="text-sm text-gray-600">Income</span>
          </div>
        </div>
        
        {/* Chart Container */}
        <div className="mt-4 h-full w-full flex items-end">
          {/* This is a placeholder for the chart */}
          {/* In a real implementation, you'd use a chart library like Chart.js or Recharts */}
          <div className="h-full w-full grid grid-cols-6 gap-4 items-end border-l border-b border-gray-200">
            <div className="flex flex-col items-center">
              <div className="w-full bg-red-400 h-1 mb-1"></div>
              <div className="w-full bg-blue-400 h-1"></div>
              <div className="text-xs text-gray-500 mt-1">Jan</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full bg-red-400 h-1 mb-1"></div>
              <div className="w-full bg-blue-400 h-1"></div>
              <div className="text-xs text-gray-500 mt-1">Feb</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full bg-red-400 h-1 mb-1"></div>
              <div className="w-full bg-blue-400 h-1"></div>
              <div className="text-xs text-gray-500 mt-1">Mar</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full bg-red-400 h-1 mb-1"></div>
              <div className="w-full bg-blue-400 h-1"></div>
              <div className="text-xs text-gray-500 mt-1">Apr</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full bg-red-400 h-1 mb-1"></div>
              <div className="w-full bg-blue-400 h-1"></div>
              <div className="text-xs text-gray-500 mt-1">May</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-full bg-red-400 h-1 mb-1"></div>
              <div className="w-full bg-blue-400 h-1"></div>
              <div className="text-xs text-gray-500 mt-1">Jun</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsChart;
