
import React, { useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { View } from '../../types';

interface TenantArrearsPanelProps {
    setCurrentView: (view: View) => void;
}

const SummaryCard: React.FC<{ title: string; value: string; subtext1: string; subtext2: string }> = ({ title, value, subtext1, subtext2 }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex-1">
        <div className="flex items-center text-gray-700 mb-2">
            <h3 className="text-lg font-medium mr-2">{title}</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <div className="text-[#1a237e] text-3xl font-medium mb-3">{value}</div>
        <div className="text-sm text-gray-500 flex flex-col gap-1">
            <div className="flex items-center">
                 <span className="mr-1 text-gray-400"># {subtext1}</span>
            </div>
            <span className="font-semibold text-gray-700">{subtext2}</span>
        </div>
    </div>
);

const TenantArrearsPanel: React.FC<TenantArrearsPanelProps> = ({ setCurrentView }) => {
    const { tenants, properties } = useData();

    const data = useMemo(() => {
        let totalArrears = 0;
        let totalAdvance = 0;
        let tenantsWithArrearsCount = 0;
        let tenantsWithAdvanceCount = 0;

        const propertyStats: Record<string, {
            name: string;
            arrears: number;
            arrearsCount: number;
            advance: number;
            advanceCount: number;
        }> = {};

        // Initialize properties
        properties.forEach(p => {
            propertyStats[p.name] = {
                name: p.name,
                arrears: 0,
                arrearsCount: 0,
                advance: 0,
                advanceCount: 0
            };
        });

        // If a tenant has a property not in list, add it
        tenants.forEach(t => {
            if (!propertyStats[t.property]) {
                propertyStats[t.property] = {
                    name: t.property,
                    arrears: 0,
                    arrearsCount: 0,
                    advance: 0,
                    advanceCount: 0
                };
            }

            const balance = t.balance || 0;
            if (balance > 0) {
                totalArrears += balance;
                tenantsWithArrearsCount++;
                propertyStats[t.property].arrears += balance;
                propertyStats[t.property].arrearsCount++;
            } else if (balance < 0) {
                totalAdvance += Math.abs(balance);
                tenantsWithAdvanceCount++;
                propertyStats[t.property].advance += Math.abs(balance);
                propertyStats[t.property].advanceCount++;
            }
        });

        return {
            totalArrears,
            totalAdvance,
            tenantsWithArrearsCount,
            tenantsWithAdvanceCount,
            rows: Object.values(propertyStats).sort((a, b) => b.arrears - a.arrears) // Sort by highest arrears
        };
    }, [tenants, properties]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                <SummaryCard 
                    title="Tenant Arrears (KES)" 
                    value={data.totalArrears.toLocaleString()} 
                    subtext1="tenants with arrears"
                    subtext2={`${data.tenantsWithArrearsCount} tenants`}
                />
                <SummaryCard 
                    title="Advance Payments (KES)" 
                    value={data.totalAdvance.toLocaleString()} 
                    subtext1="tenants with advance payments"
                    subtext2={`${data.tenantsWithAdvanceCount} tenants`}
                />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-700">Tenant Arrears Summary</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-white text-gray-500 border-b border-gray-100">
                            <tr>
                                <th className="p-4 w-8"></th>
                                <th className="p-4 font-normal">Property Name</th>
                                <th className="p-4 font-normal">Total Arrears (KES)</th>
                                <th className="p-4 font-normal"># Tenants with Arrears</th>
                                <th className="p-4 font-normal">Total Advance Payments (KES)</th>
                                <th className="p-4 font-normal"># Tenants with Advance Payments</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {data.rows.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">No properties data found.</td>
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
                                            onClick={() => setCurrentView('Tenants')}
                                        >
                                            {row.name}
                                        </td>
                                        <td className="p-4 text-[#1a237e]">KES {row.arrears.toLocaleString()}</td>
                                        <td className="p-4"><span className="bg-gray-200 px-2 py-1 rounded text-xs text-gray-700 font-bold">{row.arrearsCount}</span></td>
                                        <td className="p-4 text-[#1a237e]">KES {row.advance.toLocaleString()}</td>
                                        <td className="p-4"><span className="bg-gray-200 px-2 py-1 rounded text-xs text-gray-700 font-bold">{row.advanceCount}</span></td>
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

export default TenantArrearsPanel;
