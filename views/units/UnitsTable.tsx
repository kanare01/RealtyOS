
import React from 'react';
import { Unit } from '../../types';
import Badge from '../../components/shared/Badge';

interface UnitsTableProps {
    units: Unit[];
}

const UnitsTable: React.FC<UnitsTableProps> = ({ units }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Units</h3>
                 <button className="text-[#1a237e] hover:text-blue-900 font-bold text-xl">
                    -
                </button>
            </div>
            <div className="p-4">
                <div className="overflow-x-auto">
                     <table className="min-w-full text-sm text-left">
                        <thead className="text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-3 font-normal">Property Name</th>
                                <th className="p-3 font-normal">Unit Name/ID</th>
                                <th className="p-3 font-normal">Type</th>
                                <th className="p-3 font-normal">Status</th>
                                <th className="p-3 font-normal">Rent (KES)</th>
                                <th className="p-3 font-normal">Options</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {units.map(unit => (
                                <tr key={unit.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-0">
                                    <td className="p-3 font-medium text-[#1a237e]">{unit.propertyName}</td>
                                    <td className="p-3">{unit.name}</td>
                                    <td className="p-3">{unit.type}</td>
                                    <td className="p-3">
                                        <Badge color={unit.status === 'Occupied' ? 'green' : 'yellow'}>{unit.status}</Badge>
                                    </td>
                                    <td className="p-3 font-semibold">{unit.rentAmount.toLocaleString()}</td>
                                    <td className="p-3">
                                        <button className="text-gray-400 hover:text-[#1a237e]">
                                            ...
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {units.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center py-12">
                                        No units found. Add a unit to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                     </table>
                </div>

                <div className="flex items-center space-x-1 pt-4 text-sm text-gray-500 border-t border-gray-100 mt-4">
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&laquo;</button>
                    <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded text-gray-600 font-medium">1</button>
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&raquo;</button>
                </div>
            </div>
        </div>
    );
};

export default UnitsTable;
