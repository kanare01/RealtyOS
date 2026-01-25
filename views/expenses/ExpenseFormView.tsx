
import React, { useState } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface ExpenseFormViewProps {
    setCurrentView: (view: View) => void;
}

const ExpenseFormView: React.FC<ExpenseFormViewProps> = ({ setCurrentView }) => {
    const { properties, addExpense } = useData();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedProperty, setSelectedProperty] = useState('');
    const [unit, setUnit] = useState('');
    const [category, setCategory] = useState('Maintenance');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'draft' | 'confirmed'>('confirmed');

    const handleSubmit = () => {
        if (!selectedProperty || !amount || !date) {
            alert("Please fill in the required fields (Property, Amount, Date).");
            return;
        }

        addExpense({
            id: Date.now(),
            date: date,
            property: selectedProperty,
            unit: unit || '-',
            category: category,
            status: status,
            amount: parseFloat(amount) || 0,
            description: description
        });

        alert("Expense recorded successfully!");
        setCurrentView('Expenses');
    };

    return (
        <div className="animate-fadeIn w-full max-w-4xl mx-auto pb-20">
            <div className="mb-6">
                <button 
                    onClick={() => setCurrentView('Expenses')}
                    className="flex items-center text-[#1a237e] text-sm hover:underline mb-4"
                >
                    &larr; Back to Expenses
                </button>
                <h2 className="text-2xl font-normal text-gray-700">Record New Expense</h2>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expense Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                        <select
                            value={selectedProperty}
                            onChange={(e) => setSelectedProperty(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        >
                            <option value="">Select Property</option>
                            {properties.map(p => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit (Optional)</label>
                        <input
                            type="text"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            placeholder="e.g. Unit 101"
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        >
                            <option value="Maintenance">Maintenance</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Salaries">Salaries</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Office Supplies">Office Supplies</option>
                            <option value="Other">Other</option>
                        </select>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <div className="flex space-x-4 pt-2">
                            <label className="flex items-center">
                                <input 
                                    type="radio" 
                                    checked={status === 'confirmed'} 
                                    onChange={() => setStatus('confirmed')}
                                    className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e]"
                                />
                                <span className="ml-2 text-sm text-gray-700">Confirmed</span>
                            </label>
                            <label className="flex items-center">
                                <input 
                                    type="radio" 
                                    checked={status === 'draft'} 
                                    onChange={() => setStatus('draft')}
                                    className="h-4 w-4 text-[#1a237e] focus:ring-[#1a237e]"
                                />
                                <span className="ml-2 text-sm text-gray-700">Draft</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border resize-none"
                        placeholder="Details about the expense..."
                    ></textarea>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Receipt (Optional)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:bg-gray-50 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-500">Click to upload receipt image</span>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setCurrentView('Expenses')}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-[#1a237e] text-white rounded-md hover:bg-blue-900 transition-colors shadow-sm font-medium"
                    >
                        Save Expense
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExpenseFormView;
