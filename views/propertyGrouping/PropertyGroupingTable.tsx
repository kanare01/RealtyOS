
import React, { useState } from 'react';
import { PropertyGrouping, View } from '../../types';
import { useData } from '../../contexts/DataContext';

interface PropertyGroupingTableProps {
    propertyGroupings: PropertyGrouping[];
    setCurrentView: (view: View) => void;
}

const PropertyGroupingTable: React.FC<PropertyGroupingTableProps> = ({ propertyGroupings, setCurrentView }) => {
    const { deletePropertyGrouping, setEditingPropertyGrouping } = useData();
    const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);

    const toggleDropdown = (id: number) => {
        setActiveDropdownId(activeDropdownId === id ? null : id);
    };

    const handleEdit = (group: PropertyGrouping) => {
        setEditingPropertyGrouping(group);
        setCurrentView('PropertyGroupingForm');
        setActiveDropdownId(null);
    };

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this property grouping?")) {
            deletePropertyGrouping(id);
            setActiveDropdownId(null);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-[#1a237e] text-lg">Property Groupings</h3>
                 <span className="text-sm text-gray-500">{propertyGroupings.length} Records</span>
            </div>
            <div className="p-4">
                <div className="overflow-x-auto min-h-[300px]">
                     <table className="min-w-full text-sm text-left">
                        <thead className="text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="p-3 font-normal">Name</th>
                                <th className="p-3 font-normal">Properties Count</th>
                                <th className="p-3 font-normal">Manager</th>
                                <th className="p-3 font-normal">Description</th>
                                <th className="p-3 font-normal">Options</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {propertyGroupings.map(group => (
                                <tr key={group.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-0 relative">
                                    <td className="p-3 font-medium text-[#1a237e]">{group.name}</td>
                                    <td className="p-3">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                                            {group.propertyIds.length}
                                        </span>
                                    </td>
                                    <td className="p-3">{group.managerName || '-'}</td>
                                    <td className="p-3 text-gray-500 truncate max-w-xs">{group.description || '-'}</td>
                                    <td className="p-3 relative">
                                        <button 
                                            onClick={() => toggleDropdown(group.id)}
                                            className="text-gray-400 hover:text-[#1a237e] px-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                            </svg>
                                        </button>

                                        {activeDropdownId === group.id && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setActiveDropdownId(null)}></div>
                                                <div className="absolute right-8 top-2 w-40 bg-white border border-gray-200 rounded shadow-xl z-20 overflow-hidden">
                                                    <button onClick={() => handleEdit(group)} className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">Edit</button>
                                                    <button onClick={() => handleDelete(group.id)} className="block w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50">Delete</button>
                                                </div>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {propertyGroupings.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No property groupings found. Click "Add Grouping" to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                     </table>
                </div>

                <div className="flex items-center space-x-1 pt-4 text-sm text-gray-500 border-t border-gray-100 mt-4">
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&lt;</button>
                    <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded text-gray-600 font-medium">1</button>
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 text-gray-400" disabled>&gt;</button>
                </div>
            </div>
        </div>
    );
};

export default PropertyGroupingTable;
