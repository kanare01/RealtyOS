
import React, { useState, useMemo } from 'react';
import UnitsFiltersPanel from './UnitsFiltersPanel';
import UnitsSummaryCard from './UnitsSummaryCard';
import UnitsTable from './UnitsTable';
import { useData } from '../../contexts/DataContext';
import { View } from '../../types';

interface UnitsViewProps {
    setCurrentView: (view: View) => void;
}

const UnitsView: React.FC<UnitsViewProps> = ({ setCurrentView }) => {
    const { units, properties, setEditingUnit } = useData();
    const [propertyFilter, setPropertyFilter] = useState('');
    const [showVacantOnly, setShowVacantOnly] = useState(false);

    const handleAddUnit = () => {
        setEditingUnit(null); // Clear editing state
        setCurrentView('UnitForm');
    };

    const filteredUnits = useMemo(() => {
        return units.filter(u => {
            if (propertyFilter && propertyFilter !== 'All Properties' && u.propertyName !== propertyFilter) {
                return false;
            }
            if (showVacantOnly && u.status !== 'Vacant') {
                return false;
            }
            return true;
        });
    }, [units, propertyFilter, showVacantOnly]);

    return (
        <div className="animate-fadeIn relative min-h-full">
            {/* Top Actions */}
            <div className="flex justify-end items-center mb-6">
                <button 
                    onClick={handleAddUnit}
                    className="px-4 py-2 text-sm font-medium text-[#1a237e] bg-white border border-[#1a237e] hover:bg-gray-50 rounded-md transition-colors shadow-sm flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Unit
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/4">
                    <UnitsFiltersPanel 
                        properties={properties}
                        selectedProperty={propertyFilter}
                        onPropertyChange={setPropertyFilter}
                        showVacantOnly={showVacantOnly}
                        onShowVacantChange={setShowVacantOnly}
                    />
                </div>
                <div className="lg:w-3/4 flex flex-col gap-6">
                    <UnitsSummaryCard units={filteredUnits} properties={properties} />
                    <UnitsTable 
                        units={filteredUnits} 
                        setCurrentView={setCurrentView} 
                    />
                </div>
            </div>
        </div>
    );
};

export default UnitsView;
