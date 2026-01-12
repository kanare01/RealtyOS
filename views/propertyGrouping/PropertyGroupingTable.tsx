
import React from 'react';

const PropertyGroupingTable: React.FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Property Groupings</h3>
                 <button className="text-[#1a237e] hover:text-blue-900 font-bold text-xl">
                    -
                </button>
            </div>
            <div className="p-4">
                <div className="overflow-x-auto">
                     <table className="min-w-full text-sm text-left">
                        <thead className="text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-3 font-normal">Name</th>
                                <th className="p-3 font-normal">Properties</th>
                                <th className="p-3 font-normal">Managers</th>
                                <th className="p-3 font-normal">Options</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {/* Empty state matching the image */}
                        </tbody>
                     </table>
                </div>

                <div className="flex items-center space-x-1 pt-4 text-sm text-gray-500 border-t border-gray-100 mt-4">
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&lt;</button>
                    <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded text-gray-600 font-medium">1</button>
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&gt;</button>
                </div>
            </div>
        </div>
    );
};

export default PropertyGroupingTable;
