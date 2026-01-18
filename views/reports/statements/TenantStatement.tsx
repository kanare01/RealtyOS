
import React, { useState, useMemo } from 'react';
import { FilterSection, ReportSection, FilterActions } from './SharedComponents';
import { useData } from '../../../contexts/DataContext';

const TenantStatement: React.FC = () => {
    const { tenants, invoices, payments, properties } = useData();
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedTenantId, setSelectedTenantId] = useState('');

    // Filter tenants based on property selection
    const filteredTenants = useMemo(() => {
        if (!selectedProperty || selectedProperty === 'All Properties') return tenants;
        return tenants.filter(t => t.property === selectedProperty);
    }, [tenants, selectedProperty]);

    // Calculate statement data
    const statementData = useMemo(() => {
        if (!selectedTenantId) return [];
        
        const tenant = tenants.find(t => t.id.toString() === selectedTenantId);
        if (!tenant) return [];

        const tenantInvoices = invoices
            .filter(i => i.tenantName === tenant.name)
            .map(i => ({
                id: `inv-${i.id}`,
                date: i.date,
                type: 'Invoice',
                ref: i.invoiceNumber,
                description: i.items.map(item => item.description).join(', '),
                amount: i.totalAmount,
                isCredit: false // Debit (increase balance)
            }));

        const tenantPayments = payments
            .filter(p => p.tenantName === tenant.name)
            .map(p => ({
                id: `pay-${p.id}`,
                date: p.date,
                type: 'Payment',
                ref: p.paymentId,
                description: `Payment via ${p.method}`,
                amount: p.amount,
                isCredit: true // Credit (decrease balance)
            }));

        // Sort by date
        const combined = [...tenantInvoices, ...tenantPayments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Calculate running balance
        let runningBalance = 0;
        return combined.map(item => {
            if (item.isCredit) {
                runningBalance -= item.amount;
            } else {
                runningBalance += item.amount;
            }
            return { ...item, balance: runningBalance };
        });

    }, [selectedTenantId, invoices, payments, tenants]);

    const tenantDetails = tenants.find(t => t.id.toString() === selectedTenantId);

    return (
        <>
            <FilterSection title="Filters">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Property</label>
                        <select 
                            value={selectedProperty}
                            onChange={(e) => {
                                setSelectedProperty(e.target.value);
                                setSelectedTenantId(''); // Reset tenant when property changes
                            }}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-gray-50 border"
                        >
                            <option value="">All Properties</option>
                            {properties.map(p => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Tenant</label>
                        <select 
                            value={selectedTenantId}
                            onChange={(e) => setSelectedTenantId(e.target.value)}
                            disabled={filteredTenants.length === 0}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-gray-50 border"
                        >
                            <option value="">Select Tenant</option>
                            {filteredTenants.map(t => (
                                <option key={t.id} value={t.id}>{t.name} (Unit: {t.unit})</option>
                            ))}
                        </select>
                    </div>
                </div>
                <FilterActions />
            </FilterSection>

            <ReportSection title={`Tenant Statement ${tenantDetails ? `- ${tenantDetails.name}` : ''}`}>
                {statementData.length > 0 ? (
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-600 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Reference</th>
                                    <th className="p-3">Description</th>
                                    <th className="p-3 text-right">Debit (Inv)</th>
                                    <th className="p-3 text-right">Credit (Pay)</th>
                                    <th className="p-3 text-right">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {statementData.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="p-3">{row.date}</td>
                                        <td className="p-3">{row.type}</td>
                                        <td className="p-3 text-xs font-mono">{row.ref}</td>
                                        <td className="p-3 text-gray-500">{row.description}</td>
                                        <td className="p-3 text-right">{!row.isCredit ? row.amount.toLocaleString() : '-'}</td>
                                        <td className="p-3 text-right">{row.isCredit ? row.amount.toLocaleString() : '-'}</td>
                                        <td className="p-3 text-right font-bold text-gray-700">{row.balance.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        {selectedTenantId ? "No transactions found for this tenant." : "Please select a tenant to view statement."}
                    </div>
                )}
            </ReportSection>
        </>
    );
};

export default TenantStatement;
