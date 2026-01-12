
import React from 'react';

const PropertyGroupingSummary: React.FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
             <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Summary</h3>
                 <button className="text-[#1a237e] hover:text-blue-900 font-bold text-xl">
                    -
                </button>
            </div>
            <div className="p-8 flex justify-center items-center">
                 <div className="text-center relative">
                    <div className="flex items-center justify-center mb-2">
                        <span className="w-12 h-[1px] bg-gray-200 mr-4"></span>
                        <p className="text-gray-500 text-sm">Total Groupings</p>
                        <span className="w-12 h-[1px] bg-gray-200 ml-4"></span>
                    </div>
                    <div className="text-[#1a237e] text-3xl font-medium">0</div>
                </div>
            </div>
        </div>
    );
};

export default PropertyGroupingSummary;
