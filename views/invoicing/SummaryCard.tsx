
import React from 'react';

interface SummaryCardProps {
    total: number;
    count: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ total, count }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
             <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Summary</h3>
                 <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {count} Invoices
                </span>
            </div>
            <div className="p-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Total Outstanding</p>
                <p className="text-4xl font-bold text-gray-800">{total.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">(KES)</p>
            </div>
        </div>
    );
};

export default SummaryCard;
