
import React from 'react';

const PaymentsTable: React.FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-blue-800 text-lg">Payments</h3>
                 <button className="text-blue-800 hover:text-blue-900 font-bold text-xl">
                    -
                </button>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <button className="px-4 py-2 text-sm font-medium text-blue-800 bg-white border border-blue-800 rounded hover:bg-blue-50 transition-colors flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                        Send Receipt(s)
                    </button>
                    <div className="flex items-center space-x-2">
                         <button className="p-2 text-blue-800 bg-white border border-blue-800 rounded hover:bg-blue-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                         <button className="px-4 py-2 text-sm font-medium text-blue-800 bg-white border border-blue-800 rounded hover:bg-blue-50 transition-colors">
                            Download Payments
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                     <table className="min-w-full text-sm text-left">
                        <thead className="text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-3 w-4"><input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/></th>
                                <th className="p-3 font-normal cursor-pointer hover:text-gray-700">
                                    <div className="flex items-center">
                                        Date
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </th>
                                <th className="p-3 font-normal">Payment ID/Number</th>
                                <th className="p-3 font-normal">Tenant</th>
                                <th className="p-3 font-normal">Property (Unit)</th>
                                <th className="p-3 font-normal">Status</th>
                                <th className="p-3 font-normal">Amount (KES)</th>
                                <th className="p-3 font-normal">Options</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {/* Empty state to match the image showing 0 results */}
                            <tr>
                                <td colSpan={8} className="p-4 text-center py-12">
                                </td>
                            </tr>
                        </tbody>
                     </table>
                </div>

                <div className="flex justify-between items-center pt-4 text-sm text-gray-500 border-t border-gray-100 mt-4">
                    <div className="flex items-center">
                        <select className="border-gray-200 rounded text-sm py-1 pl-2 pr-6 bg-white mr-3 focus:ring-blue-500 focus:border-blue-500">
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                        </select>
                        <p>Showing 0 to 0 of 0 results</p>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&laquo;</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&lsaquo;</button>
                        <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded text-gray-600 font-medium">1</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&rsaquo;</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&raquo;</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentsTable;
