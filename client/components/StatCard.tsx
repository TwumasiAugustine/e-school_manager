import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subTitle?: string;
  subValue?: string | number;
  bgColor: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subTitle = 'This Month',
  subValue = 0,
  bgColor,
  textColor
}) => {
  return (
    <div className={`${bgColor} ${textColor} rounded-lg p-6 flex flex-col shadow-md`}>
      <div className="flex items-center mb-3">
        <div className="text-white">
          {icon}
        </div>
        <div className="ml-auto text-5xl font-bold">{value}</div>
      </div>
      <div className="text-lg font-medium mb-2">{title}</div>
      <div className="flex justify-between mt-auto">
        <div className="text-sm opacity-90">{subTitle}</div>
        <div className="text-sm opacity-90">{subValue}</div>
      </div>
    </div>
  );
};

export default StatCard;
