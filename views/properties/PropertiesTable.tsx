
import React, { useState } from 'react';
import { Property, View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface PropertiesTableProps {
    properties: Property[];
    setCurrentView: (view: View) => void;
}

const PropertiesTable: React.FC<PropertiesTableProps> = ({ properties, setCurrentView }) => {
    const { deleteProperty, setEditingProperty, currentUser } = useData();
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

    const toggleDropdown = (id: number) => {
        if (activeDropdownId === id) {
            setActiveDropdownId(null);
        } else {
            setActiveDropdownId(id);
        }
    };

    const handleEdit = (property: Property) => {
        setEditingProperty(property);
        setCurrentView('PropertyForm');
        setActiveDropdownId(null);
    };

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
            deleteProperty(id);
            setActiveDropdownId(null);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Properties</h3>
                 <span className="text-sm text-gray-500">
                    {properties.length} Total
                </span>
            </div>
            <div className="p-4">
                <div className="overflow-x-auto min-h-[300px]">
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
                                <tr key={property.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-0 relative">
                                    <td className="p-3 text-[#1a237e] font-medium cursor-pointer" onClick={() => handleEdit(property)}>
                                        {property.name}
                                    </td>
                                    <td className="p-3">{property.units}</td>
                                    <td className="p-3">{property.type}</td>
                                    <td className="p-3">
                                        <div className="flex items-center">
                                            <span className="mr-2">{property.occupancy}%</span>
                                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                <div 
                                                    className={`h-1.5 rounded-full ${property.occupancy === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                                                    style={{ width: `${property.occupancy}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">{property.city || property.address.split(',')[0]}</td>
                                    <td className="p-3">
                                        <div className="flex -space-x-2 overflow-hidden">
                                            <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                                                JD
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3 relative">
                                        <button 
                                            onClick={() => toggleDropdown(property.id)}
                                            className="text-gray-400 hover:text-[#1a237e] focus:outline-none"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                            </svg>
                                        </button>
                                        
                                        {activeDropdownId === property.id && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setActiveDropdownId(null)}></div>
                                                <div className="absolute right-8 top-2 w-40 bg-white border border-gray-200 rounded shadow-xl z-20 overflow-hidden">
                                                    <button 
                                                        onClick={() => handleEdit(property)}
                                                        className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Edit
                                                    </button>
                                                    {currentUser?.role === 'Admin' && (
                                                        <button 
                                                            onClick={() => handleDelete(property.id, property.name)}
                                                            className="block w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {properties.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        No properties found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                     </table>
                </div>

                <div className="flex items-center justify-between pt-4 text-sm text-gray-500 border-t border-gray-100 mt-4">
                    <span>Showing {properties.length} entries</span>
                    <div className="flex space-x-1">
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&laquo;</button>
                        <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded text-gray-600 font-medium">1</button>
                        <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&raquo;</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertiesTable;
