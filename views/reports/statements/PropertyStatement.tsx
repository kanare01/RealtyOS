
import React, { useState, useMemo } from 'react';
import { FilterSection, ReportSection, FilterActions } from './SharedComponents';
import { useData } from '../../../contexts/DataContext';

const PropertyStatement: React.FC = () => {
    const { properties, invoices, payments, expenses } = useData();
    const [selectedProperty, setSelectedProperty] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const reportData = useMemo(() => {
        if (!selectedProperty) return null;

        // Filter data based on property and dates
        const filterByDate = (item: any) => {
            if (dateRange.start && new Date(item.date) < new Date(dateRange.start)) return false;
            if (dateRange.end && new Date(item.date) > new Date(dateRange.end)) return false;
            return true;
        };

        const propInvoices = invoices.filter(i => i.property === selectedProperty && filterByDate(i));
        const propPayments = payments.filter(p => p.propertyName === selectedProperty && filterByDate(p));
        const propExpenses = expenses.filter(e => e.property === selectedProperty && filterByDate(e));

        const totalInvoiced = propInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
        const totalCollected = propPayments.reduce((sum, p) => sum + p.amount, 0);
        const totalExpenses = propExpenses.reduce((sum, e) => sum + e.amount, 0);
        const netIncome = totalCollected - totalExpenses;

        return {
            invoices: propInvoices,
            payments: propPayments,
            expenses: propExpenses,
            summary: {
                totalInvoiced,
                totalCollected,
                totalExpenses,
                netIncome
            }
        };
    }, [selectedProperty, dateRange, invoices, payments, expenses]);

    return (
        <>
            <FilterSection title="Filters">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Property</label>
                        <select 
                            value={selectedProperty}
                            onChange={(e) => setSelectedProperty(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-gray-50 border"
                        >
                            <option value="">Select Property</option>
                            {properties.map(p => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Date Range</label>
                        <div className="flex items-center space-x-2">
                            <input 
                                type="date" 
                                value={dateRange.start}
                                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 border" 
                            />
                            <span className="text-gray-500">-</span>
                            <input 
                                type="date" 
                                value={dateRange.end}
                                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 border" 
                            />
                        </div>
                    </div>
                </div>
                <FilterActions />
            </FilterSection>

            <div className="space-y-6">
                <ReportSection title="Property Statement">
                    {reportData ? (
                        <div className="w-full text-left">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                                <div className="p-4 bg-blue-50 rounded border border-blue-100">
                                    <p className="text-xs text-blue-600 font-bold uppercase">Total Invoiced</p>
                                    <p className="text-xl font-bold text-gray-800">{reportData.summary.totalInvoiced.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded border border-green-100">
                                    <p className="text-xs text-green-600 font-bold uppercase">Total Collected</p>
                                    <p className="text-xl font-bold text-gray-800">{reportData.summary.totalCollected.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-red-50 rounded border border-red-100">
                                    <p className="text-xs text-red-600 font-bold uppercase">Total Expenses</p>
                                    <p className="text-xl font-bold text-gray-800">{reportData.summary.totalExpenses.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded border border-gray-200">
                                    <p className="text-xs text-gray-600 font-bold uppercase">Net Income</p>
                                    <p className={`text-xl font-bold ${reportData.summary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {reportData.summary.netIncome.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <h4 className="font-semibold text-gray-800 mb-4 bg-gray-100 p-2 rounded">Recent Income (Payments)</h4>
                            {reportData.payments.length > 0 ? (
                                <table className="min-w-full text-sm mb-8">
                                    <thead><tr className="text-gray-500 border-b"><th className="text-left py-2">Date</th><th className="text-left py-2">Tenant</th><th className="text-left py-2">Reference</th><th className="text-right py-2">Amount</th></tr></thead>
                                    <tbody>
                                        {reportData.payments.map(p => (
                                            <tr key={p.id} className="border-b border-gray-50"><td className="py-2">{p.date}</td><td className="py-2">{p.tenantName}</td><td className="py-2 text-xs font-mono">{p.paymentId}</td><td className="py-2 text-right">{p.amount.toLocaleString()}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : <p className="text-gray-500 italic mb-8">No payments recorded in this period.</p>}

                            <h4 className="font-semibold text-gray-800 mb-4 bg-gray-100 p-2 rounded">Expenses</h4>
                            {reportData.expenses.length > 0 ? (
                                <table className="min-w-full text-sm">
                                    <thead><tr className="text-gray-500 border-b"><th className="text-left py-2">Date</th><th className="text-left py-2">Category</th><th className="text-left py-2">Description</th><th className="text-right py-2">Amount</th></tr></thead>
                                    <tbody>
                                        {reportData.expenses.map(e => (
                                            <tr key={e.id} className="border-b border-gray-50"><td className="py-2">{e.date}</td><td className="py-2">{e.category}</td><td className="py-2 text-xs">{e.description}</td><td className="py-2 text-right">{e.amount.toLocaleString()}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : <p className="text-gray-500 italic">No expenses recorded in this period.</p>}
                        </div>
                    ) : (
                        <div className="text-center py-8">Select a property to generate the report.</div>
                    )}
                </ReportSection>
            </div>
        </>
    );
};

export default PropertyStatement;
