
import React, { useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { View } from '../../types';

interface OccupancyRatePanelProps {
    setCurrentView: (view: View) => void;
}

const SummaryCard: React.FC<{ title: string; value: string; subtext: string; highlight?: boolean }> = ({ title, value, subtext, highlight }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex-1">
        <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
        <div className={`text-3xl font-medium mb-3 ${highlight ? 'text-[#1a237e]' : 'text-[#1a237e]'}`}>{value}</div>
        <div className="text-sm text-gray-500">
            {subtext}
        </div>
    </div>
);

const OccupancyRatePanel: React.FC<OccupancyRatePanelProps> = ({ setCurrentView }) => {
    const { properties, units } = useData();

    const data = useMemo(() => {
        let totalVacancies = 0;
        let totalOccupied = 0;
        let totalUnitsCount = units.length;

        const propertyStats = properties.map(prop => {
            const propUnits = units.filter(u => u.propertyName === prop.name);
            const total = propUnits.length;
            const occupied = propUnits.filter(u => u.status === 'Occupied').length;
            const vacant = total - occupied;
            const rentLost = propUnits.filter(u => u.status === 'Vacant').reduce((sum, u) => sum + u.rentAmount, 0);
            const occupancyRate = total > 0 ? (occupied / total) * 100 : 0;

            totalVacancies += vacant;
            totalOccupied += occupied;

            return {
                name: prop.name,
                unoccupied: vacant,
                total: total,
                rentLost: rentLost,
                rate: occupancyRate
            };
        });

        // Sort by rent lost descending by default to highlight revenue impact
        propertyStats.sort((a, b) => b.rentLost - a.rentLost);

        const overallOccupancyRate = totalUnitsCount > 0 ? ((totalOccupied / totalUnitsCount) * 100).toFixed(1) : '0';

        return {
            totalVacancies,
            totalOccupied,
            totalUnitsCount,
            overallOccupancyRate,
            rows: propertyStats
        };
    }, [properties, units]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                <SummaryCard 
                    title="Total Vacancies" 
                    value={data.totalVacancies.toString()} 
                    subtext={`${data.totalUnitsCount} total units | ${data.overallOccupancyRate}% Occupied`}
                />
                <SummaryCard 
                    title="Occupied Units" 
                    value={data.totalOccupied.toString()} 
                    subtext={`${properties.length} Total Properties`}
                    highlight
                />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-700">Property Occupancy Summary</h3>
                    <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">Sort by:</span>
                        <select className="border-gray-300 rounded-md text-sm p-1.5 bg-gray-50 focus:ring-[#1a237e] focus:border-[#1a237e]">
                            <option>Total Rent Lost</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-white text-gray-500 border-b border-gray-100 text-xs uppercase font-semibold">
                            <tr>
                                <th className="p-4 w-8"></th>
                                <th className="p-4 cursor-pointer hover:text-gray-700">
                                    <div className="flex items-center">
                                        Property Name
                                    </div>
                                </th>
                                <th className="p-4 cursor-pointer hover:text-gray-700">
                                    <div className="flex items-center">
                                        # Units Unoccupied
                                    </div>
                                </th>
                                <th className="p-4 cursor-pointer hover:text-gray-700">
                                    <div className="flex items-center">
                                        Total Units
                                    </div>
                                </th>
                                <th className="p-4">
                                     <div className="flex items-center">
                                        Estimated Rent Lost
                                    </div>
                                </th>
                                <th className="p-4 cursor-pointer hover:text-gray-700">
                                     <div className="flex items-center">
                                        Occupancy Rate
                                    </div>
                                </th>
                                <th className="p-4">Options</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {data.rows.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">No property data available.</td>
                                </tr>
                            ) : (
                                data.rows.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 border-b border-gray-50">
                                        <td className="p-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </td>
                                        <td 
                                            className="p-4 text-[#1a237e] cursor-pointer hover:underline"
                                            onClick={() => setCurrentView('Properties')}
                                        >
                                            {row.name}
                                        </td>
                                        <td className="p-4"><span className={`px-2 py-1 rounded border border-gray-200 text-xs font-bold ${row.unoccupied > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>{row.unoccupied}</span></td>
                                        <td className="p-4 text-[#1a237e]">{row.total}</td>
                                        <td className="p-4 text-gray-500">KES {row.rentLost.toLocaleString()}</td>
                                        <td className={`p-4 font-bold ${row.rate === 100 ? 'text-green-600' : row.rate < 50 ? 'text-red-600' : 'text-yellow-600'}`}>{row.rate.toFixed(1)}%</td>
                                        <td className="p-4">
                                            <button 
                                                className="text-[#1a237e] hover:text-blue-900 text-xs font-medium"
                                                onClick={() => setCurrentView('Units')}
                                            >
                                                View Units
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OccupancyRatePanel;
