
import React from 'react';
import PropertyGroupingSummary from './PropertyGroupingSummary';
import PropertyGroupingTable from './PropertyGroupingTable';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface PropertyGroupingViewProps {
    setCurrentView: (view: View) => void;
}

const PropertyGroupingView: React.FC<PropertyGroupingViewProps> = ({ setCurrentView }) => {
    const { propertyGroupings, setEditingPropertyGrouping } = useData();

    const handleAddGrouping = () => {
        setEditingPropertyGrouping(null);
        setCurrentView('PropertyGroupingForm');
    };

    return (
        <div className="animate-fadeIn relative min-h-full">
            {/* Top Actions */}
            <div className="flex justify-end items-center mb-6">
                <button 
                    onClick={handleAddGrouping}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#1a237e] hover:bg-blue-900 rounded-md transition-colors shadow-sm flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Grouping
                </button>
            </div>

            <div className="flex flex-col gap-6">
                <PropertyGroupingSummary propertyGroupings={propertyGroupings} />
                <PropertyGroupingTable 
                    propertyGroupings={propertyGroupings} 
                    setCurrentView={setCurrentView}
                />
            </div>
        </div>
    );
};

export default PropertyGroupingView;
