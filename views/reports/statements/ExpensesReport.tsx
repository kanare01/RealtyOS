
import React, { useState, useMemo } from 'react';
import { FilterSection, ReportSection, FilterActions } from './SharedComponents';
import { useData } from '../../../contexts/DataContext';

const ExpensesReport: React.FC = () => {
    const { expenses, properties } = useData();
    const [selectedProperty, setSelectedProperty] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const filteredExpenses = useMemo(() => {
        let list = expenses;

        if (selectedProperty && selectedProperty !== 'All Properties') {
            list = list.filter(e => e.property === selectedProperty);
        }

        if (dateRange.start) {
            list = list.filter(e => new Date(e.date) >= new Date(dateRange.start));
        }
        if (dateRange.end) {
            list = list.filter(e => new Date(e.date) <= new Date(dateRange.end));
        }

        return list;
    }, [expenses, selectedProperty, dateRange]);

    const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <>
            <FilterSection title="Filters">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Property</label>
                        <select 
                            value={selectedProperty}
                            onChange={(e) => setSelectedProperty(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-gray-50 border"
                        >
                            <option value="">All Properties</option>
                            {properties.map(p => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Date Range</label>
                        <div className="flex items-center space-x-2">
                            <input 
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 border" 
                            />
                            <span className="text-gray-500">-</span>
                            <input 
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 border" 
                            />
                        </div>
                    </div>
                </div>
                <FilterActions />
            </FilterSection>

            <ReportSection title="Expenses Report">
                <div className="w-full text-left">
                    <div className="mb-6 p-4 bg-gray-100 rounded text-center">
                        <p className="text-gray-500 uppercase text-xs font-bold">Total Expenses</p>
                        <p className="text-2xl font-bold text-gray-800">KES {totalAmount.toLocaleString()}</p>
                    </div>

                    {filteredExpenses.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-600 font-medium border-b border-gray-200">
                                    <tr>
                                        <th className="p-3">Date</th>
                                        <th className="p-3">Property</th>
                                        <th className="p-3">Category</th>
                                        <th className="p-3">Description</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredExpenses.map(e => (
                                        <tr key={e.id} className="hover:bg-gray-50">
                                            <td className="p-3">{e.date}</td>
                                            <td className="p-3">{e.property} <span className="text-xs text-gray-400">({e.unit})</span></td>
                                            <td className="p-3">{e.category}</td>
                                            <td className="p-3 text-gray-500 max-w-xs truncate">{e.description}</td>
                                            <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded ${e.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>{e.status}</span></td>
                                            <td className="p-3 text-right font-medium">{e.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No expenses found for the selected criteria.
                        </div>
                    )}
                </div>
            </ReportSection>
        </>
    );
};

export default ExpensesReport;
