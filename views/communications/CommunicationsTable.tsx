
import React from 'react';

const CommunicationsTable: React.FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Messages</h3>
                 <button className="text-[#1a237e] hover:text-blue-900 font-bold text-xl">
                    -
                </button>
            </div>
            <div className="p-4">
                <div className="mb-4">
                    <button className="px-4 py-2 text-sm font-medium text-[#1a237e] bg-white border border-[#1a237e] hover:bg-gray-50 rounded-md transition-colors shadow-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Resend Messages
                    </button>
                </div>

                <div className="overflow-x-auto">
                     <table className="min-w-full text-sm text-left">
                        <thead className="text-gray-400 font-normal border-b border-gray-100">
                            <tr>
                                <th className="p-3 w-8"><input type="checkbox" className="rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" /></th>
                                <th className="p-3 font-normal">Type</th>
                                <th className="p-3 font-normal">Date</th>
                                <th className="p-3 font-normal">Tenant/Team</th>
                                <th className="p-3 font-normal">Property<br/><span className="text-xs">(Unit)</span></th>
                                <th className="p-3 font-normal">Message</th>
                                <th className="p-3 font-normal">Status</th>
                                <th className="p-3 font-normal">Resend</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {/* Empty state matching the image */}
                        </tbody>
                     </table>
                </div>

                <div className="flex items-center pt-4 text-xs text-gray-500 border-t border-gray-100 mt-4">
                    <div className="flex items-center mr-4">
                        <select className="border-gray-200 rounded text-xs py-1 pl-2 pr-6 bg-white mr-2 focus:ring-[#1a237e] focus:border-[#1a237e]">
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                        </select>
                    </div>
                    <p>Showing 0 to 0 of 0 Results</p>
                </div>
            </div>
        </div>
    );
};

export default CommunicationsTable;
