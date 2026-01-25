import React from 'react';

const SummaryCard: React.FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
             <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Summary</h3>
                 <button className="text-gray-500 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className="p-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Total</p>
                <p className="text-4xl font-bold text-gray-800">0.00</p>
                <p className="text-xs text-gray-400 mt-1">(KES)</p>
            </div>
        </div>
    );
};

export default SummaryCard;