
import React, { useState, useMemo } from 'react';
import PaymentsFiltersPanel from './PaymentsFiltersPanel';
import PaymentsSummaryCard from './PaymentsSummaryCard';
import PaymentsTable from './PaymentsTable';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface PaymentsViewProps {
    setCurrentView: (view: View) => void;
}

const PaymentsView: React.FC<PaymentsViewProps> = ({ setCurrentView }) => {
    const { payments, properties } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string[]>(['confirmed']);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [propertyFilter, setPropertyFilter] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');

    const filteredPayments = useMemo(() => {
        return payments.filter(p => {
            // Search
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = 
                p.tenantName.toLowerCase().includes(searchLower) ||
                p.paymentId.toLowerCase().includes(searchLower) ||
                p.propertyName.toLowerCase().includes(searchLower);
            
            if (!matchesSearch) return false;

            // Status
            if (statusFilter.length > 0 && !statusFilter.includes(p.status)) {
                return false;
            }

            // Property
            if (propertyFilter && propertyFilter !== 'All Properties' && p.propertyName !== propertyFilter) {
                return false;
            }

            // Amount Range
            if (minAmount && p.amount < parseFloat(minAmount)) return false;
            if (maxAmount && p.amount > parseFloat(maxAmount)) return false;

            // Date Range
            if (dateRange.start && new Date(p.date) < new Date(dateRange.start)) return false;
            if (dateRange.end && new Date(p.date) > new Date(dateRange.end)) return false;

            return true;
        });
    }, [payments, searchTerm, statusFilter, propertyFilter, dateRange, minAmount, maxAmount]);

    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="animate-fadeIn relative min-h-full">
            <div className="flex justify-end items-center mb-4 space-x-2">
                <button 
                    onClick={() => setCurrentView('PaymentForm')}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#1a237e] hover:bg-blue-900 rounded-md transition-colors shadow-sm"
                >
                    Record Payment
                </button>
                <button 
                    onClick={() => setCurrentView('BankStatementUpload')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors shadow-sm"
                >
                    Upload Bank Statement
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/4">
                    <PaymentsFiltersPanel 
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        statusFilter={statusFilter}
                        onStatusChange={setStatusFilter}
                        properties={properties}
                        propertyFilter={propertyFilter}
                        onPropertyChange={setPropertyFilter}
                        dateRange={dateRange}
                        onDateRangeChange={setDateRange}
                        minAmount={minAmount}
                        onMinAmountChange={setMinAmount}
                        maxAmount={maxAmount}
                        onMaxAmountChange={setMaxAmount}
                    />
                </div>
                <div className="lg:w-3/4 flex flex-col gap-6">
                    <PaymentsSummaryCard total={totalAmount} count={filteredPayments.length} />
                    <PaymentsTable payments={filteredPayments} />
                </div>
            </div>
        </div>
    );
};

export default PaymentsView;
