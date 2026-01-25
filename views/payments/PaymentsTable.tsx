
import React, { useState } from 'react';
import { Payment } from '../../types';
import Badge from '../../components/shared/Badge';

interface PaymentsTableProps {
    payments: Payment[];
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({ payments }) => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(payments.map(p => p.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSendReceipts = () => {
        if (selectedIds.length === 0) return;
        alert(`Sending ${selectedIds.length} receipts...`);
        setSelectedIds([]);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-blue-800 text-lg">Payments</h3>
                 <span className="text-sm text-gray-500">
                    {selectedIds.length} selected
                </span>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <button 
                        onClick={handleSendReceipts}
                        disabled={selectedIds.length === 0}
                        className={`px-4 py-2 text-sm font-medium border rounded transition-colors flex items-center ${
                            selectedIds.length > 0 
                            ? 'text-blue-800 bg-white border-blue-800 hover:bg-blue-50' 
                            : 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                        Send Receipt(s)
                    </button>
                    <div className="flex items-center space-x-2">
                         <button className="p-2 text-blue-800 bg-white border border-blue-800 rounded hover:bg-blue-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                         <button className="px-4 py-2 text-sm font-medium text-blue-800 bg-white border border-blue-800 rounded hover:bg-blue-50 transition-colors">
                            Download Payments
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                     <table className="min-w-full text-sm text-left">
                        <thead className="text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-3 w-4">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        onChange={handleSelectAll}
                                        checked={payments.length > 0 && selectedIds.length === payments.length}
                                    />
                                </th>
                                <th className="p-3 font-normal cursor-pointer hover:text-gray-700">
                                    Date
                                </th>
                                <th className="p-3 font-normal">Reference</th>
                                <th className="p-3 font-normal">Tenant</th>
                                <th className="p-3 font-normal">Property (Unit)</th>
                                <th className="p-3 font-normal">Method</th>
                                <th className="p-3 font-normal">Status</th>
                                <th className="p-3 font-normal text-right">Amount (KES)</th>
                                <th className="p-3 font-normal text-center">Options</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 divide-y divide-gray-50">
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="p-8 text-center text-gray-500">
                                        No payments found.
                                    </td>
                                </tr>
                            ) : (
                                payments.map(payment => (
                                    <tr key={payment.id} className="hover:bg-gray-50">
                                        <td className="p-3">
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                checked={selectedIds.includes(payment.id)}
                                                onChange={() => handleSelectRow(payment.id)}
                                            />
                                        </td>
                                        <td className="p-3">{payment.date}</td>
                                        <td className="p-3 font-mono text-xs">{payment.paymentId}</td>
                                        <td className="p-3 font-medium text-blue-800">{payment.tenantName}</td>
                                        <td className="p-3 text-xs">{payment.propertyName} <span className="text-gray-400">({payment.unitName})</span></td>
                                        <td className="p-3">{payment.method}</td>
                                        <td className="p-3">
                                            <Badge color={payment.status === 'confirmed' ? 'green' : 'yellow'}>
                                                {payment.status}
                                            </Badge>
                                        </td>
                                        <td className="p-3 font-medium text-right text-gray-800">{payment.amount.toLocaleString()}</td>
                                        <td className="p-3 text-center">
                                            <button className="text-gray-400 hover:text-blue-800">
                                                ...
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                     </table>
                </div>

                <div className="flex justify-between items-center pt-4 text-sm text-gray-500 border-t border-gray-100 mt-4">
                    <div className="flex items-center">
                        <select className="border-gray-200 rounded text-sm py-1 pl-2 pr-6 bg-white mr-3 focus:ring-blue-500 focus:border-blue-500">
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                        </select>
                        <p>Showing {payments.length > 0 ? 1 : 0} to {payments.length} of {payments.length} results</p>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&laquo;</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&lsaquo;</button>
                        <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded text-gray-600 font-medium">1</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&rsaquo;</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&raquo;</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentsTable;
