
import React from 'react';
import { Property } from '../../types';

interface ExpensesFiltersPanelProps {
    properties: Property[];
    searchTerm: string;
    onSearchChange: (val: string) => void;
    propertyFilter: string;
    onPropertyChange: (val: string) => void;
    dateRange: { start: string; end: string };
    onDateRangeChange: (val: { start: string; end: string }) => void;
    amountRange: { min: string; max: string };
    onAmountRangeChange: (val: { min: string; max: string }) => void;
    statusFilter: string[];
    onStatusChange: (val: string[]) => void;
}

const FilterItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-4 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">{title}</h4>
        {children}
    </div>
);

const ExpensesFiltersPanel: React.FC<ExpensesFiltersPanelProps> = ({
    properties,
    searchTerm,
    onSearchChange,
    propertyFilter,
    onPropertyChange,
    dateRange,
    onDateRangeChange,
    amountRange,
    onAmountRangeChange,
    statusFilter,
    onStatusChange
}) => {

    const handleStatusToggle = (status: string) => {
        if (statusFilter.includes(status)) {
            onStatusChange(statusFilter.filter(s => s !== status));
        } else {
            onStatusChange([...statusFilter, status]);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Filters</h3>
                <button 
                    onClick={() => {
                        onSearchChange('');
                        onPropertyChange('');
                        onDateRangeChange({ start: '', end: '' });
                        onAmountRangeChange({ min: '', max: '' });
                        onStatusChange(['confirmed']);
                    }}
                    className="text-xs text-blue-600 hover:underline"
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
                        className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <FilterItem title="Property / Unit">
                     <select 
                        value={propertyFilter}
                        onChange={(e) => onPropertyChange(e.target.value)}
                        className="w-full text-sm border-gray-300 rounded-md"
                    >
                        <option value="">All Properties</option>
                        {properties.map(p => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                </FilterItem>

                <FilterItem title="Date">
                    <div className="flex flex-col space-y-2">
                        <input 
                            type="date" 
                            value={dateRange.start}
                            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                            className="w-full text-sm border-gray-300 rounded-md" 
                        />
                        <span className="text-center text-xs text-gray-400">to</span>
                        <input 
                            type="date" 
                            value={dateRange.end}
                            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                            className="w-full text-sm border-gray-300 rounded-md" 
                        />
                    </div>
                </FilterItem>

                <FilterItem title="Amount">
                    <div className="flex items-center justify-between space-x-2">
                        <input 
                            type="number" 
                            placeholder="min" 
                            value={amountRange.min}
                            onChange={(e) => onAmountRangeChange({ ...amountRange, min: e.target.value })}
                            className="w-full text-sm border-gray-300 rounded-md" 
                        />
                        <span className="text-gray-400">-</span>
                        <input 
                            type="number" 
                            placeholder="max" 
                            value={amountRange.max}
                            onChange={(e) => onAmountRangeChange({ ...amountRange, max: e.target.value })}
                            className="w-full text-sm border-gray-300 rounded-md" 
                        />
                    </div>
                </FilterItem>

                <div className="pt-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-3">Expense status</h4>
                    <div className="space-y-2">
                        <label className="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                checked={statusFilter.includes('draft')}
                                onChange={() => handleStatusToggle('draft')}
                            />
                            <span className="ml-2 text-sm text-gray-700 capitalize">draft</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                checked={statusFilter.includes('confirmed')}
                                onChange={() => handleStatusToggle('confirmed')}
                            />
                            <span className="ml-2 text-sm text-gray-700 capitalize">confirmed</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpensesFiltersPanel;
