
import React from 'react';
import { FilterSection, ReportSection, FilterActions } from './SharedComponents';

const PropertyStatement: React.FC = () => {
    return (
        <>
            <FilterSection title="Filters">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Property</label>
                        <select className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-gray-50">
                            <option>All Properties</option>
                            <option>Sunset Apartments</option>
                            <option>Lakeside Villas</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Date:</label>
                        <div className="flex items-center space-x-2">
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input type="text" placeholder="Start Date" className="w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2" />
                            </div>
                            <span className="text-gray-500">-</span>
                            <input type="text" placeholder="End Date" className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-6">
                        <label className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" />
                            <span className="ml-2 text-sm text-gray-600">Show Deleted Tenants</span>
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" />
                            <span className="ml-2 text-sm text-gray-600">Select All Columns</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Columns (optional):</label>
                        <select className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-gray-50 text-gray-500">
                             <option>Select columns to be included in report</option>
                        </select>
                    </div>
                </div>

                <FilterActions />
            </FilterSection>

            <div className="space-y-6">
                <ReportSection title="Property Statement">
                    <div className="w-full">
                        <h4 className="font-semibold text-gray-800 mb-4 text-left">Tenants</h4>
                        <div className="text-center py-8">There are no records to display</div>
                        
                        <h4 className="font-semibold text-gray-800 mb-4 mt-8 text-left">Expenses</h4>
                        <div className="text-center py-8">There are no records to display</div>

                        <h4 className="font-semibold text-gray-800 mb-4 mt-8 text-left">Summary</h4>
                        <div className="text-center py-8">There are no records to display</div>

                        <h4 className="font-semibold text-gray-800 mb-4 mt-8 text-left">Occupancy</h4>
                        <div className="text-center py-8">There are no records to display</div>
                    </div>
                </ReportSection>
            </div>
        </>
    );
};

export default PropertyStatement;
