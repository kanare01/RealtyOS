
import React from 'react';
import { FilterSection, ReportSection, FilterActions } from './SharedComponents';

const TenantStatement: React.FC = () => {
    return (
        <>
            <FilterSection title="Filters">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Property</label>
                        <select className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-gray-50">
                            <option>All Properties</option>
                            <option>Sunset Apartments</option>
                            <option>Lakeside Villas</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Tenant</label>
                        <input 
                            type="text" 
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#1a237e] focus:border-[#1a237e] text-sm p-2 bg-gray-50"
                        />
                    </div>
                </div>
                <FilterActions />
            </FilterSection>

            <ReportSection title="Tenant Statement">
                There are no records to display
            </ReportSection>
        </>
    );
};

export default TenantStatement;
