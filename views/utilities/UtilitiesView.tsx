
import React from 'react';
import UtilitiesFiltersPanel from './UtilitiesFiltersPanel';
import UtilitiesTable from './UtilitiesTable';
import { View } from '../../types';

interface UtilitiesViewProps {
    setCurrentView: (view: View) => void;
}

const UtilitiesView: React.FC<UtilitiesViewProps> = ({ setCurrentView }) => {
    return (
        <div className="animate-fadeIn relative min-h-full">
            {/* Top Actions */}
            <div className="flex justify-end items-center mb-6 space-x-2">
                <button className="px-4 py-2 text-sm font-medium text-white bg-[#1a237e] hover:bg-blue-900 rounded-md transition-colors shadow-sm">
                    Record Utility
                </button>
                <button className="px-4 py-2 text-sm font-medium text-[#1a237e] bg-white border border-[#1a237e] hover:bg-gray-50 rounded-md transition-colors shadow-sm">
                    Bulk Upload Utilities
                </button>
                <button className="px-4 py-2 text-sm font-medium text-[#1a237e] bg-white border border-[#1a237e] hover:bg-gray-50 rounded-md transition-colors shadow-sm">
                    Reset Utilities
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/4">
                    <UtilitiesFiltersPanel />
                </div>
                <div className="lg:w-3/4">
                    <UtilitiesTable />
                </div>
            </div>
        </div>
    );
};

export default UtilitiesView;