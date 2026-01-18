
import React, { useMemo } from 'react';
import { FilterSection, ReportSection, FilterActions } from './SharedComponents';
import { useData } from '../../../contexts/DataContext';

const MonthOnMonthReport: React.FC = () => {
    const { payments, expenses } = useData();

    // Group data by Month-Year
    const monthlyStats = useMemo(() => {
        const stats: Record<string, { income: number; expense: number }> = {};

        payments.forEach(p => {
            const date = new Date(p.date);
            const key = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
            if (!stats[key]) stats[key] = { income: 0, expense: 0 };
            stats[key].income += p.amount;
        });

        expenses.forEach(e => {
            const date = new Date(e.date);
            const key = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
            if (!stats[key]) stats[key] = { income: 0, expense: 0 };
            stats[key].expense += e.amount;
        });

        return Object.entries(stats).map(([key, val]) => ({
            month: key,
            income: val.income,
            expense: val.expense,
            net: val.income - val.expense
        }));
    }, [payments, expenses]);

    return (
        <>
            <FilterSection title="Filters">
                <div className="p-4 text-sm text-gray-500 italic">
                    Standard filters available (Property, Date Range). Showing aggregated data across all properties.
                </div>
                <FilterActions />
            </FilterSection>

            <ReportSection title="Month on Month Report">
                {monthlyStats.length > 0 ? (
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-600 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="p-3">Month</th>
                                    <th className="p-3 text-right">Income</th>
                                    <th className="p-3 text-right">Expense</th>
                                    <th className="p-3 text-right">Net Income</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {monthlyStats.map((stat, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="p-3 font-medium text-gray-700">{stat.month}</td>
                                        <td className="p-3 text-right text-green-600">{stat.income.toLocaleString()}</td>
                                        <td className="p-3 text-right text-red-600">{stat.expense.toLocaleString()}</td>
                                        <td className={`p-3 text-right font-bold ${stat.net >= 0 ? 'text-gray-800' : 'text-red-600'}`}>{stat.net.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8">No transaction data available to generate report.</div>
                )}
            </ReportSection>
        </>
    );
};

export default MonthOnMonthReport;
