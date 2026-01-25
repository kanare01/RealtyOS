
import React from 'react';
import { Expense } from '../../types';
import Badge from '../../components/shared/Badge';

interface ExpensesTableProps {
    expenses: Expense[];
}

const ExpensesTable: React.FC<ExpensesTableProps> = ({ expenses }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                <h3 className="font-semibold text-gray-800">Expense Records</h3>
                <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                 <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Property (Unit)</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Category / Description</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Amount (KES)</th>
                            <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                       {expenses.map(expense => (
                           <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                               <td className="px-6 py-4 whitespace-nowrap text-gray-700">{expense.date}</td>
                               <td className="px-6 py-4 whitespace-nowrap">
                                   <div className="text-gray-900 font-medium">{expense.property}</div>
                                   <div className="text-gray-500 text-xs">{expense.unit !== '-' ? `Unit ${expense.unit}` : 'Common Area'}</div>
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap">
                                   <div className="text-gray-900">{expense.category}</div>
                                   <div className="text-gray-500 text-xs italic">{expense.description}</div>
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap">
                                   <Badge color={expense.status === 'confirmed' ? 'green' : 'gray'}>
                                       {expense.status}
                                   </Badge>
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-800">
                                   {expense.amount.toLocaleString()}
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                   <button onClick={() => alert("Edit not implemented")} className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                   <button onClick={() => alert("Delete not implemented")} className="text-red-600 hover:text-red-900">Delete</button>
                               </td>
                           </tr>
                       ))}
                       {expenses.length === 0 && (
                           <tr>
                               <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                   No expenses found matching your criteria.
                               </td>
                           </tr>
                       )}
                    </tbody>
                 </table>
            </div>

            <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <span className="text-sm text-gray-500">Showing {expenses.length} records</span>
                <div className="flex items-center space-x-1">
                    <button className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 text-gray-500" disabled>&laquo;</button>
                    <button className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 text-gray-500" disabled>&lsaquo;</button>
                    <button className="px-3.5 py-1.5 rounded-md bg-blue-600 text-white text-sm shadow-sm">1</button>
                    <button className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 text-gray-500" disabled>&rsaquo;</button>
                    <button className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 text-gray-500" disabled>&raquo;</button>
                </div>
            </div>
        </div>
    );
};

export default ExpensesTable;
