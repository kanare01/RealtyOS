
import React from 'react';
import { Expense } from '../../types';

interface ExpensesSummaryCardProps {
    expenses: Expense[];
}

const ExpensesSummaryCard: React.FC<ExpensesSummaryCardProps> = ({ expenses }) => {
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
             <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                <h3 className="font-semibold text-gray-800">Expense Summary</h3>
                 <button className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                <div className="p-6 text-center">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Expenses (Selected)</p>
                    <p className="text-3xl font-bold text-gray-800">{totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">KES</p>
                </div>
                 <div className="p-6 text-center">
                    <p className="text-sm font-medium text-gray-500 mb-1">Confirmed</p>
                    <p className="text-3xl font-bold text-blue-600">{expenses.filter(e => e.status === 'confirmed').length}</p>
                    <p className="text-xs text-gray-400 mt-1">Records</p>
                </div>
                 <div className="p-6 text-center">
                    <p className="text-sm font-medium text-gray-500 mb-1">Drafts</p>
                    <p className="text-3xl font-bold text-gray-400">{expenses.filter(e => e.status === 'draft').length}</p>
                    <p className="text-xs text-gray-400 mt-1">Pending Approval</p>
                </div>
            </div>
        </div>
    );
};

export default ExpensesSummaryCard;
