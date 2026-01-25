
import React from 'react';
import PropertiesSummaryCard from './PropertiesSummaryCard';
import PropertiesTable from './PropertiesTable';
import { useData } from '../../contexts/DataContext';
import { View } from '../../types';

interface PropertiesViewProps {
    setCurrentView: (view: View) => void;
}

const PropertiesView: React.FC<PropertiesViewProps> = ({ setCurrentView }) => {
    const { properties } = useData();

    return (
        <div className="animate-fadeIn relative min-h-full">
            {/* Top Actions */}
            <div className="flex justify-end items-center mb-6 space-x-2">
                <button 
                    onClick={() => setCurrentView('PropertyForm')}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#1a237e] hover:bg-blue-900 rounded-md transition-colors shadow-sm"
                >
                    Add Property
                </button>
                <button 
                    onClick={() => setCurrentView('UnitForm')}
                    className="px-4 py-2 text-sm font-medium text-[#1a237e] bg-white border border-[#1a237e] hover:bg-gray-50 rounded-md transition-colors shadow-sm"
                >
                    Add Unit
                </button>
            </div>

            <div className="flex flex-col gap-6">
                <PropertiesSummaryCard properties={properties} />
                <PropertiesTable properties={properties} />
            </div>
        </div>
    );
};

export default PropertiesView;
