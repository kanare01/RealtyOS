
import React from 'react';
import { Property } from '../../types';

interface MaintenanceFiltersPanelProps {
    properties: Property[];
    selectedProperty: string;
    onPropertyChange: (val: string) => void;
    selectedStatus: string[];
    onStatusChange: (val: string[]) => void;
}

const MaintenanceFiltersPanel: React.FC<MaintenanceFiltersPanelProps> = ({
    properties,
    selectedProperty,
    onPropertyChange,
    selectedStatus,
    onStatusChange
}) => {

    const handleStatusToggle = (status: string) => {
        if (selectedStatus.includes(status)) {
            onStatusChange(selectedStatus.filter(s => s !== status));
        } else {
            onStatusChange([...selectedStatus, status]);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-[#1a237e] text-lg">Filters</h3>
                <button 
                    onClick={() => {
                        onPropertyChange('');
                        onStatusChange(['Open', 'In Progress']);
                    }}
                    className="text-[#1a237e] hover:text-blue-900 font-bold text-xs"
                >
                    CLEAR
                </button>
            </div>
            <div className="p-4">
                <div className="py-4 border-b border-gray-200">
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

                <div className="py-4">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Status</h4>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={selectedStatus.includes('Open')}
                                onChange={() => handleStatusToggle('Open')}
                                className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" 
                            />
                            <span className="ml-2 text-sm text-gray-600">Open</span>
                        </label>
                         <label className="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={selectedStatus.includes('In Progress')}
                                onChange={() => handleStatusToggle('In Progress')}
                                className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" 
                            />
                            <span className="ml-2 text-sm text-gray-600">In Progress</span>
                        </label>
                         <label className="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={selectedStatus.includes('Closed')}
                                onChange={() => handleStatusToggle('Closed')}
                                className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" 
                            />
                            <span className="ml-2 text-sm text-gray-600">Closed</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceFiltersPanel;
