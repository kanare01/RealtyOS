
import React, { useState } from 'react';
import { Tenant, Unit, View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface TenantsTableProps {
    tenants: Tenant[];
    units?: Unit[];
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
    sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
    onSort?: (key: string) => void;
    setCurrentView: (view: View) => void;
}

const TenantsTable: React.FC<TenantsTableProps> = ({ 
    tenants, 
    units = [], 
    searchTerm = '', 
    onSearchChange,
    sortConfig,
    onSort,
    setCurrentView
}) => {
    const { deleteTenant, currentUser } = useData();
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const toggleDropdown = (id: number) => {
        if (activeDropdownId === id) {
            setActiveDropdownId(null);
        } else {
            setActiveDropdownId(id);
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(tenants.map(t => t.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // Helper to resolve unit category
    const getUnitCategory = (tenant: Tenant): string => {
        const unit = units.find(u => u.propertyName === tenant.property && u.name === tenant.unit);
        return unit?.category || '-';
    };

    // Actions
    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this tenant? This will vacate their unit.")) {
            deleteTenant(id);
            setActiveDropdownId(null);
        }
    };

    const handleDownloadPDF = () => {
        alert("Downloading PDF statement for selected tenants...");
    };

    const handleSendReminders = () => {
        alert("Sending balance reminders to selected tenants via SMS/Email...");
    };

    // Sort Icon Helper
    const SortIcon = ({ columnKey }: { columnKey: string }) => {
        if (!sortConfig || sortConfig.key !== columnKey) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            );
        }
        return (
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-3 w-3 ml-1 text-[#1a237e] transform ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
            >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        );
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Tenants</h3>
                 <span className="text-sm text-gray-500">
                    {selectedIds.length} selected
                </span>
            </div>
            <div className="p-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <div className="flex items-center space-x-2 w-full md:w-auto">
                        <button 
                            onClick={handleDownloadPDF}
                            className="px-4 py-2 text-sm font-medium text-[#1a237e] bg-white border border-[#1a237e] rounded hover:bg-blue-50 transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download PDF
                        </button>
                        <button 
                            onClick={handleSendReminders}
                            className="px-4 py-2 text-sm font-medium text-[#1a237e] bg-white border border-[#1a237e] rounded hover:bg-blue-50 transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Send Balance Reminders
                        </button>
                    </div>
                    <div className="relative w-full md:w-64">
                         <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                            placeholder="Type to search..."
                            className="w-full bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm focus:ring-[#1a237e] focus:border-[#1a237e] placeholder-gray-400"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto border-t border-gray-100 min-h-[300px]">
                     <table className="min-w-full text-sm text-left">
                        <thead className="text-gray-500 font-normal border-b border-gray-100">
                            <tr>
                                <th className="p-3 w-4">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]"
                                        onChange={handleSelectAll}
                                        checked={tenants.length > 0 && selectedIds.length === tenants.length}
                                    />
                                </th>
                                <th 
                                    className="p-3 font-normal cursor-pointer hover:text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => onSort && onSort('name')}
                                >
                                    <div className="flex items-center">
                                        Tenant Name
                                        <SortIcon columnKey="name" />
                                    </div>
                                </th>
                                <th 
                                    className="p-3 font-normal cursor-pointer hover:text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => onSort && onSort('property')}
                                >
                                    <div className="flex items-center">
                                        Property
                                        <SortIcon columnKey="property" />
                                    </div>
                                </th>
                                <th 
                                    className="p-3 font-normal cursor-pointer hover:text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => onSort && onSort('unit')}
                                >
                                    <div className="flex items-center">
                                        Unit ID
                                        <SortIcon columnKey="unit" />
                                    </div>
                                </th>
                                <th 
                                    className="p-3 font-normal cursor-pointer hover:text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => onSort && onSort('category')}
                                >
                                    <div className="flex items-center">
                                        Category
                                        <SortIcon columnKey="category" />
                                    </div>
                                </th>
                                <th className="p-3 font-normal">Phone</th>
                                <th className="p-3 font-normal">Email</th>
                                <th 
                                    className="p-3 font-normal cursor-pointer hover:text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => onSort && onSort('balance')}
                                >
                                    <div className="flex items-center">
                                        Balance
                                        <SortIcon columnKey="balance" />
                                    </div>
                                </th>
                                <th className="p-3 font-normal">Options</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {tenants.map(tenant => (
                                <tr key={tenant.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-0 relative">
                                    <td className="p-3">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300"
                                            checked={selectedIds.includes(tenant.id)}
                                            onChange={() => handleSelectRow(tenant.id)}
                                        />
                                    </td>
                                    <td className="p-3 font-medium text-blue-600 hover:underline cursor-pointer" onClick={() => setCurrentView('TenantForm')}>
                                        {tenant.name}
                                    </td>
                                    <td className="p-3 text-gray-500">{tenant.property}</td>
                                    <td className="p-3 text-gray-500">{tenant.unit}</td>
                                    <td className="p-3 text-gray-500">
                                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full border border-gray-200">
                                            {getUnitCategory(tenant)}
                                        </span>
                                    </td>
                                    <td className="p-3 text-gray-500 text-xs">{tenant.phone}</td>
                                    <td className="p-3 text-gray-500 text-xs truncate max-w-[120px]" title={tenant.email}>{tenant.email}</td>
                                    <td className={`p-3 font-medium ${tenant.balance && tenant.balance > 0 ? 'text-[#1a237e]' : 'text-green-600'}`}>
                                        {tenant.balance ? tenant.balance.toFixed(2) : '0.00'}
                                    </td>
                                    <td className="p-3 relative">
                                        <button 
                                            onClick={() => toggleDropdown(tenant.id)}
                                            className="flex items-center text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 px-2 py-1 rounded text-xs font-medium shadow-sm w-20 justify-between"
                                        >
                                            Options
                                            <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>

                                        {activeDropdownId === tenant.id && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setActiveDropdownId(null)}></div>
                                                <div className="absolute right-0 top-8 w-56 bg-white border border-gray-200 rounded-sm shadow-xl z-20 overflow-hidden">
                                                    <div className="bg-[#1a237e] text-white text-xs px-4 py-2 font-medium">Options</div>
                                                    <button onClick={() => setCurrentView('TenantForm')} className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-[#1a237e]">Edit</button>
                                                    <button onClick={() => setCurrentView('Statements')} className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-[#1a237e]">View Tenant Transactions</button>
                                                    <button onClick={() => setCurrentView('InvoiceForm')} className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-[#1a237e]">Add Invoice</button>
                                                    <button onClick={() => setCurrentView('PaymentForm')} className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-[#1a237e]">Add Payment</button>
                                                    <button onClick={() => setCurrentView('Communication')} className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-[#1a237e]">Send Custom Message</button>
                                                    <button className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-[#1a237e]">Send Tenant Statement</button>
                                                    <button className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-[#1a237e]">Download Tenant Statement</button>
                                                    {currentUser?.role === 'Admin' && (
                                                        <>
                                                            <div className="border-t border-gray-100"></div>
                                                            <button onClick={() => handleDelete(tenant.id)} className="block w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50">Delete Tenant</button>
                                                        </>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {tenants.length === 0 && (
                                 <tr>
                                    <td colSpan={9} className="p-4 text-center py-12 text-gray-500">
                                        No tenants found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                     </table>
                </div>

                <div className="flex justify-between items-center pt-4 text-xs text-gray-500 border-t border-gray-100 mt-4">
                    <div className="flex items-center">
                        <select className="border-gray-300 rounded-md text-xs p-1.5 mr-3 focus:ring-[#1a237e] focus:border-[#1a237e]">
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                        </select>
                        <p>Showing {tenants.length > 0 ? 1 : 0} to {tenants.length} of {tenants.length} results</p>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>«</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>‹</button>
                        <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded text-gray-600 font-medium">1</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>›</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>»</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TenantsTable;
