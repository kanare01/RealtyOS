
import React, { useState, useMemo } from 'react';
import UtilitiesFiltersPanel from './UtilitiesFiltersPanel';
import UtilitiesTable from './UtilitiesTable';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface UtilitiesViewProps {
    setCurrentView: (view: View) => void;
}

const UtilitiesView: React.FC<UtilitiesViewProps> = ({ setCurrentView }) => {
    const { utilities, properties } = useData();
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedType, setSelectedType] = useState<string[]>(['Water', 'Electricity']);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const filteredUtilities = useMemo(() => {
        return utilities.filter(util => {
            if (selectedProperty && selectedProperty !== 'All Properties' && util.propertyName !== selectedProperty) {
                return false;
            }
            if (selectedType.length > 0 && !selectedType.includes(util.type)) {
                return false;
            }
            if (dateRange.start && new Date(util.date) < new Date(dateRange.start)) return false;
            if (dateRange.end && new Date(util.date) > new Date(dateRange.end)) return false;
            
            return true;
        });
    }, [utilities, selectedProperty, selectedType, dateRange]);

    return (
        <div className="animate-fadeIn relative min-h-full">
            {/* Top Actions */}
            <div className="flex justify-end items-center mb-6 space-x-2">
                <button 
                    onClick={() => setCurrentView('UtilityForm')}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#1a237e] hover:bg-blue-900 rounded-md transition-colors shadow-sm"
                >
                    Record Utility
                </button>
                <button 
                    onClick={() => alert("Bulk Upload feature coming soon.")}
                    className="px-4 py-2 text-sm font-medium text-[#1a237e] bg-white border border-[#1a237e] hover:bg-gray-50 rounded-md transition-colors shadow-sm"
                >
                    Bulk Upload Utilities
                </button>
                <button 
                    onClick={() => {
                        setSelectedProperty('');
                        setSelectedType(['Water', 'Electricity']);
                        setDateRange({ start: '', end: '' });
                    }}
                    className="px-4 py-2 text-sm font-medium text-[#1a237e] bg-white border border-[#1a237e] hover:bg-gray-50 rounded-md transition-colors shadow-sm"
                >
                    Reset Utilities
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/4">
                    <UtilitiesFiltersPanel 
                        properties={properties}
                        selectedProperty={selectedProperty}
                        onPropertyChange={setSelectedProperty}
                        selectedType={selectedType}
                        onTypeChange={setSelectedType}
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange}
                    />
                </div>
                <div className="lg:w-3/4">
                    <UtilitiesTable utilities={filteredUtilities} />
                </div>
            </div>
        </div>
    );
};

export default UtilitiesView;
