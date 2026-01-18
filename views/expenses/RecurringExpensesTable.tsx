
import React from 'react';
import { RecurringExpense } from '../../types';
import Badge from '../../components/shared/Badge';
import { useData } from '../../contexts/DataContext';

interface RecurringExpensesTableProps {
    expenses: RecurringExpense[];
}

const RecurringExpensesTable: React.FC<RecurringExpensesTableProps> = ({ expenses }) => {
    const { updateRecurringExpense, deleteRecurringExpense, currentUser } = useData();

    const handleToggleStatus = (expense: RecurringExpense) => {
        const newStatus = expense.status === 'Active' ? 'Stopped' : 'Active';
        updateRecurringExpense({ ...expense, status: newStatus });
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this recurring schedule?")) {
            deleteRecurringExpense(id);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                <h3 className="font-semibold text-gray-800">Recurring Items</h3>
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
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Property</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Next Due</th>
                            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                       {expenses.map(expense => (
                           <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                               <td className="px-6 py-4 whitespace-nowrap">
                                   <div className="text-gray-900 font-medium">{expense.description}</div>
                                   <div className="text-gray-500 text-xs">{expense.category}</div>
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap text-gray-700">{expense.property}</td>
                               <td className="px-6 py-4 whitespace-nowrap text-gray-700">{expense.frequency}</td>
                               <td className="px-6 py-4 whitespace-nowrap text-gray-700">{expense.nextDueDate}</td>
                               <td className="px-6 py-4 whitespace-nowrap">
                                   <Badge color={expense.status === 'Active' ? 'green' : 'red'}>
                                       {expense.status}
                                   </Badge>
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-800">
                                   {expense.amount.toLocaleString()}
                               </td>
                               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                   <button 
                                        onClick={() => handleToggleStatus(expense)} 
                                        className={`${expense.status === 'Active' ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'} mr-3`}
                                    >
                                        {expense.status === 'Active' ? 'Pause' : 'Resume'}
                                    </button>
                                    {currentUser?.role === 'Admin' && (
                                        <button 
                                            onClick={() => handleDelete(expense.id)} 
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    )}
                               </td>
                           </tr>
                       ))}
                       {expenses.length === 0 && (
                           <tr>
                               <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                                   No recurring expenses found matching your criteria.
                               </td>
                           </tr>
                       )}
                    </tbody>
                 </table>
            </div>
             <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <span className="text-sm text-gray-500">Showing {expenses.length} records</span>
            </div>
        </div>
    );
};

export default RecurringExpensesTable;
