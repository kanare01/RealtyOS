
import React, { useState } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface PaymentFormViewProps {
    setCurrentView: (view: View) => void;
}

const PaymentFormView: React.FC<PaymentFormViewProps> = ({ setCurrentView }) => {
    const { tenants, addPayment, addNotification } = useData();
    const [selectedTenantId, setSelectedTenantId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('Mpesa');
    const [reference, setReference] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedTenant = tenants.find(t => t.id.toString() === selectedTenantId);

    const handleSubmit = async () => {
        if (!selectedTenantId || !amount || !reference) {
            addNotification("Please fill in all required fields (Tenant, Amount, Reference)", 'error');
            return;
        }

        const tenant = tenants.find(t => t.id.toString() === selectedTenantId);
        
        if (tenant) {
            setIsSubmitting(true);
            try {
                const success = await addPayment({
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
                
                if (success) {
                    setCurrentView('Payments');
                }
            } catch (e) {
                console.error("Payment submission error", e);
            } finally {
                setIsSubmitting(false);
            }
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
                            disabled={isSubmitting}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border disabled:bg-gray-100"
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
                            disabled={isSubmitting}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KES)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            disabled={isSubmitting}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            disabled={isSubmitting}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border disabled:bg-gray-100"
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
                            disabled={isSubmitting}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border disabled:bg-gray-100"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        disabled={isSubmitting}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border resize-none disabled:bg-gray-100"
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
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`px-6 py-2 bg-[#1a237e] text-white rounded-md hover:bg-blue-900 transition-colors shadow-sm font-medium flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : 'Record Payment'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFormView;
