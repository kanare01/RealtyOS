
import React from 'react';
import { FilterSection, ReportSection, FilterActions } from './SharedComponents';

const YearOnYearReport: React.FC = () => {
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
                         <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input type="text" placeholder="Select Start Year" className="w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-gray-50" />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Graphs to be added in the pdf (optional):</label>
                    <select className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-white text-gray-500">
                            <option>Select graphs to be included in report</option>
                    </select>
                </div>

                <FilterActions />
            </FilterSection>

            <ReportSection title="Year on Year Report">
                There are no records to display
            </ReportSection>

            <ReportSection title="Year On Year Graphs">
                No data available
            </ReportSection>
        </>
    );
};

export default YearOnYearReport;
