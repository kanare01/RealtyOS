
import React, { useState } from 'react';
import { Invoice } from '../../types';
import Badge from '../../components/shared/Badge';
import { useData } from '../../contexts/DataContext';

interface InvoicesTableProps {
    invoices: Invoice[];
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({ invoices }) => {
    const { deleteInvoice } = useData();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

    const toggleDropdown = (id: number) => {
        setActiveDropdownId(activeDropdownId === id ? null : id);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(invoices.map(i => i.id));
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

    const handleSendInvoices = () => {
        if (selectedIds.length === 0) {
            alert("Please select invoices to send.");
            return;
        }
        alert(`Sending ${selectedIds.length} invoice(s) via Email/SMS...`);
        setSelectedIds([]);
    };

    const handleDownload = () => {
        if (selectedIds.length === 0) {
            alert("Download all visible invoices report...");
        } else {
            alert(`Downloading ${selectedIds.length} selected invoice(s)...`);
        }
    };

    const handleVoid = (invoice: Invoice) => {
        if (confirm("Are you sure you want to void this invoice? This will remove it from the list.")) {
            // Since our backend/types don't strictly support 'Void' state in the enum yet, 
            // we will delete it to clean up the ledger.
            deleteInvoice(invoice.id);
            setActiveDropdownId(null);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this invoice?")) {
            deleteInvoice(id);
            setActiveDropdownId(null);
        }
    };

    // Helper for status badge color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'green';
            case 'Unpaid': return 'red';
            case 'Pending': return 'yellow';
            default: return 'gray';
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Invoices List</h3>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <button 
                        onClick={handleSendInvoices}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors flex items-center ${selectedIds.length > 0 ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        disabled={selectedIds.length === 0}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Send Invoices {selectedIds.length > 0 && `(${selectedIds.length})`}
                    </button>
                    <div className="flex items-center space-x-2">
                         <button className="p-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                         <button 
                            onClick={handleDownload}
                            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                        >
                            Download
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto border-t border-b min-h-[300px]">
                     <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="p-3 w-4">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        onChange={handleSelectAll}
                                        checked={invoices.length > 0 && selectedIds.length === invoices.length}
                                    />
                                </th>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Invoice #</th>
                                <th className="p-3 text-left">Tenant</th>
                                <th className="p-3 text-left">Items</th>
                                <th className="p-3 text-left">Property (Unit)</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-right">Amount (KES)</th>
                                <th className="p-3 text-center">Options</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="p-8 text-center text-gray-500">
                                        No invoices found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                invoices.map(invoice => (
                                    <tr key={invoice.id} className="hover:bg-gray-50 relative">
                                        <td className="p-3">
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                checked={selectedIds.includes(invoice.id)}
                                                onChange={() => handleSelectRow(invoice.id)}
                                            />
                                        </td>
                                        <td className="p-3 text-gray-600">{invoice.date}</td>
                                        <td className="p-3 font-medium text-blue-600 hover:underline cursor-pointer">{invoice.invoiceNumber}</td>
                                        <td className="p-3 text-gray-800">{invoice.tenantName}</td>
                                        <td className="p-3 text-gray-500 text-xs max-w-[150px] truncate">
                                            {invoice.items.map(i => i.description).join(', ')}
                                        </td>
                                        <td className="p-3 text-gray-600">
                                            {invoice.property} <span className="text-gray-400">({invoice.unit})</span>
                                        </td>
                                        <td className="p-3">
                                            <Badge color={getStatusColor(invoice.status) as any}>
                                                {invoice.status}
                                            </Badge>
                                        </td>
                                        <td className="p-3 text-right font-medium text-gray-800">
                                            {invoice.totalAmount.toLocaleString()}
                                        </td>
                                        <td className="p-3 text-center relative">
                                            <button 
                                                onClick={() => toggleDropdown(invoice.id)}
                                                className="text-gray-400 hover:text-blue-600 p-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                </svg>
                                            </button>
                                            
                                            {activeDropdownId === invoice.id && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setActiveDropdownId(null)}></div>
                                                    <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded shadow-xl z-20 overflow-hidden">
                                                        <button 
                                                            onClick={() => handleVoid(invoice)}
                                                            className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Void / Cancel
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(invoice.id)}
                                                            className="block w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                     </table>
                </div>

                <div className="flex justify-between items-center pt-4 text-sm text-gray-600">
                    <div className="flex items-center">
                        <select className="border-gray-300 rounded-md text-sm p-1.5 focus:ring-blue-500 focus:border-blue-500">
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                        </select>
                        <p className="ml-3">Showing {invoices.length > 0 ? 1 : 0} to {invoices.length} of {invoices.length} results</p>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 text-gray-500" disabled>&laquo;</button>
                        <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 text-gray-500" disabled>&lsaquo;</button>
                        <button className="px-3.5 py-1.5 rounded-md bg-blue-600 text-white text-sm shadow">1</button>
                        <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 text-gray-500" disabled>&rsaquo;</button>
                        <button className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 text-gray-500" disabled>&raquo;</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicesTable;
