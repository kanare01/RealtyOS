
import React, { useState } from 'react';
import { Utility } from '../../types';
import { useData } from '../../contexts/DataContext';
import Badge from '../../components/shared/Badge';

interface UtilitiesTableProps {
    utilities: Utility[];
}

const UtilitiesTable: React.FC<UtilitiesTableProps> = ({ utilities }) => {
    const { addInvoice, tenants, updateUtility } = useData();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(utilities.map(u => u.id));
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

    const handleCreateInvoices = () => {
        if (selectedIds.length === 0) {
            alert("Please select utility records to invoice.");
            return;
        }

        const selectedUtilities = utilities.filter(u => selectedIds.includes(u.id));
        let invoicedCount = 0;

        selectedUtilities.forEach(util => {
            if (util.status !== 'Invoiced') {
                // Find tenant for this unit
                const tenant = tenants.find(t => t.property === util.propertyName && t.unit === util.unitName && t.status === 'Active');
                
                if (tenant) {
                    // Create invoice
                    addInvoice({
                        id: Date.now() + Math.random(),
                        date: new Date().toISOString().split('T')[0],
                        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        invoiceNumber: `INV-UTL-${util.id}`,
                        tenantName: tenant.name,
                        property: util.propertyName,
                        unit: util.unitName,
                        items: [{ description: `${util.type} Bill (${util.date})`, amount: util.amount }],
                        totalAmount: util.amount,
                        status: 'Unpaid'
                    });

                    // Update utility status
                    updateUtility({ ...util, status: 'Invoiced', invoiceNumber: `INV-UTL-${util.id}` });
                    invoicedCount++;
                }
            }
        });

        if (invoicedCount > 0) {
            alert(`Successfully created ${invoicedCount} invoice(s).`);
            setSelectedIds([]);
        } else {
            alert("No eligible records found or tenants not found for selected units.");
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Utilities</h3>
                 <span className="text-sm text-gray-500">{utilities.length} Records</span>
            </div>
            <div className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                     <button 
                        onClick={handleCreateInvoices}
                        disabled={selectedIds.length === 0}
                        className={`px-4 py-2 text-sm font-medium border rounded transition-colors flex items-center ${
                            selectedIds.length > 0 
                            ? 'text-[#1a237e] bg-white border-[#1a237e] hover:bg-blue-50' 
                            : 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Create Invoices {selectedIds.length > 0 && `(${selectedIds.length})`}
                    </button>
                    <button 
                        onClick={() => alert("Reminders feature coming soon")}
                        className="px-4 py-2 text-sm font-medium text-[#1a237e] bg-white border border-[#1a237e] rounded hover:bg-blue-50 transition-colors flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Send Reminders
                    </button>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                     <table className="min-w-full text-sm text-left">
                        <thead className="text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-3 w-4">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        onChange={handleSelectAll}
                                        checked={utilities.length > 0 && selectedIds.length === utilities.length}
                                    />
                                </th>
                                <th className="p-3 font-normal">Date</th>
                                <th className="p-3 font-normal">Property</th>
                                <th className="p-3 font-normal">Unit</th>
                                <th className="p-3 font-normal">Item</th>
                                <th className="p-3 font-normal">Prev Reading</th>
                                <th className="p-3 font-normal">Curr Reading</th>
                                <th className="p-3 font-normal">Amount</th>
                                <th className="p-3 font-normal">Status</th>
                                <th className="p-3 font-normal">Options</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {utilities.map(util => (
                                <tr key={util.id} className="hover:bg-gray-50 border-b border-gray-50">
                                    <td className="p-3">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            checked={selectedIds.includes(util.id)}
                                            onChange={() => handleSelectRow(util.id)}
                                        />
                                    </td>
                                    <td className="p-3">{util.date}</td>
                                    <td className="p-3">{util.propertyName}</td>
                                    <td className="p-3">{util.unitName}</td>
                                    <td className="p-3">{util.type}</td>
                                    <td className="p-3">{util.previousReading}</td>
                                    <td className="p-3">{util.currentReading}</td>
                                    <td className="p-3 font-medium">{util.amount.toLocaleString()}</td>
                                    <td className="p-3">
                                        <Badge color={util.status === 'Invoiced' ? 'green' : 'gray'}>
                                            {util.status}
                                        </Badge>
                                    </td>
                                    <td className="p-3">...</td>
                                </tr>
                            ))}
                             {utilities.length === 0 && (
                                 <tr>
                                    <td colSpan={10} className="p-4 text-center py-12 text-gray-500">
                                        No utilities recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                     </table>
                </div>

                <div className="flex items-center space-x-4 pt-4 text-sm text-gray-500 border-t border-gray-100 mt-4">
                     <select className="border-gray-200 rounded text-sm py-1 pl-2 pr-6 bg-white focus:ring-blue-500 focus:border-blue-500">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                    <p>Showing {utilities.length} Records</p>
                </div>
            </div>
        </div>
    );
};

export default UtilitiesTable;
