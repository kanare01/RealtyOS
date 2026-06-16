import React, { useState } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface ExpenseFormViewProps {
    setCurrentView: (view: View) => void;
}

const ExpenseFormView: React.FC<ExpenseFormViewProps> = ({ setCurrentView }) => {
    const { properties, addExpense } = useData();
    
    const [property, setProperty] = useState('');
    const [category, setCategory] = useState('Maintenance');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Paid');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!property || !amount || !date) {
            alert('Please fill in required fields');
            return;
        }

        await addExpense({
            id: 0,
            property,
            category,
            amount: parseFloat(amount),
            date,
            description,
            status
        });

        setCurrentView('Expenses');
    };

    return (
        <div className="animate-fadeIn max-w-2xl mx-auto pb-20">
            <div className="mb-6">
                <button 
                    onClick={() => setCurrentView('Expenses')}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Expenses
                </button>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-8">Record Expense</h2>

            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property *</label>
                        <select 
                            value={property}
                            onChange={(e) => setProperty(e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border"
                            required
                        >
                            <option value="">Select Property</option>
                            {properties.map(p => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border"
                        >
                            <option value="Maintenance">Maintenance</option>
                            <option value="Taxes">Taxes</option>
                            <option value="Insurance">Insurance</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Management Fee">Management Fee</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                        <input 
                            type="date" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select 
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border"
                        >
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Expense details..."
                        rows={3}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm p-2.5 bg-gray-50 border resize-none"
                    ></textarea>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-lg text-sm transition-colors shadow-sm"
                    >
                        Record Expense
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ExpenseFormView;
