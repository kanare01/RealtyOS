
import React from 'react';
import { Property } from '../../types';

interface PropertiesTableProps {
    properties: Property[];
}

const PropertiesTable: React.FC<PropertiesTableProps> = ({ properties }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Properties</h3>
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
                                <th className="p-3 font-normal">Number of units</th>
                                <th className="p-3 font-normal">Type</th>
                                <th className="p-3 font-normal">Occupancy</th>
                                <th className="p-3 font-normal">City</th>
                                <th className="p-3 font-normal">Managers</th>
                                <th className="p-3 font-normal">Options</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {properties.map((property) => (
                                <tr key={property.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-0">
                                    <td className="p-3 text-[#1a237e] font-medium">{property.name}</td>
                                    <td className="p-3">{property.units}</td>
                                    <td className="p-3">{property.type}</td>
                                    <td className="p-3">{property.occupancy}%</td>
                                    <td className="p-3">{property.address.split(',')[0]}</td>
                                    <td className="p-3">
                                        <div className="flex -space-x-2 overflow-hidden">
                                            <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                                                JD
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <button className="text-gray-400 hover:text-[#1a237e]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {properties.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center py-12">
                                        No properties found.
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

export default PropertiesTable;
