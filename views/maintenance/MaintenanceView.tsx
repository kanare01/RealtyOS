
import React from 'react';
import MaintenanceFiltersPanel from './MaintenanceFiltersPanel';
import MaintenanceSummaryCard from './MaintenanceSummaryCard';
import MaintenanceTable from './MaintenanceTable';
import { View } from '../../types';

interface MaintenanceViewProps {
    setCurrentView: (view: View) => void;
}

const MaintenanceView: React.FC<MaintenanceViewProps> = ({ setCurrentView }) => {
    return (
        <div className="animate-fadeIn relative min-h-full">
            {/* Top Actions */}
            <div className="flex justify-end items-center mb-6">
                <button className="px-4 py-2 text-sm font-medium text-white bg-[#1a237e] hover:bg-blue-900 rounded-md transition-colors shadow-sm">
                    Add Maintenance
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/4">
                    <MaintenanceFiltersPanel />
                </div>
                <div className="lg:w-3/4 flex flex-col gap-6">
                    <MaintenanceSummaryCard />
                    <MaintenanceTable />
                </div>
            </div>
        </div>
    );
};

export default MaintenanceView;