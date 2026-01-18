
import React from 'react';
import { Property } from '../../types';

interface RecurringExpensesFiltersPanelProps {
    properties: Property[];
    searchTerm: string;
    onSearchChange: (val: string) => void;
    propertyFilter: string;
    onPropertyChange: (val: string) => void;
    frequencyFilter: string[];
    onFrequencyChange: (val: string[]) => void;
    statusFilter: string[];
    onStatusChange: (val: string[]) => void;
}

const FilterItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-4 border-b border-gray-200">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{title}</h4>
        {children}
    </div>
);

const RecurringExpensesFiltersPanel: React.FC<RecurringExpensesFiltersPanelProps> = ({
    properties,
    searchTerm,
    onSearchChange,
    propertyFilter,
    onPropertyChange,
    frequencyFilter,
    onFrequencyChange,
    statusFilter,
    onStatusChange
}) => {

    const handleFrequencyToggle = (freq: string) => {
        if (frequencyFilter.includes(freq)) {
            onFrequencyChange(frequencyFilter.filter(f => f !== freq));
        } else {
            onFrequencyChange([...frequencyFilter, freq]);
        }
    };

    const handleStatusToggle = (status: string) => {
        if (statusFilter.includes(status)) {
            onStatusChange(statusFilter.filter(s => s !== status));
        } else {
            onStatusChange([...statusFilter, status]);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                <h3 className="font-semibold text-gray-800">Filter Expenses</h3>
                <button 
                    onClick={() => {
                        onSearchChange('');
                        onPropertyChange('');
                        onFrequencyChange(['Monthly']);
                        onStatusChange(['Active']);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    Clear All
                </button>
            </div>
            <div className="p-4">
                <div className="relative mb-4">
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search description..."
                        className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 pl-9 pr-4 text-sm focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <FilterItem title="Property">
                     <select 
                        value={propertyFilter}
                        onChange={(e) => onPropertyChange(e.target.value)}
                        className="w-full text-sm border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Properties</option>
                        {properties.map(p => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                </FilterItem>

                <FilterItem title="Frequency">
                    <div className="space-y-2">
                         <label className="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={frequencyFilter.includes('Monthly')}
                                onChange={() => handleFrequencyToggle('Monthly')}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="ml-2 text-sm text-gray-700">Monthly</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={frequencyFilter.includes('Quarterly')}
                                onChange={() => handleFrequencyToggle('Quarterly')}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="ml-2 text-sm text-gray-700">Quarterly</span>
                        </label>
                         <label className="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={frequencyFilter.includes('Yearly')}
                                onChange={() => handleFrequencyToggle('Yearly')}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="ml-2 text-sm text-gray-700">Yearly</span>
                        </label>
                    </div>
                </FilterItem>

                <div className="pt-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Status</h4>
                    <div className="space-y-2">
                        <label className="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={statusFilter.includes('Active')}
                                onChange={() => handleStatusToggle('Active')}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="ml-2 text-sm text-gray-700">Active</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={statusFilter.includes('Stopped')}
                                onChange={() => handleStatusToggle('Stopped')}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="ml-2 text-sm text-gray-700">Stopped</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecurringExpensesFiltersPanel;
