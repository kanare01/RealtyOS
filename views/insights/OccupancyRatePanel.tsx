
import React from 'react';

const SummaryCard: React.FC<{ title: string; value: string; subtext: string; highlight?: boolean }> = ({ title, value, subtext, highlight }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex-1">
        <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>
        <div className={`text-3xl font-medium mb-3 ${highlight ? 'text-[#1a237e]' : 'text-[#1a237e]'}`}>{value}</div>
        <div className="text-sm text-gray-500">
            {subtext}
        </div>
    </div>
);

const OccupancyRatePanel: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                <SummaryCard 
                    title="Total Vacancies" 
                    value="0" 
                    subtext="1 total units | 100.0% Occupied"
                />
                <SummaryCard 
                    title="Occupied Units" 
                    value="1" 
                    subtext="1 Total Properties"
                    highlight
                />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-700">Property Occupancy Summary</h3>
                    <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">Sort by:</span>
                        <select className="border-gray-300 rounded-md text-sm p-1.5 bg-gray-50 focus:ring-[#1a237e] focus:border-[#1a237e]">
                            <option>Total Rent Lost</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-white text-gray-500 border-b border-gray-100 text-xs uppercase font-semibold">
                            <tr>
                                <th className="p-4 w-8"></th>
                                <th className="p-4 cursor-pointer hover:text-gray-700">
                                    <div className="flex items-center">
                                        Property Name
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </th>
                                <th className="p-4 cursor-pointer hover:text-gray-700">
                                    <div className="flex items-center">
                                        # Units Unoccupied
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </th>
                                <th className="p-4 cursor-pointer hover:text-gray-700">
                                    <div className="flex items-center">
                                        Total Units
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </th>
                                <th className="p-4">
                                     <div className="flex items-center">
                                        Estimated Rent Lost
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </th>
                                <th className="p-4 cursor-pointer hover:text-gray-700">
                                     <div className="flex items-center">
                                        Occupancy Rate
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </th>
                                <th className="p-4">Options</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                             <tr className="hover:bg-gray-50 border-b border-gray-50">
                                <td className="p-4">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </td>
                                <td className="p-4 text-[#1a237e]">kanari Apartments</td>
                                <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded border border-gray-200 text-xs text-gray-600 font-bold">0</span></td>
                                <td className="p-4 text-[#1a237e]">1</td>
                                <td className="p-4 text-gray-500">KES 0.00</td>
                                <td className="p-4 font-bold text-green-600">100.0%</td>
                                <td className="p-4">
                                     <select className="border-gray-300 rounded text-sm p-1 bg-white focus:ring-[#1a237e] focus:border-[#1a237e]">
                                        <option>Options</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OccupancyRatePanel;
