
import React, { useState, useMemo } from 'react';
import PropertiesSummaryCard from './PropertiesSummaryCard';
import PropertiesTable from './PropertiesTable';
import { useData } from '../../contexts/DataContext';
import { View } from '../../types';

interface PropertiesViewProps {
    setCurrentView: (view: View) => void;
}

const PropertiesView: React.FC<PropertiesViewProps> = ({ setCurrentView }) => {
    const { properties, setEditingProperty } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddProperty = () => {
        setEditingProperty(null); // Clear editing state for new entry
        setCurrentView('PropertyForm');
    };

    const filteredProperties = useMemo(() => {
        if (!searchTerm) return properties;
        const lowerTerm = searchTerm.toLowerCase();
        return properties.filter(p => 
            p.name.toLowerCase().includes(lowerTerm) || 
            (p.city && p.city.toLowerCase().includes(lowerTerm)) ||
            (p.address && p.address.toLowerCase().includes(lowerTerm))
        );
    }, [properties, searchTerm]);

    return (
        <div className="animate-fadeIn relative min-h-full">
            {/* Top Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full md:w-64">
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search properties..."
                        className="w-full bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm focus:ring-[#1a237e] focus:border-[#1a237e]"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="flex space-x-2 w-full md:w-auto justify-end">
                    <button 
                        onClick={handleAddProperty}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#1a237e] hover:bg-blue-900 rounded-md transition-colors shadow-sm flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Property
                    </button>
                    <button 
                        onClick={() => setCurrentView('UnitForm')}
                        className="px-4 py-2 text-sm font-medium text-[#1a237e] bg-white border border-[#1a237e] hover:bg-gray-50 rounded-md transition-colors shadow-sm flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Add Unit
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <PropertiesSummaryCard properties={properties} />
                <PropertiesTable 
                    properties={filteredProperties} 
                    setCurrentView={setCurrentView}
                />
            </div>
        </div>
    );
};

export default PropertiesView;
