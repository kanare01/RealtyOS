
import React from 'react';
import { Tenant } from '../../types';

interface TenantsSummaryCardProps {
    tenants: Tenant[];
}

const SummaryItem: React.FC<{ title: string; value: string; subtext?: string }> = ({ title, value, subtext }) => (
    <div className="flex-1 text-center p-6">
        <p className="text-gray-500 text-sm mb-2 relative inline-block">
            {title}
            <span className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-[1px] bg-gray-200 hidden md:block"></span>
        </p>
        <div className="text-[#1a237e] text-3xl font-medium">{value}</div>
        {subtext && <div className="text-gray-400 text-xs mt-1">{subtext}</div>}
    </div>
);

const TenantsSummaryCard: React.FC<TenantsSummaryCardProps> = ({ tenants }) => {
    const totalTenants = tenants.length;
    const totalArrears = tenants.reduce((acc, t) => acc + (t.balance && t.balance > 0 ? t.balance : 0), 0);
    // Mocking expiring leases logic
    const expiringLeases = tenants.filter(t => t.leaseEndDate !== 'N/A').length;

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
             <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Summary</h3>
                 <button className="text-[#1a237e] hover:text-blue-900 font-bold text-xl">
                    -
                </button>
            </div>
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
                <SummaryItem title="Total Tenants" value={totalTenants.toString()} />
                <SummaryItem title="Total Arrears" value={totalArrears.toLocaleString()} subtext="(KES)" />
                <SummaryItem title="Expiring Leases" value={expiringLeases.toString()} subtext="(in next 60 days)" />
            </div>
        </div>
    );
};

export default TenantsSummaryCard;
