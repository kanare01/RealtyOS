
import React from 'react';

const MaintenanceFiltersPanel: React.FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-[#1a237e] text-lg">Filters</h3>
                <button className="text-[#1a237e] hover:text-blue-900 font-bold text-xl">
                    -
                </button>
            </div>
            <div className="p-4">
                <div className="py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Property / Unit</h4>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                     <select className="w-full text-sm border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:ring-[#1a237e] focus:border-[#1a237e]">
                        <option>All Properties</option>
                        <option>Sunset Apartments</option>
                        <option>Lakeside Villas</option>
                    </select>
                </div>

                <div className="py-4">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Status</h4>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" />
                            <span className="ml-2 text-sm text-gray-600">open</span>
                        </label>
                         <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" />
                            <span className="ml-2 text-sm text-gray-600">in progress</span>
                        </label>
                         <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" />
                            <span className="ml-2 text-sm text-gray-600">closed</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceFiltersPanel;
