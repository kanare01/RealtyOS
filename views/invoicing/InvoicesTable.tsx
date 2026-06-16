import React from 'react';
import { useData } from '../../contexts/DataContext';

const InvoicesTable: React.FC = () => {
    const { invoices, loading } = useData();

    if (loading) {
        return <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>;
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Invoices</h3>
                <button className="text-gray-500 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <button className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Send Invoices
                    </button>
                    <div className="flex items-center space-x-2">
                         <button className="p-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                         <button className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors">
                            Download Invoices
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto border-t border-b">
                     <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 w-4"><input type="checkbox" className="rounded"/></th>
                                <th className="p-3 text-left font-medium text-gray-500">Date</th>
                                <th className="p-3 text-left font-medium text-gray-500">Invoice ID/Number</th>
                                <th className="p-3 text-left font-medium text-gray-500">Tenant</th>
                                <th className="p-3 text-left font-medium text-gray-500">Item</th>
                                <th className="p-3 text-left font-medium text-gray-500">Status</th>
                                <th className="p-3 text-left font-medium text-gray-500">Amount</th>
                                <th className="p-3 text-left font-medium text-gray-500">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map(invoice => (
                                <tr key={invoice.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3"><input type="checkbox" className="rounded"/></td>
                                    <td className="p-3">{invoice.date}</td>
                                    <td className="p-3 font-medium text-blue-600">{invoice.invoiceNumber}</td>
                                    <td className="p-3">{invoice.tenantName}</td>
                                    <td className="p-3">{invoice.item}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                            invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="p-3 font-semibold">{invoice.amount.toLocaleString()}</td>
                                    <td className="p-3">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {invoices.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-gray-500">No invoices found.</td>
                                </tr>
                            )}
                        </tbody>
                     </table>
                </div>

                <div className="flex justify-between items-center pt-4 text-sm text-gray-600">
                    <div className="flex items-center">
                        <select className="border-gray-300 rounded-md text-sm p-1.5">
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                        </select>
                        <p className="ml-3">Showing {invoices.length > 0 ? 1 : 0} to {invoices.length} of {invoices.length} results</p>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50" disabled>&laquo;</button>
                        <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50" disabled>&lsaquo;</button>
                        <button className="px-3.5 py-1.5 rounded-md bg-blue-500 text-white text-sm">1</button>
                        <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50" disabled>&rsaquo;</button>
                        <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50" disabled>&raquo;</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicesTable;
