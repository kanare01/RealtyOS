
import React, { useState, useMemo } from 'react';
import DashboardCard from '../../components/shared/DashboardCard';
import { useData } from '../../contexts/DataContext';

interface OnboardingProps {
    onViewProgress?: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onViewProgress }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { properties, units, tenants } = useData();

  const progress = useMemo(() => {
      let count = 0;
      if (properties.length > 0) count++;
      if (units.length > 0) count++;
      if (tenants.length > 0) count++;
      return Math.round((count / 3) * 100);
  }, [properties, units, tenants]);

  if (!isVisible && progress === 100) return null; // Auto-hide if complete and dismissed previously, or logic can be adjusted

  return (
    <DashboardCard className="bg-white border-l-4 border-[#1a237e]">
      <div className="flex items-start justify-between">
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">
                You have completed <span className="text-[#1a237e]">{progress}%</span> of setup
            </h3>
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    if (onViewProgress) onViewProgress();
                }}
                className="text-sm font-semibold text-[#1a237e] hover:underline focus:outline-none"
            >
                {progress === 100 ? 'Review setup' : 'Continue setup'}
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            {progress === 100 
                ? "Great job! You've set up the basics. You can now start managing your portfolio." 
                : "Complete these steps to unlock the full potential of RealtyOS."}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
                className="bg-[#1a237e] h-2 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <button onClick={() => setIsVisible(false)} className="ml-4 text-gray-400 hover:text-gray-600 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </DashboardCard>
  );
};

export default Onboarding;
