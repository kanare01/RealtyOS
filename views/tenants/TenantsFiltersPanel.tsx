
import React, { useState } from 'react';
import { Property } from '../../types';

interface TenantsFiltersPanelProps {
    properties: Property[];
    selectedProperty: string;
    onPropertyChange: (value: string) => void;
    selectedCategory: string;
    onCategoryChange: (value: string) => void;
    leaseExpiryFilter: string;
    onLeaseExpiryChange: (value: string) => void;
    minBalance: string;
    onMinBalanceChange: (value: string) => void;
    maxBalance: string;
    onMaxBalanceChange: (value: string) => void;
    showDeleted: boolean;
    onShowDeletedChange: (value: boolean) => void;
}

const FilterItem: React.FC<{ title: string; children: React.ReactNode; isOpen?: boolean }> = ({ title, children, isOpen = true }) => {
    const [open, setOpen] = useState(isOpen);
    return (
        <div className="py-4 border-b border-gray-100 last:border-0">
            <button 
                className="flex items-center justify-between w-full text-left mb-2 group"
                onClick={() => setOpen(!open)}
            >
                <h4 className="text-sm font-medium text-gray-700">{title}</h4>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 text-[#1a237e] font-bold transition-transform duration-200 ${open ? '' : '-rotate-90'}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                >
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
            </button>
            <div className={`transition-all duration-200 ease-in-out ${open ? 'block' : 'hidden'}`}>
                {children}
            </div>
        </div>
    );
};

const TenantsFiltersPanel: React.FC<TenantsFiltersPanelProps> = ({
    properties,
    selectedProperty,
    onPropertyChange,
    selectedCategory,
    onCategoryChange,
    leaseExpiryFilter,
    onLeaseExpiryChange,
    minBalance,
    onMinBalanceChange,
    maxBalance,
    onMaxBalanceChange,
    showDeleted,
    onShowDeletedChange
}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm sticky top-6">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Filters</h3>
                <button 
                    className="text-[#1a237e] hover:text-blue-900 font-bold text-xl"
                >
                    -
                </button>
            </div>
            <div className="p-4">
                <FilterItem title="Property">
                     <select 
                        value={selectedProperty}
                        onChange={(e) => onPropertyChange(e.target.value)}
                        className="w-full text-sm border-gray-300 rounded-md bg-white text-gray-600 focus:ring-[#1a237e] focus:border-[#1a237e] py-2"
                    >
                        <option value="">All Properties</option>
                        {properties.map(prop => (
                            <option key={prop.id} value={prop.name}>{prop.name}</option>
                        ))}
                    </select>
                </FilterItem>

                <FilterItem title="Unit Category">
                     <select 
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="w-full text-sm border-gray-300 rounded-md bg-white text-gray-600 focus:ring-[#1a237e] focus:border-[#1a237e] py-2"
                    >
                        <option value="">All Categories</option>
                        <option value="Bedsitter">Bedsitter</option>
                        <option value="Studio">Studio</option>
                        <option value="1 Bedroom">1 Bedroom</option>
                        <option value="2 Bedroom">2 Bedroom</option>
                        <option value="3 Bedroom">3 Bedroom</option>
                        <option value="4 Bedroom">4 Bedroom</option>
                        <option value="5+ Bedroom">5+ Bedroom</option>
                        <option value="Shop">Shop</option>
                        <option value="Office">Office</option>
                        <option value="Warehouse">Warehouse</option>
                        <option value="Other">Other</option>
                    </select>
                </FilterItem>

                <FilterItem title="Account Balance">
                    <div className="flex space-x-2">
                        <input 
                            type="number" 
                            placeholder="min" 
                            value={minBalance}
                            onChange={(e) => onMinBalanceChange(e.target.value)}
                            className="w-full text-sm border-gray-300 rounded-md text-gray-600 focus:ring-[#1a237e] focus:border-[#1a237e] py-2 px-3"
                        />
                        <input 
                            type="number" 
                            placeholder="max" 
                            value={maxBalance}
                            onChange={(e) => onMaxBalanceChange(e.target.value)}
                            className="w-full text-sm border-gray-300 rounded-md text-gray-600 focus:ring-[#1a237e] focus:border-[#1a237e] py-2 px-3"
                        />
                    </div>
                </FilterItem>

                <FilterItem title="Deleted tenants">
                    <div className="flex items-center">
                        <input 
                            type="checkbox" 
                            id="showDeleted"
                            checked={showDeleted}
                            onChange={(e) => onShowDeletedChange(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" 
                        />
                        <label htmlFor="showDeleted" className="ml-2 text-sm text-gray-500 cursor-pointer">show</label>
                    </div>
                </FilterItem>
                
                <FilterItem title="Days to Lease Expiry">
                     <select 
                        value={leaseExpiryFilter}
                        onChange={(e) => onLeaseExpiryChange(e.target.value)}
                        className="w-full text-sm border-gray-300 rounded-md bg-white text-gray-600 focus:ring-[#1a237e] focus:border-[#1a237e] py-2"
                    >
                        <option value="">-</option>
                        <option value="30 Days">Next 30 Days</option>
                        <option value="60 Days">Next 60 Days</option>
                        <option value="90 Days">Next 90 Days</option>
                    </select>
                </FilterItem>
            </div>
        </div>
    );
};

export default TenantsFiltersPanel;
