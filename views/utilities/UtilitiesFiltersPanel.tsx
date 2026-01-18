
import React from 'react';
import { Property } from '../../types';

interface UtilitiesFiltersPanelProps {
    properties: Property[];
    selectedProperty: string;
    onPropertyChange: (val: string) => void;
    selectedType: string[];
    onTypeChange: (val: string[]) => void;
    dateRange: { start: string; end: string };
    onDateRangeChange: (val: { start: string; end: string }) => void;
}

const FilterItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
             <h4 className="text-sm font-medium text-gray-700">{title}</h4>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
        {children}
    </div>
);

const UtilitiesFiltersPanel: React.FC<UtilitiesFiltersPanelProps> = ({
    properties,
    selectedProperty,
    onPropertyChange,
    selectedType,
    onTypeChange,
    dateRange,
    onDateRangeChange
}) => {

    const handleTypeToggle = (type: string) => {
        if (selectedType.includes(type)) {
            onTypeChange(selectedType.filter(t => t !== type));
        } else {
            onTypeChange([...selectedType, type]);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-[#1a237e] text-lg">Filters</h3>
                <button 
                    onClick={() => {
                        onPropertyChange('');
                        onTypeChange(['Water', 'Electricity']);
                        onDateRangeChange({ start: '', end: '' });
                    }}
                    className="text-[#1a237e] hover:text-blue-900 font-bold text-xs"
                >
                    CLEAR
                </button>
            </div>
            <div className="p-4">
                <FilterItem title="Utility Item">
                    <div className="space-y-2">
                        <label className="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={selectedType.includes('Water')}
                                onChange={() => handleTypeToggle('Water')}
                                className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" 
                            />
                            <span className="ml-2 text-sm text-gray-600">water</span>
                        </label>
                         <label className="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={selectedType.includes('Electricity')}
                                onChange={() => handleTypeToggle('Electricity')}
                                className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" 
                            />
                            <span className="ml-2 text-sm text-gray-600">electricity</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={selectedType.includes('Garbage')}
                                onChange={() => handleTypeToggle('Garbage')}
                                className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" 
                            />
                            <span className="ml-2 text-sm text-gray-600">garbage</span>
                        </label>
                    </div>
                </FilterItem>

                <FilterItem title="Date">
                     <div className="space-y-2">
                        <div className="relative">
                            <input 
                                type="date" 
                                value={dateRange.start}
                                onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                                className="w-full text-sm border-gray-300 rounded-md text-gray-500" 
                            />
                        </div>
                         <input 
                            type="date" 
                            value={dateRange.end}
                            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                            className="w-full text-sm border-gray-300 rounded-md text-gray-500" 
                        />
                    </div>
                </FilterItem>

                <div className="py-4">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Property / Unit</h4>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                     <select 
                        value={selectedProperty}
                        onChange={(e) => onPropertyChange(e.target.value)}
                        className="w-full text-sm border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:ring-[#1a237e] focus:border-[#1a237e]"
                    >
                        <option value="">All Properties</option>
                        {properties.map(p => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default UtilitiesFiltersPanel;
