
import React from 'react';

const PaymentsSummaryCard: React.FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
             <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-blue-800 text-lg">Summary</h3>
                 <button className="text-blue-800 hover:text-blue-900 font-bold text-xl">
                    -
                </button>
            </div>
            <div className="p-8 text-center">
                <div className="inline-block relative">
                    <h4 className="text-gray-400 text-sm mb-2 font-normal border-t border-gray-200 pt-2 px-8">Total</h4>
                </div>
                <p className="text-4xl font-normal text-blue-800 mb-1">0.00</p>
                <p className="text-sm text-gray-500">(KES)</p>
            </div>
        </div>
    );
};

export default PaymentsSummaryCard;
