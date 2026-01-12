
import React from 'react';

const paymentStatuses = [
    { id: 'draft', label: 'draft' },
    { id: 'confirmed', label: 'confirmed' },
];

const paymentSources = [
    { id: 'mpesa', label: 'mpesa' },
    { id: 'copilot', label: 'copilot' },
    { id: 'bank-statement', label: 'bank statement' },
    { id: 'manual', label: 'manual' },
];

const FilterItem: React.FC<{ title: string; children: React.ReactNode; isOpen?: boolean }> = ({ title, children, isOpen = true }) => {
    const [open, setOpen] = React.useState(isOpen);
    return (
        <div className="py-4 border-b border-gray-200">
            <button 
                className="flex items-center justify-between w-full text-left mb-3 group"
                onClick={() => setOpen(!open)}
            >
                <h4 className="text-sm font-medium text-blue-800">{title}</h4>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            <div className={`transition-all duration-300 ${open ? 'block' : 'hidden'}`}>
                {children}
            </div>
        </div>
    );
};

const PaymentsFiltersPanel: React.FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-blue-800 text-lg">Filters</h3>
                <button className="text-blue-800 hover:text-blue-900 font-bold text-xl">
                    -
                </button>
            </div>
            <div className="p-4">
                <div className="relative mb-4">
                    <input
                        type="search"
                        placeholder="Type to search..."
                        className="w-full bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <FilterItem title="Date">
                    <div className="space-y-2">
                        <input type="text" placeholder="Start Date" className="w-full text-sm border-gray-300 rounded-md text-gray-500" />
                        <input type="text" placeholder="End Date" className="w-full text-sm border-gray-300 rounded-md text-gray-500" />
                    </div>
                </FilterItem>

                <FilterItem title="Amount">
                    <div className="flex items-center space-x-2">
                        <input type="text" placeholder="min" className="w-full text-sm border-gray-300 rounded-md" />
                        <input type="text" placeholder="max" className="w-full text-sm border-gray-300 rounded-md" />
                    </div>
                </FilterItem>

                <FilterItem title="Payment status">
                    <div className="space-y-2">
                        {paymentStatuses.map(status => (
                            <label key={status.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">{status.label}</span>
                            </label>
                        ))}
                    </div>
                </FilterItem>

                <FilterItem title="Payment source">
                    <div className="space-y-2">
                        {paymentSources.map(source => (
                            <label key={source.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">{source.label}</span>
                            </label>
                        ))}
                    </div>
                </FilterItem>

                <FilterItem title="Property / Unit">
                     <select className="w-full text-sm border-gray-300 rounded-md bg-gray-50 text-gray-600">
                        <option>All Properties</option>
                        <option>Sunset Apartments</option>
                        <option>Lakeside Villas</option>
                    </select>
                </FilterItem>

                <FilterItem title="Unassigned payments">
                    <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-600">Show</span>
                    </label>
                </FilterItem>
            </div>
        </div>
    );
};

export default PaymentsFiltersPanel;
