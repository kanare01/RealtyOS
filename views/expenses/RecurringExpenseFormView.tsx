
import React, { useState } from 'react';
import { View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface RecurringExpenseFormViewProps {
    setCurrentView: (view: View) => void;
}

const RecurringExpenseFormView: React.FC<RecurringExpenseFormViewProps> = ({ setCurrentView }) => {
    const { properties, addRecurringExpense } = useData();
    const [description, setDescription] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('');
    const [unit, setUnit] = useState('');
    const [category, setCategory] = useState('Maintenance');
    const [frequency, setFrequency] = useState<'Monthly' | 'Quarterly' | 'Yearly'>('Monthly');
    const [amount, setAmount] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = () => {
        if (!selectedProperty || !amount || !description) {
            alert("Please fill in the required fields (Property, Amount, Description).");
            return;
        }

        const start = new Date(startDate);
        let nextDue = new Date(start);
        
        if (frequency === 'Monthly') nextDue.setMonth(start.getMonth() + 1);
        if (frequency === 'Quarterly') nextDue.setMonth(start.getMonth() + 3);
        if (frequency === 'Yearly') nextDue.setFullYear(start.getFullYear() + 1);

        addRecurringExpense({
            id: Date.now(),
            description: description,
            property: selectedProperty,
            unit: unit || '-',
            category: category,
            frequency: frequency,
            amount: parseFloat(amount) || 0,
            startDate: startDate,
            nextDueDate: nextDue.toISOString().split('T')[0],
            status: 'Active'
        });

        alert("Recurring expense setup successfully!");
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
                <h2 className="text-2xl font-normal text-gray-700">Setup Recurring Expense</h2>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expense Name</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Monthly Garbage Collection"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value as any)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        >
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Yearly">Yearly</option>
                        </select>
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
                            <option value="Security">Security</option>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white border"
                        />
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
                        Create Schedule
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecurringExpenseFormView;
