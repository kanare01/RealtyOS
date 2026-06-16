import React, { useState } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface InvoiceFormViewProps {
    setCurrentView: (view: View) => void;
}

const InvoiceFormView: React.FC<InvoiceFormViewProps> = ({ setCurrentView }) => {
    const { tenants, addInvoice } = useData();
    
    const [tenantId, setTenantId] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('Rent');
    const [status, setStatus] = useState('Unpaid');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const tenant = tenants.find(t => t.id.toString() === tenantId);
        if (!tenant || !amount || !dueDate) {
            alert('Please fill in all required fields');
            return;
        }

        await addInvoice({
            id: 0,
            tenantId: tenant.id,
            tenantName: tenant.name,
            property: tenant.property,
            unit: tenant.unit,
            amount: parseFloat(amount),
            dueDate,
            status,
            date: new Date().toISOString().split('T')[0]
        });

        setCurrentView('Invoices');
    };

    return (
        <div className="animate-fadeIn max-w-2xl mx-auto pb-20">
            <div className="mb-6">
                <button 
                    onClick={() => setCurrentView('Invoices')}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Invoices
                </button>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-8">Create New Invoice</h2>

            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tenant *</label>
                    <select 
                        value={tenantId}
                        onChange={(e) => setTenantId(e.target.value)}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border"
                        required
                    >
                        <option value="">Select Tenant</option>
                        {tenants.map(t => (
                            <option key={t.id} value={t.id}>{t.name} ({t.property} - {t.unit})</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                        <input 
                            type="date" 
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input 
                        type="text" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g. Rent for January"
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border"
                    >
                        <option value="Unpaid">Unpaid</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-lg text-sm transition-colors shadow-sm"
                    >
                        Create Invoice
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InvoiceFormView;
