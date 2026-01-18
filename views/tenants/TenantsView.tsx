
import React, { useState, useMemo } from 'react';
import TenantsFiltersPanel from './TenantsFiltersPanel';
import TenantsSummaryCard from './TenantsSummaryCard';
import TenantsTable from './TenantsTable';
import { useData } from '../../contexts/DataContext';
import { View, Tenant } from '../../types';

interface TenantsViewProps {
    setCurrentView: (view: View) => void;
}

const TenantsView: React.FC<TenantsViewProps> = ({ setCurrentView }) => {
    const { tenants, properties, units } = useData();

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [leaseExpiryFilter, setLeaseExpiryFilter] = useState('');
    const [minBalance, setMinBalance] = useState('');
    const [maxBalance, setMaxBalance] = useState('');
    const [showDeleted, setShowDeleted] = useState(false);
    
    // Sort State
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
    
    // Dropdown State
    const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);

    const handleSort = (key: string) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const filteredTenants = useMemo(() => {
        // 1. Filter
        let result = tenants.filter(tenant => {
            // Resolve Unit Category
            const tenantUnit = units.find(u => u.propertyName === tenant.property && u.name === tenant.unit);
            const tenantCategory = tenantUnit?.category || '';

            // Search Filter
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = 
                (tenant.name && tenant.name.toLowerCase().includes(searchLower)) ||
                (tenant.firstName && tenant.firstName.toLowerCase().includes(searchLower)) ||
                (tenant.lastName && tenant.lastName.toLowerCase().includes(searchLower)) ||
                (tenant.email && tenant.email.toLowerCase().includes(searchLower)) ||
                (tenant.phone && tenant.phone.includes(searchLower)) ||
                (tenant.unit && tenant.unit.toLowerCase().includes(searchLower));

            if (!matchesSearch) return false;

            // Property Filter
            if (selectedProperty && selectedProperty !== 'All Properties') {
                if (tenant.property !== selectedProperty) return false;
            }

            // Category Filter
            if (selectedCategory && selectedCategory !== '') {
                if (tenantCategory !== selectedCategory) return false;
            }

            // Deleted Filter
            if (!showDeleted && tenant.status === 'Inactive') {
                return false;
            }

            // Balance Filter
            const balance = tenant.balance || 0;
            if (minBalance && balance < parseFloat(minBalance)) return false;
            if (maxBalance && balance > parseFloat(maxBalance)) return false;

            // Lease Expiry Filter
            if (leaseExpiryFilter && leaseExpiryFilter !== '-') {
                if (!tenant.leaseEndDate || tenant.leaseEndDate === 'N/A') return false;
                
                const today = new Date();
                const leaseEnd = new Date(tenant.leaseEndDate);
                const diffTime = leaseEnd.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                const daysLimit = parseInt(leaseExpiryFilter.split(' ')[0]);
                
                if (diffDays < 0 || diffDays > daysLimit) return false;
            }

            return true;
        });

        // 2. Sort
        if (sortConfig) {
            result.sort((a, b) => {
                let aValue: any = '';
                let bValue: any = '';

                if (sortConfig.key === 'category') {
                    // Resolve category from units for sorting
                    const unitA = units.find(u => u.propertyName === a.property && u.name === a.unit);
                    const unitB = units.find(u => u.propertyName === b.property && u.name === b.unit);
                    aValue = unitA?.category || '';
                    bValue = unitB?.category || '';
                } else if (sortConfig.key === 'name') {
                     // Prefer firstName/lastName if available, else fallback to name
                     const nameA = a.firstName ? `${a.firstName} ${a.lastName}` : a.name;
                     const nameB = b.firstName ? `${b.firstName} ${b.lastName}` : b.name;
                     aValue = nameA;
                     bValue = nameB;
                } else {
                    // Direct property access
                    aValue = a[sortConfig.key as keyof Tenant] || '';
                    bValue = b[sortConfig.key as keyof Tenant] || '';
                }

                // Handle string comparison case-insensitively
                if (typeof aValue === 'string') aValue = aValue.toLowerCase();
                if (typeof bValue === 'string') bValue = bValue.toLowerCase();

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [tenants, units, searchTerm, selectedProperty, selectedCategory, showDeleted, minBalance, maxBalance, leaseExpiryFilter, sortConfig]);

    return (
        <div className="animate-fadeIn relative min-h-full">
            {/* Top Actions */}
            <div className="flex justify-end items-center mb-6 space-x-2">
                 <button 
                    onClick={() => setCurrentView('TenantForm')}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#1a237e] hover:bg-blue-900 rounded-md transition-colors shadow-sm flex items-center"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Tenant
                </button>
                <button 
                    onClick={() => setCurrentView('Communication')}
                    className="px-4 py-2 text-sm font-medium text-[#1a237e] bg-white border border-[#1a237e] hover:bg-gray-50 rounded-md transition-colors shadow-sm flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Reminders
                </button>
                
                <div className="relative">
                    <button 
                        onClick={() => setIsMoreOptionsOpen(!isMoreOptionsOpen)}
                        className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors shadow-sm flex items-center ${isMoreOptionsOpen ? 'bg-[#1a237e] text-white border-[#1a237e]' : 'text-[#1a237e] bg-white border-[#1a237e] hover:bg-gray-50'}`}
                    >
                        More Options
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {isMoreOptionsOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsMoreOptionsOpen(false)}></div>
                            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1">
                                <button onClick={() => setCurrentView('Communication')} className="block w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#1a237e]">Send Custom Message</button>
                                <button onClick={() => setCurrentView('InvoiceForm')} className="block w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#1a237e]">Add Invoice</button>
                                <button onClick={() => setCurrentView('Invoices')} className="block w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#1a237e] flex items-center justify-between">
                                    Generate Bulk Invoices
                                    <span className="bg-[#1a237e] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">New</span>
                                </button>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button onClick={() => setCurrentView('Invoices')} className="block w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#1a237e]">Generate Rent Invoices</button>
                                <button onClick={() => setCurrentView('Invoices')} className="block w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#1a237e]">Generate Other Bills</button>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button onClick={() => setCurrentView('PaymentForm')} className="block w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#1a237e]">Add Payment</button>
                                <button className="block w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-[#1a237e]">Shift Tenant</button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/4">
                    <TenantsFiltersPanel 
                        properties={properties}
                        selectedProperty={selectedProperty}
                        onPropertyChange={setSelectedProperty}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        minBalance={minBalance}
                        onMinBalanceChange={setMinBalance}
                        maxBalance={maxBalance}
                        onMaxBalanceChange={setMaxBalance}
                        showDeleted={showDeleted}
                        onShowDeletedChange={setShowDeleted}
                        leaseExpiryFilter={leaseExpiryFilter}
                        onLeaseExpiryChange={setLeaseExpiryFilter}
                    />
                </div>
                <div className="lg:w-3/4 flex flex-col gap-6">
                    <TenantsSummaryCard tenants={filteredTenants} />
                    <TenantsTable 
                        tenants={filteredTenants} 
                        units={units}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        setCurrentView={setCurrentView}
                    />
                </div>
            </div>
        </div>
    );
};

export default TenantsView;
