
import React from 'react';
import { Unit, Property } from '../../types';

interface UnitsSummaryCardProps {
    units: Unit[];
    properties: Property[];
}

const SummaryItem: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
    <div className="flex-1 text-center p-6">
        <p className="text-gray-500 text-sm mb-2 relative inline-block">
            {title}
            <span className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-[1px] bg-gray-200 hidden md:block"></span>
        </p>
        <div className="text-[#1a237e] text-3xl font-medium">{value}</div>
    </div>
);

const UnitsSummaryCard: React.FC<UnitsSummaryCardProps> = ({ units, properties }) => {
    const totalProperties = properties.length;
    const totalUnits = units.length;
    const totalVacancies = units.filter(u => u.status === 'Vacant').length;

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
             <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Summary</h3>
                 <button className="text-[#1a237e] hover:text-blue-900 font-bold text-xl">
                    -
                </button>
            </div>
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
                <SummaryItem title="Total Properties" value={totalProperties} />
                <SummaryItem title="Total Units" value={totalUnits} />
                <SummaryItem title="Total Vacancies" value={totalVacancies} />
            </div>
        </div>
    );
};

export default UnitsSummaryCard;
