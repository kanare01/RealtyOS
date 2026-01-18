
import React from 'react';
import { RecurringExpense } from '../../types';

interface RecurringExpensesSummaryCardProps {
    expenses: RecurringExpense[];
}

const RecurringExpensesSummaryCard: React.FC<RecurringExpensesSummaryCardProps> = ({ expenses }) => {
    const monthlyTotal = expenses
        .filter(e => e.status === 'Active' && e.frequency === 'Monthly')
        .reduce((sum, e) => sum + e.amount, 0);
    
    const activeCount = expenses.filter(e => e.status === 'Active').length;

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
             <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                <h3 className="font-semibold text-gray-800">Recurring Overview</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                <div className="p-6 text-center">
                    <p className="text-sm font-medium text-gray-500 mb-1">Monthly Liability (Active)</p>
                    <p className="text-3xl font-bold text-gray-800">{monthlyTotal.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">KES / Month</p>
                </div>
                 <div className="p-6 text-center">
                    <p className="text-sm font-medium text-gray-500 mb-1">Active Recurring</p>
                    <p className="text-3xl font-bold text-blue-600">{activeCount}</p>
                    <p className="text-xs text-gray-400 mt-1">Items</p>
                </div>
            </div>
        </div>
    );
};

export default RecurringExpensesSummaryCard;
