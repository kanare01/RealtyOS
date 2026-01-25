import React from 'react';
import DashboardCard from '../../components/shared/DashboardCard';

const ArrearsOverview: React.FC = () => {
    return (
        <DashboardCard title="Arrears Overview">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2">Unit</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2">Name</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2">Amount</th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase pb-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Rows would be mapped here */}
                        <tr>
                            <td colSpan={4} className="text-center text-sm text-gray-500 py-8">
                                No arrears to show.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="text-left mt-4">
                <a href="#" className="text-sm text-blue-600 hover:underline">View All Arrears &rarr;</a>
            </div>
        </DashboardCard>
    );
};

export default ArrearsOverview;