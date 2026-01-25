
import React from 'react';

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
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
            </div>
            <span className="font-semibold text-gray-700">{subtext2}</span>
        </div>
    </div>
);

const TenantArrearsPanel: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                <SummaryCard 
                    title="Tenant Arrears (KES)" 
                    value="0.00" 
                    subtext1="tenants with arrears"
                    subtext2="0 tenants"
                />
                <SummaryCard 
                    title="Advance Payments (KES)" 
                    value="0.00" 
                    subtext1="tenants with advance payments"
                    subtext2="0 tenants"
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
                                <th className="p-4 font-normal">Total Advance Payemtns (KES)</th>
                                <th className="p-4 font-normal"># Tenants with Advance Payments</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                             <tr className="hover:bg-gray-50 border-b border-gray-50">
                                <td className="p-4">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </td>
                                <td className="p-4 text-[#1a237e]">kanari Apartments</td>
                                <td className="p-4 text-[#1a237e]">KES 0.00</td>
                                <td className="p-4"><span className="bg-gray-200 px-2 py-1 rounded text-xs text-gray-700 font-bold">0</span></td>
                                <td className="p-4 text-[#1a237e]">KES 0.00</td>
                                <td className="p-4"><span className="bg-gray-200 px-2 py-1 rounded text-xs text-gray-700 font-bold">0</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TenantArrearsPanel;
