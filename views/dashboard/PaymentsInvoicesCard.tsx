import React from 'react';
import DashboardCard from '../../components/shared/DashboardCard';
import DonutChart from '../../components/shared/DonutChart';

const PaymentsInvoicesCard: React.FC = () => {
    return (
        <DashboardCard title="Payments and Invoices">
            <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md">
                    <span className="text-sm">10/01/2025</span>
                    <span>-</span>
                    <span className="text-sm">10/16/2025</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                 </div>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">Total Billed</p>
                    <p className="font-bold text-xl">0.00</p>
                    <p className="text-gray-500 text-sm mt-2">Total Paid</p>
                    <p className="font-bold text-xl">0.00</p>
                </div>
                <DonutChart percentage={0} />
                <div>
                     <button className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors">
                        Record Payments
                    </button>
                </div>
            </div>
             <div className="text-left mt-4">
                <a href="#" className="text-sm text-blue-600 hover:underline">View &rarr;</a>
            </div>
        </DashboardCard>
    );
};

export default PaymentsInvoicesCard;