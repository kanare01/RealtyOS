import React, { useState } from 'react';
import DashboardCard from './DashboardCard';

const Onboarding: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <DashboardCard className="bg-white border-l-4 border-red-500">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center mb-1">
            <h3 className="font-semibold text-gray-800">You have completed <span className="text-blue-600">0%</span> onboarding</h3>
            <a href="#" className="ml-4 text-sm font-semibold text-blue-600 hover:underline">View onboarding progress</a>
          </div>
          <p className="text-sm text-gray-500 mb-3">Please complete these tasks to get started with the app.</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
        <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </DashboardCard>
  );
};

export default Onboarding;