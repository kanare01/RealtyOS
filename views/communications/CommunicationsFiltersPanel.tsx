
import React, { useState } from 'react';

const FilterItem: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="py-4 border-b border-gray-100 last:border-0">
            <button 
                className="flex items-center justify-between w-full text-left mb-3 group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h4 className="text-sm font-medium text-gray-700">{title}</h4>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            <div className={`transition-all duration-200 ease-in-out ${isOpen ? 'block' : 'hidden'}`}>
                {children}
            </div>
        </div>
    );
};

const CommunicationsFiltersPanel: React.FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-[#1a237e] text-lg">Filters</h3>
                <button className="text-[#1a237e] hover:text-blue-900 font-bold text-xl">
                    -
                </button>
            </div>
            <div className="p-4">
                <FilterItem title="Date">
                    <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-2">
                        <input type="text" placeholder="Start Date" className="w-full text-sm outline-none text-gray-600 placeholder-gray-500" />
                        <span className="text-gray-400">-</span>
                        <input type="text" placeholder="End Date" className="w-full text-sm outline-none text-gray-600 placeholder-gray-500" />
                    </div>
                </FilterItem>

                <FilterItem title="Property / Unit">
                    <div className="space-y-3">
                        <select className="w-full text-sm border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:ring-[#1a237e] focus:border-[#1a237e] py-2">
                            <option>kanari Apartments</option>
                            <option>Lakeside Villas</option>
                        </select>
                        <select className="w-full text-sm border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:ring-[#1a237e] focus:border-[#1a237e] py-2">
                            <option>All Units</option>
                        </select>
                    </div>
                </FilterItem>

                <FilterItem title="Tenant / Team">
                    <div className="space-y-2 pl-1">
                        <label className="flex items-center group cursor-pointer">
                            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e] cursor-pointer" />
                            <span className="ml-2 text-sm text-gray-500 group-hover:text-gray-700">tenants</span>
                        </label>
                        <label className="flex items-center group cursor-pointer">
                            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e] cursor-pointer" />
                            <span className="ml-2 text-sm text-gray-500 group-hover:text-gray-700">team</span>
                        </label>
                    </div>
                </FilterItem>

                <FilterItem title="Status">
                    <div className="space-y-2 pl-1">
                        <label className="flex items-center group cursor-pointer">
                            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e] cursor-pointer" />
                            <span className="ml-2 text-sm text-gray-500 group-hover:text-gray-700">delivered</span>
                        </label>
                    </div>
                </FilterItem>

                <FilterItem title="Message Type">
                    <div className="space-y-2 pl-1">
                        <label className="flex items-center group cursor-pointer">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e] cursor-pointer" />
                            <span className="ml-2 text-sm text-gray-500 group-hover:text-gray-700">SMS</span>
                        </label>
                        <label className="flex items-center group cursor-pointer">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e] cursor-pointer" />
                            <span className="ml-2 text-sm text-gray-500 group-hover:text-gray-700">WhatsApp (coming soon)</span>
                        </label>
                        <label className="flex items-center group cursor-pointer">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e] cursor-pointer" />
                            <span className="ml-2 text-sm text-gray-500 group-hover:text-gray-700">Email</span>
                        </label>
                    </div>
                </FilterItem>
            </div>
        </div>
    );
};

export default CommunicationsFiltersPanel;
