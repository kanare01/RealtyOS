
import React, { useMemo } from 'react';
import DashboardCard from './DashboardCard';
import { useData } from '../../contexts/DataContext';

const RevenueChart: React.FC = () => {
    const { payments, invoices, expenses } = useData();

    const chartData = useMemo(() => {
        const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
        const currentYear = new Date().getFullYear();
        
        return months.map(month => {
            // Simple mock mapping for month names to numbers (0-11) for the current year
            // Note: In a real app, we'd handle years dynamically.
            const monthIndex = new Date(`${month} 1, ${currentYear}`).getMonth();
            
            const monthlyPayments = payments
                .filter(p => new Date(p.date).getMonth() === monthIndex)
                .reduce((sum, p) => sum + p.amount, 0);

            const monthlyInvoices = invoices
                .filter(i => new Date(i.date).getMonth() === monthIndex)
                .reduce((sum, i) => sum + i.totalAmount, 0);

            const monthlyExpenses = expenses
                .filter(e => new Date(e.date).getMonth() === monthIndex)
                .reduce((sum, e) => sum + e.amount, 0);

            return {
                name: month,
                payments: monthlyPayments,
                invoices: monthlyInvoices,
                expenses: monthlyExpenses
            };
        });
    }, [payments, invoices, expenses]);

    // Calculate max value for scaling
    const maxValue = useMemo(() => {
        const max = Math.max(...chartData.map(d => Math.max(d.payments, d.invoices, d.expenses)));
        return max === 0 ? 10000 : max * 1.2; // Add 20% headroom
    }, [chartData]);

    const formatCurrency = (val: number) => {
        if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
        return val.toString();
    };

    return (
        <DashboardCard title="Financial Overview">
            <div className="flex justify-center items-center space-x-6 mb-6">
                <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-sm text-gray-600">Collected (Payments)</span>
                </div>
                <div className="flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    <span className="text-sm text-gray-600">Billed (Invoices)</span>
                </div>
                <div className="flex items-center">
                    <span className="w-3 h-3 bg-red-400 rounded-full mr-2"></span>
                    <span className="text-sm text-gray-600">Expenses</span>
                </div>
            </div>

            <div className="w-full h-72 flex flex-col">
                <div className="flex-grow flex items-end space-x-4 pr-4">
                    {/* Y-Axis Labels */}
                    <div className="flex flex-col justify-between h-full text-xs text-gray-400 py-1 min-w-[3rem] text-right pr-2">
                        <span>{formatCurrency(maxValue)}</span>
                        <span>{formatCurrency(maxValue * 0.75)}</span>
                        <span>{formatCurrency(maxValue / 2)}</span>
                        <span>{formatCurrency(maxValue * 0.25)}</span>
                        <span>0</span>
                    </div>
                    {/* Chart Bars */}
                    <div className="flex-grow flex items-end justify-around border-l border-b border-gray-200 pl-2 relative">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            <div className="border-t border-gray-100 w-full h-0"></div>
                            <div className="border-t border-gray-100 w-full h-0"></div>
                            <div className="border-t border-gray-100 w-full h-0"></div>
                            <div className="border-t border-gray-100 w-full h-0"></div>
                            <div className="border-t border-gray-100 w-full h-0"></div>
                        </div>

                        {chartData.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">
                                    <p className="font-bold mb-1 border-b border-gray-600 pb-1">{data.name}</p>
                                    <p className="text-green-300">Collected: {data.payments.toLocaleString()}</p>
                                    <p className="text-blue-300">Billed: {data.invoices.toLocaleString()}</p>
                                    <p className="text-red-300">Expenses: {data.expenses.toLocaleString()}</p>
                                </div>
                                
                                <div className="flex items-end justify-center space-x-1 w-full px-1 h-full">
                                    <div 
                                        className="w-1/3 bg-green-500 rounded-t-sm transition-all duration-500 ease-out hover:bg-green-600"
                                        style={{ height: `${(data.payments / maxValue) * 100}%` }}
                                    ></div>
                                    <div 
                                        className="w-1/3 bg-blue-500 rounded-t-sm transition-all duration-500 ease-out hover:bg-blue-600"
                                        style={{ height: `${(data.invoices / maxValue) * 100}%` }}
                                    ></div>
                                    <div 
                                        className="w-1/3 bg-red-400 rounded-t-sm transition-all duration-500 ease-out hover:bg-red-500"
                                        style={{ height: `${(data.expenses / maxValue) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-500 mt-2 font-medium">{data.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="text-center text-xs text-gray-400 mt-4">Revenue vs Expenses (Last 7 Months)</div>
            </div>
        </DashboardCard>
    );
};

export default RevenueChart;
