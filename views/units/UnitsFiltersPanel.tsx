
import React from 'react';

const UnitsFiltersPanel: React.FC = () => {
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
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Property / Unit</h4>
                     <select className="w-full text-sm border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:ring-[#1a237e] focus:border-[#1a237e]">
                        <option>All Properties</option>
                        <option>Sunset Apartments</option>
                        <option>Lakeside Villas</option>
                    </select>
                </div>
                 <div className="py-4">
                    <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]" />
                        <span className="ml-2 text-sm text-gray-600">Show Vacant Units</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default UnitsFiltersPanel;
