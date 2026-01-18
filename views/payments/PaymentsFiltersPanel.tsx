
import React from 'react';
import { Property } from '../../types';

interface PaymentsFiltersPanelProps {
    searchTerm: string;
    onSearchChange: (val: string) => void;
    statusFilter: string[];
    onStatusChange: (val: string[]) => void;
    properties: Property[];
    propertyFilter: string;
    onPropertyChange: (val: string) => void;
    dateRange: { start: string; end: string };
    onDateRangeChange: (val: { start: string; end: string }) => void;
    minAmount: string;
    onMinAmountChange: (val: string) => void;
    maxAmount: string;
    onMaxAmountChange: (val: string) => void;
}

const paymentStatuses = [
    { id: 'draft', label: 'draft' },
    { id: 'confirmed', label: 'confirmed' },
    { id: 'pending', label: 'pending' },
];

const FilterItem: React.FC<{ title: string; children: React.ReactNode; isOpen?: boolean }> = ({ title, children, isOpen = true }) => {
    const [open, setOpen] = React.useState(isOpen);
    return (
        <div className="py-4 border-b border-gray-200">
            <button 
                className="flex items-center justify-between w-full text-left mb-3 group"
                onClick={() => setOpen(!open)}
            >
                <h4 className="text-sm font-medium text-blue-800">{title}</h4>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            <div className={`transition-all duration-300 ${open ? 'block' : 'hidden'}`}>
                {children}
            </div>
        </div>
    );
};

const PaymentsFiltersPanel: React.FC<PaymentsFiltersPanelProps> = ({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    properties,
    propertyFilter,
    onPropertyChange,
    dateRange,
    onDateRangeChange,
    minAmount,
    onMinAmountChange,
    maxAmount,
    onMaxAmountChange
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
                <h3 className="font-semibold text-blue-800 text-lg">Filters</h3>
                <button 
                    onClick={() => {
                        onSearchChange('');
                        onStatusChange(['confirmed']);
                        onPropertyChange('');
                        onDateRangeChange({ start: '', end: '' });
                        onMinAmountChange('');
                        onMaxAmountChange('');
                    }}
                    className="text-blue-800 hover:text-blue-900 text-xs font-medium"
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
                        placeholder="Search ID, Tenant..."
                        className="w-full bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <FilterItem title="Date">
                    <div className="space-y-2">
                        <input 
                            type="date" 
                            value={dateRange.start}
                            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                            className="w-full text-sm border-gray-300 rounded-md text-gray-500" 
                        />
                        <input 
                            type="date" 
                            value={dateRange.end}
                            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                            className="w-full text-sm border-gray-300 rounded-md text-gray-500" 
                        />
                    </div>
                </FilterItem>

                <FilterItem title="Amount">
                    <div className="flex items-center space-x-2">
                        <input 
                            type="number" 
                            placeholder="min" 
                            value={minAmount}
                            onChange={(e) => onMinAmountChange(e.target.value)}
                            className="w-full text-sm border-gray-300 rounded-md" 
                        />
                        <input 
                            type="number" 
                            placeholder="max" 
                            value={maxAmount}
                            onChange={(e) => onMaxAmountChange(e.target.value)}
                            className="w-full text-sm border-gray-300 rounded-md" 
                        />
                    </div>
                </FilterItem>

                <FilterItem title="Payment status">
                    <div className="space-y-2">
                        {paymentStatuses.map(status => (
                            <label key={status.id} className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={statusFilter.includes(status.id)}
                                    onChange={() => handleStatusToggle(status.id)}
                                />
                                <span className="ml-2 text-sm text-gray-600 capitalize">{status.label}</span>
                            </label>
                        ))}
                    </div>
                </FilterItem>

                <FilterItem title="Property / Unit">
                     <select 
                        value={propertyFilter}
                        onChange={(e) => onPropertyChange(e.target.value)}
                        className="w-full text-sm border-gray-300 rounded-md bg-gray-50 text-gray-600"
                    >
                        <option value="">All Properties</option>
                        {properties.map(p => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                    </select>
                </FilterItem>
            </div>
        </div>
    );
};

export default PaymentsFiltersPanel;
