
import React, { useState } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface PaymentFormViewProps {
    setCurrentView: (view: View) => void;
}

const PaymentFormView: React.FC<PaymentFormViewProps> = ({ setCurrentView }) => {
    const { tenants, addPayment } = useData();
    const [selectedTenantId, setSelectedTenantId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('Mpesa');
    const [reference, setReference] = useState('');
    const [notes, setNotes] = useState('');

    const selectedTenant = tenants.find(t => t.id.toString() === selectedTenantId);

    const handleSubmit = () => {
        if (!selectedTenantId || !amount || !reference) {
            alert("Please fill in all required fields (Tenant, Amount, Reference)");
            return;
        }

        const tenant = tenants.find(t => t.id.toString() === selectedTenantId);
        
        if (tenant) {
            addPayment({
                id: Date.now(),
                date: date,
                paymentId: reference,
                tenantName: tenant.name,
                propertyName: tenant.property,
                unitName: tenant.unit,
                amount: parseFloat(amount),
                method: method,
                status: 'confirmed'
            });
            
            alert('Payment recorded successfully!');
            setCurrentView('Payments');
        }
    };

    return (
        <div className="animate-fadeIn w-full max-w-4xl mx-auto pb-20">
            <div className="mb-6">
                <button 
                    onClick={() => setCurrentView('Payments')}
                    className="flex items-center text-[#1a237e] text-sm hover:underline mb-4"
                >
                    &larr; Back to Payments
                </button>
                <h2 className="text-2xl font-normal text-gray-700">Record Payment</h2>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Tenant</label>
                        <select
                            value={selectedTenantId}
                            onChange={(e) => setSelectedTenantId(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        >
                            <option value="">Select Tenant</option>
                            {tenants.map(tenant => (
                                <option key={tenant.id} value={tenant.id}>
                                    {tenant.name} - {tenant.property} ({tenant.unit})
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KES)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        >
                            <option value="Mpesa">Mpesa</option>
                            <option value="Bank">Bank Transfer</option>
                            <option value="Cash">Cash</option>
                            <option value="Check">Check</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
                        <input
                            type="text"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="e.g. QX1234567"
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border resize-none"
                        placeholder="Add any notes about this payment..."
                    ></textarea>
                </div>

                {selectedTenant && (
                    <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-800 mb-2">Payment Details Summary</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>Property: <span className="font-semibold">{selectedTenant.property}</span></div>
                            <div>Unit: <span className="font-semibold">{selectedTenant.unit}</span></div>
                            <div>Current Balance: <span className="font-semibold text-red-600">{selectedTenant.balance?.toLocaleString() || 0} KES</span></div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setCurrentView('Payments')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-[#1a237e] text-white rounded-md hover:bg-blue-900 transition-colors shadow-sm font-medium"
                    >
                        Record Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFormView;
