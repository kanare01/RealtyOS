
import React from 'react';

interface PaymentsSummaryCardProps {
    total: number;
    count: number;
}

const PaymentsSummaryCard: React.FC<PaymentsSummaryCardProps> = ({ total, count }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
             <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-blue-800 text-lg">Summary</h3>
                 <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {count} Payments
                </span>
            </div>
            <div className="p-8 text-center">
                <div className="inline-block relative">
                    <h4 className="text-gray-400 text-sm mb-2 font-normal border-t border-gray-200 pt-2 px-8">Total Collected</h4>
                </div>
                <p className="text-4xl font-normal text-blue-800 mb-1">{total.toLocaleString()}</p>
                <p className="text-sm text-gray-500">(KES)</p>
            </div>
        </div>
    );
};

export default PaymentsSummaryCard;
