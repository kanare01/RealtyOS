
import React, { useState } from 'react';
import TenantArrearsPanel from './TenantArrearsPanel';
import OccupancyRatePanel from './OccupancyRatePanel';
import { View } from '../../types';

interface InsightsViewProps {
    setCurrentView: (view: View) => void;
}

const InsightsView: React.FC<InsightsViewProps> = ({ setCurrentView }) => {
    const [activeTab, setActiveTab] = useState<'Tenant Arrears' | 'Occupancy Rate'>('Tenant Arrears');

    return (
        <div className="animate-fadeIn">
            <div className="bg-white border-b border-gray-200 mb-6 rounded-t-lg">
                <div className="flex">
                    <button
                        className={`px-6 py-4 text-sm font-medium focus:outline-none ${
                            activeTab === 'Tenant Arrears'
                                ? 'text-gray-800 border-b-2 border-gray-800'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('Tenant Arrears')}
                    >
                        Tenant Arrears
                    </button>
                    <button
                        className={`px-6 py-4 text-sm font-medium focus:outline-none ${
                            activeTab === 'Occupancy Rate'
                                ? 'text-gray-800 border-b-2 border-gray-800'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('Occupancy Rate')}
                    >
                        Occupancy Rate
                    </button>
                </div>
            </div>

            <div className="min-h-[500px]">
                {activeTab === 'Tenant Arrears' ? (
                    <TenantArrearsPanel setCurrentView={setCurrentView} />
                ) : (
                    <OccupancyRatePanel setCurrentView={setCurrentView} />
                )}
            </div>
        </div>
    );
};

export default InsightsView;
