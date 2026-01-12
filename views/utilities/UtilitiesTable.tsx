
import React from 'react';

const UtilitiesTable: React.FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Utilities</h3>
                 <button className="text-[#1a237e] hover:text-blue-900 font-bold text-xl">
                    -
                </button>
            </div>
            <div className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                     <button className="px-4 py-2 text-sm font-medium text-[#1a237e] bg-white border border-[#1a237e] rounded hover:bg-blue-50 transition-colors flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Create Invoices
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-[#1a237e] bg-white border border-[#1a237e] rounded hover:bg-blue-50 transition-colors flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Send Reminders
                    </button>
                </div>

                <div className="overflow-x-auto">
                     <table className="min-w-full text-sm text-left">
                        <thead className="text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-3 w-4"><input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/></th>
                                <th className="p-3 font-normal">Date</th>
                                <th className="p-3 font-normal">Property</th>
                                <th className="p-3 font-normal">Unit</th>
                                <th className="p-3 font-normal">Item</th>
                                <th className="p-3 font-normal">Previous Reading</th>
                                <th className="p-3 font-normal">Current Reading</th>
                                <th className="p-3 font-normal">Invoice ID/Number</th>
                                <th className="p-3 font-normal">Options</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                             {/* Empty state to match the image showing 0 results */}
                             <tr>
                                <td colSpan={9} className="p-4 text-center py-12">
                                </td>
                            </tr>
                        </tbody>
                     </table>
                </div>

                <div className="flex items-center space-x-4 pt-4 text-sm text-gray-500 border-t border-gray-100 mt-4">
                     <select className="border-gray-200 rounded text-sm py-1 pl-2 pr-6 bg-white focus:ring-blue-500 focus:border-blue-500">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                    </select>
                    <p>Showing 0 to 0 of 0 Results</p>
                </div>
            </div>
        </div>
    );
};

export default UtilitiesTable;
