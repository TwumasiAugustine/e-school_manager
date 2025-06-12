import React from 'react';

interface SMSGatewayCardProps {
  title?: string;
}

const SMSGatewayCard: React.FC<SMSGatewayCardProps> = ({ title = 'Free SMS Gateway' }) => {
  return (
    <div className="bg-indigo-600 text-white p-6 rounded-lg shadow-md flex justify-between items-center">
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm opacity-90">Send SMS notifications to parents and staff</p>
        <button className="mt-4 bg-white text-indigo-600 px-4 py-2 rounded-md font-medium text-sm hover:bg-indigo-100 transition-colors">
          Configure SMS
        </button>
      </div>
      <div>
        <img 
          src="/placeholder-avatar.png" 
          alt="SMS Gateway" 
          className="h-20 w-auto"
        />
      </div>
    </div>
  );
};

export default SMSGatewayCard;
