
import React from 'react';
import DashboardCard from '../shared/DashboardCard';
import { useData } from '../../contexts/DataContext';
import Badge from '../shared/Badge';

const RecentPaymentsTable: React.FC = () => {
    const { payments } = useData();

    // Get last 5 payments sorted by date (assuming date is ISO string or comparable)
    const recentPayments = [...payments]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    return (
        <DashboardCard title="Recent Transactions">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="py-2">Date</th>
                            <th className="py-2">Tenant</th>
                            <th className="py-2">Property</th>
                            <th className="py-2">Method</th>
                            <th className="py-2 text-right">Amount</th>
                            <th className="py-2 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {recentPayments.length > 0 ? (
                            recentPayments.map(payment => (
                                <tr key={payment.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                    <td className="py-3 whitespace-nowrap text-xs">{payment.date}</td>
                                    <td className="py-3 font-medium text-[#1a237e]">{payment.tenantName}</td>
                                    <td className="py-3 text-xs">{payment.propertyName} - {payment.unitName}</td>
                                    <td className="py-3 text-xs">{payment.method}</td>
                                    <td className="py-3 text-right font-medium">{payment.amount.toLocaleString()}</td>
                                    <td className="py-3 text-right">
                                        <Badge color={payment.status === 'confirmed' ? 'green' : 'yellow'}>
                                            {payment.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-gray-500">
                                    No recent transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardCard>
    );
};

export default RecentPaymentsTable;
