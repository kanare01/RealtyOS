
import React, { useState, useMemo } from 'react';
import { FilterSection, ReportSection, FilterActions } from './SharedComponents';
import { useData } from '../../../contexts/DataContext';

const PropertyGroupingReport: React.FC = () => {
    const { propertyGroupings, properties, payments } = useData();
    const [selectedGroupId, setSelectedGroupId] = useState('');

    const groupReport = useMemo(() => {
        if (!selectedGroupId) return null;
        
        const group = propertyGroupings.find(g => g.id.toString() === selectedGroupId);
        if (!group) return null;

        const groupProperties = properties.filter(p => group.propertyIds.includes(p.id));
        
        // Aggregate stats per property in group
        const stats = groupProperties.map(prop => {
            const income = payments
                .filter(p => p.propertyName === prop.name)
                .reduce((sum, p) => sum + p.amount, 0);
            
            return {
                name: prop.name,
                units: prop.units,
                occupancy: prop.occupancy,
                income
            };
        });

        const totalIncome = stats.reduce((sum, s) => sum + s.income, 0);

        return {
            groupName: group.name,
            properties: stats,
            totalIncome
        };

    }, [selectedGroupId, propertyGroupings, properties, payments]);

    return (
        <>
            <FilterSection title="Filters">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Grouping</label>
                        <select 
                            value={selectedGroupId}
                            onChange={(e) => setSelectedGroupId(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-gray-50 border"
                        >
                            <option value="">Select Grouping</option>
                            {propertyGroupings.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <FilterActions />
            </FilterSection>

            <ReportSection title="Property Grouping Report">
                {groupReport ? (
                    <div className="w-full text-left">
                        <div className="mb-6 border-b pb-4">
                            <h3 className="text-xl font-bold text-[#1a237e]">{groupReport.groupName}</h3>
                            <p className="text-sm text-gray-500">Consolidated Report</p>
                        </div>

                        <div className="mb-6 p-4 bg-blue-50 rounded text-center">
                            <p className="text-gray-500 uppercase text-xs font-bold">Total Group Income</p>
                            <p className="text-2xl font-bold text-[#1a237e]">KES {groupReport.totalIncome.toLocaleString()}</p>
                        </div>

                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-600 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="p-3">Property Name</th>
                                    <th className="p-3 text-center">Total Units</th>
                                    <th className="p-3 text-center">Occupancy</th>
                                    <th className="p-3 text-right">Income Generated</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {groupReport.properties.map((prop, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="p-3 font-medium text-gray-700">{prop.name}</td>
                                        <td className="p-3 text-center">{prop.units}</td>
                                        <td className="p-3 text-center">{prop.occupancy}%</td>
                                        <td className="p-3 text-right font-medium">{prop.income.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8">Select a property grouping to view report.</div>
                )}
            </ReportSection>
        </>
    );
};

export default PropertyGroupingReport;
