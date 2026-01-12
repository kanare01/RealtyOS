
import React from 'react';

const SummaryItem: React.FC<{ title: string; value: number | string }> = ({ title, value }) => (
    <div className="flex-1 text-center p-6">
        <p className="text-gray-500 text-sm mb-2 relative inline-block">
            {title}
            <span className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-[1px] bg-gray-200 hidden md:block"></span>
        </p>
        <div className="text-[#1a237e] text-3xl font-medium">{value}</div>
    </div>
);

const MaintenanceSummaryCard: React.FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
             <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Summary</h3>
                 <button className="text-[#1a237e] hover:text-blue-900 font-bold text-xl">
                    -
                </button>
            </div>
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
                <SummaryItem title="Open Requests" value="0" />
                <SummaryItem title="In Progress Requests" value="0" />
            </div>
        </div>
    );
};

export default MaintenanceSummaryCard;
