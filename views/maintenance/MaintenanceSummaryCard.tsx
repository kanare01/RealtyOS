
import React from 'react';
import { MaintenanceRequest } from '../../types';

interface MaintenanceSummaryCardProps {
    requests: MaintenanceRequest[];
}

const SummaryItem: React.FC<{ title: string; value: number | string; color?: string }> = ({ title, value, color }) => (
    <div className="flex-1 text-center p-6">
        <p className="text-gray-500 text-sm mb-2 relative inline-block">
            {title}
            <span className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-[1px] bg-gray-200 hidden md:block"></span>
        </p>
        <div className={`text-3xl font-medium ${color || 'text-[#1a237e]'}`}>{value}</div>
    </div>
);

const MaintenanceSummaryCard: React.FC<MaintenanceSummaryCardProps> = ({ requests }) => {
    const openCount = requests.filter(r => r.status === 'Open').length;
    const inProgressCount = requests.filter(r => r.status === 'In Progress').length;
    const closedCount = requests.filter(r => r.status === 'Closed').length;

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
             <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Summary</h3>
                 <button className="text-[#1a237e] hover:text-blue-900 font-bold text-xl">
                    -
                </button>
            </div>
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
                <SummaryItem title="Open Requests" value={openCount} color="text-red-600" />
                <SummaryItem title="In Progress" value={inProgressCount} color="text-yellow-600" />
                <SummaryItem title="Closed Requests" value={closedCount} color="text-green-600" />
            </div>
        </div>
    );
};

export default MaintenanceSummaryCard;
