
import React from 'react';
import { useData } from '../../contexts/DataContext';

const MaintenanceTable: React.FC = () => {
    const { maintenance, loading } = useData();

    if (loading) {
        return <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
        </div>;
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Maintenance</h3>
                <button className="text-[#1a237e] hover:text-blue-900 font-bold text-xl">
                    -
                </button>
            </div>
            <div className="p-4">
                <div className="overflow-x-auto">
                     <table className="min-w-full text-sm text-left">
                        <thead className="text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-3 font-normal">Short Summary</th>
                                <th className="p-3 font-normal">Property Name</th>
                                <th className="p-3 font-normal">Unit ID/Name</th>
                                <th className="p-3 font-normal">Status</th>
                                <th className="p-3 font-normal">Category</th>
                                <th className="p-3 font-normal">Expense</th>
                                <th className="p-3 font-normal">Date</th>
                                <th className="p-3 font-normal">Options</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {maintenance.map(item => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium text-blue-800">{item.summary}</td>
                                    <td className="p-3">{item.propertyName}</td>
                                    <td className="p-3">{item.unitName}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            item.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                                            item.status === 'Open' ? 'bg-red-100 text-red-800' : 
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-3">{item.category}</td>
                                    <td className="p-3 font-semibold">{item.expense.toLocaleString()}</td>
                                    <td className="p-3">{item.date}</td>
                                    <td className="p-3">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {maintenance.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-500">No maintenance requests found.</td>
                                </tr>
                            )}
                        </tbody>
                     </table>
                </div>

                <div className="flex items-center space-x-1 pt-4 text-sm text-gray-500 border-t border-gray-100 mt-4">
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&lt;</button>
                    <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded text-gray-600 font-medium">1</button>
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&gt;</button>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceTable;

