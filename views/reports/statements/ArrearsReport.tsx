
import React, { useMemo, useState } from 'react';
import { FilterSection, ReportSection, FilterActions } from './SharedComponents';
import { useData } from '../../../contexts/DataContext';

const ArrearsReport: React.FC = () => {
    const { tenants, properties } = useData();
    const [selectedProperty, setSelectedProperty] = useState('');

    const tenantsWithArrears = useMemo(() => {
        let list = tenants.filter(t => (t.balance || 0) > 0);
        
        if (selectedProperty && selectedProperty !== 'All Properties') {
            list = list.filter(t => t.property === selectedProperty);
        }
        
        return list;
    }, [tenants, selectedProperty]);

    const totalArrears = tenantsWithArrears.reduce((sum, t) => sum + (t.balance || 0), 0);

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
                </div>
                <FilterActions />
            </FilterSection>

            <ReportSection title="Arrears Report">
                <div className="w-full text-left">
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded text-center">
                        <p className="text-gray-500 uppercase text-xs font-bold">Total Arrears</p>
                        <p className="text-2xl font-bold text-red-700">KES {totalArrears.toLocaleString()}</p>
                    </div>

                    {tenantsWithArrears.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-600 font-medium border-b border-gray-200">
                                    <tr>
                                        <th className="p-3">Tenant Name</th>
                                        <th className="p-3">Property</th>
                                        <th className="p-3">Unit</th>
                                        <th className="p-3">Phone</th>
                                        <th className="p-3 text-right">Balance Due</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {tenantsWithArrears.map(t => (
                                        <tr key={t.id} className="hover:bg-gray-50">
                                            <td className="p-3 font-medium text-[#1a237e]">{t.name}</td>
                                            <td className="p-3">{t.property}</td>
                                            <td className="p-3">{t.unit}</td>
                                            <td className="p-3 text-xs">{t.phone}</td>
                                            <td className="p-3 text-right font-bold text-red-600">{(t.balance || 0).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No tenants have outstanding arrears.
                        </div>
                    )}
                </div>
            </ReportSection>
        </>
    );
};

export default ArrearsReport;
