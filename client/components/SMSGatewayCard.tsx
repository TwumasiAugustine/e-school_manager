import React from 'react';
import Image from 'next/image';

interface SMSGatewayCardProps {
  title?: string;
}

const SMSGatewayCard: React.FC<SMSGatewayCardProps> = ({
  title = 'Free SMS Gateway',
}) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-center gap-6">
      <div className="flex-1">
        <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
          <span className="inline-block w-2 h-6 bg-white rounded-full mr-2 opacity-30" />
          {title}
        </h3>
        <p className="text-base opacity-90 mb-6">
          Send SMS notifications to parents and staff instantly and securely.
        </p>
        <button className="mt-2 bg-white text-indigo-700 px-6 py-2 rounded-lg font-semibold text-base shadow hover:bg-indigo-50 hover:text-indigo-800 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
          <span className="mr-2">⚙️</span>
          Configure SMS
        </button>
      </div>
      <div className="flex-shrink-0">
        <div className="bg-white/20 rounded-full p-2 shadow-inner">
          <Image
            src="/placeholder-avatar.png"
            alt="SMS Gateway"
            className="rounded-full"
            width={90}
            height={90}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default SMSGatewayCard;
