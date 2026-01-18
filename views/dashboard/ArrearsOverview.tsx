
import React, { useMemo } from 'react';
import DashboardCard from '../../components/shared/DashboardCard';
import { useData } from '../../contexts/DataContext';

interface ArrearsOverviewProps {
    onViewAll?: () => void;
}

const ArrearsOverview: React.FC<ArrearsOverviewProps> = ({ onViewAll }) => {
    const { tenants } = useData();

    const arrearsData = useMemo(() => {
        return tenants
            .filter(t => (t.balance || 0) > 0)
            .sort((a, b) => (b.balance || 0) - (a.balance || 0))
            .slice(0, 5); // Top 5
    }, [tenants]);

    return (
        <DashboardCard title="Arrears Overview">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2">Unit</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2">Name</th>
                            <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-2">Amount</th>
                            <th className="text-right text-xs font-semibold text-gray-500 uppercase pb-2">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {arrearsData.length > 0 ? (
                            arrearsData.map(tenant => (
                                <tr key={tenant.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                    <td className="py-3 text-gray-600 font-medium">{tenant.unit}</td>
                                    <td className="py-3 text-gray-800">{tenant.name}</td>
                                    <td className="py-3 text-right text-red-600 font-bold">
                                        {(tenant.balance || 0).toLocaleString()}
                                    </td>
                                    <td className="py-3 text-right">
                                        <button className="text-blue-600 hover:underline text-xs">Notify</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center text-sm text-gray-500 py-8">
                                    No arrears to show. Good job!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="text-left mt-4 border-t border-gray-100 pt-2">
                <button 
                    onClick={onViewAll}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                    View All Arrears 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </button>
            </div>
        </DashboardCard>
    );
};

export default ArrearsOverview;
