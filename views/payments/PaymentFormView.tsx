import React, { useState } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface PaymentFormViewProps {
    setCurrentView: (view: View) => void;
}

const PaymentFormView: React.FC<PaymentFormViewProps> = ({ setCurrentView }) => {
    const { tenants, addPayment } = useData();
    
    const [tenantId, setTenantId] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [method, setMethod] = useState('MPESA');
    const [paymentId, setPaymentId] = useState('');
    const [status, setStatus] = useState('confirmed');

    const generateRandomMpesaCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'RK';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPaymentId(code);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const tenant = tenants.find(t => t.id.toString() === tenantId);
        if (!tenant || !amount || parseFloat(amount) <= 0) {
            alert('Please select a tenant and enter a valid positive payment amount');
            return;
        }

        const mpesaRef = paymentId.trim() || `PAY-${Date.now().toString().slice(-6)}`;

        await addPayment({
            id: 0,
            tenantName: tenant.name,
            propertyName: tenant.property,
            unitName: tenant.unit,
            amount: parseFloat(amount),
            date: paymentDate,
            method: method,
            paymentId: mpesaRef,
            status: status
        });

        setCurrentView('Payments');
    };

    return (
        <div className="animate-fadeIn max-w-2xl mx-auto pb-20">
            <div className="mb-6">
                <button 
                    onClick={() => setCurrentView('Payments')}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    id="back-to-payments-btn"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Payments
                </button>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-8">Record Payment</h2>

            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 space-y-6" id="record-payment-form">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Tenant *</label>
                    <select 
                        value={tenantId}
                        onChange={(e) => setTenantId(e.target.value)}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border"
                        required
                        id="payment-tenant-select"
                    >
                        <option value="">Select Tenant</option>
                        {tenants.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.name} (Unit {t.unit} @ {t.property}) - Bal: KES {t.balance}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (KES) *</label>
                        <input 
                            type="number" 
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border"
                            required
                            min="0.01"
                            id="payment-amount-input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date *</label>
                        <input 
                            type="date" 
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-white border"
                            required
                            id="payment-date-input"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                        <select 
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border"
                            id="payment-method-select"
                        >
                            <option value="MPESA">M-PESA</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Cash">Cash</option>
                            <option value="Cheque">Cheque</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Ref / ID</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={paymentId}
                                onChange={(e) => setPaymentId(e.target.value)}
                                placeholder="Ref / Memo (e.g. SAG123XWZ)"
                                className="flex-1 border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border"
                                id="payment-ref-input"
                            />
                            {method === 'MPESA' && (
                                <button
                                    type="button"
                                    onClick={generateRandomMpesaCode}
                                    className="px-3 py-1.5 bg-gray-200 border border-gray-300 hover:bg-gray-300 rounded-lg text-xs font-semibold text-gray-700 transition"
                                >
                                    Gen Code
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border"
                        id="payment-status-select"
                    >
                        <option value="confirmed">Confirmed / Received</option>
                        <option value="pending">Pending Clearing</option>
                    </select>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit"
                        className="bg-[#1a237e] hover:bg-blue-900 text-white font-medium py-2.5 px-8 rounded-lg text-sm transition-colors shadow-sm"
                        id="payment-submit-btn"
                    >
                        Record Payment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PaymentFormView;
