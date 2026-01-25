
import React from 'react';
import UnitsFiltersPanel from './UnitsFiltersPanel';
import UnitsSummaryCard from './UnitsSummaryCard';
import UnitsTable from './UnitsTable';
import { useData } from '../../contexts/DataContext';
import { View } from '../../types';

interface UnitsViewProps {
    setCurrentView: (view: View) => void;
}

const UnitsView: React.FC<UnitsViewProps> = ({ setCurrentView }) => {
    const { units, properties } = useData();

    return (
        <div className="animate-fadeIn relative min-h-full">
            {/* Top Actions */}
            <div className="flex justify-end items-center mb-6">
                <button 
                    onClick={() => setCurrentView('UnitForm')}
                    className="px-4 py-2 text-sm font-medium text-[#1a237e] bg-white border border-[#1a237e] hover:bg-gray-50 rounded-md transition-colors shadow-sm"
                >
                    Add Unit
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/4">
                    <UnitsFiltersPanel />
                </div>
                <div className="lg:w-3/4 flex flex-col gap-6">
                    <UnitsSummaryCard units={units} properties={properties} />
                    <UnitsTable units={units} />
                </div>
            </div>
        </div>
    );
};

export default UnitsView;
