
import React, { useState, useMemo } from 'react';
import FiltersPanel from './FiltersPanel';
import SummaryCard from './SummaryCard';
import InvoicesTable from './InvoicesTable';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface InvoicingViewProps {
    setCurrentView: (view: View) => void;
}

const InvoicingView: React.FC<InvoicingViewProps> = ({ setCurrentView }) => {
    const { invoices, properties } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string[]>(['Unpaid', 'Pending', 'Overdue']);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [propertyFilter, setPropertyFilter] = useState('');

    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv => {
            // Search
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = 
                inv.tenantName.toLowerCase().includes(searchLower) ||
                inv.invoiceNumber.toLowerCase().includes(searchLower) ||
                inv.property.toLowerCase().includes(searchLower);
            
            if (!matchesSearch) return false;

            // Status
            if (statusFilter.length > 0 && !statusFilter.includes(inv.status)) {
                return false;
            }

            // Property
            if (propertyFilter && propertyFilter !== 'All Properties' && inv.property !== propertyFilter) {
                return false;
            }

            // Date Range
            if (dateRange.start && new Date(inv.date) < new Date(dateRange.start)) return false;
            if (dateRange.end && new Date(inv.date) > new Date(dateRange.end)) return false;

            return true;
        });
    }, [invoices, searchTerm, statusFilter, propertyFilter, dateRange]);

    const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

    return (
        <div className="animate-fadeIn relative min-h-full">
            <div className="flex justify-end items-center mb-4">
                <button 
                    onClick={() => setCurrentView('InvoiceForm')}
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Invoice
                </button>
                <div className="relative ml-2">
                    <button className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors flex items-center shadow-sm">
                        More Options
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/4">
                    <FiltersPanel 
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        statusFilter={statusFilter}
                        onStatusChange={setStatusFilter}
                        properties={properties}
                        propertyFilter={propertyFilter}
                        onPropertyChange={setPropertyFilter}
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange}
                    />
                </div>
                <div className="lg:w-3/4 flex flex-col gap-6">
                    <SummaryCard total={totalAmount} count={filteredInvoices.length} />
                    <InvoicesTable invoices={filteredInvoices} />
                </div>
            </div>
            
            <button 
                onClick={() => alert("Chat support coming soon")}
                className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full h-12 w-12 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
        </div>
    );
};

export default InvoicingView;
