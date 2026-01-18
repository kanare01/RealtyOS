
import React, { useMemo } from 'react';
import { FilterSection, ReportSection, FilterActions } from './SharedComponents';
import { useData } from '../../../contexts/DataContext';

const YearOnYearReport: React.FC = () => {
    const { payments, expenses } = useData();

    // Group data by Year
    const yearlyStats = useMemo(() => {
        const stats: Record<string, { income: number; expense: number }> = {};

        payments.forEach(p => {
            const year = new Date(p.date).getFullYear().toString();
            if (!stats[year]) stats[year] = { income: 0, expense: 0 };
            stats[year].income += p.amount;
        });

        expenses.forEach(e => {
            const year = new Date(e.date).getFullYear().toString();
            if (!stats[year]) stats[year] = { income: 0, expense: 0 };
            stats[year].expense += e.amount;
        });

        return Object.entries(stats).map(([key, val]) => ({
            year: key,
            income: val.income,
            expense: val.expense,
            net: val.income - val.expense
        })).sort((a, b) => b.year.localeCompare(a.year));
    }, [payments, expenses]);

    return (
        <>
            <FilterSection title="Filters">
                <div className="p-4 text-sm text-gray-500 italic">
                    Standard filters available. Showing aggregated yearly data.
                </div>
                <FilterActions />
            </FilterSection>

            <ReportSection title="Year on Year Report">
                {yearlyStats.length > 0 ? (
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-600 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="p-3">Year</th>
                                    <th className="p-3 text-right">Total Income</th>
                                    <th className="p-3 text-right">Total Expense</th>
                                    <th className="p-3 text-right">Net Income</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {yearlyStats.map((stat, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="p-3 font-medium text-gray-700">{stat.year}</td>
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

export default YearOnYearReport;
