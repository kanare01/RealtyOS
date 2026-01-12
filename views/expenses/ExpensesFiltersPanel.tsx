import React from 'react';

const FilterItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-4 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">{title}</h4>
        {children}
    </div>
);

const ExpensesFiltersPanel: React.FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Filters</h3>
                <button className="text-gray-500 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className="p-4">
                <div className="relative mb-4">
                    <input
                        type="search"
                        placeholder="Type to search..."
                        className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <FilterItem title="Property / Unit">
                     <select className="w-full text-sm border-gray-300 rounded-md">
                        <option>All Properties</option>
                    </select>
                </FilterItem>

                <FilterItem title="Date">
                    <div className="flex items-center justify-between space-x-2">
                        <input type="text" placeholder="Start Date" className="w-full text-sm border-gray-300 rounded-md" />
                        <span>-</span>
                        <input type="text" placeholder="End Date" className="w-full text-sm border-gray-300 rounded-md" />
                    </div>
                </FilterItem>

                <FilterItem title="Amount">
                    <div className="flex items-center justify-between space-x-2">
                        <input type="number" placeholder="min" className="w-full text-sm border-gray-300 rounded-md" />
                        <span>-</span>
                        <input type="number" placeholder="max" className="w-full text-sm border-gray-300 rounded-md" />
                    </div>
                </FilterItem>

                <div className="pt-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-3">Expense status</h4>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-gray-700 capitalize">draft</span>
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="ml-2 text-sm text-gray-700 capitalize">confirmed</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpensesFiltersPanel;
