
import React from 'react';

const FilterItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-2">
             <h4 className="text-sm font-medium text-gray-700">{title}</h4>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
        {children}
    </div>
);

const UtilitiesFiltersPanel: React.FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-[#1a237e] text-lg">Filters</h3>
                <button className="text-[#1a237e] hover:text-blue-900 font-bold text-xl">
                    -
                </button>
            </div>
            <div className="p-4">
                <FilterItem title="Utility Item">
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" />
                            <span className="ml-2 text-sm text-gray-600">water</span>
                        </label>
                         <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" />
                            <span className="ml-2 text-sm text-gray-600">electricity</span>
                        </label>
                    </div>
                </FilterItem>

                <FilterItem title="Date">
                     <div className="space-y-2">
                        <div className="relative">
                            <input type="text" placeholder="Start Date" className="w-full text-sm border-gray-300 rounded-md text-gray-500" />
                            <span className="absolute right-3 top-2 text-gray-400 text-xs">-</span>
                        </div>
                         <input type="text" placeholder="End Date" className="w-full text-sm border-gray-300 rounded-md text-gray-500" />
                    </div>
                </FilterItem>

                <div className="py-4">
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
            </div>
        </div>
    );
};

export default UtilitiesFiltersPanel;
