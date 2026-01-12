import React from 'react';
import DashboardCard from '../../components/shared/DashboardCard';

const chartData = [
  { name: 'Apr', payments: 0, invoices: 0, expenses: 0 },
  { name: 'May', payments: 0, invoices: 0, expenses: 0 },
  { name: 'Jun', payments: 4, invoices: 0, expenses: 0 },
  { name: 'Jul', payments: 0, invoices: 0, expenses: 0 },
  { name: 'Aug', payments: 0, invoices: 0, expenses: 0 },
  { name: 'Sep', payments: 0, invoices: 0, expenses: 0 },
  { name: 'Oct', payments: 0, invoices: 0, expenses: 0 },
];

const RevenueChart: React.FC = () => {
    const maxValue = 5; // Set a static max value for the y-axis

    return (
        <DashboardCard>
            <div className="flex justify-center items-center space-x-6 mb-4">
                <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-sm text-gray-600">Total payments</span>
                </div>
                <div className="flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    <span className="text-sm text-gray-600">Total invoices</span>
                </div>
                <div className="flex items-center">
                    <span className="w-3 h-3 bg-sky-300 rounded-full mr-2"></span>
                    <span className="text-sm text-gray-600">Total expenses</span>
                </div>
            </div>

            <div className="w-full h-72 flex flex-col">
                <div className="flex-grow flex items-end space-x-4 pr-4">
                    {/* Y-Axis Labels */}
                    <div className="flex flex-col justify-between h-full text-xs text-gray-500 py-1">
                        <span>{maxValue}-</span>
                        <span>{maxValue * 0.75}-</span>
                        <span>{maxValue / 2}-</span>
                        <span>{maxValue * 0.25}-</span>
                        <span>0-</span>
                    </div>
                    {/* Chart Bars */}
                    <div className="flex-grow flex items-end justify-around border-l border-b border-gray-200 pl-2">
                        {chartData.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center group relative">
                                <div className="absolute bottom-full mb-2 w-max bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <p className="font-bold">{data.name}</p>
                                    <p>Total payments: {data.payments}</p>
                                    <p>Total invoices: {data.invoices}</p>
                                    <p>Total expenses: {data.expenses}</p>
                                </div>
                                <div
                                    className="w-1/3 bg-green-500"
                                    style={{ height: `${(data.payments / maxValue) * 100}%` }}
                                ></div>
                                <span className="text-xs text-gray-500 mt-2">{data.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="text-center text-sm text-gray-500 mt-2">Apr 2025 - Oct 2025</div>
            </div>
        </DashboardCard>
    );
};

export default RevenueChart;