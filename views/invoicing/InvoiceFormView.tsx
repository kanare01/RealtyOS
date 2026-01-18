
import React, { useState } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface InvoiceFormViewProps {
    setCurrentView: (view: View) => void;
}

const InvoiceFormView: React.FC<InvoiceFormViewProps> = ({ setCurrentView }) => {
    const { tenants, addInvoice, addNotification } = useData();
    const [selectedTenantId, setSelectedTenantId] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [items, setItems] = useState([{ description: 'Rent', amount: 0 }]);
    const [notes, setNotes] = useState('');

    const selectedTenant = tenants.find(t => t.id.toString() === selectedTenantId);

    const handleAddItem = () => {
        setItems([...items, { description: '', amount: 0 }]);
    };

    const handleItemChange = (index: number, field: 'description' | 'amount', value: string | number) => {
        const newItems = [...items];
        if (field === 'amount') {
            newItems[index].amount = parseFloat(value as string) || 0;
        } else {
            newItems[index].description = value as string;
        }
        setItems(newItems);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + item.amount, 0);
    };

    const handleSubmit = () => {
        if (!selectedTenant) {
            addNotification('Please select a tenant', 'error');
            return;
        }

        const totalAmount = calculateTotal();
        if (totalAmount <= 0) {
            addNotification('Total amount must be greater than 0', 'error');
            return;
        }

        addInvoice({
            id: Date.now(),
            date: invoiceDate,
            dueDate: dueDate,
            invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
            tenantName: selectedTenant.name,
            property: selectedTenant.property,
            unit: selectedTenant.unit,
            items: items,
            totalAmount: totalAmount,
            status: 'Unpaid'
        });

        addNotification('Invoice created successfully!', 'success');
        setCurrentView('Invoices');
    };

    return (
        <div className="animate-fadeIn w-full max-w-4xl mx-auto pb-20">
            <div className="mb-6">
                <button 
                    onClick={() => setCurrentView('Invoices')}
                    className="flex items-center text-[#1a237e] text-sm hover:underline mb-4"
                >
                    &larr; Back to Invoices
                </button>
                <h2 className="text-2xl font-normal text-gray-700">Create New Invoice</h2>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tenant</label>
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
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                                <input
                                    type="date"
                                    value={invoiceDate}
                                    onChange={(e) => setInvoiceDate(e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3 border-b pb-2">Invoice Items</h3>
                    {items.map((item, index) => (
                        <div key={index} className="flex gap-4 mb-3 items-end">
                            <div className="flex-grow">
                                <label className="block text-xs text-gray-500 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                                    placeholder="e.g. Monthly Rent"
                                />
                            </div>
                            <div className="w-32">
                                <label className="block text-xs text-gray-500 mb-1">Amount</label>
                                <input
                                    type="number"
                                    value={item.amount}
                                    onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border text-right"
                                    placeholder="0.00"
                                />
                            </div>
                            <button
                                onClick={() => handleRemoveItem(index)}
                                className="mb-1.5 p-1.5 text-red-500 hover:bg-red-50 rounded"
                                disabled={items.length === 1}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={handleAddItem}
                        className="text-sm text-[#1a237e] font-medium hover:underline flex items-center mt-2"
                    >
                        + Add Item
                    </button>
                </div>

                <div className="flex justify-end mb-6 border-t pt-4">
                    <div className="text-right">
                        <span className="text-gray-600 mr-4">Total Amount:</span>
                        <span className="text-2xl font-bold text-gray-800">KES {calculateTotal().toLocaleString()}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border resize-none"
                        placeholder="Add any additional notes here..."
                    ></textarea>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setCurrentView('Invoices')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-[#1a237e] text-white rounded-md hover:bg-blue-900 transition-colors shadow-sm font-medium"
                    >
                        Create Invoice
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvoiceFormView;
