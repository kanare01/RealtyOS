
import React from 'react';
import { Property } from '../../types';

interface UnitsFiltersPanelProps {
    properties: Property[];
    selectedProperty: string;
    onPropertyChange: (val: string) => void;
    showVacantOnly: boolean;
    onShowVacantChange: (val: boolean) => void;
}

const UnitsFiltersPanel: React.FC<UnitsFiltersPanelProps> = ({ 
    properties, 
    selectedProperty, 
    onPropertyChange,
    showVacantOnly,
    onShowVacantChange
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm sticky top-6">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-[#1a237e] text-lg">Filters</h3>
                <button 
                    onClick={() => {
                        onPropertyChange('');
                        onShowVacantChange(false);
                    }}
                    className="text-xs text-blue-600 hover:underline"
                >
                    Clear All
                </button>
            </div>
            <div className="p-4">
                <div className="py-4 border-b border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Property / Unit</h4>
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
                 <div className="py-4">
                    <label className="flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={showVacantOnly}
                            onChange={(e) => onShowVacantChange(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" 
                        />
                        <span className="ml-2 text-sm text-gray-600">Show Vacant Units</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default UnitsFiltersPanel;
